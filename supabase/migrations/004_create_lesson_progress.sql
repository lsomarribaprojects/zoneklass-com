-- ============================================
-- Tabla: lesson_progress
-- Registra el progreso del estudiante por leccion
-- ============================================

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Un usuario solo puede completar una leccion una vez
  UNIQUE(user_id, lesson_id)
);

-- Indices para consultas frecuentes
CREATE INDEX idx_lesson_progress_user_course ON lesson_progress(user_id, course_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);

-- ============================================
-- RLS: Usuario solo ve/crea su propio progreso
-- ============================================

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Estudiantes ven solo su propio progreso
CREATE POLICY "Users can view own progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Estudiantes pueden marcar lecciones como completadas
CREATE POLICY "Users can insert own progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins pueden ver todo el progreso (para analytics)
CREATE POLICY "Admins can view all progress"
  ON lesson_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );
