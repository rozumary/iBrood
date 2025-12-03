"use client"

import { Calendar, TrendingUp, Trash2 } from "lucide-react"
import { useState } from "react"

interface HistoryEntry {
  id: number
  date: string
  healthScore: number
  broodCoverage: number
  riskLevel: "low" | "medium" | "high"
  cellTypes: {
    larva: number
    pupa: number
    dead: number
  }
}

export default function BroodHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 1,
      date: "2025-11-20",
      healthScore: 78,
      broodCoverage: 85,
      riskLevel: "medium",
      cellTypes: { larva: 35, pupa: 28, dead: 5 },
    },
    {
      id: 2,
      date: "2025-11-18",
      healthScore: 82,
      broodCoverage: 88,
      riskLevel: "low",
      cellTypes: { larva: 38, pupa: 30, dead: 3 },
    },
    {
      id: 3,
      date: "2025-11-15",
      healthScore: 75,
      broodCoverage: 80,
      riskLevel: "medium",
      cellTypes: { larva: 32, pupa: 26, dead: 8 },
    },
  ])

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return "bg-sky-100 text-success"
      case "medium":
        return "bg-yellow-100 text-warning"
      case "high":
        return "bg-red-100 text-danger"
      default:
        return "bg-gray-100 text-muted"
    }
  }

  const deleteEntry = (id: number) => {
    setHistory(history.filter((entry) => entry.id !== id))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-semibold">Brood Pattern History</h2>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <p className="text-muted">No brood pattern history yet. Start analyzing frames to see results here.</p>
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-text-primary">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRiskBadge(entry.riskLevel)}`}
                    >
                      {entry.riskLevel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-muted mb-1">Health Score</p>
                  <p className="text-2xl font-bold text-text-primary">{entry.healthScore}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Brood Coverage</p>
                  <p className="text-2xl font-bold text-text-primary">{entry.broodCoverage}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Larvae</p>
                  <p className="text-2xl font-bold text-blue-500">{entry.cellTypes.larva}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Pupae</p>
                  <p className="text-2xl font-bold text-purple-500">{entry.cellTypes.pupa}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Dead Cells</p>
                  <p className="text-2xl font-bold text-red-500">{entry.cellTypes.dead}%</p>
                </div>
              </div>

              {/* Mini trend indicator */}
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-success">
                <TrendingUp size={16} />
                Score has been stable
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
