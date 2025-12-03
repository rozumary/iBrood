"use client"

import { useEffect } from "react"

const PREFERENCES_STORAGE_KEY = 'ibrood_preferences'

export default function FontSizeInitializer() {
  useEffect(() => {
    // Load and apply font size on initial load
    const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.fontSize && parsed.fontSize !== 'default') {
          document.documentElement.classList.add(`font-size-${parsed.fontSize}`)
        }
        if (parsed.compactMode) {
          document.documentElement.classList.add('compact')
        }
      } catch (e) {
        console.error('Error loading preferences:', e)
      }
    }
  }, [])

  return null
}
