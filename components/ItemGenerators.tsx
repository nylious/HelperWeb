'use client'

import { useMemo, useState } from 'react'
import { Copy, Check, ArrowRight } from 'lucide-react'

const weaponEU = ['!OneHand','!TwoHand','!Axe','!Dagger','!Crossbow','!Staff','!Warlock','!Cleric','!Bard','!EuShield']
const weaponCH = ['!Sword','!Blade','!Spear','!Glaive','!Bow','!ChShield']

export default function ItemGenerators() {
  const [itemMode, setItemMode] = useState<'normal'|'egy'|'nova'>('normal')
  const [region, setRegion] = useState<'eu'|'ch'>('eu')
  const [type, setType] = useState<'clothes'|'light'|'heavy'>('clothes')
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [plus, setPlus] = useState(0)
  const [weaponMode, setWeaponMode] = useState<'normal'|'egy'|'nova'>('normal')
  const [weaponRegion, setWeaponRegion] = useState<'eu'|'ch'>('eu')
  const [weapon, setWeapon] = useState('!OneHand')
  const [weaponPlus, setWeaponPlus] = useState(0)
  const [copied, setCopied] = useState('')

  const itemTemplate = itemMode === 'normal' ? 'a' : itemMode === 'egy' ? 'set_a' : 'a_rare'
  const itemCode = `!makeset ${region} 11 ${itemTemplate} ${type} ${gender} ${plus}`
  const weaponCode = `${weapon}${weaponMode === 'egy' ? 'egy' : weaponMode === 'nova' ? 'rare' : ''} ${weaponPlus}`
  const weapons = weaponRegion === 'eu' ? weaponEU : weaponCH

  async function copy(label:string, value:string){ await navigator.clipboard.writeText(value); setCopied(label); setTimeout(()=>setCopied(''),1200) }

  return <div className="browser-shell" style={{padding:22}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
      <GeneratorCard title="ITEM GENERATOR" subtitle="The same generator logic used by the Helper.">
        <div className="field"><label>ITEM SYSTEM</label><div className="variant-row">{(['normal','egy','nova'] as const).map(m=><button key={m} className={`variant-btn ${itemMode===m?'active':''}`} onClick={()=>setItemMode(m)}>{m === 'normal' ? 'Normal Items' : m === 'egy' ? 'Normal Egy Items' : 'Nova Items'}</button>)}</div></div>
        <div className="field" style={{marginTop:16}}><label>REGION</label><div className="variant-row">{(['eu','ch'] as const).map(m=><button key={m} className={`variant-btn ${region===m?'active':''}`} onClick={()=>setRegion(m)}>{m.toUpperCase()}</button>)}</div></div>
        <div className="field" style={{marginTop:16}}><label>TYPE</label><div className="variant-row">{(['clothes','light','heavy'] as const).map(m=><button key={m} className={`variant-btn ${type===m?'active':''}`} onClick={()=>setType(m)}>{m === 'clothes' ? (region==='eu'?'Robe':'Garment') : m === 'light' ? (region==='eu'?'Light Armor':'Protector') : (region==='eu'?'Heavy Armor':'Armor')}</button>)}</div></div>
        <div className="field" style={{marginTop:16}}><label>GENDER</label><div className="variant-row">{(['male','female'] as const).map(m=><button key={m} className={`variant-btn ${gender===m?'active':''}`} onClick={()=>setGender(m)}>{m}</button>)}</div></div>
        <div className="field" style={{marginTop:16}}><label>PLUS</label><div className="variant-row">{[0,1,3,5,7,9].map(n=><button key={n} className={`variant-btn ${plus===n?'active':''}`} onClick={()=>setPlus(n)}>{n===0?'BASE':`+${n}`}</button>)}</div></div>
        <CodeResult value={itemCode} copied={copied==='item'} onCopy={()=>copy('item',itemCode)} />
      </GeneratorCard>
      <GeneratorCard title="WEAPON GENERATOR" subtitle="EU / CH weapon commands and plus levels.">
        <div className="field"><label>WEAPON SYSTEM</label><div className="variant-row">{(['normal','egy','nova'] as const).map(m=><button key={m} className={`variant-btn ${weaponMode===m?'active':''}`} onClick={()=>setWeaponMode(m)}>{m==='normal'?'Normal Weapons':m==='egy'?'Egy Normal Weapons':'Nova Weapons'}</button>)}</div></div>
        <div className="field" style={{marginTop:16}}><label>REGION</label><div className="variant-row">{(['eu','ch'] as const).map(m=><button key={m} className={`variant-btn ${weaponRegion===m?'active':''}`} onClick={()=>{setWeaponRegion(m);setWeapon(m==='eu'?'!OneHand':'!Sword')}}>{m.toUpperCase()}</button>)}</div></div>
        <div className="field" style={{marginTop:16}}><label>WEAPON</label><div className="variant-row">{weapons.map(w=><button key={w} className={`variant-btn ${weapon===w?'active':''}`} onClick={()=>setWeapon(w)}>{w.replace(/^!/,'')}</button>)}</div></div>
        <div className="field" style={{marginTop:16}}><label>PLUS</label><div className="variant-row">{[0,1,3,5,7,9].map(n=><button key={n} className={`variant-btn ${weaponPlus===n?'active':''}`} onClick={()=>setWeaponPlus(n)}>{n===0?'BASE':`+${n}`}</button>)}</div></div>
        <CodeResult value={weaponCode} copied={copied==='weapon'} onCopy={()=>copy('weapon',weaponCode)} />
      </GeneratorCard>
    </div>
  </div>
}

function GeneratorCard({title,subtitle,children}:{title:string;subtitle:string;children:React.ReactNode}){return <div className="hero-card" style={{padding:22}}><div className="eyebrow">{title}</div><p style={{marginTop:8}}>{subtitle}</p>{children}</div>}
function CodeResult({value,copied,onCopy}:{value:string;copied:boolean;onCopy:()=>void}){return <div><div className="detail-kicker" style={{marginTop:24}}>GENERATED CODE</div><div className="code-box"><div className="code-row"><span>{value}</span><button className="copy-btn" onClick={onCopy}>{copied?<><Check size={16}/>Copied</>:<><Copy size={16}/>Copy</>}</button></div></div></div>}
