// ============================================
// AI Credit Costs (shared between server actions and client components)
// ============================================

export const AI_CREDIT_COSTS = {
  course_outline: 5,
  lesson_content: 2,
  quiz: 1,
  image: 3,
  chat_message: 1,
  improve_text: 1,
  generate_content: 3,
  generate_quiz: 2,
} as const

export type AIActionType = keyof typeof AI_CREDIT_COSTS
