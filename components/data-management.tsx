"use client"

import { Download, Upload, RotateCcw, Trash2, AlertTriangle } from "lucide-react"
import { useState } from "react"

export default function DataManagement() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleExportData = () => {
    const data = {
      queenCellAnalyses: 24,
      broodPatternAnalyses: 24,
      queenCellLogs: 12,
      exportDate: new Date().toISOString(),
    }
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ibrood-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Last Backup */}
      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-text-primary mb-2">Last Backup</h3>
            <p className="text-sm text-muted mb-2">Auto-backup: November 23, 2025 at 2:30 AM</p>
            <p className="text-xs text-success">All data backed up successfully</p>
          </div>
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-semibold text-text-primary">Export Data</h3>
              <p className="text-xs text-muted">Download your analysis data as JSON</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleExportData}
          className="w-full px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors"
        >
          Export as JSON
        </button>
      </div>

      {/* Import Data */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-semibold text-text-primary">Import Data</h3>
              <p className="text-xs text-muted">Restore data from a previous export</p>
            </div>
          </div>
        </div>
        <input
          type="file"
          accept=".json"
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-sm"
        />
      </div>

      {/* Auto Backup */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-semibold text-text-primary">Auto Backup</h3>
              <p className="text-xs text-muted">Automatically backup data daily</p>
            </div>
          </div>
          <button
            onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              autoBackupEnabled ? "bg-success" : "bg-border"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                autoBackupEnabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Clear All Data */}
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-text-primary mb-2">Clear All Data</h3>
            <p className="text-sm text-muted mb-4">
              Permanently delete all analyses, logs, and settings. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
              Delete All Data
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg border border-border p-6 max-w-sm w-full">
            <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">Delete All Data?</h3>
            <p className="text-sm text-muted mb-6">
              This will permanently erase all your analyses, logs, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg font-medium hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                }}
                className="flex-1 px-4 py-2 bg-danger text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
