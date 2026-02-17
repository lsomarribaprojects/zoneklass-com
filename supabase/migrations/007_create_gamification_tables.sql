-- ============================================
-- GAMIFICATION SYSTEM TABLES
-- ============================================

-- Enum types
CREATE TYPE xp_source AS ENUM (
  'lesson_complete',
  'course_complete',
  'post_create',
  'comment_create',
  'daily_login',
  'streak_bonus',
  'badge_earned'
);

CREATE TYPE badge_requirement AS ENUM (
  'lessons_completed',
  'courses_completed',
  'xp_earned',
  'streak_days',
  'posts_created',
  'comments_created'
);

-- ============================================
-- XP TRANSACTIONS
-- ============================================
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source xp_source NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id, created_at DESC);
CREATE INDEX idx_xp_transactions_source ON xp_transactions(source);

-- ============================================
-- BADGES
-- ============================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color TEXT NOT NULL,
  requirement_type badge_requirement NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- USER BADGES
-- ============================================
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

-- ============================================
-- RLS POLICIES
-- ============================================

-- XP Transactions: users see all, system inserts
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "XP transactions are viewable by authenticated users"
  ON xp_transactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can create XP transactions"
  ON xp_transactions FOR INSERT TO authenticated WITH CHECK (true);

-- Badges: everyone can see
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by authenticated users"
  ON badges FOR SELECT TO authenticated USING (true);

-- User Badges: everyone can see, system inserts
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User badges are viewable by authenticated users"
  ON user_badges FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can award badges"
  ON user_badges FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- RPC: Award XP and update profile
-- ============================================
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source xp_source,
  p_description TEXT
) RETURNS TABLE(new_xp INTEGER, new_level INTEGER) AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Insert XP transaction
  INSERT INTO xp_transactions (user_id, amount, source, description)
  VALUES (p_user_id, p_amount, p_source, p_description);

  -- Update profile XP and level
  UPDATE profiles
  SET xp = xp + p_amount,
      level = FLOOR((xp + p_amount) / 100) + 1,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING xp, level INTO v_new_xp, v_new_level;

  RETURN QUERY SELECT v_new_xp, v_new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED: 10 predefined badges
-- ============================================
INSERT INTO badges (name, description, icon_name, color, requirement_type, requirement_value) VALUES
  ('Primer Paso', 'Completa tu primera lección', 'footprints', '#10B981', 'lessons_completed', 1),
  ('Estudiante', 'Completa 10 lecciones', 'book-open', '#3B82F6', 'lessons_completed', 10),
  ('Graduado', 'Completa tu primer curso', 'graduation-cap', '#8B5CF6', 'courses_completed', 1),
  ('Académico', 'Completa 3 cursos', 'award', '#F59E0B', 'courses_completed', 3),
  ('Racha 7', 'Mantén una racha de 7 días', 'flame', '#EF4444', 'streak_days', 7),
  ('Racha 30', 'Mantén una racha de 30 días', 'zap', '#F97316', 'streak_days', 30),
  ('Social', 'Crea 5 posts en la comunidad', 'message-circle', '#06B6D4', 'posts_created', 5),
  ('Colaborador', 'Escribe 20 comentarios', 'users', '#EC4899', 'comments_created', 20),
  ('Centurión', 'Gana 1000 XP', 'shield', '#6366F1', 'xp_earned', 1000),
  ('Leyenda', 'Gana 5000 XP', 'crown', '#EAB308', 'xp_earned', 5000);
