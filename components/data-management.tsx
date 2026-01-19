"use client"

import { Download, Upload, RotateCcw, Trash2, AlertTriangle, Database, CheckCircle, FileJson, HardDrive, X, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { getAnalyses, getBroodAnalyses, getTotalInspections } from "@/lib/storage"

export default function DataManagement() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [storageStats, setStorageStats] = useState({
    queenAnalyses: 0,
    broodAnalyses: 0,
    queenLogs: 0,
    broodLogs: 0,
    totalItems: 0
  })

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text })
    setTimeout(() => setToastMessage(null), 3000)
  }

  useEffect(() => {
    loadStorageStats()
  }, [])

  const loadStorageStats = () => {
    const queenAnalyses = getAnalyses().length
    const broodAnalyses = getBroodAnalyses().length
    const queenLogs = JSON.parse(localStorage.getItem('ibrood_queen_cell_logs') || '[]').length
    const broodLogs = JSON.parse(localStorage.getItem('ibrood_brood_logs') || '[]').length
    
    setStorageStats({
      queenAnalyses,
      broodAnalyses,
      queenLogs,
      broodLogs,
      totalItems: queenAnalyses + broodAnalyses + queenLogs + broodLogs
    })
  }

  const handleExportData = () => {
    const data = {
      queenCellAnalyses: getAnalyses(),
      broodPatternAnalyses: getBroodAnalyses(),
      queenCellLogs: JSON.parse(localStorage.getItem('ibrood_queen_cell_logs') || '[]'),
      broodLogs: JSON.parse(localStorage.getItem('ibrood_brood_logs') || '[]'),
      apiaryProfile: JSON.parse(localStorage.getItem('ibrood_apiary_profile') || '{}'),
      preferences: JSON.parse(localStorage.getItem('ibrood_preferences') || '{}'),
      exportDate: new Date().toISOString(),
      version: "1.0.0"
    }
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ibrood-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.queenCellAnalyses) {
          localStorage.setItem('ibrood_queen_cell_analyses', JSON.stringify(data.queenCellAnalyses))
        }
        if (data.broodPatternAnalyses) {
          localStorage.setItem('ibrood_brood_analyses', JSON.stringify(data.broodPatternAnalyses))
        }
        if (data.queenCellLogs) {
          localStorage.setItem('ibrood_queen_cell_logs', JSON.stringify(data.queenCellLogs))
        }
        if (data.broodLogs) {
          localStorage.setItem('ibrood_brood_logs', JSON.stringify(data.broodLogs))
        }
        if (data.apiaryProfile) {
          localStorage.setItem('ibrood_apiary_profile', JSON.stringify(data.apiaryProfile))
        }
        if (data.preferences) {
          localStorage.setItem('ibrood_preferences', JSON.stringify(data.preferences))
        }

        loadStorageStats()
        window.dispatchEvent(new Event('analysisUpdated'))
        showToast('success', 'Data imported successfully!')
      } catch {
        showToast('error', 'Error importing data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteAllData = () => {
    localStorage.removeItem('ibrood_queen_cell_analyses')
    localStorage.removeItem('ibrood_brood_analyses')
    localStorage.removeItem('ibrood_queen_cell_logs')
    localStorage.removeItem('ibrood_brood_logs')
    localStorage.removeItem('ibrood_apiary_profile')
    localStorage.removeItem('ibrood_preferences')
    localStorage.removeItem('ibrood_notification_settings')
    
    loadStorageStats()
    window.dispatchEvent(new Event('analysisUpdated'))
    setShowDeleteConfirm(false)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top-2 ${
          toastMessage.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Storage Overview */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-200 dark:border-amber-700/50 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-[#FFA95C] rounded-xl shadow-md">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-amber-900 dark:text-amber-100">Storage Overview</h3>
            <p className="text-sm text-amber-700/70 dark:text-amber-300/70">Your local data summary</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 text-center border border-amber-200/50 dark:border-amber-700/50">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{storageStats.queenAnalyses}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Queen Analysis</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 text-center border border-amber-200/50 dark:border-amber-700/50">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{storageStats.broodAnalyses}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Brood Analysis</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 text-center border border-amber-200/50 dark:border-amber-700/50">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{storageStats.queenLogs}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Queen Logs</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 text-center border border-amber-200/50 dark:border-amber-700/50">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{storageStats.broodLogs}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Brood Logs</p>
          </div>
        </div>
      </div>

      {/* Export & Import */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Data */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
              <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">Export Data</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400">Download all your data as JSON</p>
            </div>
          </div>
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md"
          >
            <FileJson className="w-5 h-5" />
            Export as JSON
          </button>
        </div>

        {/* Import Data */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">Import Data</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400">Restore from a previous backup</p>
            </div>
          </div>
          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md cursor-pointer">
            <HardDrive className="w-5 h-5" />
            Select JSON File
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Auto Backup */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <RotateCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">Auto Backup Reminder</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400">Get reminders to backup your data weekly</p>
            </div>
          </div>
          <button
            onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              autoBackupEnabled ? "bg-emerald-500" : "bg-amber-200 dark:bg-amber-700"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                autoBackupEnabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
        {autoBackupEnabled && (
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl">
            <CheckCircle className="w-4 h-4" />
            <span>You&apos;ll be reminded to backup your data every week</span>
          </div>
        )}
      </div>

      {/* Clear All Data - Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800/50 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-red-900 dark:text-red-300 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              Permanently delete all analyses, logs, and settings. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} />
              Delete All Data
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800/50 p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-heading font-bold text-lg text-red-900 dark:text-red-300">Delete All Data?</h3>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-red-700 dark:text-red-400 mb-6">
              This will permanently erase <strong>{storageStats.totalItems} items</strong> including all analyses, logs, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-amber-200 dark:border-amber-700 rounded-xl font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllData}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
