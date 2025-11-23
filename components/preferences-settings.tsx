"use client"

import { Thermometer, Globe } from "lucide-react"
import { useState } from "react"

export default function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    temperatureUnit: "celsius",
    language: "english",
  })

  const handleChange = (field: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-8">
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="font-heading font-semibold text-xl mb-6">Preferences</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">Temperature Unit</label>
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background mb-2">
            <Thermometer className="w-5 h-5 text-muted flex-shrink-0" />
            <select
              value={preferences.temperatureUnit}
              onChange={(e) => handleChange("temperatureUnit", e.target.value)}
              className="flex-1 bg-transparent focus:outline-none font-medium text-text-primary"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
          <p className="text-xs text-muted">Choose your preferred temperature scale</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">Language</label>
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background mb-2">
            <Globe className="w-5 h-5 text-muted flex-shrink-0" />
            <select
              value={preferences.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="flex-1 bg-transparent focus:outline-none font-medium text-text-primary"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish (Español)</option>
              <option value="french">French (Français)</option>
              <option value="german">German (Deutsch)</option>
            </select>
          </div>
          <p className="text-xs text-muted">Select your preferred language</p>
        </div>
      </div>
    </div>
  )
}
