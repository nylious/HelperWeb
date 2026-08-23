import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
}

export async function middleware(request: NextRequest) {
  let response =
    NextResponse.next({
      request
    })

  const pathname =
    request.nextUrl.pathname

  const protectedPath =
    pathname.startsWith('/admin')

  if (
    !protectedPath ||
    pathname === '/admin/login'
  ) {
    return response
  }

  const key =
    getSupabaseKey()

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !key
  ) {
    const login =
      request.nextUrl.clone()

    login.pathname =
      '/admin/login'

    login.searchParams.set(
      'error',
      'supabase-config'
    )

    return NextResponse.redirect(
      login
    )
  }

  const supabase =
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      key,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options
              }) => {
                request.cookies.set(
                  name,
                  value
                )

                response =
                  NextResponse.next({
                    request
                  })

                response.cookies.set(
                  name,
                  value,
                  options
                )
              }
            )
          }
        }
      }
    )

  const {
    data: { user }
  } =
    await supabase.auth.getUser()

  if (!user) {
    const login =
      request.nextUrl.clone()

    login.pathname =
      '/admin/login'

    return NextResponse.redirect(
      login
    )
  }

  const {
    data: profile
  } =
    await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

  if (
    profile?.role !== 'admin'
  ) {
    const login =
      request.nextUrl.clone()

    login.pathname =
      '/admin/login'

    login.searchParams.set(
      'error',
      'not-admin'
    )

    return NextResponse.redirect(
      login
    )
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*']
}
