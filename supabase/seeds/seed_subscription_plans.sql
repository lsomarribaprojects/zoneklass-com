-- ============================================
-- Seed: Subscription Plans
-- Free, Pro, Premium plans for instructors
-- ============================================

-- Clear existing plans (for idempotency)
TRUNCATE TABLE subscription_plans CASCADE;

-- ============================================
-- FREE PLAN
-- ============================================
INSERT INTO subscription_plans (
  name,
  name_en,
  description,
  description_en,
  price_monthly,
  price_yearly,
  max_courses,
  max_students_per_course,
  ai_generation_credits,
  can_sell_courses,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  features,
  is_active
) VALUES (
  'Gratis',
  'Free',
  'Perfecto para empezar a crear tu primer curso',
  'Perfect to start creating your first course',
  0.00,
  0.00,
  1,        -- 1 curso máximo
  50,       -- 50 estudiantes por curso
  10,       -- 10 créditos IA/mes
  false,    -- No puede vender cursos
  NULL,     -- No Stripe ID (free plan)
  NULL,
  '[
    "1 curso",
    "50 estudiantes máximo por curso",
    "10 créditos IA/mes",
    "Analíticas básicas",
    "Comunidad de instructores"
  ]'::jsonb,
  true
);

-- ============================================
-- PRO PLAN
-- ============================================
INSERT INTO subscription_plans (
  name,
  name_en,
  description,
  description_en,
  price_monthly,
  price_yearly,
  max_courses,
  max_students_per_course,
  ai_generation_credits,
  can_sell_courses,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  features,
  is_active
) VALUES (
  'Pro',
  'Pro',
  'Para instructores serios que quieren escalar',
  'For serious instructors looking to scale',
  19.99,
  199.99,   -- ~$16.66/mes si pagan anual (2 meses gratis)
  10,       -- 10 cursos
  500,      -- 500 estudiantes por curso
  100,      -- 100 créditos IA/mes
  true,     -- Puede vender cursos
  NULL,     -- TODO: Agregar Stripe Price ID después de crear en Stripe
  NULL,     -- TODO: Agregar Stripe Price ID después de crear en Stripe
  '[
    "10 cursos",
    "500 estudiantes máximo por curso",
    "100 créditos IA/mes",
    "Analíticas avanzadas",
    "Vende cursos (70% comisión)",
    "Programa de referidos",
    "Certificados de finalización",
    "Soporte prioritario"
  ]'::jsonb,
  true
);

-- ============================================
-- PREMIUM PLAN
-- ============================================
INSERT INTO subscription_plans (
  name,
  name_en,
  description,
  description_en,
  price_monthly,
  price_yearly,
  max_courses,
  max_students_per_course,
  ai_generation_credits,
  can_sell_courses,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  features,
  is_active
) VALUES (
  'Premium',
  'Premium',
  'Todo ilimitado para academias y empresas',
  'Everything unlimited for academies and companies',
  49.99,
  499.99,   -- ~$41.66/mes si pagan anual (2 meses gratis)
  NULL,     -- Ilimitado (NULL = no limit)
  NULL,     -- Ilimitado
  0,        -- Ilimitado (0 = unlimited)
  true,     -- Puede vender cursos
  NULL,     -- TODO: Agregar Stripe Price ID después de crear en Stripe
  NULL,     -- TODO: Agregar Stripe Price ID después de crear en Stripe
  '[
    "Cursos ilimitados",
    "Estudiantes ilimitados",
    "IA ilimitada",
    "Analíticas avanzadas + exportación",
    "Vende cursos (70% comisión)",
    "Programa de referidos + afiliados",
    "Embeds en tu sitio web",
    "Marca personalizada (logo, colores)",
    "Subdominio propio",
    "API access",
    "Soporte dedicado 24/7",
    "Onboarding personalizado"
  ]'::jsonb,
  true
);

-- ============================================
-- VERIFY SEED
-- ============================================
-- Show seeded plans
SELECT
  name,
  price_monthly,
  price_yearly,
  max_courses,
  ai_generation_credits,
  can_sell_courses
FROM subscription_plans
ORDER BY price_monthly;
