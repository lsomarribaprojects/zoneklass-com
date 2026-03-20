-- ============================================
-- Migration 013: Extend Existing Tables for Multi-Tenancy
-- Adds instructor-specific and marketplace fields
-- ============================================

-- ============================================
-- 1. ADD 'INSTRUCTOR' ROLE TO ENUM
-- ============================================
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'instructor';

COMMENT ON TYPE user_role IS 'User roles: super_admin, admin, instructor, estudiante';

-- ============================================
-- 2. EXTEND PROFILES FOR INSTRUCTORS
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio_en TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_instructor_verified BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instructor_since TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0;

COMMENT ON COLUMN profiles.bio IS 'Instructor bio in Spanish';
COMMENT ON COLUMN profiles.bio_en IS 'Instructor bio in English';
COMMENT ON COLUMN profiles.website_url IS 'Instructor website or portfolio URL';
COMMENT ON COLUMN profiles.social_links IS 'JSON object with social media links: {twitter, linkedin, youtube, etc}';
COMMENT ON COLUMN profiles.is_instructor_verified IS 'Manual verification by admin (badge)';
COMMENT ON COLUMN profiles.instructor_since IS 'Date when user became instructor';
COMMENT ON COLUMN profiles.total_earnings IS 'Total revenue earned from course sales';

-- ============================================
-- 3. EXTEND COURSES FOR MARKETPLACE
-- ============================================
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_official BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_marketplace_published BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS sale_type TEXT DEFAULT 'free';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS visibility_mode TEXT DEFAULT 'public';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS enable_referrals BOOLEAN DEFAULT true;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS enable_social_sharing BOOLEAN DEFAULT true;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS embeddable BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS embed_domains TEXT[];
ALTER TABLE courses ADD COLUMN IF NOT EXISTS total_enrollments INTEGER DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

COMMENT ON COLUMN courses.is_official IS 'Official ZoneKlass course (free, featured, doesn''t count against instructor limits)';
COMMENT ON COLUMN courses.is_marketplace_published IS 'Published to public marketplace (separate from is_published)';
COMMENT ON COLUMN courses.sale_type IS 'free or paid';
COMMENT ON COLUMN courses.visibility_mode IS 'public, private, or scheduled';
COMMENT ON COLUMN courses.scheduled_publish_at IS 'Future publish date for scheduled courses';
COMMENT ON COLUMN courses.enable_referrals IS 'Allow referral codes for this course';
COMMENT ON COLUMN courses.enable_social_sharing IS 'Show social share buttons';
COMMENT ON COLUMN courses.embeddable IS 'Allow embedding in external sites via iframe';
COMMENT ON COLUMN courses.embed_domains IS 'Whitelist of domains allowed to embed (NULL = all)';
COMMENT ON COLUMN courses.total_enrollments IS 'Cached count of enrollments';
COMMENT ON COLUMN courses.avg_rating IS 'Cached average rating (1.00-5.00)';
COMMENT ON COLUMN courses.total_reviews IS 'Cached count of reviews';

-- ============================================
-- 4. INDEXES FOR MARKETPLACE QUERIES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_marketplace
  ON courses(is_marketplace_published, category)
  WHERE is_marketplace_published = true;

CREATE INDEX IF NOT EXISTS idx_courses_creator
  ON courses(created_by, is_published);

CREATE INDEX IF NOT EXISTS idx_courses_official
  ON courses(is_official)
  WHERE is_official = true;

CREATE INDEX IF NOT EXISTS idx_courses_scheduled
  ON courses(scheduled_publish_at)
  WHERE visibility_mode = 'scheduled' AND scheduled_publish_at IS NOT NULL;

-- ============================================
-- 5. ADD CONSTRAINTS
-- ============================================

-- sale_type must be 'free' or 'paid'
ALTER TABLE courses ADD CONSTRAINT check_sale_type
  CHECK (sale_type IN ('free', 'paid'));

-- visibility_mode must be 'public', 'private', or 'scheduled'
ALTER TABLE courses ADD CONSTRAINT check_visibility_mode
  CHECK (visibility_mode IN ('public', 'private', 'scheduled'));

-- avg_rating must be between 1.00 and 5.00 if not NULL
ALTER TABLE courses ADD CONSTRAINT check_avg_rating
  CHECK (avg_rating IS NULL OR (avg_rating >= 1.00 AND avg_rating <= 5.00));

-- ============================================
-- 6. UPDATE EXISTING OFFICIAL COURSES
-- ============================================

-- Mark "Domina la IA" and "IA para Marketing" as official courses
UPDATE courses
SET is_official = true
WHERE slug IN ('domina-la-ia-de-cero-a-experto', 'ia-para-marketing-y-negocios');

-- ============================================
-- 7. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to increment total_enrollments on course
CREATE OR REPLACE FUNCTION increment_course_enrollments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET total_enrollments = total_enrollments + 1
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-increment enrollments
DROP TRIGGER IF EXISTS trigger_increment_enrollments ON course_enrollments;
CREATE TRIGGER trigger_increment_enrollments
  AFTER INSERT ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION increment_course_enrollments();

-- Function to update course avg_rating when review changes
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
DECLARE
  new_avg DECIMAL(3,2);
  review_count INTEGER;
BEGIN
  -- Calculate new average rating
  SELECT
    ROUND(AVG(rating)::numeric, 2),
    COUNT(*)
  INTO new_avg, review_count
  FROM course_reviews
  WHERE course_id = COALESCE(NEW.course_id, OLD.course_id);

  -- Update course
  UPDATE courses
  SET
    avg_rating = new_avg,
    total_reviews = review_count
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update ratings
DROP TRIGGER IF EXISTS trigger_update_rating ON course_reviews;
CREATE TRIGGER trigger_update_rating
  AFTER INSERT OR UPDATE OR DELETE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

-- Function to increment instructor earnings
CREATE OR REPLACE FUNCTION increment_instructor_earnings(
  p_instructor_id UUID,
  p_amount DECIMAL(10,2)
)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET total_earnings = total_earnings + p_amount
  WHERE id = p_instructor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION increment_instructor_earnings IS 'Adds revenue to instructor total_earnings (called from Stripe webhook)';
