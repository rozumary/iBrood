"use client"

import { Bell, AlertTriangle, Crown, Grid3X3, Volume2, Vibrate, Mail, BellRing } from "lucide-react"
import { useState, useEffect } from "react"

const NOTIFICATION_STORAGE_KEY = 'ibrood_notification_settings'

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    criticalAlerts: true,
    matureQueenCells: true,
    abnormalBrood: true,
    soundEnabled: true,
    vibrationEnabled: true,
    dailyDigest: false,
  })

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY)
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const toggleSetting = (key: string) => {
    const updated = { ...settings, [key]: !settings[key as keyof typeof settings] }
    setSettings(updated)
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-200 dark:border-amber-700/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FFA95C] rounded-xl shadow-md">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-amber-900 dark:text-amber-100">Enable Notifications</h3>
              <p className="text-sm text-amber-700/70 dark:text-amber-300/70">Allow iBrood to send you alerts</p>
            </div>
          </div>
          <button
            onClick={() => toggleSetting("enableNotifications")}
            className={`relative w-16 h-9 rounded-full transition-colors shadow-inner ${
              settings.enableNotifications ? "bg-emerald-500" : "bg-amber-200 dark:bg-amber-700"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full transition-transform shadow-md ${
                settings.enableNotifications ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Alert Types */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Alert Types
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">Critical Alerts Only</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">Only receive important alerts</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("criticalAlerts")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.criticalAlerts ? "bg-amber-500" : "bg-amber-200 dark:bg-amber-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  settings.criticalAlerts ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">Mature Queen Cells</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">Alert when mature queen cells are detected</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("matureQueenCells")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.matureQueenCells ? "bg-emerald-500" : "bg-amber-200 dark:bg-amber-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  settings.matureQueenCells ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                <Grid3X3 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">Abnormal Brood Patterns</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">Alert when unusual patterns are detected</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("abnormalBrood")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.abnormalBrood ? "bg-emerald-500" : "bg-amber-200 dark:bg-amber-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  settings.abnormalBrood ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Style */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
          <BellRing className="w-5 h-5 text-amber-500" />
          Notification Style
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Volume2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">Sound</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">Play sound for notifications</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("soundEnabled")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.soundEnabled ? "bg-amber-500" : "bg-amber-200 dark:bg-amber-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  settings.soundEnabled ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                <Vibrate className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">Vibration</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">Vibrate for notifications (mobile only)</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("vibrationEnabled")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.vibrationEnabled ? "bg-amber-500" : "bg-amber-200 dark:bg-amber-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  settings.vibrationEnabled ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <Mail className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">Daily Digest</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">Receive a daily summary of all activities</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("dailyDigest")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.dailyDigest ? "bg-amber-500" : "bg-amber-200 dark:bg-amber-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  settings.dailyDigest ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
