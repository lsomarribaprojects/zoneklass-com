# ZoneKlass - Aprende con IA

Plataforma de aprendizaje con IA. Cursos interactivos, comunidad activa, gamificacion y tutora inteligente Hanna.

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Framework | Next.js 16 + React 19 + TypeScript |
| Estilos | Tailwind CSS 3.4 |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| AI Engine | OpenRouter (via API route) |
| Emails | Resend + React Email |
| Validacion | Zod |
| Estado | Zustand |
| UI | Radix UI + Lucide Icons |

## Features

- **Autenticacion**: Email/password con Supabase Auth, recuperacion de password
- **Cursos**: Catalogo, modulos, lecciones con video, progreso por leccion
- **Comunidad**: Feed de posts, comentarios, likes, mensajes directos, notificaciones
- **Gamificacion**: Sistema XP, niveles, badges, leaderboard, rachas
- **Hanna (IA Tutora)**: Chat con streaming, 6 modos de tutoria, rating de conversaciones
- **Admin**: Dashboard con metricas, gestion de cursos/usuarios, panel Hanna, invite links con QR
- **Emails automaticos**: Welcome, enrollment, completion, badges, weekly digest

## Correr Localmente

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd zoneklass.com

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Ejecutar migraciones en Supabase
# Aplicar en orden los archivos de supabase/migrations/

# 5. Servidor de desarrollo
npm run dev
```

## Variables de Entorno

```env
# Supabase (requerido)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL (requerido)
NEXT_PUBLIC_SITE_URL=https://zoneklass.com

# OpenRouter - Hanna AI Tutor (requerido)
OPENROUTER_API_KEY=your-openrouter-api-key

# Resend - Emails transaccionales (requerido)
RESEND_API_KEY=re_xxxxxxxxxxxx
```

## Estructura de Carpetas

```
src/
├── actions/          # Server Actions (auth, courses, community, emails, etc.)
├── app/              # Next.js App Router
│   ├── (admin)/      # Rutas de administracion
│   ├── (auth)/       # Login, signup, forgot-password
│   ├── (main)/       # Dashboard, cursos, comunidad, leaderboard, mensajes
│   └── api/          # API routes (chat streaming)
├── components/       # Layout (Header, Sidebar, BottomNav) + UI (Button, Card, etc.)
├── features/         # Feature-first: auth, courses, community, gamification, hanna, admin
├── hooks/            # useAuth, useUser
├── lib/              # Supabase clients, email (Resend + templates), utils
├── types/            # TypeScript types (database.ts)
└── middleware.ts     # Auth protection + admin role check
```

## Scripts

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de produccion
npm run start     # Servidor de produccion
npm run lint      # ESLint
```
