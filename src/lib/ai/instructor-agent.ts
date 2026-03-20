import OpenAI from 'openai'
import type { InstructorAIMemory, AIConversationMessage } from '@/types/database'

// Initialize OpenAI client configured for OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

const CLAUDE_MODEL = 'anthropic/claude-sonnet-4-20250514'

// ============================================
// Types
// ============================================

interface InstructorContext {
  name: string
  courses: { title: string; category: string; level: string }[]
  memories: InstructorAIMemory[]
}

interface ChatContext {
  contextType: 'course_creation' | 'lesson_editing' | 'general' | 'review'
  courseTitle?: string
  moduleTitle?: string
  lessonTitle?: string
  lessonContent?: string
  selectedText?: string
}

// ============================================
// System Prompt Builder
// ============================================

/**
 * Builds a dynamic system prompt tailored to the instructor's context
 *
 * @param instructor - Instructor info (name, courses, memories)
 * @param chat - Current chat context (what they're editing/creating)
 * @returns System prompt string
 */
function buildSystemPrompt(instructor: InstructorContext, chat: ChatContext): string {
  // Extract specialties from courses
  const categorySet = new Set(instructor.courses.map(c => c.category))
  const specialties = Array.from(categorySet).join(', ')
  const courseList = instructor.courses.map(c => `- ${c.title} (${c.level})`).join('\n')

  // Group memories by type
  const memoryByType: Record<string, string[]> = {}
  for (const m of instructor.memories) {
    if (!memoryByType[m.memory_type]) memoryByType[m.memory_type] = []
    memoryByType[m.memory_type].push(m.content)
  }

  // Build context section based on what they're doing
  let contextSection = ''
  if (chat.contextType === 'lesson_editing' && chat.lessonTitle) {
    contextSection = `\n## Contexto Actual\nEditando la lección "${chat.lessonTitle}"${chat.moduleTitle ? ` del módulo "${chat.moduleTitle}"` : ''}${chat.courseTitle ? ` del curso "${chat.courseTitle}"` : ''}.`

    if (chat.lessonContent) {
      // Strip HTML and truncate for context
      const plainContent = chat.lessonContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      const truncated = plainContent.length > 2000 ? plainContent.substring(0, 2000) + '...' : plainContent
      contextSection += `\n\nContenido actual de la lección:\n${truncated}`
    }

    if (chat.selectedText) {
      contextSection += `\n\nTexto seleccionado por el instructor:\n"${chat.selectedText}"`
    }
  } else if (chat.contextType === 'course_creation') {
    contextSection = `\n## Contexto Actual\nCreando un nuevo curso${chat.courseTitle ? `: "${chat.courseTitle}"` : ''}.`
  } else if (chat.contextType === 'review') {
    contextSection = `\n## Contexto Actual\nRevisando el curso "${chat.courseTitle || 'sin título'}".`
  }

  // Build complete system prompt
  return `Eres el Asistente Didáctico de ZoneKlass. Tu especialidad es pedagogía, diseño instruccional y creación de cursos online de alta calidad.

## Tu Instructor
- Nombre: ${instructor.name}
${specialties ? `- Especialidades: ${specialties}` : ''}
${courseList ? `- Cursos creados:\n${courseList}` : '- Aún no ha creado cursos'}

${memoryByType.preference ? `## Preferencias que has aprendido\n${memoryByType.preference.map(p => `- ${p}`).join('\n')}` : ''}
${memoryByType.style ? `## Estilo del instructor\n${memoryByType.style.map(s => `- ${s}`).join('\n')}` : ''}
${memoryByType.feedback ? `## Feedback anterior\n${memoryByType.feedback.map(f => `- ${f}`).join('\n')}` : ''}
${contextSection}

## Tus Capacidades
1. Sugerir estructura de curso (módulos → lecciones → duraciones)
2. Escribir o mejorar contenido de lecciones (HTML compatible con TipTap)
3. Generar ejercicios prácticos y quizzes
4. Revisar contenido existente y sugerir mejoras didácticas
5. Adaptar el tono según el público objetivo
6. Recomendar orden y prerequisitos

## Reglas
- Siempre responde en español (a menos que el instructor pida otro idioma)
- Usa analogías y ejemplos del mundo real
- Sugiere, no impongas — el instructor tiene la última palabra
- Cuando aprendas algo nuevo del instructor, dilo: "📝 Voy a recordar que prefieres..."
- Si generas HTML para una lección, usa formato compatible con TipTap: h2, h3, p, ul, ol, strong, em, code, pre, blockquote
- Sé conciso pero completo. No repitas información del contexto.`
}

// ============================================
// Chat Functions
// ============================================

/**
 * Chat with the instructor's AI assistant
 *
 * @param instructor - Instructor context (name, courses, memories)
 * @param chatContext - Current context (what they're editing/creating)
 * @param conversationHistory - Previous messages in this conversation
 * @param userMessage - New message from the instructor
 * @returns Assistant response and extracted memories to save
 *
 * @example
 * ```ts
 * const result = await chatWithInstructorAgent(
 *   { name: "María", courses: [...], memories: [...] },
 *   { contextType: "lesson_editing", lessonTitle: "Intro a React" },
 *   previousMessages,
 *   "¿Puedes mejorar esta sección?"
 * );
 * ```
 */
export async function chatWithInstructorAgent(
  instructor: InstructorContext,
  chatContext: ChatContext,
  conversationHistory: AIConversationMessage[],
  userMessage: string
): Promise<{ response: string; memoriesToSave: { type: string; content: string }[] }> {
  try {
    const systemPrompt = buildSystemPrompt(instructor, chatContext)

    // Build messages array for OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      })),
      { role: 'user', content: userMessage }
    ]

    const completion = await openai.chat.completions.create({
      model: CLAUDE_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content || 'No se pudo generar una respuesta.'

    // Extract memories from response (when AI mentions learning something new)
    const memoriesToSave: { type: string; content: string }[] = []
    const memoryPatterns = [
      /(?:voy a recordar|recordaré|noto|he aprendido) que (?:prefieres?|te gusta|usas?|quieres?) (.+?)(?:\.|$)/gi,
      /📝 (.+?)(?:\.|$)/g,
    ]

    for (const pattern of memoryPatterns) {
      let match
      while ((match = pattern.exec(response)) !== null) {
        memoriesToSave.push({
          type: 'preference',
          content: match[1].trim()
        })
      }
    }

    return { response, memoriesToSave }
  } catch (error) {
    console.error('Error en chat con instructor agent:', error)
    throw new Error(
      `Error al generar respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}`
    )
  }
}

/**
 * Summarize a conversation for storage/review
 *
 * @param messages - All messages in the conversation
 * @returns Summary string (2-3 sentences)
 *
 * @example
 * ```ts
 * const summary = await summarizeConversation(messages);
 * // "El instructor mejoró la estructura del módulo 3..."
 * ```
 */
export async function summarizeConversation(messages: AIConversationMessage[]): Promise<string> {
  if (messages.length < 4) return ''

  try {
    const transcript = messages.map(m => `${m.role === 'user' ? 'Instructor' : 'Asistente'}: ${m.content}`).join('\n\n')
    const truncated = transcript.length > 3000 ? transcript.substring(0, 3000) + '...' : transcript

    const completion = await openai.chat.completions.create({
      model: CLAUDE_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Resume esta conversación entre un instructor y su asistente AI didáctico en 2-3 oraciones. Enfócate en las decisiones tomadas, preferencias del instructor, y resultados.'
        },
        { role: 'user', content: truncated }
      ],
      temperature: 0.3,
      max_tokens: 300,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error al resumir conversación:', error)
    return ''
  }
}
