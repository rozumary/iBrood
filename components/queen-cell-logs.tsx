"use client"

import { Trash2, Plus, Calendar, X, MapPin, Clock, ClipboardList } from "lucide-react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

interface QueenCellLog {
  id: number
  date: string
  estimatedHatchDate: string
  status: "open" | "capped" | "semi-mature" | "mature" | "emerged"
  notes: string
  daysOld: number
  hiveId: string
  queenBirthday?: string
  queenAge?: number
}

const LOGS_STORAGE_KEY = 'ibrood_queen_cell_logs'

// Modal Component that renders via portal for full-screen blur effect
function AddLogModal({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean
  onClose: () => void
  onAdd: (log: any) => void 
}) {
  const [mounted, setMounted] = useState(false)
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'capped' as const,
    notes: '',
    hiveId: '',
    queenBirthday: '',
    daysOld: 0
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (!newLog.hiveId.trim()) {
      alert('Please enter a Hive ID / Palatandaan')
      return
    }
    onAdd(newLog)
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      status: 'capped',
      notes: '',
      hiveId: '',
      queenBirthday: '',
      daysOld: 0
    })
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content - Centered */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-amber-200 dark:border-amber-700/50 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-bold text-amber-900 dark:text-amber-100">Add Queen Cell Entry</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
          >
            <X size={20} className="text-amber-600 dark:text-amber-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Hive ID / Palatandaan */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">
              <MapPin size={14} className="inline mr-1" />
              Hive ID / Palatandaan *
            </label>
            <input
              type="text"
              value={newLog.hiveId}
              onChange={(e) => setNewLog({...newLog, hiveId: e.target.value})}
              placeholder="e.g., Hive A, Box #1, Palatandaan sa Kanan"
              className="w-full px-4 py-2.5 border border-amber-200 dark:border-amber-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100 placeholder:text-amber-400 dark:placeholder:text-amber-600"
            />
          </div>

          {/* Observation Date */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">
              <Calendar size={14} className="inline mr-1" />
              Observation Date
            </label>
            <input
              type="date"
              value={newLog.date}
              onChange={(e) => setNewLog({...newLog, date: e.target.value})}
              className="w-full px-4 py-2.5 border border-amber-200 dark:border-amber-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100"
            />
          </div>

          {/* Cell Status */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">Cell Status</label>
            <select
              value={newLog.status}
              onChange={(e) => setNewLog({...newLog, status: e.target.value as any})}
              className="w-full px-4 py-2.5 border border-amber-200 dark:border-amber-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100"
            >
              <option value="open">Open</option>
              <option value="capped">Capped</option>
              <option value="semi-mature">Semi-Mature</option>
              <option value="mature">Mature</option>
              <option value="emerged">Emerged</option>
            </select>
          </div>

          {/* Cell Age (Days Old) */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">
              <Clock size={14} className="inline mr-1" />
              Cell Age (Days Old)
            </label>
            <input
              type="number"
              min="0"
              max="16"
              value={newLog.daysOld}
              onChange={(e) => setNewLog({...newLog, daysOld: parseInt(e.target.value) || 0})}
              placeholder="0-16 days"
              className="w-full px-4 py-2.5 border border-amber-200 dark:border-amber-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100"
            />
          </div>

          {/* Queen Birthday (Optional) */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">
              <Calendar size={14} className="inline mr-1" />
              Queen Birthday / Hatch Date (Optional)
            </label>
            <input
              type="date"
              value={newLog.queenBirthday}
              onChange={(e) => setNewLog({...newLog, queenBirthday: e.target.value})}
              className="w-full px-4 py-2.5 border border-amber-200 dark:border-amber-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100"
            />
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">If this queen has emerged, record her birthday</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">Notes</label>
            <textarea
              value={newLog.notes}
              onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
              placeholder="Any observations about this queen cell..."
              rows={3}
              className="w-full px-4 py-2.5 border border-amber-200 dark:border-amber-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100 resize-none placeholder:text-amber-400 dark:placeholder:text-amber-600"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg mt-2"
          >
            Add Entry
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function QueenCellLogs() {
  const [logs, setLogs] = useState<QueenCellLog[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  // Load logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY)
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs))
    }
  }, [])

  // Save logs to localStorage
  const saveLogs = (updatedLogs: QueenCellLog[]) => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs))
    setLogs(updatedLogs)
    window.dispatchEvent(new Event('analysisUpdated'))
  }

  const calculateEstimatedHatchDate = (observationDate: string, status: string, daysOld: number): string => {
    const baseDate = new Date(observationDate)
    let daysToHatch = 0
    
    switch (status) {
      case 'open': daysToHatch = 13 - daysOld; break
      case 'capped': daysToHatch = 8 - daysOld; break
      case 'semi-mature': daysToHatch = 4 - daysOld; break
      case 'mature': daysToHatch = 2 - daysOld; break
      default: daysToHatch = 0
    }
    
    if (daysToHatch < 0) daysToHatch = 0
    baseDate.setDate(baseDate.getDate() + daysToHatch)
    return baseDate.toISOString().split('T')[0]
  }

  const calculateQueenAge = (birthday: string): number => {
    if (!birthday) return 0
    const birth = new Date(birthday)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - birth.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleAddLog = (newLog: any) => {
    const estimatedHatchDate = calculateEstimatedHatchDate(newLog.date, newLog.status, newLog.daysOld)
    const queenAge = newLog.queenBirthday ? calculateQueenAge(newLog.queenBirthday) : undefined

    const log: QueenCellLog = {
      id: Date.now(),
      date: newLog.date,
      estimatedHatchDate,
      status: newLog.status,
      notes: newLog.notes || `Queen cell observed in Hive ${newLog.hiveId}`,
      daysOld: newLog.daysOld,
      hiveId: newLog.hiveId,
      queenBirthday: newLog.queenBirthday || undefined,
      queenAge
    }

    saveLogs([log, ...logs])
    setShowAddModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "mature":
        return "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700"
      case "semi-mature":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
      case "capped":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
      case "open":
        return "bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
      case "emerged":
        return "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
    }
  }

  const deleteLog = (id: number) => {
    saveLogs(logs.filter((log) => log.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Add Log Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg text-sm"
        >
          <Plus size={18} />
          Add Queen Log
        </button>
      </div>

      {/* Modal via Portal - Full screen blur */}
      <AddLogModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={handleAddLog}
      />

      {/* Logs List - Scrollable */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-8 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/30 dark:border-amber-700/30">
            <ClipboardList className="w-10 h-10 text-amber-300 dark:text-amber-600 mx-auto mb-2" />
            <p className="text-amber-600/70 dark:text-amber-400/70 text-sm">No queen cell logs yet.</p>
            <p className="text-xs text-amber-500 dark:text-amber-500 mt-1">Click &quot;Add Queen Log&quot; to start tracking</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-amber-50/30 dark:bg-amber-900/20 rounded-xl border border-amber-200/30 dark:border-amber-700/30 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-xs capitalize border ${getStatusColor(log.status)}`}>
                      {log.status.replace("-", " ")}
                    </span>
                    {log.hiveId && (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <MapPin size={10} />
                        {log.hiveId}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <p className="text-amber-700/60 dark:text-amber-400/60">Observed</p>
                      <p className="text-amber-900 dark:text-amber-100 font-medium">{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-amber-700/60 dark:text-amber-400/60">Est. Hatch</p>
                      <p className="text-amber-900 dark:text-amber-100 font-medium">{new Date(log.estimatedHatchDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50/50 dark:bg-amber-900/30 p-2 rounded-lg line-clamp-2">{log.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
