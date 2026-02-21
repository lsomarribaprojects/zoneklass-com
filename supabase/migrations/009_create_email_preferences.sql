-- ============================================
-- 009: Email Preferences
-- ============================================

CREATE TABLE email_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  welcome BOOLEAN DEFAULT true NOT NULL,
  enrollment BOOLEAN DEFAULT true NOT NULL,
  completion BOOLEAN DEFAULT true NOT NULL,
  badges BOOLEAN DEFAULT true NOT NULL,
  weekly_digest BOOLEAN DEFAULT true NOT NULL,
  marketing BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own preferences
CREATE POLICY "Users can read own email preferences"
  ON email_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own email preferences"
  ON email_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own email preferences"
  ON email_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin can read all preferences
CREATE POLICY "Admin can read all email preferences"
  ON email_preferences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- Auto-create preferences on profile creation
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_profile_email_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_email_prefs
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_profile_email_prefs();

-- ============================================
-- Index
-- ============================================

CREATE INDEX idx_email_preferences_user_id ON email_preferences(user_id);
