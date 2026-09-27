'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type SiteLanguage = 'en' | 'tr'

type I18nKey =
  | 'language'
  | 'searchPlaceholder'
  | 'categories'
  | 'entries'
  | 'noMatchingEntries'
  | 'selectEntry'
  | 'selectCategory'
  | 'chooseEntry'
  | 'variants'
  | 'amount'
  | 'generatedCode'
  | 'copy'
  | 'copied'
  | 'liveDatabase'

const UI: Record<I18nKey, Record<SiteLanguage, string>> = {
  language: { en: 'LANGUAGE', tr: 'LANGUAGE' },
  searchPlaceholder: {
    en: 'Search commands, codes or descriptions...',
    tr: 'Komut, kod veya açıklama ara...',
  },
  categories: { en: 'CATEGORIES', tr: 'KATEGORİLER' },
  entries: { en: 'ENTRIES', tr: 'KOMUTLAR' },
  noMatchingEntries: { en: 'No matching entries.', tr: 'Eşleşen komut bulunamadı.' },
  selectEntry: { en: 'Select an entry', tr: 'Bir komut seçin' },
  selectCategory: { en: 'Select a category', tr: 'Bir kategori seçin' },
  chooseEntry: {
    en: 'Choose an entry from the list to inspect its code.',
    tr: 'Kodunu görmek için listeden bir komut seçin.',
  },
  variants: { en: 'VARIANTS', tr: 'VARYANTLAR' },
  amount: { en: 'AMOUNT', tr: 'MİKTAR' },
  generatedCode: { en: 'GENERATED CODE', tr: 'OLUŞTURULAN KOD' },
  copy: { en: 'Copy', tr: 'Kopyala' },
  copied: { en: 'Copied', tr: 'Kopyalandı' },
  liveDatabase: {
    en: 'Live from the central command database.',
    tr: 'Merkezi komut veritabanından canlı olarak yükleniyor.',
  },
}

// The command name/code are intentionally NOT translated.
// These descriptions are the existing descriptions used by the project.

const LABEL_TR: Record<string, string> = {
  'Discord Commands': 'Discord Komutları',
  'In-game Commands': 'Oyun İçi Komutlar',
  'Item Codes': 'Ürün Kodları',
  'Console Commands': 'Konsol Komutları',
  'Streaming / Nitro Commands': 'Yayın Akışı / Nitro Komutları',
  'Silk - Gold - Package Commands': 'Silk - Gold - Paket Komutları',
  'CHAR Commands': 'Karakter Komutları',
  'Quests Commands': 'Görev Komutları',
  'Card Collection Commands': 'Kart Koleksiyonu Komutları',
  'Ban Commands': 'Yasaklama Komutları',
  'Titles / Streaming Commands': 'Title / Yayın Komutları',
  'Silk / Gift Commands': 'Silk / Gift Komutları',
  'Character Commands': 'Karakter Komutları',
  'Inventory Commands': 'Envanter Komutları',
  'Plus / FB Commands': 'Plus / FB Komutları',
  'Normal Commands': 'Normal Komutlar',
  'Normal CH': 'Normal CH',
  'Normal EU': 'Normal EU',
  'Normal Items': 'Normal Ürünler',
  'Normal Egy Items': 'Normal Egy Ürünleri',
  'Nova Items': 'Nova Ürünleri',
  'Normal Weapons': 'Normal Silahlar',
  'Egy Normal Weapons': 'Egy Normal Silahlar',
  'Nova Weapons': 'Nova Silahları',
  'Roc - Medusa': 'Roc - Medusa',
  'Zerk': 'Zerk',
  'Zealot Uniques': "Zealot Unique'leri",
  'Temple Uniques': "Temple Unique'leri",
}

const DESCRIPTION_TR: Record<string, string> = {
  'Discord commands from the existing Discord JSON.': 'Mevcut Discord JSON dosyasındaki Discord komutları.',
  'بيدي للكراكتر Nitro Icon + Title + Avatar + Pet، حسب اختيار In-game أو Bot.': 'Seçilen karaktere In-game veya Bot seçimine göre Nitro Icon + Title + Avatar + Pet verir.',
  'بيدي للكراكتر Nitro Icon + Title، حسب اختيار In-game أو Bot.': 'Seçilen karaktere In-game veya Bot seçimine göre Nitro Icon + Title verir.',
  'بيبعت ريوارد 1 Nitro Boost - Title Only.': '1 Nitro Boost ödülü gönderir - yalnızca Title.',
  'بيبعت ريوارد 1 Nitro Boost يشمل Avatar و Pet و Title.': 'Avatar, Pet ve Title içeren 1 Nitro Boost ödülü gönderir.',
  'بيعمل Remove للـ Nitro Title من الكراكتر.': 'Karakterdeki Nitro Title\'ı kaldırır.',
  'بيضيف Supporter Title للكراكتر المحدد.': 'Seçilen karaktere Supporter Title ekler.',
  'بيشيل Supporter Title من الكراكتر المحدد.': 'Seçilen karakterden Supporter Title\'ı kaldırır.',
  'بيضيف Streamer Title / Role للكراكتر المحدد حسب إعدادات النظام.': 'Sistem ayarlarına göre seçilen karaktere Streamer Title / Role ekler.',
  'بيشيل Streamer Title / Role من الكراكتر.': 'Karakterden Streamer Title / Role\'ü kaldırır.',
  'بيضيف TikTok Title أو Tag للكراكتر المحدد.': 'Seçilen karaktere TikTok Title veya Tag ekler.',
  'بيشيل TikTok Title أو Tag من الكراكتر المحدد.': 'Seçilen karakterden TikTok Title veya Tag\'i kaldırır.',
  'بيضيف Kick Title أو Tag للكراكتر المحدد.': 'Seçilen karaktere Kick Title veya Tag ekler.',
  'بيشيل Kick Title أو Tag من الكراكتر المحدد.': 'Seçilen karakterden Kick Title veya Tag\'i kaldırır.',
  'بيضيف YouTuber Title أو Tag للكراكتر المحدد.': 'Seçilen karaktere YouTuber Title veya Tag ekler.',
  'بيشيل YouTuber Title أو Tag من الكراكتر المحدد.': 'Seçilen karakterden YouTuber Title veya Tag\'i kaldırır.',
  'بيضيف Twitch Title أو Tag للكراكتر المحدد.': 'Seçilen karaktere Twitch Title veya Tag ekler.',
  'بيشيل Twitch Title أو Tag من الكراكتر المحدد.': 'Seçilen karakterden Twitch Title veya Tag\'i kaldırır.',
  'بيبعت Silk بالـ ID. اكتب الكوماند ثم الـ ID ثم كمية الـ Silk.': 'ID ile Silk gönderir. Önce komutu, ardından ID ve Silk miktarını yazın.',
  'بيبعت Gift بالـ ID. اكتب الكوماند ثم الـ ID ثم كمية الـ Gift.': 'ID ile Gift gönderir. Önce komutu, ardından ID ve Gift miktarını yazın.',
  'بيبعت Silk باستخدام اسم الكراكتر.': 'Karakter adını kullanarak Silk gönderir.',
  'بيبعت Gift باستخدام اسم الكراكتر.': 'Karakter adını kullanarak Gift gönderir.',
  'بيبعت Starter Package للكراكتر، ولازم يكون Online.': 'Karaktere Starter Package gönderir; karakter Online olmalıdır.',
  'بيبعت Starter Package للكراكتر سواء Online أو Offline.': 'Karakter Online veya Offline olsa da Starter Package gönderir.',
  'بيبعت Package لمدة 7 أيام.': '7 günlük Package gönderir.',
  'بيبعت Gold للكراكتر المحدد.': 'Seçilen karaktere Gold gönderir.',
  'بيبعت الشار إلى Prison.': 'Karakteri Prison\'a gönderir.',
  'بيرجع الشار من Prison إلى Town.': 'Karakteri Prison\'dan Town\'a geri gönderir.',
  'بيجيب الـ Real Character Name من اسم الـ Job.': 'Job adından gerçek Character Name bilgisini getirir.',
  'بيعمل Reset للـ Password الخاصة بالكراكتر.': 'Karakterin Password bilgisini sıfırlar.',
  'بيضيف Battle Pass Points للكراكتر.': 'Karaktere Battle Pass Points ekler.',
  'بيخلص Quest الـ Solo Dungeon للكراكتر.': 'Karakter için Solo Dungeon Quest görevini tamamlar.',
  'بيخلص Quest الـ Garden للكراكتر.': 'Karakter için Garden Quest görevini tamamlar.',
  'بيخلص Quest بغداد للكراكتر.': 'Karakter için Baghdad Quest görevini tamamlar.',
  'بيخلص Quest الـ Party Dungeon للكراكتر.': 'Karakter için Party Dungeon Quest görevini tamamlar.',
  'بيعمل Reset للـ Limit الخاص بالـ Party Dungeon.': 'Party Dungeon limitini sıfırlar.',
  'بيخلص Quest الـ HWT للكراكتر.': 'Karakter için HWT Quest görevini tamamlar.',
  'بيعمل Reset للـ Limit الخاص بالـ HWT.': 'HWT limitini sıfırlar.',
  'بيخلص Quest بغداد Party للكراكتر.': 'Karakter için Baghdad Party Quest görevini tamamlar.',
  'بيعمل Reset للـ Limit الخاص ببغداد Party.': 'Baghdad Party limitini sıfırlar.',
  'بيضيف Card Jibril للكراكتر المحدد.': 'Seçilen karaktere Jibril Card ekler.',
  'بيضيف Ice Card للكراكتر المحدد.': 'Seçilen karaktere Ice Card ekler.',
  'بيضيف Poison Card للكراكتر المحدد.': 'Seçilen karaktere Poison Card ekler.',
  'بيضيف Fire Card للكراكتر المحدد.': 'Seçilen karaktere Fire Card ekler.',
  'بيضيف Human Card للكراكتر المحدد.': 'Seçilen karaktere Human Card ekler.',
  'بيضيف Michael Card للكراكتر المحدد.': 'Seçilen karaktere Michael Card ekler.',
  'بيعمل PC Ban للكراكتر المحدد.': 'Seçilen karaktere PC Ban uygular.',
  'بيشيل الـ PC Ban من الكراكتر المحدد.': 'Seçilen karakterin PC Ban\'ını kaldırır.',
  'بيعمل IP Ban للكراكتر المحدد.': 'Seçilen karaktere IP Ban uygular.',
  'بيشيل الـ IP Ban من الكراكتر المحدد.': 'Seçilen karakterin IP Ban\'ını kaldırır.',
  'بيعمل Ban للكراكتر المحدد.': 'Seçilen karaktere Ban uygular.',
  'بيشيل الـ Ban من الكراكتر المحدد.': 'Seçilen karakterin Ban\'ını kaldırır.',
  'بيعمل Global Ban للكراكتر لمدة عدد الأيام المحدد.': 'Seçilen karaktere belirtilen gün sayısı boyunca Global Ban uygular.',
  'بيشيل الـ Global Ban من الكراكتر.': 'Karakterin Global Ban\'ını kaldırır.',
  'بيعمل Chat Ban للكراكتر لمدة عدد الأيام المحدد.': 'Seçilen karaktere belirtilen gün sayısı boyunca Chat Ban uygular.',
  'بيشيل الـ Chat Ban من الكراكتر.': 'Karakterin Chat Ban\'ını kaldırır.',
  'In-game command catalog from the existing In-game JSON.': 'Mevcut In-game JSON dosyasındaki oyun içi komut kataloğu.',
  'بيضيف Nitro Icon + Title للكراكتر المحدد حسب اختيار In-game أو Bot.': 'Seçilen karaktere In-game veya Bot seçimine göre Nitro Icon + Title ekler.',
  'بيضيف Nitro Icon + Title + Avatar + Pet، حسب اختيار In-game أو Bot.': 'In-game veya Bot seçimine göre Nitro Icon + Title + Avatar + Pet ekler.',
  'بيضيف TikTok Title أو Tag للكراكتر.': 'Karaktere TikTok Title veya Tag ekler.',
  'بيضيف YouTuber Title أو Tag للكراكتر.': 'Karaktere YouTuber Title veya Tag ekler.',
  'بيضيف Twitch Title أو Tag للكراكتر.': 'Karaktere Twitch Title veya Tag ekler.',
  'بيضيف Supporter Title أو Tag للكراكتر.': 'Karaktere Supporter Title veya Tag ekler.',
  'بيشيل YouTuber Title أو Tag من الكراكتر.': 'Karakterden YouTuber Title veya Tag\'i kaldırır.',
  'بيشيل Nitro Title / Icon من الكراكتر.': 'Karakterden Nitro Title / Icon\'u kaldırır.',
  'بيشيل Twitch Title أو Tag من الكراكتر.': 'Karakterden Twitch Title veya Tag\'i kaldırır.',
  'بيضيف Title مخصص للكراكتر باستخدام القيمة المحددة.': 'Belirtilen değeri kullanarak karaktere özel Title ekler.',
  'بيضيف Silk للمستخدم باستخدام الـ ID والكمية المحددة.': 'Belirtilen ID ve miktarı kullanarak kullanıcıya Silk ekler.',
  'بيضيف Gift للمستخدم باستخدام الـ ID والكمية المحددة.': 'Belirtilen ID ve miktarı kullanarak kullanıcıya Gift ekler.',
  'بيضيف Silk للكراكتر باستخدام اسم الكراكتر والكمية.': 'Karakter adı ve miktarı kullanarak karaktere Silk ekler.',
  'بيبعت Gift للكراكتر باستخدام اسم الكراكتر والكمية.': 'Karakter adı ve miktarı kullanarak karaktere Gift gönderir.',
  'بيفك الكراكتر لو عالق أو غير قادر على الحركة بشكل طبيعي.': 'Karakter takılı kaldığında veya normal hareket edemediğinde karakteri serbest bırakır.',
  'بيحدد Level للكراكتر مباشرة بالمستوى المطلوب.': 'Karakter Level\'ını doğrudan belirtilen seviyeye ayarlar.',
  'بيعمل Disconnect للكراكتر المحدد من السيرفر.': 'Seçilen karakterin sunucu bağlantısını keser.',
  'بيضيف Rank Points للكراكتر بالكمية المحددة.': 'Belirtilen miktarda Rank Points karaktere ekler.',
  'بيعمل Random Stats للـ Item الموجود في الـ Inventory.': 'Inventory\'deki Item için rastgele Stats oluşturur.',
  'بيمسح كل الـ Items من الـ Inventory والـ Storage للكراكتر.': 'Karakterin Inventory ve Storage alanındaki tüm Item\'ları siler.',
  'بيمسح الـ Chest Log الخاص بالكراكتر.': 'Karakterin Chest Log\'unu temizler.',
  'بيملى الـ Inventory بـ Random Elixirs.': 'Inventory\'yi rastgele Elixir\'lerle doldurur.',
  'بيعمل Copy للـ Item، ولازم الـ Item يكون موجود في Slot 1 من الـ Inventory.': 'Item\'ı kopyalar; Item Inventory\'nin 1. Slotunda olmalıdır.',
  'بيطبق قيمة الـ Plus المحددة على الـ Items حسب إعداد الأمر.': 'Belirtilen Plus değerini komut ayarına göre Item\'lara uygular.',
  'FB Full.': 'FB Full.',
  'بيضيف Max Dur + 1 Immortal + 1 Astral.': 'Max Dur + 1 Immortal + 1 Astral ekler.',
  'بيضيف Adv + Max Dur + 1 Immortal + 1 Astral.': 'Adv + Max Dur + 1 Immortal + 1 Astral ekler.',
  'Item and weapon generators from the original Helper.': 'Orijinal Helper\'daki Item ve silah oluşturucuları.',
  'Console commands and unique spawners from the original Helper.': 'Orijinal Helper\'daki Console komutları ve Unique oluşturucuları.',
  'بيظهر أو يخفي الكراكتر.': 'Karakteri gösterir veya gizler.',
  'بيخلي الكراكتر غير قابل للضرب من الموبس أو اللاعبين.': 'Karakteri moblar ve oyuncular tarafından vurulamaz hale getirir.',
  'GM Camera.': 'GM Kamerası.',
  'بيعمل Disconnect للاعب.': 'Oyuncunun bağlantısını keser.',
  'بيسحب اللاعب جنبك.': 'Oyuncuyu yanına getirir.',
  'بينقلك جنب اللاعب.': 'Seni oyuncunun yanına ışınlar.',
  'بيسحب الجيلد بالكامل جنبك.': 'Tüm guild\'i yanına getirir.',
  'بينقلك للـ Town.': 'Seni Town\'a ışınlar.',
  'بيودي اللاعب للـ Town.': 'Oyuncuyu Town\'a gönderir.',
  'بيقتل Mob أو Unique.': 'Mob veya Unique öldürür.',
  'بيخفي Mob أو Unique.': 'Mob veya Unique\'i gizler.',
  'Skill الدايرة الخاصة بالـ GM.': 'GM\'e özel dairesel Skill.',
  'EU / INT': 'EU / INT',
  'EU / STR': 'EU / STR',
  'CH / INT': 'CH / INT',
  'CH / STR': 'CH / STR',
  'Zerk Unique.': 'Zerk Unique.',
  'Zealot Unique.': 'Zealot Unique.',
  'STR.': 'STR.',
  'Temple Unique.': 'Temple Unique.',
  'Medusa Party / CH / STR.': 'Medusa Party / CH / STR.',
  'Medusa Party / CH / INT.': 'Medusa Party / CH / INT.',
  'Medusa Party / EU / STR.': 'Medusa Party / EU / STR.',
  'Medusa Party / EU / INT.': 'Medusa Party / EU / INT.',
  'Roc / CH / STR.': 'Roc / CH / STR.',
  'Roc / CH / INT.': 'Roc / CH / INT.',
  'Roc / EU / STR.': 'Roc / EU / STR.',
  'Roc / EU / INT.': 'Roc / EU / INT.',
  'HP كتير جدًا.': 'Çok yüksek HP.',
  'Death Bone Roc.': 'Death Bone Roc.',
}

interface LanguageContextValue {
  language: SiteLanguage
  setLanguage: (language: SiteLanguage) => void
  t: (key: I18nKey) => string
  translateDescription: (text: string) => string
  translateLabel: (text: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>('en')

  useEffect(() => {
    const saved = window.localStorage.getItem('site-language')
    if (saved === 'tr' || saved === 'en') setLanguageState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem('site-language', language)
  }, [language])

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    t: (key: I18nKey) => UI[key][language],
    translateDescription: (text: string) => language === 'tr' ? (DESCRIPTION_TR[text] ?? text) : text,
  translateLabel: (text: string) => language === 'tr' ? (LABEL_TR[text] ?? text) : text,
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="language-selector" aria-label={t('language')}>
      <span className="language-label">{t('language')}</span>
      <div className="language-switcher" role="group" aria-label="LANGUAGE">
        <button type="button" title="English" aria-label="English" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>🇬🇧</button>
        <button type="button" title="Türkçe" aria-label="Türkçe" className={language === 'tr' ? 'active' : ''} onClick={() => setLanguage('tr')}>🇹🇷</button>
      </div>
    </div>
  )
}
