"use client"

import { History, Crown, Grid3X3, Trash2, Calendar, MapPin, ClipboardList, Scan } from "lucide-react"
import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import QueenCellLogs from "@/components/queen-cell-logs"
import BroodPatternLogs from "@/components/brood-pattern-logs"
import { getAnalyses, getBroodAnalyses } from "@/lib/storage"

interface QueenCellAnalysis {
  id: string
  timestamp: number
  totalQueenCells: number
  maturityDistribution: any
  recommendations: string[]
}

interface BroodAnalysis {
  id: string
  timestamp: number
  totalDetections: number
  counts: { egg: number; larva: number; pupa: number }
  healthScore: number
  healthStatus: string
  broodCoverage: number
}

export default function HistoryPage() {
  const [queenAnalyses, setQueenAnalyses] = useState<QueenCellAnalysis[]>([])
  const [broodAnalyses, setBroodAnalyses] = useState<BroodAnalysis[]>([])

  useEffect(() => {
    const loadData = () => {
      setQueenAnalyses(getAnalyses())
      setBroodAnalyses(getBroodAnalyses())
    }
    loadData()

    window.addEventListener('storage', loadData)
    window.addEventListener('analysisUpdated', loadData)
    return () => {
      window.removeEventListener('storage', loadData)
      window.removeEventListener('analysisUpdated', loadData)
    }
  }, [])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-sky-600 bg-sky-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const deleteQueenAnalysis = (id: string) => {
    const updated = queenAnalyses.filter(a => a.id !== id)
    localStorage.setItem('ibrood_queen_cell_analyses', JSON.stringify(updated))
    setQueenAnalyses(updated)
    window.dispatchEvent(new Event('analysisUpdated'))
  }

  const deleteBroodAnalysis = (id: string) => {
    const updated = broodAnalyses.filter(a => a.id !== id)
    localStorage.setItem('ibrood_brood_analyses', JSON.stringify(updated))
    setBroodAnalyses(updated)
    window.dispatchEvent(new Event('analysisUpdated'))
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main style={{ flex: '1' }} className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl">
              <History className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">History</h1>
          </div>
          <p className="text-amber-700/70 dark:text-amber-300/70 ml-12 sm:ml-14 text-sm sm:text-base">
            View AI analysis results and manual tracking logs
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN - Queen Cell */}
          <div className="space-y-6">
            {/* Queen Cell Analysis History (AI) */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50">
              <div className="p-4 sm:p-5 border-b border-amber-200/50 dark:border-amber-700/50 bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-t-2xl">
                <h2 className="font-heading font-bold text-lg text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Scan className="w-4 h-4 text-white" />
                  </div>
                  Queen Cell Analysis
                  <span className="text-xs font-normal text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full ml-auto">AI Detection</span>
                </h2>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                {queenAnalyses.length === 0 ? (
                  <div className="text-center py-8">
                    <Crown className="w-10 h-10 text-amber-300 dark:text-amber-600 mx-auto mb-2" />
                    <p className="text-amber-600/70 dark:text-amber-400/70 text-sm">No AI analysis yet</p>
                    <p className="text-xs text-amber-500 dark:text-amber-500">Run Queen Cell detection to see results</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queenAnalyses.map((analysis) => (
                      <div key={analysis.id} className="p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/30 dark:border-amber-700/30 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(analysis.timestamp)}
                          </span>
                          <button onClick={() => deleteQueenAnalysis(analysis.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{analysis.totalQueenCells}</div>
                          <div className="text-xs text-amber-600 dark:text-amber-400">Queen Cells</div>
                        </div>
                        {analysis.maturityDistribution && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {Object.entries(analysis.maturityDistribution).map(([stage, count]) => (
                              count ? (
                                <span key={stage} className="text-xs px-2 py-0.5 bg-white dark:bg-gray-700 rounded-full border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                                  {stage}: {String(count)}
                                </span>
                              ) : null
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Queen Cell Logs (Manual) */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50">
              <div className="p-4 sm:p-5 border-b border-amber-200/50 dark:border-amber-700/50 bg-gradient-to-r from-orange-100/50 to-amber-100/50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-t-2xl">
                <h2 className="font-heading font-bold text-lg text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <ClipboardList className="w-4 h-4 text-white" />
                  </div>
                  Queen Cell Logs
                  <span className="text-xs font-normal text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full ml-auto">Manual Tracking</span>
                </h2>
              </div>
              <div className="p-4">
                <QueenCellLogs />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Brood Pattern */}
          <div className="space-y-6">
            {/* Brood Analysis History (AI) */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50">
              <div className="p-4 sm:p-5 border-b border-amber-200/50 dark:border-amber-700/50 bg-gradient-to-r from-yellow-100/50 to-amber-100/50 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-t-2xl">
                <h2 className="font-heading font-bold text-lg text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <Scan className="w-4 h-4 text-white" />
                  </div>
                  Brood Pattern Analysis
                  <span className="text-xs font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full ml-auto">AI Detection</span>
                </h2>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                {broodAnalyses.length === 0 ? (
                  <div className="text-center py-8">
                    <Grid3X3 className="w-10 h-10 text-yellow-300 dark:text-yellow-600 mx-auto mb-2" />
                    <p className="text-amber-600/70 dark:text-amber-400/70 text-sm">No AI analysis yet</p>
                    <p className="text-xs text-amber-500 dark:text-amber-500">Run Brood Pattern detection to see results</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {broodAnalyses.map((analysis) => (
                      <div key={analysis.id} className="p-3 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200/30 dark:border-yellow-700/30 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(analysis.timestamp)}
                          </span>
                          <button onClick={() => deleteBroodAnalysis(analysis.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <div>
                            <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{analysis.totalDetections}</div>
                            <div className="text-xs text-amber-600 dark:text-amber-400">Total Cells</div>
                          </div>
                          <div>
                            <div className={`text-xl font-bold ${analysis.healthScore >= 80 ? 'text-sky-600 dark:text-sky-400' : analysis.healthScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{analysis.healthScore}%</div>
                            <div className="text-xs text-amber-600 dark:text-amber-400">Health</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{analysis.broodCoverage}%</div>
                            <div className="text-xs text-amber-600 dark:text-amber-400">Coverage</div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">Egg: {analysis.counts?.egg || 0}</span>
                          <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">Larva: {analysis.counts?.larva || 0}</span>
                          <span className="text-xs px-2 py-0.5 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-full">Pupa: {analysis.counts?.pupa || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Brood Pattern Logs (Manual) - Brown Theme */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50">
              <div className="p-4 sm:p-5 border-b border-amber-300/50 dark:border-amber-700/50 bg-gradient-to-r from-amber-200/50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 rounded-t-2xl">
                <h2 className="font-heading font-bold text-lg text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <div className="p-2 bg-amber-700 rounded-lg">
                    <ClipboardList className="w-4 h-4 text-white" />
                  </div>
                  Brood Pattern Logs
                  <span className="text-xs font-normal text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full ml-auto">Manual Tracking</span>
                </h2>
              </div>
              <div className="p-4">
                <BroodPatternLogs />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}