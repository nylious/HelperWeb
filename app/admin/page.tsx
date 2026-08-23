import Link from 'next/link'
import { LayoutDashboard, LogOut, Terminal, Bot, Boxes, Swords } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSections } from '@/lib/data'

export default async function AdminPage(){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); const sections=await getSections();
  return <div className="admin-shell"><div className="admin-grid"><aside className="admin-nav"><Link className="active" href="/admin"><LayoutDashboard size={16}/> Dashboard</Link>{sections.map(s=><Link key={s.slug} href={`/admin/commands?section=${s.slug}`}>{s.slug==='discord'?<Bot size={16}/>:s.slug==='items'?<Boxes size={16}/>:s.slug==='console'?<Swords size={16}/>:<Terminal size={16}/>} {s.name}</Link>)}<form action="/auth/signout" method="post"><button className="ghost-btn" style={{width:'100%',marginTop:8}}><LogOut size={16}/> Sign out</button></form></aside><main className="admin-card"><div className="eyebrow">ADMIN CONTROL ROOM</div><h1>Welcome back.</h1><p className="muted">{user?.email ?? 'Administrator'} · Live command database</p><div className="section-grid" style={{width:'100%',margin:'24px 0 0'}}>{sections.map(s=><Link key={s.slug} href={`/admin/commands?section=${s.slug}`} className="section-card"><div className="eyebrow">{s.name}</div><h2>{s.categories.reduce((n,c)=>n+c.entries.length,0)} entries</h2><p>{s.categories.length} categories</p></Link>)}</div></main></div></div>
}
