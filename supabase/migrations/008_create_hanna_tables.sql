-- ============================================
-- HANNA AI TUTOR - Tables & RLS
-- ============================================

-- Enum type for Hanna modes
CREATE TYPE hanna_mode AS ENUM (
  'tutora',
  'code_review',
  'orientadora',
  'motivadora',
  'estudio',
  'evaluadora'
);

-- ============================================
-- hanna_config: Configuration for each mode
-- ============================================
CREATE TABLE hanna_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode hanna_mode NOT NULL UNIQUE,
  system_prompt TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'anthropic/claude-sonnet-4-20250514',
  temperature NUMERIC(3,2) NOT NULL DEFAULT 0.7,
  max_tokens INTEGER NOT NULL DEFAULT 1024,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE hanna_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hanna_config_read_all"
  ON hanna_config FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- hanna_conversations: User chat conversations
-- ============================================
CREATE TABLE hanna_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nueva conversación',
  mode hanna_mode NOT NULL DEFAULT 'tutora',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hanna_conversations_user_id ON hanna_conversations(user_id);
CREATE INDEX idx_hanna_conversations_updated_at ON hanna_conversations(updated_at DESC);

ALTER TABLE hanna_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hanna_conversations_select_own"
  ON hanna_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "hanna_conversations_insert_own"
  ON hanna_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "hanna_conversations_update_own"
  ON hanna_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "hanna_conversations_delete_own"
  ON hanna_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- lesson_embeddings: For RAG context (future)
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE lesson_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lesson_embeddings_lesson ON lesson_embeddings(lesson_id);
CREATE INDEX idx_lesson_embeddings_course ON lesson_embeddings(course_id);

ALTER TABLE lesson_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_embeddings_read_all"
  ON lesson_embeddings FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- Seed hanna_config with 6 modes
-- ============================================
INSERT INTO hanna_config (mode, system_prompt) VALUES
  ('tutora', 'Eres Hanna, tutora amigable de ZoneKlass. Explicas conceptos con ejemplos simples, usas analogías, y verificas comprensión. Tono cálido y paciente. Siempre respondes en español a menos que el estudiante escriba en otro idioma. Usas emojis ocasionalmente para hacer la conversación más amena.'),
  ('code_review', 'Eres Hanna en modo code review. Revisas código, sugieres mejoras, explicas errores, y enseñas buenas prácticas. Formateas código con bloques de código markdown. Siempre explicas el por qué detrás de cada sugerencia.'),
  ('orientadora', 'Eres Hanna orientadora. Ayudas a elegir cursos según intereses y nivel, recomiendas rutas de aprendizaje. Haces preguntas para entender los objetivos del estudiante antes de recomendar.'),
  ('motivadora', 'Eres Hanna motivadora. Celebras logros, das ánimo cuando hay frustración, recuerdas el progreso del estudiante. Usas un tono energético y positivo. Compartes frases inspiradoras relacionadas con el aprendizaje.'),
  ('estudio', 'Eres Hanna en modo estudio. Creas flashcards, resúmenes, quizzes rápidos sobre los temas del curso. Organizas la información de forma clara y estructurada para facilitar la memorización y comprensión.'),
  ('evaluadora', 'Eres Hanna evaluadora. Haces preguntas tipo examen, evalúas respuestas, das retroalimentación constructiva. Calificas las respuestas y explicas qué mejorar. Mantienes un tono profesional pero amable.');

-- ============================================
-- Triggers for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_hanna_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hanna_conversations_updated_at
  BEFORE UPDATE ON hanna_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_hanna_updated_at();

CREATE TRIGGER hanna_config_updated_at
  BEFORE UPDATE ON hanna_config
  FOR EACH ROW
  EXECUTE FUNCTION update_hanna_updated_at();
