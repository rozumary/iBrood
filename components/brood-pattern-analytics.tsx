"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingDown } from "lucide-react"
import { getBroodAnalyses } from "@/lib/storage"

export default function BroodPatternAnalytics() {
  const [stats, setStats] = useState({
    avgHealthScore: 0,
    avgBroodCoverage: 0,
    totalAnalyses: 0,
    totalEggs: 0,
    totalLarvae: 0,
    totalPupae: 0
  })
  const [broodTrendData, setBroodTrendData] = useState<any[]>([])
  const [healthScoreData, setHealthScoreData] = useState<any[]>([])
  const [cellComposition, setCellComposition] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])

  // Bee-themed chart colors
  const chartColors = {
    larvae: "tomato", // Changed to tomato for better distinction
    pupae: "#A67C52",
    eggs: "#FBBF24",
    empty: "#FCD34D",
    dead: "#DC2626",
    nectar: "#6F4E37",
  }

  useEffect(() => {
    loadBroodData()
    
    window.addEventListener('storage', loadBroodData)
    window.addEventListener('analysisUpdated', loadBroodData)
    
    return () => {
      window.removeEventListener('storage', loadBroodData)
      window.removeEventListener('analysisUpdated', loadBroodData)
    }
  }, [])

  const loadBroodData = () => {
    const analyses = getBroodAnalyses()
    
    if (analyses.length === 0) {
      setRecommendations(["No brood analysis data yet", "Perform analysis to see insights"])
      return
    }

    // Calculate totals
    let totalHealth = 0
    let totalCoverage = 0
    let totalEggs = 0
    let totalLarvae = 0
    let totalPupae = 0

    analyses.forEach(analysis => {
      totalHealth += analysis.healthScore || 0
      totalCoverage += analysis.broodCoverage || 0
      if (analysis.counts) {
        totalEggs += analysis.counts.egg || 0
        totalLarvae += analysis.counts.larva || 0
        totalPupae += analysis.counts.pupa || 0
      }
    })

    const avgHealth = Math.round(totalHealth / analyses.length)
    const avgCoverage = Math.round(totalCoverage / analyses.length)

    setStats({
      avgHealthScore: avgHealth,
      avgBroodCoverage: avgCoverage,
      totalAnalyses: analyses.length,
      totalEggs,
      totalLarvae,
      totalPupae
    })

    // Create brood trend data from analyses
    const trendData = analyses.slice(0, 10).reverse().map(analysis => ({
      date: new Date(analysis.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      eggs: analysis.counts?.egg || 0,
      larvae: analysis.counts?.larva || 0,
      pupae: analysis.counts?.pupa || 0,
    }))
    setBroodTrendData(trendData)

    // Create health score data
    const healthData = analyses.slice(0, 10).reverse().map(analysis => ({
      date: new Date(analysis.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: analysis.healthScore || 0
    }))
    setHealthScoreData(healthData)

    // Create cell composition
    const totalCells = totalEggs + totalLarvae + totalPupae
    if (totalCells > 0) {
      setCellComposition([
        { name: "Egg", value: Math.round((totalEggs / totalCells) * 100), color: chartColors.eggs },
        { name: "Larva", value: Math.round((totalLarvae / totalCells) * 100), color: chartColors.larvae },
        { name: "Pupa", value: Math.round((totalPupae / totalCells) * 100), color: chartColors.pupae },
      ].filter(c => c.value > 0))
    }

    // Generate recommendations
    const recList: string[] = []
    if (avgHealth >= 80) {
      recList.push("Excellent colony health - maintain current management")
    } else if (avgHealth >= 60) {
      recList.push("Good brood pattern - continue regular monitoring")
    } else {
      recList.push("Consider closer inspection for potential issues")
    }
    
    if (totalEggs > 0) {
      recList.push(`${totalEggs} eggs detected - queen is actively laying`)
    }
    if (totalLarvae > totalPupae && totalLarvae > 0) {
      recList.push("Active larval development observed")
    }
    if (recList.length === 0) {
      recList.push("Continue regular monitoring for best results")
    }
    setRecommendations(recList)
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-amber-700 mb-2">Avg. Health Score</h3>
          <p className="text-3xl font-bold text-amber-900">{stats.avgHealthScore || '--'}</p>
          <p className="text-xs text-amber-600 mt-2">{stats.totalAnalyses > 0 ? `${stats.totalAnalyses} analysis` : 'No data'}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-amber-700 mb-2">Total Cells Detected</h3>
          <p className="text-3xl font-bold text-orange-500">{stats.totalEggs + stats.totalLarvae + stats.totalPupae}</p>
          <p className="text-xs text-amber-600 mt-2">Eggs, Larvae, Pupae</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-amber-700 mb-2">Frames Analyzed</h3>
          <p className="text-3xl font-bold text-amber-900">{stats.totalAnalyses}</p>
          <p className="text-xs text-amber-600 mt-2">All time</p>
        </div>
      </div>

      {/* Brood Development Trend */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 mb-6">Brood Cell Detection Trend</h3>
        {broodTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={broodTrendData}>
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
              <Line type="monotone" dataKey="eggs" stroke={chartColors.eggs} strokeWidth={3} name="Eggs" />
              <Line type="monotone" dataKey="larvae" stroke={chartColors.larvae} strokeWidth={3} name="Larvae" />
              <Line type="monotone" dataKey="pupae" stroke={chartColors.pupae} strokeWidth={3} name="Pupae" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-amber-600/70 bg-amber-50/50 rounded-xl">
            <div className="text-center">
              <p className="font-medium">No brood analysis data yet</p>
              <p className="text-sm mt-1">Perform analysis to see trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Health Score Trend */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 mb-6">Overall Health Score Progression</h3>
        {healthScoreData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={healthScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
              <XAxis dataKey="date" stroke="#92400E" style={{ fontSize: "12px" }} />
              <YAxis stroke="#92400E" style={{ fontSize: "12px" }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFBEB",
                  border: "1px solid #FCD34D",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="score" fill={chartColors.larvae} radius={[8, 8, 0, 0]} name="Health Score" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-amber-600/70 bg-amber-50/50 rounded-xl">
            <div className="text-center">
              <p className="font-medium">No health data yet</p>
              <p className="text-sm mt-1">Perform analysis to see health trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Cell Composition Pie Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-amber-900 mb-6">Cell Type Composition</h3>
        {cellComposition.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cellComposition}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {cellComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFBEB",
                    border: "1px solid #FCD34D",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {cellComposition.map((type, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-sm text-amber-700">
                    {type.name} ({type.value}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-amber-600/70 bg-amber-50/50 rounded-xl">
            <div className="text-center">
              <p className="font-medium">No composition data</p>
              <p className="text-sm mt-1">Analyze brood frames to see cell types</p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-300 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-heading font-semibold text-amber-900 mb-2">Colony Assessment</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              {recommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
