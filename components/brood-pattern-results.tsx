"use client"

import { AlertCircle, TrendingUp, BarChart3, Heart, Activity } from "lucide-react"

interface BroodCell {
  type: string
  percentage: number
  count: number
  description: string
  color: string
}

interface Results {
  hiveHealthScore: number
  riskLevel: string
  broodCoverage: number
  cellBreakdown: BroodCell[]
  recommendations: string[]
  imagePreview: string
}

interface BroodPatternResultsProps {
  results: Results | null
}

export default function BroodPatternResults({ results }: BroodPatternResultsProps) {
  if (!results) return null

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-success text-white"
      case "medium":
        return "bg-warning text-white"
      case "high":
        return "bg-danger text-white"
      default:
        return "bg-muted text-white"
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-50"
      case "medium":
        return "bg-yellow-50"
      case "high":
        return "bg-red-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <div className="space-y-8">
      {/* Image Preview */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <img
          src={results.imagePreview || "/placeholder.svg"}
          alt="Brood pattern analysis"
          className="w-full h-96 object-cover"
        />
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted">Health Score</h3>
          </div>
          <p className="text-4xl font-bold text-text-primary">{results.hiveHealthScore}</p>
          <p className="text-xs text-muted mt-2">Out of 100</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted">Risk Level</h3>
          </div>
          <p className={`text-xl font-bold px-3 py-1 rounded-full w-fit capitalize ${getRiskColor(results.riskLevel)}`}>
            {results.riskLevel}
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted">Brood Coverage</h3>
          </div>
          <p className="text-4xl font-bold text-text-primary">{results.broodCoverage}%</p>
          <p className="text-xs text-muted mt-2">Frame coverage</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted">Colony Status</h3>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {results.hiveHealthScore >= 75 ? "Strong" : results.hiveHealthScore >= 50 ? "Fair" : "Weak"}
          </p>
          <p className="text-xs text-muted mt-2">Current condition</p>
        </div>
      </div>

      {/* Cell Type Breakdown */}
      <div className="bg-surface rounded-lg border border-border p-8">
        <h3 className="font-heading font-semibold text-xl mb-6">Brood Composition Analysis</h3>
        <div className="space-y-6">
          {results.cellBreakdown.map((cell, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${cell.color}`} />
                  <div>
                    <h4 className="font-semibold text-text-primary">{cell.type}</h4>
                    <p className="text-sm text-muted">{cell.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-text-primary">{cell.percentage}%</p>
                  <p className="text-xs text-muted">{cell.count} cells</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                <div className={cell.color} style={{ width: `${cell.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-surface rounded-lg border border-border p-8">
        <h3 className="font-heading font-semibold text-lg mb-6">Cell Distribution</h3>
        <div className="flex items-center justify-center gap-2 h-32 mb-4">
          {results.cellBreakdown.map((cell, index) => (
            <div
              key={index}
              className={`flex-1 h-full rounded-lg ${cell.color} hover:shadow-lg transition-shadow`}
              style={{ opacity: 0.9 }}
              title={`${cell.type}: ${cell.percentage}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {results.cellBreakdown.map((cell, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${cell.color}`} />
              <span className="text-muted">
                {cell.type} ({cell.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className={`rounded-lg border p-6 ${getRiskBgColor(results.riskLevel)}`}>
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Management Recommendations</h3>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-text-primary flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Save Analysis Button */}
      <button className="w-full px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors">
        Save This Analysis
      </button>
    </div>
  )
}
