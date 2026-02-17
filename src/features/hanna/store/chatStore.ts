import { create } from 'zustand'
import type {
  HannaMode,
  HannaConversation,
  ChatMessage,
  LessonContext,
} from '@/features/hanna/types'

// ============================================
// HANNA AI TUTOR - Chat Store
// ============================================

interface ChatState {
  // UI
  isOpen: boolean
  showHistory: boolean
  showRating: boolean

  // Conversation
  currentConversation: HannaConversation | null
  conversations: HannaConversation[]
  mode: HannaMode

  // Streaming
  isStreaming: boolean
  streamingContent: string

  // Context
  lessonContext: LessonContext | null
}

interface ChatActions {
  // UI actions
  toggleOpen: () => void
  toggleHistory: () => void
  setShowRating: (show: boolean) => void

  // Mode and conversation actions
  setMode: (mode: HannaMode) => void
  setCurrentConversation: (conv: HannaConversation | null) => void
  addMessage: (message: ChatMessage) => void
  newConversation: () => void
  setConversations: (convs: HannaConversation[]) => void

  // Streaming actions
  startStreaming: () => void
  appendStreamContent: (chunk: string) => void
  finishStreaming: (fullContent: string) => void

  // Context actions
  setLessonContext: (ctx: LessonContext) => void
  clearLessonContext: () => void
}

const INITIAL_STATE: ChatState = {
  isOpen: false,
  showHistory: false,
  showRating: false,
  currentConversation: null,
  conversations: [],
  mode: 'tutora',
  isStreaming: false,
  streamingContent: '',
  lessonContext: null,
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  ...INITIAL_STATE,

  // --- UI ---

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  toggleHistory: () => set((state) => ({ showHistory: !state.showHistory })),

  setShowRating: (show) => set({ showRating: show }),

  // --- Mode and Conversation ---

  setMode: (mode) => set({ mode }),

  setCurrentConversation: (conv) => set({ currentConversation: conv }),

  addMessage: (message) =>
    set((state) => {
      if (!state.currentConversation) return state

      return {
        currentConversation: {
          ...state.currentConversation,
          messages: [...state.currentConversation.messages, message],
          updated_at: new Date().toISOString(),
        },
      }
    }),

  newConversation: () =>
    set({
      currentConversation: null,
      isStreaming: false,
      streamingContent: '',
      showRating: false,
    }),

  setConversations: (convs) => set({ conversations: convs }),

  // --- Streaming ---

  startStreaming: () =>
    set({
      isStreaming: true,
      streamingContent: '',
    }),

  appendStreamContent: (chunk) =>
    set((state) => ({
      streamingContent: state.streamingContent + chunk,
    })),

  finishStreaming: (fullContent) =>
    set((state) => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fullContent,
        timestamp: new Date().toISOString(),
      }

      const updatedConversation = state.currentConversation
        ? {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, assistantMessage],
            updated_at: new Date().toISOString(),
          }
        : null

      return {
        isStreaming: false,
        streamingContent: '',
        currentConversation: updatedConversation,
      }
    }),

  // --- Context ---

  setLessonContext: (ctx) => set({ lessonContext: ctx }),

  clearLessonContext: () => set({ lessonContext: null }),
}))
