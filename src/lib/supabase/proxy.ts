import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieToSet = {
  name: string
  value: string
  options: CookieOptions
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Rutas protegidas: dashboard, admin, instructor
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/instructor')

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password')

  const isAdminRoute = pathname.startsWith('/admin')
  const isInstructorRoute = pathname.startsWith('/instructor')

  // Si no esta autenticado y quiere acceder a rutas protegidas -> login
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si esta autenticado y quiere ir a auth routes -> redirigir según rol
  if (isAuthRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Redirigir según rol
    if (profile?.role === 'instructor') {
      return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
    } else if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protección de rutas de admin (solo super_admin y admin)
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'super_admin' && profile.role !== 'admin')) {
      // Instructores intentando acceder a /admin -> redirigir a su dashboard
      if (profile?.role === 'instructor') {
        return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protección de rutas de instructor (solo instructor, admin y super_admin)
  if (isInstructorRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const allowedRoles = ['instructor', 'admin', 'super_admin']
    if (!profile || !allowedRoles.includes(profile.role)) {
      // Estudiantes intentando acceder a /instructor -> redirigir a dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}
