'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  Copy,
  FilePlus2,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Entry, Section } from '@/lib/types'

type Draft = {
  name: string
  code: string
  description: string
  uses_amount: boolean
  variants: string
  levels: string
}

const emptyDraft = (): Draft => ({
  name: '',
  code: '',
  description: '',
  uses_amount: false,
  variants: '{}',
  levels: '[]',
})

function toDraft(entry?: Entry | null): Draft {
  if (!entry) return emptyDraft()

  return {
    name: entry.name,
    code: entry.code,
    description: entry.description,
    uses_amount: entry.uses_amount,
    variants: JSON.stringify(entry.variants ?? {}, null, 2),
    levels: JSON.stringify(entry.levels ?? [], null, 2),
  }
}

export default function AdminCommandEditor({
  sections,
  initialSection,
  initialCategory,
}: {
  sections: Section[]
  initialSection?: string
  initialCategory?: string
}) {
  const supabase = useMemo(() => createClient(), [])
  const [local, setLocal] = useState(sections)
  const [sectionSlug, setSectionSlug] = useState(
    initialSection ?? sections[0]?.slug ?? 'discord',
  )
  const [categoryId, setCategoryId] = useState(initialCategory ?? '')
  const [entryId, setEntryId] = useState('')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState<Draft>(emptyDraft())
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [status, setStatus] = useState('')
  const [statusKind, setStatusKind] = useState<'success' | 'error' | 'info'>('info')
  const [copied, setCopied] = useState(false)

  const currentSection =
    local.find((section) => section.slug === sectionSlug) ?? local[0]
  const categories = currentSection?.categories ?? []
  const currentCategory =
    categories.find((category) => category.id === categoryId) ?? categories[0]
  const entries = currentCategory?.entries ?? []
  const filteredEntries = entries.filter((entry) => {
    const needle = search.trim().toLowerCase()
    if (!needle) return true
    return `${entry.name} ${entry.code} ${entry.description}`
      .toLowerCase()
      .includes(needle)
  })
  const isNew = entryId === '__new__'
  const selectedEntry = entries.find((entry) => entry.id === entryId) ?? null

  useEffect(() => {
    if (currentCategory?.id !== categoryId) {
      setCategoryId(currentCategory?.id ?? '')
    }
  }, [currentCategory?.id, categoryId])

  useEffect(() => {
    const firstEntry = currentCategory?.entries[0]
    setEntryId(firstEntry?.id ?? '')
    setDraft(toDraft(firstEntry))
    setSearch('')
  }, [currentCategory?.id])

  useEffect(() => {
    if (!entryId || entryId === '__new__') return
    const entry = entries.find((item) => item.id === entryId)
    if (entry) setDraft(toDraft(entry))
  }, [entryId, entries])

  async function refreshCatalog(showMessage = true) {
    setRefreshing(true)
    try {
      const { data, error } = await supabase
        .from('sections')
        .select(
          'id,name,slug,description,kind,sort_order,categories(id,name,slug,sort_order,entries(id,name,code,description,uses_amount,variants,levels,sort_order))',
        )
        .order('sort_order')

      if (error) throw error
      if (data) {
        setLocal(data as unknown as Section[])
        if (showMessage) {
          setStatus('Catalog refreshed from Supabase.')
          setStatusKind('success')
        }
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not refresh catalog.')
      setStatusKind('error')
    } finally {
      setRefreshing(false)
    }
  }

  function beginAdd() {
    if (!currentCategory) return
    setEntryId('__new__')
    setDraft(emptyDraft())
    setStatus('')
    setStatusKind('info')
  }

  function selectEntry(entry: Entry) {
    setEntryId(entry.id)
    setDraft(toDraft(entry))
    setStatus('')
    setStatusKind('info')
  }

  async function saveEntry() {
    if (!currentCategory) return
    if (!draft.name.trim()) {
      setStatus('Entry name is required.')
      setStatusKind('error')
      return
    }

    setSaving(true)
    setStatus('')

    try {
      let variants: Record<string, string> = {}
      let levels: string[] = []

      try {
        variants = JSON.parse(draft.variants || '{}')
      } catch {
        throw new Error('Variants JSON is not valid JSON.')
      }

      try {
        levels = JSON.parse(draft.levels || '[]')
      } catch {
        throw new Error('Levels JSON is not valid JSON.')
      }

      if (
        !variants ||
        Array.isArray(variants) ||
        typeof variants !== 'object'
      ) {
        throw new Error('Variants must be a JSON object.')
      }

      if (!Array.isArray(levels)) {
        throw new Error('Levels must be a JSON array.')
      }

      if (isNew) {
        const maxSort = Math.max(
          -1,
          ...entries.map((entry) => entry.sort_order),
        )

        const { data, error } = await supabase
          .from('entries')
          .insert({
            category_id: currentCategory.id,
            name: draft.name.trim(),
            code: draft.code.trim(),
            description: draft.description.trim(),
            uses_amount: draft.uses_amount,
            variants,
            levels,
            sort_order: maxSort + 1,
          })
          .select()
          .single()

        if (error) throw error
        setEntryId(data.id)
        setStatus('Entry created successfully.')
        setStatusKind('success')
      } else {
        if (!selectedEntry) throw new Error('Select an entry first.')

        const { error } = await supabase
          .from('entries')
          .update({
            name: draft.name.trim(),
            code: draft.code.trim(),
            description: draft.description.trim(),
            uses_amount: draft.uses_amount,
            variants,
            levels,
          })
          .eq('id', selectedEntry.id)

        if (error) throw error

        setStatus('Changes saved successfully.')
        setStatusKind('success')
      }

      await refreshCatalog(false)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save entry.')
      setStatusKind('error')
    } finally {
      setSaving(false)
    }
  }

  async function deleteEntry() {
    if (!selectedEntry) return
    if (!window.confirm(`Delete "${selectedEntry.name}" permanently?`)) return

    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', selectedEntry.id)

    if (error) {
      setStatus(error.message)
      setStatusKind('error')
      return
    }

    setEntryId('')
    setDraft(emptyDraft())
    setStatus('Entry deleted successfully.')
    setStatusKind('success')
    await refreshCatalog(false)
  }

  async function copyCode() {
    const code = draft.code.trim()
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="editor-page">
      <div className="editor-header">
        <div>
          <div className="dashboard-kicker">ADMIN / COMMAND MANAGER</div>
          <h1>{currentSection?.name ?? 'Catalog'}</h1>
          <p>
            Edit the live catalog without rebuilding the public helper.
          </p>
        </div>
        <button
          className="editor-toolbar-btn"
          onClick={() => refreshCatalog()}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="editor-layout">
        <aside className="editor-sidebar">
          <div className="editor-sidebar-block">
            <div className="editor-sidebar-label">SECTIONS</div>
            <div className="editor-section-list">
              {local.map((section) => (
                <button
                  key={section.id}
                  className={`editor-section-btn ${section.slug === currentSection?.slug ? 'active' : ''}`}
                  onClick={() => {
                    setSectionSlug(section.slug)
                    setCategoryId(section.categories[0]?.id ?? '')
                    setEntryId(section.categories[0]?.entries[0]?.id ?? '')
                  }}
                >
                  <span>{section.name}</span>
                  <small>
                    {section.categories.reduce(
                      (total, category) => total + category.entries.length,
                      0,
                    )}
                  </small>
                </button>
              ))}
            </div>
          </div>

          <div className="editor-sidebar-divider" />

          <div className="editor-sidebar-block">
            <div className="editor-sidebar-label">CATEGORIES</div>
            <div className="editor-category-list">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`editor-category-btn ${category.id === currentCategory?.id ? 'active' : ''}`}
                  onClick={() => {
                    setCategoryId(category.id)
                    setEntryId(category.entries[0]?.id ?? '')
                    setDraft(toDraft(category.entries[0]))
                    setSearch('')
                  }}
                >
                  <span>{category.name}</span>
                  <small>{category.entries.length}</small>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="editor-main">
          <div className="editor-main-toolbar">
            <div className="editor-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search entries..."
              />
            </div>
            <button
              className="editor-new-btn"
              onClick={beginAdd}
              disabled={!currentCategory}
            >
              <FilePlus2 size={16} />
              New entry
            </button>
          </div>

          <div className="editor-content-grid">
            <div className="editor-entry-panel">
              <div className="editor-panel-heading">
                <div>
                  <div className="dashboard-kicker">ENTRIES</div>
                  <strong>{currentCategory?.name ?? 'No category'}</strong>
                </div>
                <span>{filteredEntries.length}</span>
              </div>

              <div className="editor-entry-list">
                {filteredEntries.map((entry) => (
                  <button
                    key={entry.id}
                    className={`editor-entry-btn ${selectedEntry?.id === entry.id && !isNew ? 'active' : ''}`}
                    onClick={() => selectEntry(entry)}
                  >
                    <span>
                      <strong>{entry.name}</strong>
                      <small>{entry.code || 'No code'}</small>
                    </span>
                    <span className="editor-entry-dot" />
                  </button>
                ))}

                {!filteredEntries.length && (
                  <div className="editor-empty-state">
                    <Sparkles size={18} />
                    <strong>No entries yet</strong>
                    <p>Create the first entry in this category.</p>
                    <button onClick={beginAdd}>Add entry</button>
                  </div>
                )}
              </div>
            </div>

            <div className="editor-form-panel">
              <div className="editor-form-head">
                <div>
                  <div className="dashboard-kicker">
                    {isNew ? 'NEW ENTRY' : 'EDIT ENTRY'}
                  </div>
                  <h2>{isNew ? 'Create entry' : draft.name || 'Select an entry'}</h2>
                  <p>
                    {currentSection?.name} <span>•</span> {currentCategory?.name}
                  </p>
                </div>

                {draft.code && (
                  <button className="editor-copy-code" onClick={copyCode}>
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? 'Copied' : 'Copy code'}
                  </button>
                )}
              </div>

              <div className="editor-form-grid">
                <label className="editor-field">
                  <span>Name</span>
                  <input
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((value) => ({ ...value, name: event.target.value }))
                    }
                    placeholder="Entry name"
                  />
                </label>

                <label className="editor-field">
                  <span>Command / Code</span>
                  <input
                    className="editor-mono"
                    value={draft.code}
                    onChange={(event) =>
                      setDraft((value) => ({ ...value, code: event.target.value }))
                    }
                    placeholder="/command or !command"
                  />
                </label>

                <label className="editor-field full">
                  <span>Description</span>
                  <textarea
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Explain what this command does..."
                  />
                </label>

                <label className="editor-field">
                  <span>Variants JSON</span>
                  <textarea
                    className="editor-json"
                    value={draft.variants}
                    onChange={(event) =>
                      setDraft((value) => ({ ...value, variants: event.target.value }))
                    }
                    spellCheck={false}
                  />
                </label>

                <label className="editor-field">
                  <span>Levels JSON</span>
                  <textarea
                    className="editor-json"
                    value={draft.levels}
                    onChange={(event) =>
                      setDraft((value) => ({ ...value, levels: event.target.value }))
                    }
                    spellCheck={false}
                  />
                </label>
              </div>

              <label className="editor-check">
                <input
                  type="checkbox"
                  checked={draft.uses_amount}
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      uses_amount: event.target.checked,
                    }))
                  }
                />
                <span>
                  <strong>Uses spawn amount</strong>
                  <small>Add an amount selector to the public command browser.</small>
                </span>
              </label>

              <div className="editor-actions">
                <button
                  className="editor-save-btn"
                  onClick={saveEntry}
                  disabled={saving || !currentCategory}
                >
                  <Save size={16} />
                  {saving ? 'Saving…' : isNew ? 'Create entry' : 'Save changes'}
                </button>

                {!isNew && selectedEntry && (
                  <button className="editor-delete-btn" onClick={deleteEntry}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}

                {isNew && (
                  <button className="editor-cancel-btn" onClick={() => selectEntry(entries[0])}>
                    Cancel
                  </button>
                )}
              </div>

              {status && (
                <div className={`editor-status ${statusKind}`}>
                  {status}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
