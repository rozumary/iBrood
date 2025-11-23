"use client"

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

export default function BroodPatternAnalytics() {
  const broodTrendData = [
    { date: "Nov 1", larvae: 32, pupae: 25, eggs: 20, dead: 8 },
    { date: "Nov 5", larvae: 35, pupae: 26, eggs: 22, dead: 6 },
    { date: "Nov 10", larvae: 38, pupae: 28, eggs: 24, dead: 4 },
    { date: "Nov 15", larvae: 32, pupae: 26, eggs: 19, dead: 8 },
    { date: "Nov 18", larvae: 38, pupae: 30, eggs: 23, dead: 3 },
    { date: "Nov 20", larvae: 35, pupae: 28, eggs: 22, dead: 5 },
  ]

  const healthScoreData = [
    { date: "Nov 1", score: 72 },
    { date: "Nov 5", score: 75 },
    { date: "Nov 10", score: 78 },
    { date: "Nov 15", score: 75 },
    { date: "Nov 18", score: 82 },
    { date: "Nov 20", score: 78 },
  ]

  const chartColors = {
    larvae: "#FFCC99", // Pastel Orange
    pupae: "#FFD9B3", // Light Pastel Orange
    eggs: "#FFB3B3", // Pastel Red
    empty: "#ADD8E6", // Pastel Blue
    dead: "#8DD3F0", // Pastel Light Blue
    nectar: "#FFCC99", // Pastel Orange
  }

  const cellComposition = [
    { name: "Larva", value: 35, color: chartColors.larvae },
    { name: "Pupa", value: 28, color: chartColors.pupae },
    { name: "Egg", value: 22, color: chartColors.eggs },
    { name: "Empty", value: 8, color: chartColors.empty },
    { name: "Dead", value: 5, color: chartColors.dead },
    { name: "Nectar", value: 2, color: chartColors.nectar },
  ]

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-sm text-muted mb-2">Avg. Health Score</h3>
          <p className="text-3xl font-bold text-text-primary">77</p>
          <p className="text-xs text-muted mt-2">Last 30 days</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-sm text-muted mb-2">Avg. Brood Coverage</h3>
          <p className="text-3xl font-bold text-success">82%</p>
          <p className="text-xs text-muted mt-2">Very healthy</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-sm text-muted mb-2">Dead Cell Rate</h3>
          <p className="text-3xl font-bold text-danger">5%</p>
          <p className="text-xs text-muted mt-2">Within normal range</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-sm text-muted mb-2">Frames Analyzed</h3>
          <p className="text-3xl font-bold text-text-primary">24</p>
          <p className="text-xs text-muted mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Brood Development Trend */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-6">Brood Cell Development Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={broodTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D8" />
            <XAxis dataKey="date" stroke="#666666" style={{ fontSize: "12px" }} />
            <YAxis stroke="#666666" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFEF0",
                border: "1px solid #F0E8D8",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="larvae" stroke={chartColors.larvae} strokeWidth={2} name="Larvae %" />
            <Line type="monotone" dataKey="pupae" stroke={chartColors.pupae} strokeWidth={2} name="Pupae %" />
            <Line type="monotone" dataKey="eggs" stroke={chartColors.eggs} strokeWidth={2} name="Eggs %" />
            <Line type="monotone" dataKey="dead" stroke={chartColors.dead} strokeWidth={2} name="Dead %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Health Score Trend */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-6">Overall Health Score Progression</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={healthScoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D8" />
            <XAxis dataKey="date" stroke="#666666" style={{ fontSize: "12px" }} />
            <YAxis stroke="#666666" style={{ fontSize: "12px" }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFEF0",
                border: "1px solid #F0E8D8",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="score" fill={chartColors.larvae} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cell Composition Pie Chart */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-6">Average Cell Composition</h3>
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
                backgroundColor: "#FFFEF0",
                border: "1px solid #F0E8D8",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {cellComposition.map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
              <span className="text-sm text-muted">
                {type.name} ({type.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-6 h-6 text-success flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-2">Colony Assessment</h3>
            <ul className="space-y-1 text-sm text-text-primary">
              <li>• Brood pattern is healthy and consistent with good coverage</li>
              <li>• Dead larval rates are at healthy levels, no disease indicators</li>
              <li>• Recommend maintaining current feeding and management schedule</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
