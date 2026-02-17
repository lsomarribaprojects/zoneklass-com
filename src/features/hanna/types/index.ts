// ============================================
// HANNA AI TUTOR - Types
// ============================================

export type HannaMode = 'tutora' | 'code_review' | 'orientadora' | 'motivadora' | 'estudio' | 'evaluadora'

export const HANNA_MODE_LABELS: Record<HannaMode, string> = {
  tutora: 'Tutora',
  code_review: 'Code Review',
  orientadora: 'Orientadora',
  motivadora: 'Motivadora',
  estudio: 'Estudio',
  evaluadora: 'Evaluadora',
}

export const HANNA_MODE_DESCRIPTIONS: Record<HannaMode, string> = {
  tutora: 'Explica conceptos con ejemplos simples',
  code_review: 'Revisa codigo y sugiere mejoras',
  orientadora: 'Recomienda cursos y rutas',
  motivadora: 'Celebra logros y da animo',
  estudio: 'Flashcards, resumenes y quizzes',
  evaluadora: 'Preguntas tipo examen',
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface HannaConversation {
  id: string
  user_id: string
  title: string
  mode: HannaMode
  messages: ChatMessage[]
  rating: number | null
  created_at: string
  updated_at: string
}

export interface HannaConfig {
  id: string
  mode: HannaMode
  system_prompt: string
  model: string
  temperature: number
  max_tokens: number
  is_active: boolean
  updated_at: string
}

export interface ChatRequest {
  message: string
  conversationId?: string
  mode: HannaMode
  lessonContext?: {
    lessonTitle: string
    courseTitle: string
    lessonContent: string
  }
}

export interface LessonContext {
  lessonTitle: string
  courseTitle: string
  lessonContent: string
}
