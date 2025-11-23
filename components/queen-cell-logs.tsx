"use client"

import { Trash2, Plus, Calendar } from "lucide-react"
import { useState } from "react"

interface QueenCellLog {
  id: number
  date: string
  estimatedHatchDate: string
  status: "open" | "capped" | "semi-mature" | "mature" | "emerged"
  notes: string
  daysOld: number
}

export default function QueenCellLogs() {
  const [logs, setLogs] = useState<QueenCellLog[]>([
    {
      id: 1,
      date: "2024-11-24",
      estimatedHatchDate: "2024-11-26",
      status: "mature",
      notes: "Conical tip visible, ready for emergence",
      daysOld: 8,
    },
    {
      id: 2,
      date: "2024-11-20",
      estimatedHatchDate: "2024-11-27",
      status: "semi-mature",
      notes: "Uniform color development",
      daysOld: 6,
    },
    {
      id: 3,
      date: "2024-11-18",
      estimatedHatchDate: "2024-11-30",
      status: "capped",
      notes: "Cell capped, sealed transition",
      daysOld: 3,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "mature":
        return "bg-green-100 text-success"
      case "semi-mature":
        return "bg-yellow-100 text-warning"
      case "capped":
        return "bg-blue-100 text-info"
      case "open":
        return "bg-gray-100 text-muted"
      case "emerged":
        return "bg-purple-100 text-purple-600"
      default:
        return "bg-gray-100 text-muted"
    }
  }

  const deleteLog = (id: number) => {
    setLogs(logs.filter((log) => log.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-semibold">Queen Cell Tracking</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors">
          <Plus size={20} />
          Add Log Entry
        </button>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <p className="text-muted">No queen cell logs yet. Start tracking queen cells to see them here.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs capitalize ${getStatusColor(log.status)}`}
                    >
                      {log.status.replace("-", " ")}
                    </span>
                    <span className="text-sm text-muted font-medium">{log.daysOld} days old</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted mb-1">Observation Date</p>
                      <p className="flex items-center gap-2 text-text-primary font-medium">
                        <Calendar size={16} />
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Estimated Hatch Date</p>
                      <p className="flex items-center gap-2 text-text-primary font-medium">
                        <Calendar size={16} />
                        {new Date(log.estimatedHatchDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-text-primary bg-surface-hover p-3 rounded-lg">{log.notes}</p>
                </div>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
