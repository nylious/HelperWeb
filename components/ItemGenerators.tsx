'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'

const weaponEU = ['!OneHand', '!TwoHand', '!Axe', '!Dagger', '!Crossbow', '!Staff', '!Warlock', '!Cleric', '!Bard', '!EuShield']
const weaponCH = ['!Sword', '!Blade', '!Spear', '!Glaive', '!Bow', '!ChShield']

const unifiedEU = [
  ['OneHanded', 'SWORD_'],
  ['TwoHanded', 'TSWORD_'],
  ['CrossBow', 'CROSSBOW_'],
  ['Dagger', 'DAGGER_'],
  ['Staff', 'TSTAFF_'],
  ['Harp', 'HARP_'],
  ['Cleric', 'STAFF_'],
  ['Warlock', 'DARKSTAFF_'],
  ['Shield', 'SHIELD_'],
  ['Axe', 'AXE_'],
] as const

const unifiedCH = [
  ['Spear', 'SPEAR_'],
  ['Bow', 'BOW_'],
  ['Glavie', 'TBLADE_'],
  ['Sword', 'SWORD_'],
  ['Blade', 'BLADE_'],
  ['Shield', 'SHIELD_'],
] as const

export default function ItemGenerators() {
  const [itemMode, setItemMode] = useState<'normal'|'egy'|'nova'>('normal')
  const [region, setRegion] = useState<'eu'|'ch'>('eu')
  const [type, setType] = useState<'clothes'|'light'|'heavy'>('clothes')
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [plus, setPlus] = useState(0)

  const [weaponSystem, setWeaponSystem] = useState<'unified'|'egy'>('unified')
  const [weaponRegion, setWeaponRegion] = useState<'eu'|'ch'>('eu')
  const [weapon, setWeapon] = useState('OneHanded')
  const [degree, setDegree] = useState(1)
  const [seal, setSeal] = useState('A')
  const [unifiedPlus, setUnifiedPlus] = useState(1)
  const [egyWeapon, setEgyWeapon] = useState('!OneHand')
  const [egyPlus, setEgyPlus] = useState(0)
  const [copied, setCopied] = useState('')

  const itemTemplate = itemMode === 'normal' ? 'a' : itemMode === 'egy' ? 'set_a' : 'a_rare'
  const itemCode = `!makeset ${region} 11 ${itemTemplate} ${type} ${gender} ${plus}`

  const unifiedWeapons = weaponRegion === 'eu' ? unifiedEU : unifiedCH
  const unifiedCodePart = useMemo(
    () => (unifiedWeapons.find(([name]) => name === weapon)?.[1] ?? ''),
    [unifiedWeapons, weapon],
  )
  const unifiedSealOptions = degree === 11
    ? [['Normal', 'A'], ['Seal Of Nova', 'A_RARE']]
    : [['Normal', 'A'], ['Seal Of Star', 'A_RARE'], ['Seal Of Moon', 'B_RARE'], ['Seal Of Sun', 'C_RARE']]

  const unifiedCode = unifiedCodePart
    ? `/MAKEITEM ITEM_${weaponRegion.toUpperCase()}_${unifiedCodePart}${String(degree).padStart(2, '0')}_${seal} ${unifiedPlus}`
    : ''
  const egyWeapons = weaponRegion === 'eu' ? weaponEU : weaponCH
  const egyCode = `${egyWeapon}${'egy'} ${egyPlus}`

  function setUnifiedRegion(next: 'eu'|'ch') {
    setWeaponRegion(next)
    setWeapon(next === 'eu' ? 'OneHanded' : 'Spear')
    setSeal('A')
  }

  function setDegreeSafe(value: number) {
    setDegree(value)
    const valid = (value === 11
      ? ['A', 'A_RARE']
      : ['A', 'A_RARE', 'B_RARE', 'C_RARE'])
    if (!valid.includes(seal)) setSeal('A')
  }

  async function copy(label: string, value: string) {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(label)
    setTimeout(() => setCopied(''), 1200)
  }

  return (
    <div className="browser-shell generators-page">
      <div className="generator-grid">
        <GeneratorCard title="ITEM GENERATOR" subtitle="The same armor / set generator logic used by the Helper.">
          <Field label="ITEM SYSTEM">
            <VariantRow>
              {(['normal','egy','nova'] as const).map((mode) => (
                <VariantButton key={mode} active={itemMode === mode} onClick={() => setItemMode(mode)}>
                  {mode === 'normal' ? 'Normal Items' : mode === 'egy' ? 'Normal Egy Items' : 'Nova Items'}
                </VariantButton>
              ))}
            </VariantRow>
          </Field>
          <Field label="REGION">
            <VariantRow>{(['eu','ch'] as const).map((mode) => <VariantButton key={mode} active={region === mode} onClick={() => setRegion(mode)}>{mode.toUpperCase()}</VariantButton>)}</VariantRow>
          </Field>
          <Field label="TYPE">
            <VariantRow>{(['clothes','light','heavy'] as const).map((mode) => <VariantButton key={mode} active={type === mode} onClick={() => setType(mode)}>{mode === 'clothes' ? region === 'eu' ? 'Robe' : 'Garment' : mode === 'light' ? region === 'eu' ? 'Light Armor' : 'Protector' : region === 'eu' ? 'Heavy Armor' : 'Armor'}</VariantButton>)}</VariantRow>
          </Field>
          <Field label="GENDER">
            <VariantRow>{(['male','female'] as const).map((mode) => <VariantButton key={mode} active={gender === mode} onClick={() => setGender(mode)}>{mode === 'male' ? 'Male' : 'Female'}</VariantButton>)}</VariantRow>
          </Field>
          <Field label="PLUS">
            <VariantRow>{[0,1,3,5,7,9].map((n) => <VariantButton key={n} active={plus === n} onClick={() => setPlus(n)}>{n === 0 ? 'BASE' : `+${n}`}</VariantButton>)}</VariantRow>
          </Field>
          <CodeResult value={itemCode} copied={copied === 'item'} onCopy={() => copy('item', itemCode)} />
        </GeneratorCard>

        <GeneratorCard title="WEAPON GENERATOR" subtitle="Normal + Nova use the original degree / seal generator. Egy keeps the original !weaponegy system.">
          <Field label="WEAPON SYSTEM">
            <VariantRow>
              <VariantButton active={weaponSystem === 'unified'} onClick={() => setWeaponSystem('unified')}>Normal + Nova</VariantButton>
              <VariantButton active={weaponSystem === 'egy'} onClick={() => setWeaponSystem('egy')}>Egy Normal Weapons</VariantButton>
            </VariantRow>
          </Field>

          {weaponSystem === 'unified' ? (
            <>
              <Field label="REGION">
                <VariantRow>{(['eu','ch'] as const).map((mode) => <VariantButton key={mode} active={weaponRegion === mode} onClick={() => setUnifiedRegion(mode)}>{mode.toUpperCase()}</VariantButton>)}</VariantRow>
              </Field>
              <Field label="WEAPON">
                <VariantRow>{unifiedWeapons.map(([name]) => <VariantButton key={name} active={weapon === name} onClick={() => setWeapon(name)}>{name}</VariantButton>)}</VariantRow>
              </Field>
              <Field label="DEGREE">
                <VariantRow>{Array.from({ length: 11 }, (_, i) => i + 1).map((n) => <VariantButton key={n} active={degree === n} onClick={() => setDegreeSafe(n)}>D{n}</VariantButton>)}</VariantRow>
              </Field>
              <Field label="SEAL / TYPE">
                <VariantRow>{unifiedSealOptions.map(([label, value]) => <VariantButton key={value} active={seal === value} onClick={() => setSeal(value)}>{label}</VariantButton>)}</VariantRow>
              </Field>
              <Field label="PLUS">
                <VariantRow>{[...Array.from({ length: 12 }, (_, i) => i + 1), 255].map((n) => <VariantButton key={n} active={unifiedPlus === n} onClick={() => setUnifiedPlus(n)}>+{n}</VariantButton>)}</VariantRow>
              </Field>
              <CodeResult value={unifiedCode} copied={copied === 'weapon'} onCopy={() => copy('weapon', unifiedCode)} />
            </>
          ) : (
            <>
              <Field label="REGION">
                <VariantRow>{(['eu','ch'] as const).map((mode) => <VariantButton key={mode} active={weaponRegion === mode} onClick={() => { setWeaponRegion(mode); setEgyWeapon(mode === 'eu' ? '!OneHand' : '!Sword') }}>{mode.toUpperCase()}</VariantButton>)}</VariantRow>
              </Field>
              <Field label="WEAPON">
                <VariantRow>{egyWeapons.map((name) => <VariantButton key={name} active={egyWeapon === name} onClick={() => setEgyWeapon(name)}>{name.replace(/^!/, '')}</VariantButton>)}</VariantRow>
              </Field>
              <Field label="PLUS">
                <VariantRow>{Array.from({ length: 11 }, (_, n) => n).map((n) => <VariantButton key={n} active={egyPlus === n} onClick={() => setEgyPlus(n)}>{n === 0 ? 'BASE' : `+${n}`}</VariantButton>)}</VariantRow>
              </Field>
              <CodeResult value={egyCode} copied={copied === 'egy'} onCopy={() => copy('egy', egyCode)} />
            </>
          )}
        </GeneratorCard>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="generator-field"><label>{label}</label>{children}</div>
}
function VariantRow({ children }: { children: React.ReactNode }) { return <div className="variant-row">{children}</div> }
function VariantButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button className={`variant-btn ${active ? 'active' : ''}`} onClick={onClick}>{children}</button> }
function GeneratorCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <div className="generator-card"><div className="eyebrow">{title}</div><p className="generator-subtitle">{subtitle}</p>{children}</div> }
function CodeResult({ value, copied, onCopy }: { value: string; copied: boolean; onCopy: () => void }) { return <div className="generator-code-result"><div className="detail-kicker">GENERATED CODE</div><div className="code-box"><div className="code-row"><span>{value}</span><button className="copy-btn" onClick={onCopy}>{copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}</button></div></div></div> }
