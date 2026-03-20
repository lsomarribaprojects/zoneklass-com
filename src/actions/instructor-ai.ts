'use server'

import { createClient } from '@/lib/supabase/server'
import { requireInstructor, hasAICredits, deductAICredits } from '@/lib/auth/permissions'
import { chatWithInstructorAgent, summarizeConversation } from '@/lib/ai/instructor-agent'
import { AI_CREDIT_COSTS } from '@/lib/ai/constants'
import type { AIContextType, InstructorAIConversation } from '@/types/database'

// ============================================
// Chat Actions
// ============================================

/**
 * Send a message to the instructor's AI assistant
 *
 * @param message - User message
 * @param contextType - What the instructor is doing (course_creation, lesson_editing, etc.)
 * @param contextId - ID of the course/lesson being edited (optional)
 * @param selectedText - Text selected by instructor for context (optional)
 * @returns Assistant response, conversation ID, and remaining credits
 */
export async function sendMessage(
  message: string,
  contextType: AIContextType,
  contextId?: string,
  selectedText?: string
) {
  // 1. Auth check
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase || !auth.user || !auth.profile) {
    return { error: auth.error || 'No autorizado' }
  }

  const { supabase, user } = auth

  try {
    // 2. Check AI credits
    const creditCheck = await hasAICredits(user.id, AI_CREDIT_COSTS.chat_message)
    if (!creditCheck.hasCredits) {
      return { error: creditCheck.error || 'No tienes suficientes créditos IA' }
    }

    // 3. Load or create conversation (active = updated in last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    let conversation: any = null
    const { data: existingConversations } = await supabase
      .from('instructor_ai_conversations')
      .select('*')
      .eq('instructor_id', user.id)
      .eq('context_type', contextType)
      .eq('context_id', contextId || null)
      .gte('updated_at', twentyFourHoursAgo)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (existingConversations && existingConversations.length > 0) {
      conversation = existingConversations[0]
    } else {
      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('instructor_ai_conversations')
        .insert({
          instructor_id: user.id,
          context_type: contextType,
          context_id: contextId || null,
          messages: []
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creando conversación:', createError)
        return { error: 'Error al iniciar la conversación' }
      }

      conversation = newConversation
    }

    // 4. Load instructor memory
    const { data: memories } = await supabase
      .from('instructor_ai_memory')
      .select('*')
      .eq('instructor_id', user.id)
      .order('updated_at', { ascending: false })

    // 5. Load instructor's courses (for context)
    const { data: courses } = await supabase
      .from('courses')
      .select('title, category, level')
      .eq('created_by', user.id)
      .limit(10)

    // 6. Build chat context (load course/lesson info if contextId provided)
    let courseTitle: string | undefined
    let moduleTitle: string | undefined
    let lessonTitle: string | undefined
    let lessonContent: string | undefined

    if (contextId) {
      if (contextType === 'course_creation' || contextType === 'review') {
        const { data: course } = await supabase
          .from('courses')
          .select('title')
          .eq('id', contextId)
          .single()
        courseTitle = course?.title
      } else if (contextType === 'lesson_editing') {
        // contextId is a lesson ID
        const { data: lesson } = await supabase
          .from('lessons')
          .select(`
            title,
            content,
            modules!inner(
              title,
              courses!inner(title)
            )
          `)
          .eq('id', contextId)
          .single()

        if (lesson) {
          lessonTitle = lesson.title
          lessonContent = lesson.content || undefined
          moduleTitle = (lesson.modules as any)?.title
          courseTitle = ((lesson.modules as any)?.courses as any)?.title
        }
      }
    }

    // 7. Call AI agent
    const result = await chatWithInstructorAgent(
      {
        name: auth.profile.full_name || 'Instructor',
        courses: courses || [],
        memories: memories || []
      },
      {
        contextType,
        courseTitle,
        moduleTitle,
        lessonTitle,
        lessonContent,
        selectedText
      },
      conversation.messages || [],
      message
    )

    // 8. Deduct AI credits
    const deductResult = await deductAICredits(
      user.id,
      AI_CREDIT_COSTS.chat_message,
      'chat_message',
      conversation.id
    )

    if (deductResult.error) {
      return { error: deductResult.error }
    }

    // 9. Save both messages to conversation
    const updatedMessages = [
      ...(conversation.messages || []),
      {
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant' as const,
        content: result.response,
        timestamp: new Date().toISOString()
      }
    ]

    const { error: updateError } = await supabase
      .from('instructor_ai_conversations')
      .update({
        messages: updatedMessages,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversation.id)

    if (updateError) {
      console.error('Error actualizando conversación:', updateError)
      return { error: 'Error al guardar la conversación' }
    }

    // 10. Save new memories if extracted
    if (result.memoriesToSave.length > 0) {
      const memoryInserts = result.memoriesToSave.map(m => ({
        instructor_id: user.id,
        memory_type: m.type,
        content: m.content,
        metadata: { extracted_from: 'chat', conversation_id: conversation.id }
      }))

      await supabase
        .from('instructor_ai_memory')
        .upsert(memoryInserts, {
          onConflict: 'instructor_id,content',
          ignoreDuplicates: true
        })
    }

    // 11. Get remaining credits
    const creditsCheck = await hasAICredits(user.id, 0)

    return {
      response: result.response,
      conversationId: conversation.id,
      creditsRemaining: creditsCheck.remaining
    }
  } catch (error) {
    console.error('Error en sendMessage:', error)
    return {
      error: `Error al procesar el mensaje: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}

// ============================================
// Conversation Management
// ============================================

/**
 * Get conversation history for the instructor
 *
 * @param contextType - Filter by context type (optional)
 * @param contextId - Filter by context ID (optional)
 * @returns List of conversations (max 20)
 */
export async function getConversationHistory(contextType?: AIContextType, contextId?: string) {
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase || !auth.user) {
    return { error: auth.error || 'No autorizado' }
  }

  const { supabase, user } = auth

  try {
    let query = supabase
      .from('instructor_ai_conversations')
      .select('*')
      .eq('instructor_id', user.id)

    if (contextType) {
      query = query.eq('context_type', contextType)
    }

    if (contextId) {
      query = query.eq('context_id', contextId)
    }

    const { data, error } = await query
      .order('updated_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error cargando conversaciones:', error)
      return { error: 'Error al cargar el historial' }
    }

    return { conversations: data || [] }
  } catch (error) {
    console.error('Error en getConversationHistory:', error)
    return {
      error: `Error al cargar conversaciones: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}

/**
 * Get the active conversation (last 24 hours)
 *
 * @param contextType - Context type
 * @param contextId - Context ID (optional)
 * @returns Active conversation or null
 */
export async function getActiveConversation(contextType: AIContextType, contextId?: string) {
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase || !auth.user) {
    return { error: auth.error || 'No autorizado' }
  }

  const { supabase, user } = auth

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('instructor_ai_conversations')
      .select('*')
      .eq('instructor_id', user.id)
      .eq('context_type', contextType)
      .eq('context_id', contextId || null)
      .gte('updated_at', twentyFourHoursAgo)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected when no conversation exists)
      console.error('Error cargando conversación activa:', error)
      return { error: 'Error al cargar la conversación' }
    }

    return { conversation: data || null }
  } catch (error) {
    console.error('Error en getActiveConversation:', error)
    return {
      error: `Error al cargar conversación: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}

/**
 * Close a conversation and generate summary
 *
 * @param conversationId - Conversation ID
 * @returns Success status
 */
export async function closeConversation(conversationId: string) {
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase || !auth.user) {
    return { error: auth.error || 'No autorizado' }
  }

  const { supabase, user } = auth

  try {
    // Load conversation and verify ownership
    const { data: conversation, error: loadError } = await supabase
      .from('instructor_ai_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('instructor_id', user.id)
      .single()

    if (loadError || !conversation) {
      return { error: 'Conversación no encontrada' }
    }

    // Generate summary
    const summary = await summarizeConversation(conversation.messages || [])

    // Update conversation with summary
    const { error: updateError } = await supabase
      .from('instructor_ai_conversations')
      .update({
        summary,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId)

    if (updateError) {
      console.error('Error actualizando resumen:', updateError)
      return { error: 'Error al cerrar la conversación' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error en closeConversation:', error)
    return {
      error: `Error al cerrar conversación: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}

// ============================================
// Memory Management
// ============================================

/**
 * Get all memories for the instructor
 *
 * @returns List of memories
 */
export async function getInstructorMemories() {
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase || !auth.user) {
    return { error: auth.error || 'No autorizado' }
  }

  const { supabase, user } = auth

  try {
    const { data, error } = await supabase
      .from('instructor_ai_memory')
      .select('*')
      .eq('instructor_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error cargando memorias:', error)
      return { error: 'Error al cargar las memorias' }
    }

    return { memories: data || [] }
  } catch (error) {
    console.error('Error en getInstructorMemories:', error)
    return {
      error: `Error al cargar memorias: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}

/**
 * Delete a specific memory
 *
 * @param memoryId - Memory ID to delete
 * @returns Success status
 */
export async function deleteMemory(memoryId: string) {
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase || !auth.user) {
    return { error: auth.error || 'No autorizado' }
  }

  const { supabase, user } = auth

  try {
    const { error } = await supabase
      .from('instructor_ai_memory')
      .delete()
      .eq('id', memoryId)
      .eq('instructor_id', user.id) // Ensure ownership

    if (error) {
      console.error('Error eliminando memoria:', error)
      return { error: 'Error al eliminar la memoria' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error en deleteMemory:', error)
    return {
      error: `Error al eliminar memoria: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}
