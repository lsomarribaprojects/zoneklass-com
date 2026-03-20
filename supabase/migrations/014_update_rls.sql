-- ============================================
-- Migration 014: Update RLS Policies for Multi-Tenancy
-- Ownership-based access control for instructors
-- ============================================

-- ============================================
-- 1. DROP OLD ADMIN-ONLY POLICIES
-- ============================================
DROP POLICY IF EXISTS "admin_full_access_courses" ON courses;
DROP POLICY IF EXISTS "admin_full_access_modules" ON modules;
DROP POLICY IF EXISTS "admin_full_access_lessons" ON lessons;
DROP POLICY IF EXISTS "students_read_published_courses" ON courses;

-- ============================================
-- 2. COURSES TABLE - OWNERSHIP-BASED POLICIES
-- ============================================

-- Super admin: full access to all courses
CREATE POLICY "super_admin_full_access_courses" ON courses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Admins: moderate all courses (read, update, delete but not create)
CREATE POLICY "admin_moderate_courses" ON courses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Instructors: CRUD only THEIR courses
CREATE POLICY "instructors_manage_own_courses" ON courses
  FOR ALL TO authenticated
  USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
    )
  )
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
    )
  );

-- Authenticated users: read published marketplace courses
CREATE POLICY "authenticated_read_marketplace_courses" ON courses
  FOR SELECT TO authenticated
  USING (
    (is_published = true AND is_marketplace_published = true)
    OR (visibility_mode = 'scheduled' AND scheduled_publish_at <= now())
    OR created_by = auth.uid() -- Instructors can see their own drafts
  );

-- Public (not authenticated): read official courses only
CREATE POLICY "public_read_official_courses" ON courses
  FOR SELECT TO public
  USING (is_official = true AND is_published = true);

-- ============================================
-- 3. MODULES TABLE - OWNERSHIP-BASED POLICIES
-- ============================================

DROP POLICY IF EXISTS "students_read_modules" ON modules;

-- Super admin: full access
CREATE POLICY "super_admin_full_access_modules" ON modules
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Admins: moderate all modules
CREATE POLICY "admin_moderate_modules" ON modules
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Instructors: CRUD modules of THEIR courses
CREATE POLICY "instructors_manage_own_modules" ON modules
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND courses.created_by = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND courses.created_by = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
    )
  );

-- Authenticated users: read modules of published courses
CREATE POLICY "authenticated_read_published_modules" ON modules
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND (
        (courses.is_published = true AND courses.is_marketplace_published = true)
        OR courses.created_by = auth.uid() -- Own drafts
      )
    )
  );

-- Public: read modules of official courses
CREATE POLICY "public_read_official_modules" ON modules
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND courses.is_official = true
      AND courses.is_published = true
    )
  );

-- ============================================
-- 4. LESSONS TABLE - OWNERSHIP-BASED POLICIES
-- ============================================

DROP POLICY IF EXISTS "students_read_lessons" ON lessons;

-- Super admin: full access
CREATE POLICY "super_admin_full_access_lessons" ON lessons
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Admins: moderate all lessons
CREATE POLICY "admin_moderate_lessons" ON lessons
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Instructors: CRUD lessons of THEIR courses
CREATE POLICY "instructors_manage_own_lessons" ON lessons
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      JOIN modules ON modules.course_id = courses.id
      WHERE modules.id = lessons.module_id
      AND courses.created_by = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      JOIN modules ON modules.course_id = courses.id
      WHERE modules.id = lessons.module_id
      AND courses.created_by = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
    )
  );

-- Authenticated users: read lessons of published courses
CREATE POLICY "authenticated_read_published_lessons" ON lessons
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      JOIN modules ON modules.course_id = courses.id
      WHERE modules.id = lessons.module_id
      AND (
        (courses.is_published = true AND courses.is_marketplace_published = true)
        OR courses.created_by = auth.uid() -- Own drafts
      )
    )
  );

-- Public: read lessons of official courses
CREATE POLICY "public_read_official_lessons" ON lessons
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM courses
      JOIN modules ON modules.course_id = courses.id
      WHERE modules.id = lessons.module_id
      AND courses.is_official = true
      AND courses.is_published = true
    )
  );

-- ============================================
-- 5. ADMIN-SPECIFIC POLICIES FOR NEW TABLES
-- ============================================

-- Super admin and admin can see all instructor subscriptions
CREATE POLICY "admin_view_all_subscriptions" ON instructor_subscriptions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Super admin and admin can see all AI credit transactions
CREATE POLICY "admin_view_all_credits" ON ai_credit_transactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Super admin and admin can see all course purchases
CREATE POLICY "admin_view_all_purchases" ON course_purchases
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Instructors can see purchases of THEIR courses
CREATE POLICY "instructors_view_own_course_purchases" ON course_purchases
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_purchases.course_id
      AND courses.created_by = auth.uid()
    )
  );

-- Super admin and admin can see all analytics
CREATE POLICY "admin_view_all_analytics" ON instructor_analytics
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- ============================================
-- 6. UPDATE TRIGGER FOR handle_new_user
-- ============================================

-- This trigger needs to read role from metadata during signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  user_role_value user_role;
BEGIN
  -- Count existing users
  SELECT COUNT(*) INTO user_count FROM public.profiles;

  -- First user = super_admin
  IF user_count = 0 THEN
    user_role_value := 'super_admin';
  ELSE
    -- Read role from signup metadata (SignupForm will set this)
    user_role_value := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'estudiante' -- Default to student
    );
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    instructor_since
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role_value,
    CASE
      WHEN user_role_value = 'instructor' THEN now()
      ELSE NULL
    END
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (ensure it's the latest version)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

COMMENT ON FUNCTION handle_new_user IS 'Creates profile on signup. First user = super_admin, others use role from metadata';
