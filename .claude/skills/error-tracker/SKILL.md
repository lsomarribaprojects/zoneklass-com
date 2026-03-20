# Error Tracker Skill

## Purpose
Systematic error detection, tracking, and correction for ZoneKlass.
Implements the Auto-Blindaje pattern from SaaS Factory V3.

## When to Use
- After implementing new features
- When the user reports bugs
- Before deployments
- During Sprint transitions

## Process

### 1. Detection Phase
Run these checks in parallel:

```bash
# TypeScript errors
npx tsc --noEmit

# ESLint errors
npm run lint

# Build errors
npm run build
```

### 2. Runtime Verification
Use Next.js MCP tools:
- `nextjs_index` - Discover running dev servers
- `nextjs_call` with `get_errors` - Get compilation/runtime errors

Use Playwright MCP:
- Navigate to each route
- Check for console errors
- Verify visual rendering

### 3. Database Verification
Use Supabase MCP:
- `list_tables` - Verify schema matches code types
- `execute_sql` - Verify RLS policies work
- `get_advisors` - Check for security/performance issues

### 4. Error Documentation
Update `ERRORS.md` with format:
```markdown
### [YYYY-MM-DD]: [Error Title]
- **Sprint**: [Sprint number]
- **Error**: [What failed]
- **Cause**: [Root cause]
- **Fix**: [How it was fixed]
- **Prevention**: [How to prevent in future]
- **Files**: [Affected files]
```

### 5. Auto-Blindaje
After fixing, update:
- `ERRORS.md` - Add error entry
- `CLAUDE.md` - If error is critical and applies globally
- Current PRP - If error is feature-specific

## Routes to Test

### Auth Routes
- `/signup` - Role selection (estudiante/instructor)
- `/login` - Email + Google OAuth
- `/forgot-password` - Password reset
- `/onboarding` - Instructor onboarding wizard (5 steps)

### Main Routes (require auth)
- `/dashboard` - Student dashboard
- `/cursos` - Course catalog
- `/cursos/[slug]` - Course detail
- `/cursos/[slug]/leccion/[lessonId]` - Lesson player
- `/comunidad` - Community
- `/leaderboard` - Leaderboard
- `/mensajes` - Messages
- `/settings` - User settings

### Instructor Routes (require instructor role)
- `/instructor/dashboard` - Instructor dashboard
- `/instructor/courses` - Course management (Sprint 4)
- `/instructor/courses/new` - AI course wizard (Sprint 3)

### Admin Routes (require admin role)
- `/admin` - Admin panel
- `/admin/courses` - Course management
- `/admin/users` - User management
- `/admin/hanna` - Hanna AI config

### API Routes
- `POST /api/webhooks/stripe` - Stripe webhooks

## Common Error Patterns

### 1. TypeScript Type Mismatch
**Pattern**: DB schema changes not reflected in TypeScript types
**Detection**: `npx tsc --noEmit`
**Fix**: Update `src/types/database.ts`
**Prevention**: Always update types when running migrations

### 2. i18n Missing Keys
**Pattern**: New UI text without dictionary entries
**Detection**: TypeScript error on `t.section.key`
**Fix**: Add keys to both `es.ts` and `en.ts` dictionaries + `types.ts` interface
**Prevention**: Always add dictionary type first, then implement

### 3. Supabase RLS Blocking
**Pattern**: Queries return empty results or permission errors
**Detection**: Check Supabase logs, test with different user roles
**Fix**: Review and update RLS policies
**Prevention**: Test with all roles after policy changes

### 4. Middleware Session Issues
**Pattern**: Routes not protected or session not refreshing
**Detection**: Access protected route without auth
**Fix**: Add route to middleware matcher
**Prevention**: Always add new protected routes to matcher

### 5. Missing Enum Values
**Pattern**: DB enum has values not in TypeScript types
**Detection**: Runtime errors or type errors
**Fix**: Update TypeScript union types
**Prevention**: Always sync TS types with DB enums after migrations

## Verification Checklist

```
[ ] TypeScript: `npx tsc --noEmit` passes with 0 errors
[ ] Build: `npm run build` completes successfully
[ ] Auth: Login/signup/logout flows work
[ ] Roles: Student, Instructor, Admin access correct routes
[ ] i18n: All text appears in both ES and EN
[ ] DB: All tables have RLS enabled
[ ] API: Webhook endpoints respond correctly
[ ] Visual: All pages render without console errors
```
