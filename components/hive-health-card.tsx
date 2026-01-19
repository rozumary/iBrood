"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Zap, Activity, Home } from "lucide-react"
import { getOverallHealthData } from "@/lib/storage"
import { useTranslation } from "@/lib/translation-context"

export default function HiveHealthCard() {
  const { t } = useTranslation()
  const [healthData, setHealthData] = useState({
    healthScore: 0,
    healthStatus: 'Unknown',
    queenCellInfo: { count: 0, mature: 0 },
    broodCoverage: 0,
    alert: { title: 'No Recent Data', message: 'Perform an analysis to see health overview' },
    hasData: false
  })

  useEffect(() => {
    // Load health data from storage
    const data = getOverallHealthData()
    setHealthData(data)
    
    // Listen for storage changes (when new analysis is saved)
    const handleStorageChange = () => {
      setHealthData(getOverallHealthData())
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom event for same-tab updates
    window.addEventListener('analysisUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('analysisUpdated', handleStorageChange)
    }
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-br from-sky-400 to-blue-600'
    if (score >= 60) return 'bg-[#FFA95C]'
    if (score >= 40) return 'bg-gradient-to-br from-amber-500 to-amber-600'
    return 'bg-gradient-to-br from-orange-500 to-orange-600'
  }

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'EXCELLENT': return t('brood.excellent')
      case 'GOOD': return t('brood.good')
      case 'FAIR': return t('brood.fair')
      case 'POOR': return t('brood.poor')
      default: return status || 'Unknown'
    }
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-8 shadow-sm">
      <h3 className="font-heading font-bold text-lg mb-6 text-amber-900 dark:text-amber-100 flex items-center gap-2">
        <Home className="w-5 h-5 text-amber-600" /> {t('dashboard.overview')}
      </h3>

      <div className="space-y-6">
        {/* Health Score */}
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0">
            <div className={`flex items-center justify-center h-20 w-20 rounded-2xl ${getScoreColor(healthData.healthScore)} shadow-lg`}>
              <span className="text-3xl font-bold text-white">
                {healthData.hasData ? healthData.healthScore : '--'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-amber-700/70 dark:text-amber-400/70 mb-1">Hive Health Score</p>
            <p className="text-amber-900 dark:text-amber-100 font-semibold text-lg">{getStatusText(healthData.healthStatus)}</p>
            <p className="text-xs text-amber-600/60 dark:text-amber-400/60 mt-2">Based on brood pattern and queen activity</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
            <CheckCircle className={`w-6 h-6 ${healthData.queenCellInfo.count > 0 ? 'text-sky-500' : 'text-amber-400'}`} />
            <div>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70">Queen Cells</p>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                {healthData.queenCellInfo.count > 0 
                  ? `${healthData.queenCellInfo.mature > 0 ? healthData.queenCellInfo.mature + ' Mature' : healthData.queenCellInfo.count + ' Detected'}`
                  : 'No data'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
            <Zap className={`w-6 h-6 ${healthData.broodCoverage > 0 ? 'text-amber-500' : 'text-amber-400'}`} />
            <div>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70">Brood Coverage</p>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                {healthData.broodCoverage > 0 ? `${healthData.broodCoverage}%` : 'No data'}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${
          healthData.hasData 
            ? healthData.healthScore >= 80 
              ? 'bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-700/50' 
              : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50'
            : 'bg-amber-50/50 border-amber-200/50 dark:bg-amber-900/10 dark:border-amber-700/30'
        }`}>
          {healthData.hasData ? (
            healthData.healthScore >= 80 
              ? <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
              : <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          ) : (
            <Activity className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-sm text-amber-900 dark:text-amber-100">{healthData.alert.title}</p>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-1">{healthData.alert.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
