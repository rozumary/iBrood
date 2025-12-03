"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language, TranslationKey } from './translations'

const PREFERENCES_STORAGE_KEY = 'ibrood_preferences'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('english')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved language preference
    const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.language && (parsed.language === 'english' || parsed.language === 'filipino')) {
          setLanguageState(parsed.language)
        }
      } catch (e) {
        console.error('Error loading language preference:', e)
      }
    }
  }, [])

  // Listen for storage changes (when settings page updates)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.language && (parsed.language === 'english' || parsed.language === 'filipino')) {
            setLanguageState(parsed.language)
          }
        } catch (e) {
          console.error('Error loading language preference:', e)
        }
      }
    }

    // Custom event for same-tab updates
    window.addEventListener('preferencesUpdated', handleStorageChange)
    // Standard event for cross-tab updates
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('preferencesUpdated', handleStorageChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Save to localStorage
    const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY)
    const prefs = saved ? JSON.parse(saved) : {}
    prefs.language = lang
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs))
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('preferencesUpdated'))
  }

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.english[key] || key
  }

  // Prevent hydration mismatch - return English initially
  if (!mounted) {
    return (
      <TranslationContext.Provider value={{ 
        language: 'english', 
        setLanguage, 
        t: (key) => translations.english[key] || key 
      }}>
        {children}
      </TranslationContext.Provider>
    )
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
