import OpenAI from 'openai';

// Types
interface LessonOutline {
  title: string;
  title_en: string;
  duration_minutes: number;
}

interface ModuleOutline {
  title: string;
  title_en: string;
  lessons: LessonOutline[];
}

interface CourseOutline {
  modules: ModuleOutline[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

// Initialize OpenAI client configured for OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const CLAUDE_MODEL = 'anthropic/claude-sonnet-4-20250514';

/**
 * Generates a structured course outline with modules and lessons
 *
 * @param title - The course title
 * @param category - Course category (e.g., "programming", "design", "marketing")
 * @param level - Course difficulty level (e.g., "beginner", "intermediate", "advanced")
 * @param description - Brief description of what the course covers
 * @returns Promise<CourseOutline> - Structured outline with modules and lessons
 *
 * @example
 * ```ts
 * const outline = await generateCourseOutline(
 *   "Introducción a React",
 *   "programming",
 *   "beginner",
 *   "Aprende los fundamentos de React desde cero"
 * );
 * ```
 */
export async function generateCourseOutline(
  title: string,
  category: string,
  level: string,
  description: string
): Promise<CourseOutline> {
  try {
    const prompt = `Eres un experto diseñador de cursos educativos. Crea una estructura completa de curso en ESPAÑOL.

INFORMACIÓN DEL CURSO:
- Título: ${title}
- Categoría: ${category}
- Nivel: ${level}
- Descripción: ${description}

INSTRUCCIONES:
1. Genera entre 5 y 8 módulos progresivos
2. Cada módulo debe tener entre 3 y 5 lecciones
3. Las lecciones deben seguir una progresión lógica de aprendizaje
4. Proporciona títulos en español e inglés para cada módulo y lección
5. Asigna una duración estimada en minutos para cada lección (entre 10 y 45 minutos)
6. La estructura debe ser apropiada para el nivel "${level}"

FORMATO DE RESPUESTA (JSON):
{
  "modules": [
    {
      "title": "Título del módulo en español",
      "title_en": "Module title in English",
      "lessons": [
        {
          "title": "Título de la lección en español",
          "title_en": "Lesson title in English",
          "duration_minutes": 20
        }
      ]
    }
  ]
}

Genera el curso completo ahora.`;

    const response = await openai.chat.completions.create({
      model: CLAUDE_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Eres un experto diseñador de cursos educativos. Respondes siempre en formato JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No se recibió respuesta del modelo de IA');
    }

    const outline = JSON.parse(content) as CourseOutline;

    // Validate structure
    if (!outline.modules || !Array.isArray(outline.modules) || outline.modules.length === 0) {
      throw new Error('Estructura de curso inválida: no se generaron módulos');
    }

    return outline;
  } catch (error) {
    console.error('Error generando outline del curso:', error);
    throw new Error(
      `Error al generar la estructura del curso: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
}

/**
 * Generates rich HTML content for a lesson using Tiptap-compatible format
 *
 * @param lessonTitle - Title of the lesson
 * @param moduleTitle - Title of the parent module
 * @param courseTitle - Title of the course
 * @param category - Course category
 * @param level - Course difficulty level
 * @returns Promise<string> - HTML content (800-1500 words)
 *
 * @example
 * ```ts
 * const content = await generateLessonContent(
 *   "Componentes en React",
 *   "Fundamentos de React",
 *   "Introducción a React",
 *   "programming",
 *   "beginner"
 * );
 * ```
 */
export async function generateLessonContent(
  lessonTitle: string,
  moduleTitle: string,
  courseTitle: string,
  category: string,
  level: string
): Promise<string> {
  try {
    const prompt = `Eres un experto instructor creando contenido educativo de alta calidad. Genera el contenido completo para esta lección en ESPAÑOL.

CONTEXTO:
- Curso: ${courseTitle}
- Módulo: ${moduleTitle}
- Lección: ${lessonTitle}
- Categoría: ${category}
- Nivel: ${level}

INSTRUCCIONES:
1. Escribe contenido educativo claro y estructurado de 800-1500 palabras
2. Usa HTML válido compatible con el editor Tiptap
3. Incluye: introducción, conceptos clave, ejemplos prácticos, y conclusión
4. Usa estos elementos HTML cuando sea apropiado:
   - <h2> y <h3> para secciones
   - <p> para párrafos
   - <ul> y <ol> para listas
   - <strong> y <em> para énfasis
   - <code> para código inline
   - <pre><code> para bloques de código
   - <blockquote> para citas importantes
5. El contenido debe ser apropiado para el nivel "${level}"
6. Incluye ejemplos concretos y prácticos
7. Si es relevante para "${category}", incluye código o ejemplos técnicos

IMPORTANTE: Responde SOLO con el HTML, sin texto adicional ni explicaciones.

Genera el contenido de la lección ahora.`;

    const response = await openai.chat.completions.create({
      model: CLAUDE_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Eres un experto instructor que crea contenido educativo claro, estructurado y práctico en formato HTML.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No se recibió contenido del modelo de IA');
    }

    // Basic validation
    if (content.trim().length < 500) {
      throw new Error('El contenido generado es demasiado corto');
    }

    return content.trim();
  } catch (error) {
    console.error('Error generando contenido de lección:', error);
    throw new Error(
      `Error al generar el contenido de la lección: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
}

/**
 * Generates multiple choice quiz questions based on lesson content
 *
 * @param lessonTitle - Title of the lesson
 * @param lessonContent - HTML content of the lesson
 * @returns Promise<QuizQuestion[]> - Array of 5 quiz questions
 *
 * @example
 * ```ts
 * const questions = await generateQuizQuestions(
 *   "Componentes en React",
 *   "<h2>Introducción</h2><p>Los componentes son...</p>"
 * );
 * ```
 */
export async function generateQuizQuestions(
  lessonTitle: string,
  lessonContent: string
): Promise<QuizQuestion[]> {
  try {
    // Strip HTML tags for better content analysis
    const plainContent = lessonContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Truncate if too long (to avoid token limits)
    const contentForPrompt = plainContent.length > 3000
      ? plainContent.substring(0, 3000) + '...'
      : plainContent;

    const prompt = `Eres un experto en evaluación educativa. Crea 5 preguntas de opción múltiple en ESPAÑOL basadas en este contenido de lección.

LECCIÓN: ${lessonTitle}

CONTENIDO:
${contentForPrompt}

INSTRUCCIONES:
1. Crea exactamente 5 preguntas de opción múltiple
2. Cada pregunta debe tener 4 opciones
3. Las preguntas deben evaluar comprensión real del contenido
4. Varía la dificultad: 2 fáciles, 2 medias, 1 difícil
5. Las opciones incorrectas deben ser plausibles pero claramente erróneas
6. Indica el índice de la respuesta correcta (0-3)

FORMATO DE RESPUESTA (JSON):
{
  "questions": [
    {
      "question": "¿Cuál es el concepto principal de...?",
      "options": [
        "Opción A",
        "Opción B (correcta)",
        "Opción C",
        "Opción D"
      ],
      "correctIndex": 1
    }
  ]
}

Genera las 5 preguntas ahora.`;

    const response = await openai.chat.completions.create({
      model: CLAUDE_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en evaluación educativa que crea preguntas de opción múltiple claras y efectivas. Respondes siempre en formato JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No se recibió respuesta del modelo de IA');
    }

    const parsed = JSON.parse(content) as { questions: QuizQuestion[] };

    // Validate structure
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length !== 5) {
      throw new Error('Se esperaban exactamente 5 preguntas');
    }

    // Validate each question
    parsed.questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Pregunta ${index + 1} tiene estructura inválida`);
      }
      if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
        throw new Error(`Pregunta ${index + 1} tiene índice de respuesta correcta inválido`);
      }
    });

    return parsed.questions;
  } catch (error) {
    console.error('Error generando preguntas de quiz:', error);
    throw new Error(
      `Error al generar las preguntas del quiz: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
}
