"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Beef as Bee, Grid3X3, Calendar, 
  Clock, AlertTriangle, CheckCircle, ArrowRight, 
  Sparkles, Lightbulb, Database
} from "lucide-react"
import Navigation from "@/components/navigation"
import HiveHealthCard from "@/components/hive-health-card"
import Footer from "@/components/footer"
import { getLatestActivity, getTotalInspections, getAnalyses, getBroodAnalyses } from "@/lib/storage"
import { useTranslation } from "@/lib/translation-context"

export default function Dashboard() {
  const { t, language } = useTranslation()
  const [activity, setActivity] = useState<{ queen: any, brood: any }>({ queen: null, brood: null })
  const [recentAlerts, setRecentAlerts] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<string>('Beekeeper')
  const [storageStats, setStorageStats] = useState({
    queenAnalyses: 0,
    broodAnalyses: 0,
    queenLogs: 0,
    broodLogs: 0,
    totalItems: 0
  })

  useEffect(() => {
    // Get current user
    const user = localStorage.getItem('ibrood_current_user')
    if (user) {
      const parsed = JSON.parse(user)
      setCurrentUser(parsed.name || 'Beekeeper')
    }
    
    const loadData = () => {
      setActivity(getLatestActivity())
      
      // Load storage stats
      const queenAnalyses = getAnalyses()
      const broodAnalysis = getBroodAnalyses()
      const queenLogs = JSON.parse(localStorage.getItem('ibrood_queen_cell_logs') || '[]')
      const broodLogs = JSON.parse(localStorage.getItem('ibrood_brood_logs') || '[]')
      
      setStorageStats({
        queenAnalyses: queenAnalyses.length,
        broodAnalyses: broodAnalysis.length,
        queenLogs: queenLogs.length,
        broodLogs: broodLogs.length,
        totalItems: queenAnalyses.length + broodAnalysis.length + queenLogs.length + broodLogs.length
      })
      
      // Calculate alerts from REAL data only
      const healthScores = broodAnalysis.map(a => a.healthScore).filter(s => s > 0)
      const avgHealth = healthScores.length > 0 
        ? Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length) 
        : 0
      
      // Generate alerts based on real data
      const alerts: string[] = []
      if (queenAnalyses[0]?.maturityDistribution?.mature > 0) {
        alerts.push(`${queenAnalyses[0].maturityDistribution.mature} mature queen cell(s) detected`)
      }
      if (avgHealth > 0 && avgHealth < 70) {
        alerts.push('Brood health below optimal levels')
      }
      if (queenAnalyses.length === 0 && broodAnalysis.length === 0) {
        alerts.push('No analysis yet - analyze your hive to get started!')
      }
      
      setRecentAlerts(alerts)
    }
    
    loadData()
    
    // Listen for updates (real-time sync)
    window.addEventListener('storage', loadData)
    window.addEventListener('analysisUpdated', loadData)
    
    return () => {
      window.removeEventListener('storage', loadData)
      window.removeEventListener('analysisUpdated', loadData)
    }
  }, [])

  const getTimeAgo = (timestamp: number) => {
    if (!timestamp) return t('dashboard.noData')
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return t('dashboard.justNow')
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ${t('common.mago')}`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ${t('common.mago')}`
    const days = Math.floor(hours / 24)
    return `${days}d ${t('common.mago')}`
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('dashboard.goodMorning')
    if (hour < 18) return t('dashboard.goodAfternoon')
    return t('dashboard.goodEvening')
  }

  const today = new Date().toLocaleDateString(language === 'filipino' ? 'fil-PH' : 'en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main style={{ flex: '1' }} className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-amber-900 dark:text-amber-100">
                  {getGreeting()}, {currentUser}!
                </h1>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4" /> {today}
                </p>
              </div>
            </div>
          </div>
          <p className="text-amber-700/80 dark:text-amber-300/80 ml-14 hidden sm:block">
            {t('dashboard.assistant')}
          </p>
        </div>

        {/* Storage Overview - Compact */}
        <div className="mb-6 p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-amber-900 dark:text-amber-100">{t('dashboard.storageOverview')}</h3>
                <p className="text-xs text-amber-600 dark:text-amber-400">{storageStats.totalItems} {t('dashboard.totalRecords')}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3">
              <div className="text-center px-2 sm:px-4 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                <p className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-300">{storageStats.queenAnalyses}</p>
                <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">{t('dashboard.queenAI')}</p>
              </div>
              <div className="text-center px-2 sm:px-4 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                <p className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-300">{storageStats.broodAnalyses}</p>
                <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">{t('dashboard.broodAI')}</p>
              </div>
              <div className="text-center px-2 sm:px-4 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                <p className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-300">{storageStats.queenLogs}</p>
                <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">{t('dashboard.qLogs')}</p>
              </div>
              <div className="text-center px-2 sm:px-4 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                <p className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-300">{storageStats.broodLogs}</p>
                <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">{t('dashboard.bLogs')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions - Big Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <Link
            href="/queen-cell"
            className="group p-6 sm:p-8 bg-[#fce588] dark:bg-[#e8d06a] backdrop-blur-sm rounded-2xl border-2 border-[#f5da6a] dark:border-[#c9b454] hover:border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-white/40 dark:bg-white/25 rounded-2xl">
                <Bee className="w-8 h-8 text-amber-700 dark:text-amber-900" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-amber-800 dark:text-amber-900">{t('queenCell.title')}</h2>
                <p className="text-sm text-amber-700/80 dark:text-amber-800/80">{t('dashboard.aiPoweredDetection')}</p>
              </div>
            </div>
            <p className="text-amber-700/90 dark:text-amber-800/90 mb-4">{t('dashboard.queenCellDesc')}</p>
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-900 font-semibold">
              {t('dashboard.startAnalysis')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/brood-pattern"
            className="group p-6 sm:p-8 bg-[#fce588] dark:bg-[#e8d06a] backdrop-blur-sm rounded-2xl border-2 border-[#f5da6a] dark:border-[#c9b454] hover:border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-white/40 dark:bg-white/25 rounded-2xl">
                <Grid3X3 className="w-8 h-8 text-amber-700 dark:text-amber-900" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-amber-800 dark:text-amber-900">{t('brood.title')}</h2>
                <p className="text-sm text-amber-700/80 dark:text-amber-800/80">{t('dashboard.healthAssessment')}</p>
              </div>
            </div>
            <p className="text-amber-700/90 dark:text-amber-800/90 mb-4">{t('dashboard.broodPatternDesc')}</p>
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-900 font-semibold">
              {t('dashboard.startAnalysis')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Health & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="lg:col-span-2">
            <HiveHealthCard />
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" /> {t('dashboard.recentActivity')}
              </h3>
              <Link href="/history" className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium hover:underline">
                {t('dashboard.viewAll')} →
              </Link>
            </div>
            <div className="space-y-3">
              <Link 
                href="/history" 
                className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-800/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Bee className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800 dark:text-amber-200 group-hover:text-amber-900 dark:group-hover:text-amber-100">Queen Cell</span>
                </div>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded-lg">
                  {activity.queen ? getTimeAgo(activity.queen.timestamp) : t('dashboard.noData')}
                </span>
              </Link>
              <Link 
                href="/history" 
                className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-800/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800 dark:text-amber-200 group-hover:text-amber-900 dark:group-hover:text-amber-100">Brood Pattern</span>
                </div>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded-lg">
                  {activity.brood ? getTimeAgo(activity.brood.timestamp) : t('dashboard.noData')}
                </span>
              </Link>
              
              {/* Last Detection Summary - Clickable */}
              {activity.queen && (
                <Link href="/history" className="block mt-4 p-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-xl hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-800/40 dark:hover:to-orange-800/40 transition-colors cursor-pointer">
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">{t('dashboard.latestQueenDetection')}</p>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    {activity.queen.totalQueenCells} {t('dashboard.cellsFound')}
                  </p>
                </Link>
              )}
              
              {activity.brood && (
                <Link href="/history" className="block p-3 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 rounded-xl hover:from-yellow-200 hover:to-amber-200 dark:hover:from-yellow-800/40 dark:hover:to-amber-800/40 transition-colors cursor-pointer">
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">{t('dashboard.latestBroodDetection')}</p>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    {activity.brood.totalDetections} {t('dashboard.cells')} • {activity.brood.healthScore}% {t('dashboard.health')}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Alerts & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Alerts */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-5 sm:p-6">
            <h3 className="font-heading font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> {t('dashboard.alertsReminders')}
            </h3>
            {recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-orange-800 dark:text-orange-200">{alert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-200 dark:border-sky-800">
                <CheckCircle className="w-5 h-5 text-sky-500" />
                <span className="text-sm text-sky-800 dark:text-sky-200">{t('dashboard.allClear')}</span>
              </div>
            )}
          </div>

          {/* Getting Started */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-5 sm:p-6">
            <h3 className="font-heading font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" /> {t('dashboard.gettingStarted')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{t('dashboard.takePhoto')}</p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70">{t('dashboard.takePhotoDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{t('dashboard.chooseAnalysis')}</p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70">{t('dashboard.chooseAnalysisDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{t('dashboard.getInsights')}</p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70">{t('dashboard.getInsightsDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-2xl border border-amber-300 dark:border-amber-700 p-5 sm:p-6">
          <h3 className="font-heading font-bold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" /> {t('dashboard.tipTitle')}
          </h3>
          <p className="text-amber-800 dark:text-amber-200">
            {t('dashboard.tipContent')}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}