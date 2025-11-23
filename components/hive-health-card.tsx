"use client"

import { AlertCircle, CheckCircle, Zap } from "lucide-react"

export default function HiveHealthCard() {
  return (
    <div className="bg-gradient-to-br from-surface to-surface-hover rounded-lg border border-border p-8">
      <h3 className="font-heading font-semibold text-lg mb-6">Colony Health Overview</h3>

      <div className="space-y-6">
        {/* Health Score */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent">
              <span className="text-2xl font-bold text-white">78</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Hive Health Score</p>
            <p className="text-text-primary font-medium">Good</p>
            <p className="text-xs text-muted mt-2">Based on brood pattern and queen activity</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="text-xs text-muted">Queen Cells</p>
              <p className="font-semibold">2 Mature</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
            <Zap className="w-5 h-5 text-warning" />
            <div>
              <p className="text-xs text-muted">Brood Coverage</p>
              <p className="font-semibold">85%</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-text-primary">Monitor Closely</p>
            <p className="text-xs text-muted mt-1">Consider additional feeding to support brood development</p>
          </div>
        </div>
      </div>
    </div>
  )
}
