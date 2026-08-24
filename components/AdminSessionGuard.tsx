'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const IDLE_MS = 15 * 60 * 1000

export default function AdminSessionGuard() {
  const router = useRouter()

  useEffect(() => {
    let timer: number | undefined

    const logout = async () => {
      try {
        await fetch('/auth/signout', { method: 'POST' })
      } finally {
        router.replace('/admin/login?error=inactive')
      }
    }

    const reset = () => {
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => void logout(), IDLE_MS)
    }

    const events: (keyof WindowEventMap)[] = [
      'pointerdown',
      'pointermove',
      'keydown',
      'scroll',
      'touchstart',
      'mousemove',
    ]

    events.forEach((event) => window.addEventListener(event, reset, { passive: true }))
    reset()

    return () => {
      if (timer) window.clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [router])

  return null
}
