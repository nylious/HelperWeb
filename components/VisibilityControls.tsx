'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function VisibilityControls({
  type,
  id,
  initialVisible,
  label,
  compact = false,
}: {
  type: 'section' | 'category'
  id: string
  initialVisible: boolean
  label?: string
  compact?: boolean
}) {
  const supabase = createClient()
  const [visible, setVisible] = useState(initialVisible)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    if (saving) return
    const next = !visible
    setSaving(true)
    const table = type === 'section' ? 'sections' : 'categories'
    const { error } = await supabase.from(table).update({ is_visible: next }).eq('id', id)
    setSaving(false)
    if (!error) setVisible(next)
    else window.alert(`Could not update visibility: ${error.message}`)
  }

  return (
    <button
      type="button"
      onClick={(event) => { event.preventDefault(); event.stopPropagation(); void toggle() }}
      disabled={saving}
      title={visible ? `Hide ${type}` : `Show ${type}`}
      className={`visibility-toggle ${visible ? 'is-visible' : 'is-hidden'} ${compact ? 'compact' : ''}`}
    >
      {saving ? <Loader2 size={14} className="visibility-spin" /> : visible ? <Eye size={14} /> : <EyeOff size={14} />}
      {!compact && <span>{saving ? 'Saving...' : visible ? 'Visible' : 'Hidden'}</span>}
      {label && !compact && <small>{label}</small>}
    </button>
  )
}
