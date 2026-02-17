-- ============================================
-- Invite Links System
-- ============================================

-- Enums
CREATE TYPE invite_source AS ENUM ('twitter', 'whatsapp', 'email', 'website', 'other');
CREATE TYPE invite_action AS ENUM ('click', 'register', 'enroll');

-- Tabla invite_links
CREATE TABLE invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  source invite_source NOT NULL DEFAULT 'other',
  expires_at TIMESTAMPTZ,
  max_uses INTEGER DEFAULT 0,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla invite_tracking
CREATE TABLE invite_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_link_id UUID NOT NULL REFERENCES invite_links(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action invite_action NOT NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices
CREATE INDEX idx_invite_links_code ON invite_links(code);
CREATE INDEX idx_invite_links_course ON invite_links(course_id);
CREATE INDEX idx_invite_tracking_link ON invite_tracking(invite_link_id);
CREATE INDEX idx_invite_tracking_user ON invite_tracking(user_id);

-- ============================================
-- RLS
-- ============================================

ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_tracking ENABLE ROW LEVEL SECURITY;

-- invite_links: admins full CRUD
CREATE POLICY "Admins can manage invite links"
  ON invite_links FOR ALL
  TO authenticated
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

-- invite_links: anyone can read active links (for /invite/[code] validation)
CREATE POLICY "Anyone can read active invite links"
  ON invite_links FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- invite_tracking: anyone can insert (for click tracking)
CREATE POLICY "Anyone can insert invite tracking"
  ON invite_tracking FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- invite_tracking: admins can read tracking data
CREATE POLICY "Admins can read invite tracking"
  ON invite_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );
