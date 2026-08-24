import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized.' },
        { status: 401 },
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { ok: false, error: 'Admin access required.' },
        { status: 403 },
      )
    }

    const body = (await request.json()) as {
      display_name?: string
      password?: string
      password_confirm?: string
    }

    const displayName = (body.display_name ?? '').trim()
    const password = body.password ?? ''
    const passwordConfirm = body.password_confirm ?? ''

    if (password || passwordConfirm) {
      if (password.length < 8) {
        return NextResponse.json(
          {
            ok: false,
            error: 'New password must be at least 8 characters.',
          },
          { status: 400 },
        )
      }

      if (password !== passwordConfirm) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Password confirmation does not match.',
          },
          { status: 400 },
        )
      }
    }

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!existingProfile) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Your admin profile is missing. Run the latest Supabase upgrade SQL first.',
        },
        { status: 500 },
      )
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id)

    if (profileError) {
      throw profileError
    }

    if (password) {
      const { error: passwordError } =
        await supabase.auth.updateUser({
          password,
        })

      if (passwordError) {
        throw passwordError
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Could not update profile.',
      },
      { status: 500 },
    )
  }
}
