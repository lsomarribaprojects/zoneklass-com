-- ============================================
-- Tabla de inscripciones a cursos
-- ============================================

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Indices
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);

-- RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Estudiantes pueden ver sus propias inscripciones
CREATE POLICY "users_read_own_enrollments" ON course_enrollments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Estudiantes pueden inscribirse (solo en cursos publicados)
CREATE POLICY "users_enroll_themselves" ON course_enrollments
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_enrollments.course_id
      AND courses.is_published = true
    )
  );

-- Estudiantes pueden actualizar sus propias inscripciones
CREATE POLICY "users_update_own_enrollments" ON course_enrollments
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins acceso total
CREATE POLICY "admin_full_access_enrollments" ON course_enrollments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );
