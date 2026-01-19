"use client"

import { Save, MapPin, Home, Archive as Beehive, Sparkles, Users, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

const APIARY_STORAGE_KEY = 'ibrood_apiary_profile'

export default function ApiaryProfile() {
  const [profile, setProfile] = useState({
    apiaryName: "Lucido Bee Farm",
    location: "",
    numHives: 0,
    beeSpecies: "",
    establishedDate: "",
    notes: ""
  })

  const [isSaved, setIsSaved] = useState(true)

  // Load profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(APIARY_STORAGE_KEY)
    if (saved) {
      setProfile(JSON.parse(saved))
    }
  }, [])

  const handleChange = (field: string, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem(APIARY_STORAGE_KEY, JSON.stringify(profile))
    setIsSaved(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-200 dark:border-amber-700/50 p-6 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="p-4 bg-[#FFA95C] rounded-2xl shadow-lg">
            <Home className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <h2 className="font-heading font-bold text-2xl text-amber-900 dark:text-amber-100">
              {profile.apiaryName || "Your Apiary"}
            </h2>
            <p className="text-amber-700/70 dark:text-amber-300/70 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {profile.location || "Location not set"}
            </p>
          </div>
          {profile.numHives > 0 && (
            <div className="text-center bg-white/60 dark:bg-gray-800/60 rounded-xl px-4 py-2 border border-amber-200 dark:border-amber-700/50">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{profile.numHives}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Hives</p>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/30 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Apiary Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Apiary Name */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Apiary Name</label>
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <input
                type="text"
                value={profile.apiaryName}
                onChange={(e) => handleChange("apiaryName", e.target.value)}
                placeholder="e.g., Sunny Hills Apiary"
                className="flex-1 px-4 py-3 border border-amber-200 dark:border-amber-700/50 rounded-xl bg-amber-50/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100 placeholder:text-amber-400 dark:placeholder:text-amber-600"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Location</label>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g., Laguna, Philippines"
                className="flex-1 px-4 py-3 border border-amber-200 dark:border-amber-700/50 rounded-xl bg-amber-50/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100 placeholder:text-amber-400 dark:placeholder:text-amber-600"
              />
            </div>
          </div>

          {/* Number of Hives */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Number of Hives</label>
            <div className="flex items-center gap-3">
              <Beehive className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <input
                type="number"
                min="0"
                value={profile.numHives || ""}
                onChange={(e) => handleChange("numHives", parseInt(e.target.value) || 0)}
                placeholder="0"
                className="flex-1 px-4 py-3 border border-amber-200 dark:border-amber-700/50 rounded-xl bg-amber-50/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100 placeholder:text-amber-400 dark:placeholder:text-amber-600"
              />
            </div>
          </div>

          {/* Bee Species */}
          <div className="relative">
            <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Bee Species</label>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <select
                value={profile.beeSpecies}
                onChange={(e) => handleChange("beeSpecies", e.target.value)}
                className="flex-1 px-4 py-3 border border-amber-200 dark:border-amber-700/50 rounded-xl bg-amber-50/50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100 appearance-none cursor-pointer"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
                <option value="" className="bg-white dark:bg-gray-900 text-amber-900 dark:text-amber-100">Select species...</option>
                <option value="apis-cerana" className="bg-white dark:bg-gray-900 text-amber-900 dark:text-amber-100">Apis Cerana (Asian Honeybee)</option>
                <option value="apis-cerana-japonica" className="bg-white dark:bg-gray-900 text-amber-900 dark:text-amber-100">Apis Cerana Japonica (Japanese Honeybee)</option>
                <option value="apis-mellifera" className="bg-white dark:bg-gray-900 text-amber-900 dark:text-amber-100">Apis Mellifera (Western/European Honeybee)</option>
                <option value="other" className="bg-white dark:bg-gray-900 text-amber-900 dark:text-amber-100">Other</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-[calc(50%+0.5rem)] pointer-events-none">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Established Date */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Established Date</label>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <input
                type="date"
                value={profile.establishedDate}
                onChange={(e) => handleChange("establishedDate", e.target.value)}
                className="flex-1 max-w-xs px-4 py-3 border border-amber-200 dark:border-amber-700/50 rounded-xl bg-amber-50/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Notes</label>
          <textarea
            value={profile.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Any additional notes about your apiary..."
            rows={3}
            className="w-full px-4 py-3 border border-amber-200 dark:border-amber-700/50 rounded-xl bg-amber-50/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100 placeholder:text-amber-400 dark:placeholder:text-amber-600 resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isSaved
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-400 dark:text-amber-600 cursor-not-allowed"
                : "bg-[#FFA95C] text-white hover:bg-[#ff9b40] shadow-md hover:shadow-lg"
            }`}
          >
            <Save size={18} />
            Save Changes
          </button>
          {isSaved && (
            <div className="flex items-center text-sky-600 dark:text-sky-400 text-sm font-medium gap-1">
              <Sparkles className="w-4 h-4" />
              All changes saved!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
