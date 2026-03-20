-- ============================================
-- Migration 015: Instructor AI Memory System
-- Tablas para memoria persistente del agente AI por instructor
-- ============================================

-- Tabla para memoria persistente del agente por instructor
CREATE TABLE IF NOT EXISTS public.instructor_ai_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('preference', 'style', 'feedback', 'context')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(instructor_id, memory_type, content)
);

-- Tabla para historial de conversaciones con el agente
CREATE TABLE IF NOT EXISTS public.instructor_ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL CHECK (context_type IN ('course_creation', 'lesson_editing', 'general', 'review')),
  context_id UUID,
  messages JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_ai_memory_instructor ON public.instructor_ai_memory(instructor_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_type ON public.instructor_ai_memory(instructor_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_instructor ON public.instructor_ai_conversations(instructor_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_context ON public.instructor_ai_conversations(instructor_id, context_type, context_id);

-- RLS: cada instructor solo ve su propia memoria
ALTER TABLE public.instructor_ai_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own AI memory"
  ON public.instructor_ai_memory FOR ALL
  USING (instructor_id = auth.uid());

CREATE POLICY "Users can manage own AI conversations"
  ON public.instructor_ai_conversations FOR ALL
  USING (instructor_id = auth.uid());
