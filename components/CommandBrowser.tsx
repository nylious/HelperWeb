'use client'

import { useEffect, useMemo, useState } from 'react'
import { Copy, Search, Check, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Category, Entry, Section } from '@/lib/types'

export default function CommandBrowser({ section }: { section: Section }) {
  const supabase = useMemo(() => createClient(), [])
  const [categories, setCategories] = useState<Category[]>(section.categories ?? [])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(categories[0] ?? null)
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(categories[0]?.entries?.[0] ?? null)
  const [search, setSearch] = useState('')
  const [variant, setVariant] = useState('')
  const [amount, setAmount] = useState(1)
  const [copied, setCopied] = useState(false)

  const displayCode = useMemo(() => {
    if (!selectedEntry) return ''
    let code = selectedEntry.code
    if (variant && selectedEntry.variants?.[variant]) code = selectedEntry.variants[variant]
    if (selectedEntry.uses_amount) code = `${code} ${amount}`
    return code
  }, [selectedEntry, variant, amount])

  useEffect(() => {
    setCategories(section.categories ?? [])
    setSelectedCategory(section.categories?.[0] ?? null)
    setSelectedEntry(section.categories?.[0]?.entries?.[0] ?? null)
    setVariant('')
    setAmount(1)
  }, [section])

  useEffect(() => {
    const channel = supabase
      .channel(`section-${section.slug}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, async () => {
        const { data } = await supabase
          .from('sections')
          .select('id,name,slug,description,kind,sort_order,categories(id,name,slug,sort_order,entries(id,name,code,description,uses_amount,variants,levels,sort_order))')
          .eq('slug', section.slug)
          .single()
        if (data) {
          const fresh = data as unknown as Section
          setCategories(fresh.categories ?? [])
          setSelectedCategory((fresh.categories ?? [])[0] ?? null)
          setSelectedEntry((fresh.categories ?? [])[0]?.entries?.[0] ?? null)
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [section.slug, supabase])

  const filteredEntries = useMemo(() => {
    if (!selectedCategory) return []
    const needle = search.trim().toLowerCase()
    if (!needle) return selectedCategory.entries
    return selectedCategory.entries.filter((e) =>
      `${e.name} ${e.code} ${e.description}`.toLowerCase().includes(needle)
    )
  }, [selectedCategory, search])

  async function copyCode() {
    if (!displayCode) return
    await navigator.clipboard.writeText(displayCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="browser-shell">
      <div className="browser-toolbar">
        <Search size={18} color="#7f8a95" />
        <input className="search" placeholder="Search commands, codes or descriptions..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="browser">
        <div className="browser-col">
          <div className="browser-title">CATEGORIES</div>
          <div className="scroll">
            {categories.map((cat) => (
              <button key={cat.id} className={`choice ${selectedCategory?.id === cat.id ? 'active' : ''}`} onClick={() => { setSelectedCategory(cat); setSelectedEntry(cat.entries[0] ?? null); setSearch(''); setVariant('') }}>
                <span>{cat.name}</span><span style={{ marginLeft:'auto', opacity:.65 }}>{cat.entries.length}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="browser-col">
          <div className="browser-title">ENTRIES</div>
          <div className="scroll">
            {filteredEntries.map((entry) => (
              <button key={entry.id} className={`entry ${selectedEntry?.id === entry.id ? 'active' : ''}`} onClick={() => { setSelectedEntry(entry); setVariant(Object.keys(entry.variants ?? {})[0] ?? '') }}>
                <span>{entry.name}</span>
              </button>
            ))}
            {!filteredEntries.length && <div className="muted" style={{padding:12}}>No matching entries.</div>}
          </div>
        </div>
        <div className="detail">
          <div className="detail-kicker">{section.name}</div>
          <div className="detail-kicker" style={{marginTop:10}}>{selectedCategory?.name ?? 'Select a category'}</div>
          <h1>{selectedEntry?.name ?? 'Select an entry'}</h1>
          <p>{selectedEntry?.description || 'Choose an entry from the list to inspect its code.'}</p>

          {selectedEntry && Object.keys(selectedEntry.variants ?? {}).length > 0 && (
            <>
              <div className="detail-kicker" style={{marginTop:22}}>VARIANTS</div>
              <div className="variant-row">
                {Object.keys(selectedEntry.variants).map((v) => (
                  <button key={v} className={`variant-btn ${variant === v ? 'active' : ''}`} onClick={() => setVariant(v)}>{v}</button>
                ))}
              </div>
            </>
          )}

          {selectedEntry?.uses_amount && (
            <>
              <div className="detail-kicker" style={{marginTop:22}}>AMOUNT</div>
              <div className="amount-row">
                {[1,3,5,10].map((n) => <button key={n} className={`amount-btn ${amount === n ? 'active' : ''}`} onClick={() => setAmount(n)}>{n}</button>)}
              </div>
            </>
          )}

          <div className="detail-kicker" style={{marginTop:26}}>GENERATED CODE</div>
          <div className="code-box">
            <div className="code-row">
              <span>{displayCode || '—'}</span>
              <button className="copy-btn" onClick={copyCode}>{copied ? <><Check size={16}/> Copied</> : <><Copy size={16}/> Copy</>}</button>
            </div>
          </div>

          {section.slug === 'console' && <div className="muted" style={{marginTop:14,display:'flex',gap:8,alignItems:'center'}}><Sparkles size={14}/> Live from the central command database.</div>}
        </div>
      </div>
    </div>
  )
}
