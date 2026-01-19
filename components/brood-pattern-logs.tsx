"use client"

import { Trash2, Plus, Calendar, X, MapPin, ClipboardList, Egg, Bug, CircleDot, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

interface BroodLog {
  id: number
  date: string
  hiveId: string
  healthScore: number
  broodCoverage: number
  eggPresence: boolean
  larvaPresence: boolean
  pupaPresence: boolean
  queenSpotted: boolean
  notes: string
}

const LOGS_STORAGE_KEY = 'ibrood_brood_logs'

// Modal Component with portal for full-screen blur
function AddBroodLogModal({ 
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
    hiveId: '',
    healthScore: 80,
    broodCoverage: 75,
    eggPresence: true,
    larvaPresence: true,
    pupaPresence: true,
    queenSpotted: false,
    notes: ''
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

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!newLog.hiveId.trim()) {
      setErrorMsg('Please enter a Hive ID / Palatandaan')
      setTimeout(() => setErrorMsg(null), 3000)
      return
    }
    onAdd(newLog)
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      hiveId: '',
      healthScore: 80,
      broodCoverage: 75,
      eggPresence: true,
      larvaPresence: true,
      pupaPresence: true,
      queenSpotted: false,
      notes: ''
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
          <h3 className="text-xl font-heading font-bold text-amber-900 dark:text-amber-100">Add Brood Observation</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
          >
            <X size={20} className="text-amber-600 dark:text-amber-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          {/* Hive ID */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">
              <MapPin size={14} className="inline mr-1" />
              Hive ID / Palatandaan *
            </label>
            <input
              type="text"
              value={newLog.hiveId}
              onChange={(e) => setNewLog({...newLog, hiveId: e.target.value})}
              placeholder="e.g., Hive A, Box #1"
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

          {/* Health Score */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">
              Health Score: {newLog.healthScore}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newLog.healthScore}
              onChange={(e) => setNewLog({...newLog, healthScore: parseInt(e.target.value)})}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Brood Coverage */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">
              Brood Coverage: {newLog.broodCoverage}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newLog.broodCoverage}
              onChange={(e) => setNewLog({...newLog, broodCoverage: parseInt(e.target.value)})}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Cell Presence Checkboxes */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <input
                type="checkbox"
                checked={newLog.eggPresence}
                onChange={(e) => setNewLog({...newLog, eggPresence: e.target.checked})}
                className="w-4 h-4 accent-amber-600"
              />
              <Egg size={16} className="text-amber-700 dark:text-amber-400" />
              <span className="text-sm text-amber-800 dark:text-amber-200">Eggs</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <input
                type="checkbox"
                checked={newLog.larvaPresence}
                onChange={(e) => setNewLog({...newLog, larvaPresence: e.target.checked})}
                className="w-4 h-4 accent-amber-600"
              />
              <Bug size={16} className="text-amber-700 dark:text-amber-400" />
              <span className="text-sm text-amber-800 dark:text-amber-200">Larvae</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <input
                type="checkbox"
                checked={newLog.pupaPresence}
                onChange={(e) => setNewLog({...newLog, pupaPresence: e.target.checked})}
                className="w-4 h-4 accent-amber-600"
              />
              <CircleDot size={16} className="text-amber-700 dark:text-amber-400" />
              <span className="text-sm text-amber-800 dark:text-amber-200">Pupae</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <input
                type="checkbox"
                checked={newLog.queenSpotted}
                onChange={(e) => setNewLog({...newLog, queenSpotted: e.target.checked})}
                className="w-4 h-4 accent-amber-600"
              />
              <span className="text-amber-700 dark:text-amber-400">👑</span>
              <span className="text-sm text-amber-800 dark:text-amber-200">Queen Seen</span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-1.5">Notes</label>
            <textarea
              value={newLog.notes}
              onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
              placeholder="Any observations about the brood pattern..."
              rows={3}
              className="w-full px-4 py-2.5 border border-amber-200 dark:border-amber-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-amber-100 resize-none placeholder:text-amber-400 dark:placeholder:text-amber-600"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl font-semibold hover:from-amber-800 hover:to-amber-900 transition-all shadow-md hover:shadow-lg mt-2"
          >
            Add Entry
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function BroodPatternLogs() {
  const [logs, setLogs] = useState<BroodLog[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  // Load logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY)
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs))
    }
  }, [])

  // Save logs to localStorage
  const saveLogs = (updatedLogs: BroodLog[]) => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs))
    setLogs(updatedLogs)
    window.dispatchEvent(new Event('analysisUpdated'))
  }

  const handleAddLog = (newLog: any) => {
    const log: BroodLog = {
      id: Date.now(),
      date: newLog.date,
      hiveId: newLog.hiveId,
      healthScore: newLog.healthScore,
      broodCoverage: newLog.broodCoverage,
      eggPresence: newLog.eggPresence,
      larvaPresence: newLog.larvaPresence,
      pupaPresence: newLog.pupaPresence,
      queenSpotted: newLog.queenSpotted,
      notes: newLog.notes || `Brood observation in ${newLog.hiveId}`
    }

    saveLogs([log, ...logs])
    setShowAddModal(false)
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700"
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
    return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
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
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl font-medium hover:from-amber-800 hover:to-amber-900 transition-all shadow-md hover:shadow-lg text-sm"
        >
          <Plus size={18} />
          Add Brood Log
        </button>
      </div>

      {/* Modal via Portal */}
      <AddBroodLogModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={handleAddLog}
      />

      {/* Logs List - Scrollable */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-8 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/30 dark:border-amber-700/30">
            <ClipboardList className="w-10 h-10 text-amber-400 dark:text-amber-600 mx-auto mb-2" />
            <p className="text-amber-700/70 dark:text-amber-400/70 text-sm">No brood logs yet.</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">Click &quot;Add Brood Log&quot; to start tracking</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-amber-800/5 dark:bg-amber-900/20 rounded-xl border border-amber-300/30 dark:border-amber-700/30 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-xs border ${getHealthColor(log.healthScore)}`}>
                      {log.healthScore}% Health
                    </span>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <MapPin size={10} />
                      {log.hiveId}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <p className="text-amber-700/60 dark:text-amber-400/60">Observed</p>
                      <p className="text-amber-900 dark:text-amber-100 font-medium">{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-amber-700/60 dark:text-amber-400/60">Coverage</p>
                      <p className="text-amber-900 dark:text-amber-100 font-medium">{log.broodCoverage}%</p>
                    </div>
                  </div>
                  {/* Presence indicators */}
                  <div className="flex gap-1.5 flex-wrap">
                    {log.eggPresence && (
                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-1">
                        <Egg size={10} /> Egg
                      </span>
                    )}
                    {log.larvaPresence && (
                      <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full flex items-center gap-1">
                        <Bug size={10} /> Larva
                      </span>
                    )}
                    {log.pupaPresence && (
                      <span className="text-xs px-1.5 py-0.5 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-full flex items-center gap-1">
                        <CircleDot size={10} /> Pupa
                      </span>
                    )}
                    {log.queenSpotted && (
                      <span className="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full">
                        👑 Queen
                      </span>
                    )}
                  </div>
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
