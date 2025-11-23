"use client"

import { Bell, AlertTriangle } from "lucide-react"
import { useState } from "react"

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

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-semibold text-text-primary">Enable Notifications</h3>
              <p className="text-xs text-muted">Allow iBrood to send you notifications</p>
            </div>
          </div>
          <button
            onClick={() => toggleSetting("enableNotifications")}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.enableNotifications ? "bg-success" : "bg-border"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                settings.enableNotifications ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Alert Types */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Alert Types</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <h4 className="font-semibold text-text-primary">Critical Alerts Only</h4>
                <p className="text-xs text-muted">Only receive important alerts</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("criticalAlerts")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.criticalAlerts ? "bg-accent" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.criticalAlerts ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-semibold text-text-primary">Mature Queen Cells</h4>
              <p className="text-xs text-muted">Alert when mature queen cells are detected</p>
            </div>
            <button
              onClick={() => toggleSetting("matureQueenCells")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.matureQueenCells ? "bg-success" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.matureQueenCells ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-semibold text-text-primary">Abnormal Brood Patterns</h4>
              <p className="text-xs text-muted">Alert when unusual patterns are detected</p>
            </div>
            <button
              onClick={() => toggleSetting("abnormalBrood")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.abnormalBrood ? "bg-success" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.abnormalBrood ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Style */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Notification Style</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-semibold text-text-primary">Sound</h4>
              <p className="text-xs text-muted">Play sound for notifications</p>
            </div>
            <button
              onClick={() => toggleSetting("soundEnabled")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.soundEnabled ? "bg-accent" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.soundEnabled ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-semibold text-text-primary">Vibration</h4>
              <p className="text-xs text-muted">Vibrate for notifications (mobile only)</p>
            </div>
            <button
              onClick={() => toggleSetting("vibrationEnabled")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.vibrationEnabled ? "bg-accent" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.vibrationEnabled ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-semibold text-text-primary">Daily Digest</h4>
              <p className="text-xs text-muted">Receive a daily summary of all activities</p>
            </div>
            <button
              onClick={() => toggleSetting("dailyDigest")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.dailyDigest ? "bg-accent" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
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
