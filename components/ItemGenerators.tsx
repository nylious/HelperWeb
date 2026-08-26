'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import {
  ChoiceButton,
  ChoiceRow,
  ITEM_PLUS_LEVELS,
  WEAPON_DEGREES,
  WEAPON_PLUS_LEVELS,
} from '@/components/ChoiceControls'

const weaponEU = ['!OneHand', '!TwoHand', '!Axe', '!Dagger', '!Crossbow', '!Staff', '!Warlock', '!Cleric', '!Bard', '!EuShield'] as const
const weaponCH = ['!Sword', '!Blade', '!Spear', '!Glaive', '!Bow', '!ChShield'] as const

type WeaponSystem = 'normal' | 'nova' | 'egy'
type WeaponRegion = 'eu' | 'ch'
type ItemMode = 'normal' | 'egy' | 'nova'

type Seal = 'Normal' | 'Star' | 'Moon' | 'Sun' | 'Nova'

export default function ItemGenerators() {
  const [itemMode, setItemMode] = useState<ItemMode>('normal')
  const [region, setRegion] = useState<'eu' | 'ch'>('eu')
  const [type, setType] = useState<'clothes' | 'light' | 'heavy'>('clothes')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [plus, setPlus] = useState(0)

  const [weaponSystem, setWeaponSystem] = useState<WeaponSystem>('normal')
  const [weaponRegion, setWeaponRegion] = useState<WeaponRegion>('eu')
  const [weapon, setWeapon] = useState<string>(weaponEU[0])
  const [weaponDegree, setWeaponDegree] = useState(1)
  const [weaponSeal, setWeaponSeal] = useState<Seal>('Normal')
  const [weaponPlus, setWeaponPlus] = useState(1)
  const [copied, setCopied] = useState('')

  const itemTemplate = itemMode === 'normal' ? 'a' : itemMode === 'egy' ? 'set_a' : 'a_rare'
  const itemRegion = region === 'eu' ? 'eu' : 'ch'
  const itemCode = `!makeset ${itemRegion} 11 ${itemTemplate} ${type} ${gender} ${plus}`

  const availableWeapons = useMemo(
    () => (weaponRegion === 'eu' ? [...weaponEU] : [...weaponCH]),
    [weaponRegion],
  )

  const weaponCode = useMemo(() => {
    if (!weapon) return ''

    if (weaponSystem === 'egy') {
      return `${weapon} ${weaponPlus}`
    }

    const regionPrefix = weaponRegion === 'eu' ? 'EU_' : 'CH_'
    const weaponPart = getWeaponCodePart(weapon, weaponRegion)
    const degree = weaponDegree.toString().padStart(2, '0')
    const seal = weaponDegree === 11
      ? (weaponSeal === 'Nova' ? 'A_RARE' : 'A')
      : weaponSeal === 'Star'
        ? 'A_RARE'
        : weaponSeal === 'Moon'
          ? 'B_RARE'
          : weaponSeal === 'Sun'
            ? 'C_RARE'
            : 'A'

    return `/MAKEITEM ITEM_${regionPrefix}${weaponPart}${degree}_${seal} ${weaponPlus}`
  }, [weapon, weaponSystem, weaponRegion, weaponDegree, weaponSeal, weaponPlus])

  function setWeaponRegionSafe(next: WeaponRegion) {
    setWeaponRegion(next)
    setWeapon(next === 'eu' ? weaponEU[0] : weaponCH[0])
    setWeaponDegree(1)
    setWeaponSeal('Normal')
    setWeaponPlus(1)
  }

  function setWeaponSystemSafe(next: WeaponSystem) {
    setWeaponSystem(next)
    setWeaponDegree(1)
    setWeaponSeal('Normal')
    setWeaponPlus(1)
  }

  function setDegreeSafe(next: number) {
    setWeaponDegree(next)
    setWeaponSeal('Normal')
  }

  async function copy(label: string, value: string) {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(label)
    setTimeout(() => setCopied(''), 1200)
  }

  const sealOptions: Seal[] = weaponDegree === 11
    ? ['Normal', 'Nova']
    : ['Normal', 'Star', 'Moon', 'Sun']

  return (
    <div className="browser-shell generators-page">
      <div className="generator-header">
        <div>
          <div className="eyebrow">ITEM SYSTEMS</div>
          <p>These generators mirror the command formats and weapon systems used by the original Helper.</p>
        </div>
      </div>

      <div className="generator-grid">
        <GeneratorCard title="ITEM GENERATOR" subtitle="Armor / set commands with the same template structure as the original Helper.">
          <Field label="ITEM SYSTEM">
            <ChoiceRow>
              {(['normal', 'egy', 'nova'] as const).map((mode) => (
                <ChoiceButton key={mode} active={itemMode === mode} onClick={() => setItemMode(mode)}>
                  {mode === 'normal' ? 'Normal Items' : mode === 'egy' ? 'Normal Egy Items' : 'Nova Items'}
                </ChoiceButton>
              ))}
            </ChoiceRow>
          </Field>
          <Field label="REGION">
            <ChoiceRow>{(['eu', 'ch'] as const).map((mode) => <ChoiceButton key={mode} active={region === mode} onClick={() => setRegion(mode)}>{mode.toUpperCase()}</ChoiceButton>)}</ChoiceRow>
          </Field>
          <Field label="TYPE">
            <ChoiceRow>{(['clothes', 'light', 'heavy'] as const).map((mode) => <ChoiceButton key={mode} active={type === mode} onClick={() => setType(mode)}>{mode === 'clothes' ? region === 'eu' ? 'Robe' : 'Garment' : mode === 'light' ? region === 'eu' ? 'Light Armor' : 'Protector' : region === 'eu' ? 'Heavy Armor' : 'Armor'}</ChoiceButton>)}</ChoiceRow>
          </Field>
          <Field label="GENDER">
            <ChoiceRow>{(['male', 'female'] as const).map((mode) => <ChoiceButton key={mode} active={gender === mode} onClick={() => setGender(mode)}>{mode === 'male' ? 'Male' : 'Female'}</ChoiceButton>)}</ChoiceRow>
          </Field>
          <Field label="PLUS">
            <ChoiceRow>{ITEM_PLUS_LEVELS.map((n) => <ChoiceButton key={n} active={plus === n} onClick={() => setPlus(n)}>{n === 0 ? 'BASE' : `+${n}`}</ChoiceButton>)}</ChoiceRow>
          </Field>
          <CodeResult value={itemCode} copied={copied === 'item'} onCopy={() => copy('item', itemCode)} />
        </GeneratorCard>

        <GeneratorCard
          title="WEAPON GENERATOR"
          subtitle="Normal / Nova use the original degree + seal generator. Egy Normal keeps its separate chat-command system."
        >
          <Field label="WEAPON SYSTEM">
            <ChoiceRow>
              {(['normal', 'nova', 'egy'] as const).map((mode) => (
                <ChoiceButton
                  key={mode}
                  active={weaponSystem === mode}
                  onClick={() => setWeaponSystemSafe(mode)}
                >
                  {mode === 'normal' ? 'Normal Weapons' : mode === 'nova' ? 'Nova Weapons' : 'Egy Normal Weapons'}
                </ChoiceButton>
              ))}
            </ChoiceRow>
          </Field>

          <Field label="REGION">
            <ChoiceRow>
              {(['eu', 'ch'] as const).map((mode) => (
                <ChoiceButton
                  key={mode}
                  active={weaponRegion === mode}
                  onClick={() => setWeaponRegionSafe(mode)}
                >
                  {mode.toUpperCase()}
                </ChoiceButton>
              ))}
            </ChoiceRow>
          </Field>

          <Field label="WEAPON">
            <ChoiceRow>
              {availableWeapons.map((command) => (
                <ChoiceButton
                  key={command}
                  active={weapon === command}
                  onClick={() => setWeapon(command)}
                >
                  {command.replace(/^!/, '')}
                </ChoiceButton>
              ))}
            </ChoiceRow>
          </Field>

          {weaponSystem !== 'egy' && (
            <>
              <Field label="DEGREE">
                <ChoiceRow className="degree-row">
                  {WEAPON_DEGREES.map((degree) => (
                    <ChoiceButton
                      key={degree}
                      active={weaponDegree === degree}
                      onClick={() => setDegreeSafe(degree)}
                    >
                      D{degree}
                    </ChoiceButton>
                  ))}
                </ChoiceRow>
              </Field>

              <Field label="SEAL / TYPE">
                <ChoiceRow>
                  {sealOptions.map((seal) => (
                    <ChoiceButton
                      key={seal}
                      active={weaponSeal === seal}
                      onClick={() => setWeaponSeal(seal)}
                    >
                      {seal}
                    </ChoiceButton>
                  ))}
                </ChoiceRow>
              </Field>
            </>
          )}

          <Field label="PLUS">
            <ChoiceRow className="plus-row">
              {WEAPON_PLUS_LEVELS.map((n) => (
                <ChoiceButton
                  key={n}
                  active={weaponPlus === n}
                  onClick={() => setWeaponPlus(n)}
                >
                  +{n === 255 ? '255' : n}
                </ChoiceButton>
              ))}
            </ChoiceRow>
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

function getWeaponCodePart(command: string, region: WeaponRegion) {
  if (region === 'eu') {
    const parts: Record<string, string> = {
      '!OneHand': 'SWORD_',
      '!TwoHand': 'TSWORD_',
      '!Crossbow': 'CROSSBOW_',
      '!Dagger': 'DAGGER_',
      '!Staff': 'TSTAFF_',
      '!Bard': 'HARP_',
      '!Cleric': 'STAFF_',
      '!Warlock': 'DARKSTAFF_',
      '!EuShield': 'SHIELD_',
      '!Axe': 'AXE_',
    }
    return parts[command] ?? ''
  }

  const parts: Record<string, string> = {
    '!Spear': 'SPEAR_',
    '!Bow': 'BOW_',
    '!Glaive': 'TBLADE_',
    '!Sword': 'SWORD_',
    '!Blade': 'BLADE_',
    '!ChShield': 'SHIELD_',
  }
  return parts[command] ?? ''
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="generator-field"><label>{label}</label>{children}</div>
}

function GeneratorCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div className="generator-card"><div className="eyebrow">{title}</div><p className="generator-subtitle">{subtitle}</p>{children}</div>
}

function CodeResult({ value, copied, onCopy }: { value: string; copied: boolean; onCopy: () => void }) {
  return <div className="generator-code-result"><div className="detail-kicker">GENERATED CODE</div><div className="code-box"><div className="code-row"><span>{value}</span><button type="button" className="copy-btn" onClick={onCopy}>{copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}</button></div></div></div>
}
