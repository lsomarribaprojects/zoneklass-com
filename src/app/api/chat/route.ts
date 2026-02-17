import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { HannaMode, ChatMessage, HannaConfig } from '@/features/hanna/types'

const RATE_LIMIT = 50
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

const lessonContextSchema = z.object({
  lessonTitle: z.string(),
  courseTitle: z.string(),
  lessonContent: z.string(),
})

const requestSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().uuid().optional(),
  mode: z.enum(['tutora', 'code_review', 'orientadora', 'motivadora', 'estudio', 'evaluadora'] as const),
  lessonContext: lessonContextSchema.optional(),
})

type OpenRouterDelta = {
  choices: Array<{ delta: { content?: string }; finish_reason: string | null }>
}

export async function POST(req: NextRequest): Promise<NextResponse | Response> {
  // 1. Validate request body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { message, conversationId, mode, lessonContext } = parsed.data

  // 2. Authenticate user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // 3. Rate limiting: max 50 messages per hour (counts conversations active in last hour)
  const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const { data: recentConvos } = await supabase
    .from('hanna_conversations')
    .select('messages')
    .eq('user_id', user.id)
    .gte('updated_at', oneHourAgo)

  const recentMessageCount = (recentConvos ?? []).reduce((sum, c) => {
    const msgs = c.messages as ChatMessage[]
    const recentMsgs = msgs.filter(
      (m) => m.role === 'user' && new Date(m.timestamp) >= new Date(oneHourAgo)
    )
    return sum + recentMsgs.length
  }, 0)

  if (recentMessageCount >= RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Limite de mensajes alcanzado. Intenta en una hora.' },
      { status: 429 }
    )
  }

  // 4. Fetch hanna_config for the selected mode
  const { data: config, error: configError } = await supabase
    .from('hanna_config')
    .select('*')
    .eq('mode', mode as HannaMode)
    .eq('is_active', true)
    .single()

  if (configError || !config) {
    return NextResponse.json({ error: 'Configuracion de Hanna no disponible' }, { status: 503 })
  }

  const hannaConfig = config as HannaConfig

  // 5. Build system prompt with optional lesson context
  let systemPrompt = hannaConfig.system_prompt
  if (lessonContext) {
    systemPrompt += `\n\nContexto actual: El estudiante está viendo la lección '${lessonContext.lessonTitle}' del curso '${lessonContext.courseTitle}'. Contenido de la lección: ${lessonContext.lessonContent}`
  }

  // 6. Fetch existing conversation messages (if conversationId provided)
  let existingMessages: ChatMessage[] = []
  let resolvedConversationId = conversationId ?? null

  if (conversationId) {
    const { data: convo } = await supabase
      .from('hanna_conversations')
      .select('messages')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (convo) {
      existingMessages = (convo.messages as ChatMessage[]) ?? []
    }
  }

  // Build messages array for OpenRouter
  const openRouterMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...existingMessages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  // 7. Call OpenRouter with streaming
  const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zoneklass.com',
      'X-Title': 'ZoneKlass - Hanna AI Tutor',
    },
    body: JSON.stringify({
      model: hannaConfig.model,
      temperature: hannaConfig.temperature,
      max_tokens: hannaConfig.max_tokens,
      messages: openRouterMessages,
      stream: true,
    }),
  })

  if (!openRouterRes.ok) {
    const errText = await openRouterRes.text()
    console.error('OpenRouter error:', errText)
    return NextResponse.json({ error: 'Error al conectar con Hanna' }, { status: 502 })
  }

  // 8. Stream SSE response back to client and collect full assistant reply
  const encoder = new TextEncoder()
  let assistantContent = ''

  const stream = new ReadableStream({
    async start(controller) {
      // Emit conversationId as the first event so the client can track it
      const idPayload = JSON.stringify({ conversationId: resolvedConversationId ?? '__pending__' })
      controller.enqueue(encoder.encode(`data: ${idPayload}\n\n`))

      const reader = openRouterRes.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const rawData = trimmed.slice(5).trim()
            if (rawData === '[DONE]') continue

            try {
              const chunk = JSON.parse(rawData) as OpenRouterDelta
              const delta = chunk.choices[0]?.delta?.content
              if (delta) {
                assistantContent += delta
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`))
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      // 9. Save conversation to Supabase after streaming completes
      const timestamp = new Date().toISOString()
      const userMsg: ChatMessage = { role: 'user', content: message, timestamp }
      const assistantMsg: ChatMessage = { role: 'assistant', content: assistantContent, timestamp }
      const newMessages = [...existingMessages, userMsg, assistantMsg]

      if (resolvedConversationId) {
        // 10. Append to existing conversation
        await supabase
          .from('hanna_conversations')
          .update({ messages: newMessages, updated_at: timestamp })
          .eq('id', resolvedConversationId)
          .eq('user_id', user.id)
      } else {
        // Create new conversation with auto-generated title
        const title = message.slice(0, 50) + (message.length > 50 ? '...' : '')
        const { data: newConvo } = await supabase
          .from('hanna_conversations')
          .insert({ user_id: user.id, title, mode, messages: newMessages })
          .select('id')
          .single()

        resolvedConversationId = (newConvo as { id: string } | null)?.id ?? null

        // Emit updated conversationId now that it exists
        if (resolvedConversationId) {
          const updatedIdPayload = JSON.stringify({ conversationId: resolvedConversationId })
          controller.enqueue(encoder.encode(`data: ${updatedIdPayload}\n\n`))
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
