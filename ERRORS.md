# ZoneKlass Error Tracking (Auto-Blindaje)

> Cada error documentado fortalece la fabrica. El mismo error NUNCA ocurre dos veces.

---

## Sprint 2: Registro + Onboarding

### 2026-03-18: UserRole TypeScript type missing 'instructor'
- **Sprint**: 2
- **Error**: `UserRole` type in `src/types/database.ts` only had `'super_admin' | 'admin' | 'estudiante'`. Migration 013 added `'instructor'` to the DB enum but the TypeScript type was never updated.
- **Cause**: Sprint 1 applied the migration but did not sync TypeScript types.
- **Fix**: Added `'instructor'` to `UserRole` union type.
- **Prevention**: ALWAYS update `src/types/database.ts` when running SQL migrations that modify enums or add columns.
- **Files**: `src/types/database.ts`

### 2026-03-18: ROLE_PERMISSIONS missing 'instructor' entry
- **Sprint**: 2
- **Error**: `ROLE_PERMISSIONS` object in `database.ts` only had entries for `super_admin`, `admin`, `estudiante`. Accessing `ROLE_PERMISSIONS['instructor']` would return `undefined` causing runtime errors.
- **Cause**: Same root cause as above - Sprint 1 migration not reflected in TS.
- **Fix**: Added `instructor` entry with `canManageCourses: true`, `canViewAnalytics: true`, `canAccessInstructor: true`. Also added `canAccessInstructor` permission to all roles.
- **Prevention**: When adding a new role, update ALL role-related objects in `database.ts`.
- **Files**: `src/types/database.ts`

### 2026-03-18: Profile interface missing instructor fields
- **Sprint**: 2
- **Error**: Migration 013 added `bio`, `bio_en`, `website_url`, `social_links`, `is_instructor_verified`, `instructor_since`, `total_earnings` columns to profiles. The `Profile` TypeScript interface was not updated.
- **Cause**: Sprint 1 migration not reflected in TS types.
- **Fix**: Added all 7 new fields to `Profile` interface.
- **Prevention**: ALWAYS update interface when ALTER TABLE adds columns.
- **Files**: `src/types/database.ts`

### 2026-03-18: i18n Dictionary type missing new auth keys
- **Sprint**: 2
- **Error**: Added `iAmA`, `student`, `instructor`, `studentDescription`, `instructorDescription` to both `es.ts` and `en.ts` but the `Dictionary` interface in `types.ts` was not updated. TypeScript would not enforce type safety on new keys.
- **Cause**: Added dictionary values but forgot the type definition.
- **Fix**: Added 5 new keys to `auth` section of `Dictionary` interface.
- **Prevention**: ALWAYS update `src/features/i18n/types.ts` FIRST before adding values to dictionaries.
- **Files**: `src/features/i18n/types.ts`

### 2026-03-18: Middleware matcher missing /onboarding route
- **Sprint**: 2
- **Error**: The `/onboarding` route was not in the middleware matcher, meaning Supabase session would not be refreshed when visiting the onboarding page. Server actions called from onboarding would fail with stale/missing sessions.
- **Cause**: New route created but not added to middleware config.
- **Fix**: Added `'/onboarding'` to the matcher array.
- **Prevention**: ALWAYS add new protected routes to `src/middleware.ts` matcher.
- **Files**: `src/middleware.ts`

### 2026-03-18: permissions.ts implicit any on profile.role
- **Sprint**: 2
- **Error**: `TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type 'Record<UserRole, Permission[]>'`. Supabase query returns untyped data.
- **Cause**: `profile.role` from Supabase `.select()` is typed as `any` since we're not using generated types.
- **Fix**: Added explicit cast: `const userRole = profile.role as UserRole`.
- **Prevention**: When accessing enum-like fields from Supabase queries, always cast to the appropriate TypeScript type.
- **Files**: `src/lib/auth/permissions.ts`

---

## Sprint 3: AI Course Generation

### 2026-03-18: Course type missing 12 marketplace columns
- **Sprint**: 3
- **Error**: Migration 013 added 12 columns to courses table (`is_official`, `is_marketplace_published`, `sale_type`, `visibility_mode`, `scheduled_publish_at`, `enable_referrals`, `enable_social_sharing`, `embeddable`, `embed_domains`, `total_enrollments`, `avg_rating`, `total_reviews`). The `Course` TypeScript interface was never updated.
- **Cause**: Same pattern as Sprint 2 - migration types not synced (Rule 1 violation).
- **Fix**: Added all 12 fields to `Course` interface in `database.ts`.
- **Prevention**: Rule 1 already covers this. Enforce it strictly.
- **Files**: `src/types/database.ts`

### 2026-03-18: Manual object construction breaks on type expansion
- **Sprint**: 3
- **Error**: 5 TypeScript errors in `enrollments.ts`, `invite-links.ts`, `EnrolledCoursesSection.tsx` where code manually listed every Course property instead of spreading the Supabase result. When Course got 12 new fields, these manual constructions became incomplete.
- **Cause**: Anti-pattern of destructuring individual properties: `{ id: course.id, title: course.title, ... }` instead of using spread: `{ ...courseBase, ...computed }`.
- **Fix**: Refactored all 5 locations to use spread pattern: `const { modules, ...courseBase } = course; return { ...courseBase, ...computedStats }`.
- **Prevention**: NEVER manually list individual properties from DB queries. Always spread the base object and add/override only computed fields.
- **Files**: `src/actions/enrollments.ts`, `src/actions/invite-links.ts`, `src/features/courses/components/catalog/EnrolledCoursesSection.tsx`

### 2026-03-18: AI_CREDIT_COSTS exported from 'use server' file
- **Sprint**: 3
- **Error**: `AI_CREDIT_COSTS` constant and `AIActionType` type were defined in `src/actions/ai-credits.ts` which has `'use server'` directive. Non-function exports from server action files cause errors when imported in client components.
- **Cause**: Mixed concerns - constants/types in a server actions file.
- **Fix**: Moved to `src/lib/ai/constants.ts` (shared module). Server action file imports from there.
- **Prevention**: NEVER export constants or types from `'use server'` files. Keep server action files for async functions only. Put shared types/constants in `src/lib/` or `src/types/`.
- **Files**: `src/lib/ai/constants.ts`, `src/actions/ai-credits.ts`

### 2026-03-18: Client component importing server-only function
- **Sprint**: 3
- **Error**: Wizard page (`page.tsx`) imported `generateCourseOutline` directly from `src/lib/ai/course-generator.ts`. This function uses the OpenAI SDK with server-side API keys. Client components can only call server actions (async functions from `'use server'` files).
- **Cause**: Missing server action wrapper for the AI generation function.
- **Fix**: Created `generateOutlineAction` server action in `instructor-courses.ts` that wraps the call with auth check.
- **Prevention**: AI/DB operations must ALWAYS be wrapped in server actions. Client components never import from `src/lib/` server-side modules directly.
- **Files**: `src/actions/instructor-courses.ts`, `src/app/(instructor)/instructor/courses/new/page.tsx`

---

## Sprint 3.5: Security Audit Fixes

### 2026-03-20: CRITICA - Escalamiento de privilegios via signup metadata
- **Sprint**: 3.5
- **Error**: El trigger `handle_new_user()` leia `raw_user_meta_data->>'role'` y lo casteaba directamente a `user_role`. Un atacante podia registrarse como `super_admin` llamando la API de Supabase Auth directamente.
- **Cause**: El trigger confiaba en datos proporcionados por el usuario sin validar.
- **Fix**: Migracion 015 - whitelist: solo `'instructor'` pasa, todo lo demas se convierte en `'estudiante'`. `admin`/`super_admin` solo asignables desde panel admin.
- **Prevention**: Rule 9 - DB triggers NUNCA confian en user metadata para roles privilegiados.
- **Files**: `supabase/migrations/015_security_fixes.sql`

### 2026-03-20: BUG - Faltan INSERT policies en 4 tablas
- **Sprint**: 3.5
- **Error**: `instructor_subscriptions`, `ai_credit_transactions`, `course_purchases`, `instructor_analytics` tenian RLS habilitado con SELECT policies pero sin INSERT policies. Las funciones `createFreeSubscription()` y `deductAICredits()` fallaban silenciosamente.
- **Cause**: Sprint 1 solo creo policies de lectura, omitio las de escritura.
- **Fix**: Migracion 015 agrego INSERT policies para subscriptions, credits, y analytics. course_purchases usa service client (webhook).
- **Prevention**: Rule 10 - Al crear tabla con RLS, SIEMPRE agregar policies para TODAS las operaciones necesarias (SELECT, INSERT, UPDATE, DELETE).
- **Files**: `supabase/migrations/015_security_fixes.sql`

### 2026-03-20: Webhook Stripe usa createClient() sin sesion
- **Sprint**: 3.5
- **Error**: El webhook handler usaba `createClient()` (respeta RLS via `auth.uid()`) pero webhooks externos NO tienen sesion de usuario. Todas las operaciones de INSERT fallaban.
- **Cause**: El webhook fue creado sin considerar que Stripe llama el endpoint sin autenticacion de usuario.
- **Fix**: Cambiado a `createServiceClient()` (bypasses RLS). Agregada verificacion de firma defensiva.
- **Prevention**: Rule 11 - Webhooks externos SIEMPRE usan `createServiceClient()`.
- **Files**: `src/app/api/webhooks/stripe/route.ts`

### 2026-03-20: total_earnings expuesto a todos los usuarios
- **Sprint**: 3.5
- **Error**: Los hooks `useAuth` y `useUser` usaban `select('*')` en profiles, exponiendo `total_earnings` a cualquier usuario autenticado.
- **Cause**: La policy de profiles es `SELECT USING (true)` (necesaria para features de comunidad) y `select('*')` incluye todas las columnas.
- **Fix**: Cambiado a columnas explicitas excluyendo `total_earnings`. Hecho `total_earnings` opcional en Profile type.
- **Prevention**: NUNCA usar `select('*')` en hooks de cliente. Siempre listar columnas explicitas.
- **Files**: `src/hooks/useAuth.ts`, `src/hooks/useUser.ts`, `src/types/database.ts`

---

## Sprint 1: Database + Auth

### 2026-03-18: Sprint 1 types not synced with migrations
- **Sprint**: 1
- **Error**: 3 migrations (012-014) applied to Supabase but TypeScript types in `database.ts` were not updated to match. This caused cascading type errors when Sprint 2 code tried to use new fields/roles.
- **Cause**: Sprint 1 focused on SQL migrations and didn't include a types sync step.
- **Fix**: Retroactively fixed during Sprint 2.
- **Prevention**: Add a mandatory "Sync TypeScript Types" step after every migration sprint. Consider using `supabase gen types` to auto-generate.
- **Files**: `src/types/database.ts`

---

## Recurring Patterns (Auto-Blindaje Rules)

### Rule 1: Migration -> Types Sync
**Every SQL migration MUST be followed by TypeScript type updates.**
Checklist:
- [ ] New tables -> New interfaces in `database.ts`
- [ ] ALTER TABLE -> Update existing interfaces
- [ ] New enums/enum values -> Update union types
- [ ] New RLS policies -> Verify permission helpers

### Rule 2: New Route -> Middleware Matcher
**Every new protected route MUST be added to middleware matcher.**
File: `src/middleware.ts`

### Rule 3: New UI Text -> i18n Pipeline
**Every new user-facing text MUST follow:**
1. Add key to `src/features/i18n/types.ts` (Dictionary interface)
2. Add Spanish value to `src/features/i18n/dictionaries/es.ts`
3. Add English value to `src/features/i18n/dictionaries/en.ts`
4. Use `t.section.key` in component

### Rule 4: Supabase Query -> Type Cast
**Supabase queries return untyped data. Always cast enum fields.**
```typescript
// BAD
const role = profile.role // type: any

// GOOD
const role = profile.role as UserRole // type: UserRole
```

### Rule 5: New Role -> Full Role Update
**Adding a new role requires updating ALL these locations:**
1. SQL: `ALTER TYPE user_role ADD VALUE 'new_role'`
2. TypeScript: `UserRole` union in `database.ts`
3. Permissions: `ROLE_PERMISSIONS` in `database.ts`
4. Permissions: `rolePermissions` in `permissions.ts`
5. Middleware: Route protection if needed
6. UI: Role-specific routing/redirects

### Rule 6: Spread DB Results, Don't List Properties
**NEVER manually list individual properties from Supabase queries.**
```typescript
// BAD - breaks when new columns are added
return {
  id: course.id,
  title: course.title,
  // ... listing every field
}

// GOOD - automatically includes all fields
const { modules, ...courseBase } = course
return { ...courseBase, ...computedStats }
```

### Rule 7: Server Actions Files = Async Functions Only
**`'use server'` files must ONLY export async functions.**
- Constants -> `src/lib/` or `src/types/`
- Types -> `src/types/` or co-located type file
- Never mix constants/types with server actions

### Rule 8: Client Components -> Server Actions Only
**Client components must NEVER import from server-side modules directly.**
- `src/lib/ai/` -> Wrap in server action
- `src/lib/supabase/server` -> Wrap in server action
- Shared constants are OK (they're just values)

### Rule 9: DB Triggers NEVER Trust User Metadata for Privileged Roles
**Triggers like `handle_new_user()` must WHITELIST allowed roles.**
```sql
-- BAD: trusts user-provided metadata
user_role_value := COALESCE(raw_user_meta_data->>'role', 'estudiante')::user_role;

-- GOOD: explicit whitelist
IF requested_role = 'instructor' THEN
  user_role_value := 'instructor';
ELSE
  user_role_value := 'estudiante'; -- SAFE DEFAULT
END IF;
```
- `admin` and `super_admin` can ONLY be assigned from admin panel (UPDATE, never INSERT)

### Rule 10: New Table with RLS -> Policies for ALL Operations
**When creating a table with RLS enabled, ALWAYS add policies for every operation the app needs.**
Checklist:
- [ ] SELECT policy (who can read?)
- [ ] INSERT policy (who can create?)
- [ ] UPDATE policy (who can modify?)
- [ ] DELETE policy (who can remove?)
- Missing INSERT/UPDATE policies cause **silent failures** (no error, just empty results)

### Rule 11: External Webhooks -> `createServiceClient()`
**Webhooks from external services (Stripe, etc.) have NO user session.**
- `createClient()` uses `auth.uid()` for RLS → always NULL in webhooks → all operations blocked
- `createServiceClient()` bypasses RLS → required for webhook handlers
- ALWAYS add signature verification for webhook security

### Rule 12: Never `select('*')` in Client Hooks
**Client-side hooks must use explicit column selection.**
```typescript
// BAD - exposes sensitive columns (total_earnings, etc.)
const { data } = await supabase.from('profiles').select('*')

// GOOD - only fetch what the client needs
const { data } = await supabase.from('profiles').select('id, email, full_name, avatar_url, role, ...')
```
