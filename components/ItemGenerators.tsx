'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

const weaponEU = ['!OneHand', '!TwoHand', '!Axe', '!Dagger', '!Crossbow', '!Staff', '!Warlock', '!Cleric', '!Bard', '!EuShield'] as const
const weaponCH = ['!Sword', '!Blade', '!Spear', '!Glaive', '!Bow', '!ChShield'] as const

type WeaponSystem = 'normal' | 'egy' | 'nova'

export default function ItemGenerators() {
  const [itemMode, setItemMode] = useState<'normal'|'egy'|'nova'>('normal')
  const [region, setRegion] = useState<'eu'|'ch'>('eu')
  const [type, setType] = useState<'clothes'|'light'|'heavy'>('clothes')
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [plus, setPlus] = useState(0)

  const [weaponSystem, setWeaponSystem] = useState<WeaponSystem>('normal')
  const [weaponRegion, setWeaponRegion] = useState<'eu'|'ch'>('eu')
  const [weapon, setWeapon] = useState<string>(weaponEU[0])
  const [weaponPlus, setWeaponPlus] = useState(0)
  const [copied, setCopied] = useState('')

  const itemTemplate = itemMode === 'normal' ? 'a' : itemMode === 'egy' ? 'set_a' : 'a_rare'
  const itemCode = `!makeset ${region} 11 ${itemTemplate} ${type} ${gender} ${plus}`

  const availableWeapons = weaponRegion === 'eu' ? weaponEU : weaponCH

  const weaponCode = weapon
    ? `${weapon}${weaponSystem === 'egy' ? 'egy' : weaponSystem === 'nova' ? 'rare' : ''} ${weaponPlus}`
    : ''

  function setWeaponRegionSafe(next: 'eu' | 'ch') {
    setWeaponRegion(next)
    setWeapon(next === 'eu' ? weaponEU[0] : weaponCH[0])
    setWeaponPlus(0)
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

        <GeneratorCard title="WEAPON GENERATOR" subtitle="Normal, Nova and Egy use the original Helper weapon systems.">
          <Field label="WEAPON SYSTEM">
            <VariantRow>
              {(['normal','egy','nova'] as const).map((mode) => (
                <VariantButton
                  key={mode}
                  active={weaponSystem === mode}
                  onClick={() => {
                    setWeaponSystem(mode)
                    setWeaponPlus(0)
                  }}
                >
                  {mode === 'normal' ? 'Normal Weapons' : mode === 'egy' ? 'Egy Normal Weapons' : 'Nova Weapons'}
                </VariantButton>
              ))}
            </VariantRow>
          </Field>

          <Field label="REGION">
            <VariantRow>
              {(['eu','ch'] as const).map((mode) => (
                <VariantButton
                  key={mode}
                  active={weaponRegion === mode}
                  onClick={() => setWeaponRegionSafe(mode)}
                >
                  {mode.toUpperCase()}
                </VariantButton>
              ))}
            </VariantRow>
          </Field>

          <Field label="WEAPON">
            <VariantRow>
              {availableWeapons.map((command) => (
                <VariantButton
                  key={command}
                  active={weapon === command}
                  onClick={() => setWeapon(command)}
                >
                  {command.replace(/^!/, '')}
                </VariantButton>
              ))}
            </VariantRow>
          </Field>

          <Field label="PLUS">
            <VariantRow>
              {Array.from({ length: 11 }, (_, n) => n).map((n) => (
                <VariantButton
                  key={n}
                  active={weaponPlus === n}
                  onClick={() => setWeaponPlus(n)}
                >
                  {n === 0 ? 'BASE' : `+${n}`}
                </VariantButton>
              ))}
            </VariantRow>
          </Field>

          <CodeResult
            value={weaponCode}
            copied={copied === 'weapon'}
            onCopy={() => copy('weapon', weaponCode)}
          />
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
