"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { getAnalyses, getBroodAnalyses, getTotalInspections } from "@/lib/storage"

export default function OverallTrends() {
  const [stats, setStats] = useState([
    { label: "Average Health Score", value: "--", change: "No data", icon: <TrendingUp className="w-5 h-5 text-amber-500" /> },
    { label: "Total Analysis", value: "0", change: "All time", icon: <CheckCircle className="w-5 h-5 text-orange-500" /> },
    { label: "Avg. Brood Coverage", value: "--", change: "No data", icon: <CheckCircle className="w-5 h-5 text-amber-600" /> },
    { label: "Queen Cells Detected", value: "0", change: "Total", icon: <Calendar className="w-5 h-5 text-orange-500" /> },
  ])
  const [healthTrendData, setHealthTrendData] = useState<any[]>([])
  const [queenCellData, setQueenCellData] = useState<any[]>([])
  const [alerts, setAlerts] = useState<string[]>([])
  const [positives, setPositives] = useState<string[]>([])

  useEffect(() => {
    loadAnalyticsData()
    
    // Listen for updates
    window.addEventListener('storage', loadAnalyticsData)
    window.addEventListener('analysisUpdated', loadAnalyticsData)
    
    return () => {
      window.removeEventListener('storage', loadAnalyticsData)
      window.removeEventListener('analysisUpdated', loadAnalyticsData)
    }
  }, [])

  const loadAnalyticsData = () => {
    const queenAnalyses = getAnalyses()
    const broodAnalyses = getBroodAnalyses()
    const totalInspections = getTotalInspections()

    // Calculate statistics from real data
    let avgHealthScore = 0
    let avgBroodCoverage = 0
    let totalQueenCells = 0
    const alertList: string[] = []
    const positiveList: string[] = []

    // Process brood analyses for health scores
    if (broodAnalyses.length > 0) {
      const healthScores = broodAnalyses.map(a => a.healthScore || 0).filter(s => s > 0)
      const coverages = broodAnalyses.map(a => a.broodCoverage || 0).filter(c => c > 0)
      
      if (healthScores.length > 0) {
        avgHealthScore = Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length)
      }
      if (coverages.length > 0) {
        avgBroodCoverage = Math.round(coverages.reduce((a, b) => a + b, 0) / coverages.length)
      }

      // Generate alerts based on data
      const latestBrood = broodAnalyses[0]
      if (latestBrood) {
        if (latestBrood.healthScore >= 80) {
          positiveList.push("Excellent brood health detected")
        } else if (latestBrood.healthScore >= 60) {
          positiveList.push("Good brood pattern observed")
        } else {
          alertList.push("Monitor brood pattern - below optimal health")
        }
        
        if (latestBrood.counts) {
          if (latestBrood.counts.egg > 0) positiveList.push(`${latestBrood.counts.egg} eggs detected - active laying`)
          if (latestBrood.counts.larva > 0) positiveList.push(`${latestBrood.counts.larva} larvae developing`)
        }
      }
    }

    // Process queen cell analyses
    if (queenAnalyses.length > 0) {
      totalQueenCells = queenAnalyses.reduce((sum, a) => sum + (a.totalQueenCells || 0), 0)
      
      const latestQueen = queenAnalyses[0]
      if (latestQueen) {
        const dist = latestQueen.maturityDistribution || {}
        if (dist.mature > 0) {
          alertList.push(`${dist.mature} mature queen cell(s) - plan management`)
        }
        if (dist.capped > 0 || dist['semi-mature'] > 0) {
          positiveList.push("Queen cells developing normally")
        }
        if (latestQueen.totalQueenCells > 0) {
          positiveList.push(`${latestQueen.totalQueenCells} queen cell(s) detected in last analysis`)
        }
      }
    }

    // Default messages if no data
    if (alertList.length === 0 && positiveList.length === 0) {
      alertList.push("No recent analysis data")
      alertList.push("Perform a queen cell or brood analysis to see insights")
    }
    if (positiveList.length === 0 && (queenAnalyses.length > 0 || broodAnalyses.length > 0)) {
      positiveList.push("Continue regular monitoring")
    }

    setAlerts(alertList)
    setPositives(positiveList)

    // Update stats
    setStats([
      { 
        label: "Average Health Score", 
        value: avgHealthScore > 0 ? avgHealthScore.toString() : "--", 
        change: avgHealthScore >= 80 ? "Excellent" : avgHealthScore >= 60 ? "Good" : avgHealthScore > 0 ? "Fair" : "No data",
        icon: <TrendingUp className="w-5 h-5 text-amber-500" /> 
      },
      { 
        label: "Total Analyses", 
        value: totalInspections.toString(), 
        change: "All time",
        icon: <CheckCircle className="w-5 h-5 text-orange-500" /> 
      },
      { 
        label: "Queen Cells Detected", 
        value: totalQueenCells.toString(), 
        change: "Total",
        icon: <Calendar className="w-5 h-5 text-orange-500" /> 
      },
    ])

    // Prepare health trend data with brood counts (eggs + larvae + pupae)
    const healthDataRaw = broodAnalyses.slice(0, 10).reverse().map((analysis, index) => {
      const counts = analysis.counts || {}
      const broodCount = (counts.egg || 0) + (counts.larva || 0) + (counts.pupa || 0)
      return {
        date: new Date(analysis.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        healthScore: analysis.healthScore || 0,
        broodCount: broodCount
      }
    })
    setHealthTrendData(healthDataRaw.length > 0 ? healthDataRaw : [])
  }

  // Bee-themed chart colors
  const chartColors = {
    primary: "#F59E0B",
    secondary: "#A67C52",
    accent: "#DC2626",
    muted: "#FCD34D",
    success: "#D97706",
    brown: "#6F4E37",
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-amber-700">{stat.label}</h3>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-amber-900 mb-2">{stat.value}</p>
            <p className="text-xs text-amber-600">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Health Score & Queen Cells Trend */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 mb-6">Health Score & Queen Cells Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={healthTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
            <XAxis dataKey="date" stroke="#92400E" style={{ fontSize: "12px" }} />
            <YAxis stroke="#92400E" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFBEB",
                border: "1px solid #FCD34D",
                borderRadius: "12px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="healthScore"
              stroke={chartColors.primary}
              strokeWidth={3}
              dot={{ fill: chartColors.primary, r: 5 }}
              activeDot={{ r: 7 }}
              name="Health Score"
            />
            <Line
              type="monotone"
              dataKey="broodCount"
              stroke={chartColors.accent}
              strokeWidth={3}
              dot={{ fill: chartColors.accent, r: 5 }}
              activeDot={{ r: 7 }}
              name="Brood Count"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Queen Cell Trend */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 mb-6">Queen Cell Development Over Time</h3>
        {queenCellData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={queenCellData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
              <XAxis dataKey="date" stroke="#92400E" style={{ fontSize: "12px" }} />
              <YAxis stroke="#92400E" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFBEB",
                  border: "1px solid #FCD34D",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="mature" stackId="a" fill={chartColors.accent} name="Mature" radius={[4, 4, 0, 0]} />
              <Bar dataKey="semiMature" stackId="a" fill={chartColors.primary} name="Semi-Mature" />
              <Bar dataKey="capped" stackId="a" fill={chartColors.muted} name="Capped" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-amber-600/70 bg-amber-50/50 rounded-xl">
            <div className="text-center">
              <p className="font-medium">No queen cell analysis data yet</p>
              <p className="text-sm mt-1">Perform queen cell analyses to see trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Alerts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-300 p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <h3 className="font-heading font-semibold text-amber-900">Alerts & Notes</h3>
          </div>
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="text-sm text-amber-800">• {alert}</li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-300 p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <h3 className="font-heading font-semibold text-amber-900">Positive Indicators</h3>
          </div>
          <ul className="space-y-2">
            {positives.map((positive, index) => (
              <li key={index} className="text-sm text-amber-800">• {positive}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
