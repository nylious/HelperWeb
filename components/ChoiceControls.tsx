'use client'

import type { ReactNode } from 'react'

export const ITEM_PLUS_LEVELS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const

export const WEAPON_PLUS_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 255,
] as const

export const WEAPON_DEGREES = Array.from(
  { length: 11 },
  (_, index) => index + 1,
)

export function ChoiceRow({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`variant-row ${className}`.trim()}>
      {children}
    </div>
  )
}

export function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`variant-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}
