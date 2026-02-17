import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/comunidad/:path*',
    '/mensajes/:path*',
    '/leaderboard/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
}
