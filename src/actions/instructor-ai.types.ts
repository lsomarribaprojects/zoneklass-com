/**
 * Type definitions for Instructor AI Assistant
 *
 * These types are used by both the AI motor and server actions.
 */

import type {
  AIContextType,
  AIMemoryType,
  AIConversationMessage,
  InstructorAIMemory,
  InstructorAIConversation
} from '@/types/database'

// ============================================
// Request/Response Types
// ============================================

/**
 * Request to send a message to the AI assistant
 */
export interface SendMessageRequest {
  message: string
  contextType: AIContextType
  contextId?: string
  selectedText?: string
}

/**
 * Response from sending a message
 */
export interface SendMessageResponse {
  response?: string
  conversationId?: string
  creditsRemaining?: number
  error?: string
}

/**
 * Response from getting conversation history
 */
export interface ConversationHistoryResponse {
  conversations?: InstructorAIConversation[]
  error?: string
}

/**
 * Response from getting active conversation
 */
export interface ActiveConversationResponse {
  conversation?: InstructorAIConversation | null
  error?: string
}

/**
 * Response from closing a conversation
 */
export interface CloseConversationResponse {
  success?: boolean
  error?: string
}

/**
 * Response from getting instructor memories
 */
export interface InstructorMemoriesResponse {
  memories?: InstructorAIMemory[]
  error?: string
}

/**
 * Response from deleting a memory
 */
export interface DeleteMemoryResponse {
  success?: boolean
  error?: string
}

// ============================================
// AI Motor Types
// ============================================

/**
 * Instructor context for building system prompt
 */
export interface InstructorContext {
  name: string
  courses: {
    title: string
    category: string
    level: string
  }[]
  memories: InstructorAIMemory[]
}

/**
 * Chat context for building system prompt
 */
export interface ChatContext {
  contextType: AIContextType
  courseTitle?: string
  moduleTitle?: string
  lessonTitle?: string
  lessonContent?: string
  selectedText?: string
}

/**
 * Result from chatting with the AI agent
 */
export interface ChatAgentResult {
  response: string
  memoriesToSave: {
    type: string
    content: string
  }[]
}

// ============================================
// Utility Types
// ============================================

/**
 * Standard error response
 */
export interface ErrorResponse {
  error: string
}

/**
 * Check if response is an error
 */
export function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response === 'object' && 'error' in response
}

/**
 * Extract error message from response
 */
export function getErrorMessage(response: any): string {
  if (isErrorResponse(response)) {
    return response.error
  }
  return 'Error desconocido'
}

// ============================================
// Context Type Guards
// ============================================

/**
 * Check if a string is a valid context type
 */
export function isValidContextType(value: string): value is AIContextType {
  return ['course_creation', 'lesson_editing', 'general', 'review'].includes(value)
}

/**
 * Check if a string is a valid memory type
 */
export function isValidMemoryType(value: string): value is AIMemoryType {
  return ['preference', 'style', 'feedback', 'context'].includes(value)
}

// ============================================
// Constants
// ============================================

/**
 * Conversation active window (24 hours)
 */
export const CONVERSATION_ACTIVE_WINDOW_MS = 24 * 60 * 60 * 1000

/**
 * Maximum messages to include in conversation history
 */
export const MAX_CONVERSATION_MESSAGES = 50

/**
 * Maximum length for selected text
 */
export const MAX_SELECTED_TEXT_LENGTH = 5000

/**
 * Maximum length for lesson content in context
 */
export const MAX_LESSON_CONTENT_LENGTH = 2000

/**
 * Context type descriptions for UI
 */
export const CONTEXT_TYPE_LABELS: Record<AIContextType, string> = {
  course_creation: 'Creación de curso',
  lesson_editing: 'Edición de lección',
  general: 'Consulta general',
  review: 'Revisión de curso'
}

/**
 * Memory type descriptions for UI
 */
export const MEMORY_TYPE_LABELS: Record<AIMemoryType, string> = {
  preference: 'Preferencia',
  style: 'Estilo',
  feedback: 'Retroalimentación',
  context: 'Contexto'
}

/**
 * Memory type icons for UI
 */
export const MEMORY_TYPE_ICONS: Record<AIMemoryType, string> = {
  preference: '⚙️',
  style: '✨',
  feedback: '💬',
  context: '📚'
}
