'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

const LANGUAGES = 'en,ar,tr,de,fr,es,pt,ru,pl,ro'

export default function LanguageSelector() {
  const ready = useRef(false)

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (ready.current || !window.google?.translate?.TranslateElement) return
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: LANGUAGES,
          autoDisplay: false,
        },
        'google_translate_element'
      )
      ready.current = true
    }

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit()
    }

    // Re-apply Google Translate after React updates dynamic content (commands/descriptions).
    // Google Translate only processes the DOM that exists when it runs.
    ;(window as any).__retranslatePage = () => {
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
      if (!combo || !combo.value) return
      const current = combo.value
      combo.dispatchEvent(new Event('change', { bubbles: true }))
      // Some Google Translate builds ignore a change to the same value.
      window.setTimeout(() => {
        if (combo.value !== current) combo.value = current
        combo.dispatchEvent(new Event('change', { bubbles: true }))
      }, 120)
    }

    return () => {
      delete window.googleTranslateElementInit
      delete (window as any).__retranslatePage
    }
  }, [])

  return (
    <>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div className="language-selector" title="Translate website">
        <span className="language-label">LANG</span>
        <div id="google_translate_element" />
      </div>
    </>
  )
}
