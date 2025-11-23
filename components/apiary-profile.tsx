"use client"

import { Save, MapPin, Home, Archive as Beehive } from "lucide-react"
import { useState } from "react"

export default function ApiaryProfile() {
  const [profile, setProfile] = useState({
    apiaryName: "Main Apiary",
    location: "Laguna, Philippines",
    numHives: 12,
  })

  const [isSaved, setIsSaved] = useState(true)

  const handleChange = (field: string, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  const handleSave = () => {
    setIsSaved(true)
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-8">
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="font-heading font-semibold text-xl mb-6">Apiary Profile</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Apiary Name</label>
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-muted flex-shrink-0" />
            <input
              type="text"
              value={profile.apiaryName}
              onChange={(e) => handleChange("apiaryName", e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <p className="text-xs text-muted mt-1">Name your apiary location</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Location</label>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted flex-shrink-0" />
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <p className="text-xs text-muted mt-1">City, state, or region</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Number of Hives</label>
          <div className="flex items-center gap-3">
            <Beehive className="w-5 h-5 text-muted flex-shrink-0" />
            <input
              type="number"
              value={profile.numHives}
              onChange={(e) => handleChange("numHives", Number.parseInt(e.target.value))}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <p className="text-xs text-muted mt-1">Total hives in this apiary</p>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              isSaved
                ? "bg-surface-hover text-muted cursor-not-allowed"
                : "bg-accent text-white hover:bg-accent-secondary"
            }`}
          >
            <Save size={18} />
            Save Changes
          </button>
          {isSaved && <div className="flex items-center text-success text-sm font-medium">✓ Saved successfully</div>}
        </div>
      </div>
    </div>
  )
}
