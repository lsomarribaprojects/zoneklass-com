-- ============================================
-- Migration 012: Instructor System
-- Creates tables for multi-tenant SaaS marketplace
-- ============================================

-- ============================================
-- 1. SUBSCRIPTION PLANS (SaaS B2B)
-- ============================================
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_courses INTEGER, -- NULL = unlimited
  max_students_per_course INTEGER, -- NULL = unlimited
  ai_generation_credits INTEGER DEFAULT 0, -- 0 = unlimited
  can_sell_courses BOOLEAN DEFAULT false,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE subscription_plans IS 'SaaS subscription plans for instructors (Free, Pro, Premium)';
COMMENT ON COLUMN subscription_plans.max_courses IS 'Maximum courses allowed. NULL = unlimited';
COMMENT ON COLUMN subscription_plans.ai_generation_credits IS 'Monthly AI credits. 0 = unlimited';

-- ============================================
-- 2. INSTRUCTOR SUBSCRIPTIONS
-- ============================================
CREATE TABLE instructor_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing'
  billing_cycle TEXT NOT NULL, -- 'monthly', 'yearly'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

COMMENT ON TABLE instructor_subscriptions IS 'Active subscriptions for instructor users';
COMMENT ON COLUMN instructor_subscriptions.status IS 'Stripe subscription status: active, canceled, past_due, trialing';

-- ============================================
-- 3. AI CREDIT USAGE TRACKING
-- ============================================
CREATE TABLE ai_credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES instructor_subscriptions(id),
  credits_used INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'course_outline', 'lesson_content', 'quiz', 'image'
  resource_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ai_credit_transactions IS 'Tracks AI generation credit usage per instructor';
COMMENT ON COLUMN ai_credit_transactions.action_type IS 'Type of AI generation: course_outline, lesson_content, quiz, image';

-- ============================================
-- 4. COURSE PURCHASES (Marketplace B2C)
-- ============================================
CREATE TABLE course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10,2) NOT NULL,
  instructor_earnings DECIMAL(10,2) NOT NULL, -- 70%
  platform_fee DECIMAL(10,2) NOT NULL, -- 30%
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL, -- 'completed', 'refunded'
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

COMMENT ON TABLE course_purchases IS 'One-time course purchases in marketplace';
COMMENT ON COLUMN course_purchases.instructor_earnings IS '70% revenue share to instructor';
COMMENT ON COLUMN course_purchases.platform_fee IS '30% platform commission';

-- ============================================
-- 5. COURSE REVIEWS
-- ============================================
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);

COMMENT ON TABLE course_reviews IS 'Student ratings and reviews for courses';

-- ============================================
-- 6. INSTRUCTOR ANALYTICS (Pre-calculated)
-- ============================================
CREATE TABLE instructor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  total_students INTEGER DEFAULT 0,
  new_enrollments INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  avg_completion_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(instructor_id, course_id, metric_date)
);

COMMENT ON TABLE instructor_analytics IS 'Pre-calculated daily analytics per instructor and course';
COMMENT ON COLUMN instructor_analytics.avg_completion_rate IS 'Percentage of course completed on average';

-- ============================================
-- 7. REFERRAL SYSTEM
-- ============================================
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  commission_percent INTEGER DEFAULT 10 CHECK (commission_percent >= 0 AND commission_percent <= 50),
  total_uses INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE referral_codes IS 'Referral codes for course discounts and affiliate commissions';
COMMENT ON COLUMN referral_codes.discount_percent IS 'Discount for referred student (0-100%)';
COMMENT ON COLUMN referral_codes.commission_percent IS 'Affiliate commission for referrer (0-50%)';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_instructor_subs_user ON instructor_subscriptions(user_id);
CREATE INDEX idx_instructor_subs_status ON instructor_subscriptions(status);
CREATE INDEX idx_course_purchases_user ON course_purchases(user_id);
CREATE INDEX idx_course_purchases_course ON course_purchases(course_id);
CREATE INDEX idx_analytics_instructor ON instructor_analytics(instructor_id, metric_date DESC);
CREATE INDEX idx_analytics_course ON instructor_analytics(course_id, metric_date DESC);
CREATE INDEX idx_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_referral_codes_course ON referral_codes(course_id);
CREATE INDEX idx_ai_credits_user ON ai_credit_transactions(user_id, created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update instructor_subscriptions.updated_at on update
CREATE TRIGGER instructor_subscriptions_updated_at
  BEFORE UPDATE ON instructor_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Update course_reviews.updated_at on update
CREATE TRIGGER course_reviews_updated_at
  BEFORE UPDATE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS POLICIES (Basic - will be extended in 014)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- Subscription Plans: Public read (for pricing page)
CREATE POLICY "public_read_subscription_plans" ON subscription_plans
  FOR SELECT TO public
  USING (is_active = true);

-- Instructor Subscriptions: Users can read only their own
CREATE POLICY "instructors_read_own_subscription" ON instructor_subscriptions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- AI Credits: Users can read only their own
CREATE POLICY "instructors_read_own_credits" ON ai_credit_transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Course Purchases: Users can read only their own
CREATE POLICY "students_read_own_purchases" ON course_purchases
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Course Reviews: Anyone can read, authenticated can insert/update their own
CREATE POLICY "public_read_reviews" ON course_reviews
  FOR SELECT TO public
  USING (true);

CREATE POLICY "students_manage_own_reviews" ON course_reviews
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Instructor Analytics: Instructors can read only their own
CREATE POLICY "instructors_read_own_analytics" ON instructor_analytics
  FOR SELECT TO authenticated
  USING (instructor_id = auth.uid());

-- Referral Codes: Public can read active codes, instructors manage their own
CREATE POLICY "public_read_active_referrals" ON referral_codes
  FOR SELECT TO public
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "instructors_manage_own_referrals" ON referral_codes
  FOR ALL TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());
