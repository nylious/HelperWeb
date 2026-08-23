import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const protectedPath = request.nextUrl.pathname.startsWith('/admin')
  if (!protectedPath || request.nextUrl.pathname === '/admin/login') return response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({ request })
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const login = request.nextUrl.clone()
    login.pathname = '/admin/login'
    return NextResponse.redirect(login)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    const login = request.nextUrl.clone()
    login.pathname = '/admin/login'
    login.searchParams.set('error', 'not-admin')
    return NextResponse.redirect(login)
  }

  return response
}

export const config = { matcher: ['/admin/:path*'] }
