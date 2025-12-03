"use client"

import { Thermometer, Globe, Palette, Moon, Sun, Monitor, Smartphone, Type } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

const PREFERENCES_STORAGE_KEY = 'ibrood_preferences'

export default function PreferencesSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [preferences, setPreferences] = useState({
    temperatureUnit: "celsius",
    language: "english",
    compactMode: false,
    fontSize: "default",
  })

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setPreferences(parsed)
      // Apply compact mode
      if (parsed.compactMode) {
        document.documentElement.classList.add('compact')
      }
      // Apply font size
      if (parsed.fontSize) {
        applyFontSize(parsed.fontSize)
      }
    }
  }, [])

  const applyFontSize = (size: string) => {
    // Remove all font size classes
    document.documentElement.classList.remove('font-size-small', 'font-size-default', 'font-size-large', 'font-size-xlarge')
    // Add the selected font size class
    if (size !== 'default') {
      document.documentElement.classList.add(`font-size-${size}`)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    const updated = { ...preferences, [field]: value }
    setPreferences(updated)
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated))
    
    // Dispatch event for translation context to pick up
    window.dispatchEvent(new Event('preferencesUpdated'))
    
    // Apply compact mode
    if (field === 'compactMode') {
      if (value) {
        document.documentElement.classList.add('compact')
      } else {
        document.documentElement.classList.remove('compact')
      }
    }
    
    // Apply font size
    if (field === 'fontSize') {
      applyFontSize(value as string)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white/80 rounded-2xl border border-amber-200/50 p-6 h-48"></div>
        <div className="bg-white/80 rounded-2xl border border-amber-200/50 p-6 h-48"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-amber-500" />
          Display Settings
        </h3>

        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === "light" 
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                  : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
              }`}
            >
              <Sun className={`w-6 h-6 ${theme === "light" ? "text-amber-500" : "text-amber-400 dark:text-amber-500"}`} />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === "dark" 
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                  : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
              }`}
            >
              <Moon className={`w-6 h-6 ${theme === "dark" ? "text-amber-500" : "text-amber-400 dark:text-amber-500"}`} />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === "system" 
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                  : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
              }`}
            >
              <Monitor className={`w-6 h-6 ${theme === "system" ? "text-amber-500" : "text-amber-400 dark:text-amber-500"}`} />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">System</span>
            </button>
          </div>
        </div>

        {/* Compact Mode */}
        <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Compact Mode</h4>
              <p className="text-xs text-amber-600 dark:text-amber-400">Use smaller UI elements for more content</p>
            </div>
          </div>
          <button
            onClick={() => handleChange("compactMode", !preferences.compactMode)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              preferences.compactMode ? "bg-amber-500" : "bg-amber-200 dark:bg-amber-700"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                preferences.compactMode ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Font Size - for accessibility */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-500" />
            Font Size
          </label>
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">Adjust text size for better readability</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => handleChange("fontSize", "small")}
              className={`flex flex-col items-center gap-1 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                preferences.fontSize === "small" 
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                  : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
              }`}
            >
              <span className="text-xs font-medium text-amber-800 dark:text-amber-200">Aa</span>
              <span className="text-xs text-amber-600 dark:text-amber-400">Small</span>
            </button>
            <button
              onClick={() => handleChange("fontSize", "default")}
              className={`flex flex-col items-center gap-1 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                preferences.fontSize === "default" 
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                  : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Aa</span>
              <span className="text-xs text-amber-600 dark:text-amber-400">Default</span>
            </button>
            <button
              onClick={() => handleChange("fontSize", "large")}
              className={`flex flex-col items-center gap-1 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                preferences.fontSize === "large" 
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                  : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
              }`}
            >
              <span className="text-base font-medium text-amber-800 dark:text-amber-200">Aa</span>
              <span className="text-xs text-amber-600 dark:text-amber-400">Large</span>
            </button>
            <button
              onClick={() => handleChange("fontSize", "xlarge")}
              className={`flex flex-col items-center gap-1 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                preferences.fontSize === "xlarge" 
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                  : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
              }`}
            >
              <span className="text-lg font-medium text-amber-800 dark:text-amber-200">Aa</span>
              <span className="text-xs text-amber-600 dark:text-amber-400">Extra Large</span>
            </button>
          </div>
        </div>
      </div>

      {/* Units & Language */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-500" />
          Regional Settings
        </h3>

        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">Language / Wika</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChange("language", "english")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  preferences.language === "english" 
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                    : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
                }`}
              >
                <span className="text-2xl">🇺🇸</span>
                <span className="font-medium text-amber-800 dark:text-amber-200">English</span>
              </button>
              <button
                onClick={() => handleChange("language", "filipino")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  preferences.language === "filipino" 
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30" 
                    : "border-amber-200 dark:border-amber-700 hover:border-amber-300 bg-white dark:bg-gray-800"
                }`}
              >
                <span className="text-2xl">🇵🇭</span>
                <span className="font-medium text-amber-800 dark:text-amber-200">Filipino</span>
              </button>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              {preferences.language === "filipino" ? "Ang ilang bahagi ay nasa Filipino na!" : "Some parts are now available in Filipino!"}
            </p>
          </div>

          {/* Temperature Unit - Only Celsius */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">
              {preferences.language === "filipino" ? "Yunit ng Temperatura" : "Temperature Unit"}
            </label>
            <div className="flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
              <Thermometer className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-amber-800 dark:text-amber-200">Celsius (°C)</span>
              <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded-lg">
                {preferences.language === "filipino" ? "Default" : "Default"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
