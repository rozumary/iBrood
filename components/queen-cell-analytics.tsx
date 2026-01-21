"use client"

import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { AlertCircle } from "lucide-react"
import { getAnalyses } from "@/lib/storage"

export default function QueenCellAnalytics() {
  const [stats, setStats] = useState({
    totalCells: 0,
    matureCells: 0,
    avgMaturity: 0,
    successRate: 0
  })
  const [cellTypeDistribution, setCellTypeDistribution] = useState<any[]>([])
  const [emergenceData, setEmergenceData] = useState<any[]>([])
  const [insights, setInsights] = useState<string[]>([])

  // Bee-themed chart colors
  const chartColors = {
    mature: "#DC2626",
    semiMature: "#F59E0B",
    capped: "#A67C52",
    open: "#FCD34D",
    failed: "#6B7280",
  }

  useEffect(() => {
    loadQueenCellData()
    
    window.addEventListener('storage', loadQueenCellData)
    window.addEventListener('analysisUpdated', loadQueenCellData)
    
    return () => {
      window.removeEventListener('storage', loadQueenCellData)
      window.removeEventListener('analysisUpdated', loadQueenCellData)
    }
  }, [])

  const loadQueenCellData = () => {
    const analyses = getAnalyses()
    
    if (analyses.length === 0) {
      setInsights(["No queen cell analysis data yet", "Perform analysis to see insights"])
      return
    }

    // Calculate totals from all analyses
    let totalCells = 0
    let matureCells = 0
    let semiMatureCells = 0
    let cappedCells = 0
    let openCells = 0
    let failedCells = 0

    analyses.forEach(analysis => {
      totalCells += analysis.totalQueenCells || 0
      const dist = analysis.maturityDistribution || {}
      matureCells += dist.mature || dist.Mature || 0
      semiMatureCells += dist['semi-mature'] || dist['Semi-Mature'] || dist.semiMature || 0
      cappedCells += dist.capped || dist.Capped || 0
      openCells += dist.open || dist.Open || 0
      failedCells += dist.failed || dist.Failed || 0
    })

    // Update stats
    setStats({
      totalCells,
      matureCells,
      avgMaturity: analyses.length > 0 ? Math.round(totalCells / analyses.length) : 0,
      successRate: totalCells > 0 ? Math.round(((totalCells - failedCells) / totalCells) * 100) : 0
    })

    // Create distribution data
    const distribution = [
      { name: "Mature", value: matureCells, color: chartColors.mature },
      { name: "Semi-Mature", value: semiMatureCells, color: chartColors.semiMature },
      { name: "Capped", value: cappedCells, color: chartColors.capped },
      { name: "Open", value: openCells, color: chartColors.open },
    ].filter(d => d.value > 0)
    
    if (failedCells > 0) {
      distribution.push({ name: "Failed", value: failedCells, color: chartColors.failed })
    }
    
    setCellTypeDistribution(distribution)

    // Create emergence timeline data from recent analyses
    const timelineData = analyses.slice(0, 10).reverse().map(analysis => {
      const dist = analysis.maturityDistribution || {}
      return {
        date: new Date(analysis.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mature: dist.mature || dist.Mature || 0,
        semiMature: dist['semi-mature'] || dist['Semi-Mature'] || dist.semiMature || 0,
        capped: dist.capped || dist.Capped || 0,
      }
    })
    setEmergenceData(timelineData)

    // Generate insights
    const insightList: string[] = []
    if (totalCells > 0) {
      insightList.push(`Total of ${totalCells} queen cells analyzed across ${analyses.length} inspections`)
    }
    if (matureCells > 0) {
      insightList.push(`${matureCells} mature cells detected - ready for emergence`)
    }
    if (semiMatureCells > cappedCells && semiMatureCells > 0) {
      insightList.push("Most cells are semi-mature, suggesting active development")
    }
    if (failedCells > 0) {
      insightList.push(`${failedCells} failed cells detected - monitor for issues`)
    }
    if (insightList.length === 0) {
      insightList.push("Continue regular monitoring for best results")
    }
    setInsights(insightList)
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-amber-700 mb-2">Total Cells Analyzed</h3>
          <p className="text-3xl font-bold text-amber-900">{stats.totalCells}</p>
          <p className="text-xs text-amber-600 mt-2">All time</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-amber-700 mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-amber-600">{stats.successRate}%</p>
          <p className="text-xs text-amber-600 mt-2">Non-failed cells</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-amber-700 mb-2">Avg. Per Analysis</h3>
          <p className="text-3xl font-bold text-orange-500">{stats.avgMaturity}</p>
          <p className="text-xs text-amber-600 mt-2">Cells detected</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-amber-700 mb-2">Mature Cells</h3>
          <p className="text-3xl font-bold text-amber-900">{stats.matureCells}</p>
          <p className="text-xs text-amber-600 mt-2">Ready to hatch</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cell Type Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-lg text-amber-900 mb-6">Cell Type Distribution</h3>
          {cellTypeDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cellTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {cellTypeDistribution.map((entry, index) => (
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
                {cellTypeDistribution.map((type, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-sm text-amber-700">
                      {type.name} ({type.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-amber-600/70 bg-amber-50/50 rounded-xl">
              <div className="text-center">
                <p className="font-medium">No data yet</p>
                <p className="text-sm mt-1">Analyze queen cells to see distribution</p>
              </div>
            </div>
          )}
        </div>

        {/* Development Timeline */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-lg text-amber-900 mb-6">Detection Timeline</h3>
          {emergenceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emergenceData}>
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
                <Bar dataKey="mature" fill={chartColors.mature} name="Mature" radius={[4, 4, 0, 0]} />
                <Bar dataKey="semiMature" fill={chartColors.semiMature} name="Semi-Mature" />
                <Bar dataKey="capped" fill={chartColors.capped} name="Capped" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-amber-600/70 bg-amber-50/50 rounded-xl">
              <div className="text-center">
                <p className="font-medium">No timeline data</p>
                <p className="text-sm mt-1">Perform multiple analysis to see trends</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-300 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-heading font-semibold text-amber-900 mb-2">Key Insights</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              {insights.map((insight, index) => (
                <li key={index}>• {insight.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F910}-\u{1F96B}\u{1F980}-\u{1F9E0}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}\u{2623}\u{2626}\u{262A}\u{262E}\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}\u{269C}\u{26A0}\u{26A1}\u{26AA}\u{26AB}\u{26B0}\u{26B1}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26C8}\u{26CE}\u{26CF}\u{26D1}\u{26D3}\u{26D4}\u{26E9}\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{00A9}\u{00AE}\u{203C}\u{2049}\u{2122}\u{2139}\u{2194}-\u{2199}\u{21A9}\u{21AA}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}\u{2623}\u{2626}\u{262A}\u{262E}\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}\u{269C}\u{26A0}\u{26A1}\u{26AA}\u{26AB}\u{26B0}\u{26B1}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26C8}\u{26CE}\u{26CF}\u{26D1}\u{26D3}\u{26D4}\u{26E9}\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu, '').trim()}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
