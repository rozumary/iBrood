"use client"

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

export default function OverallTrends() {
  const healthTrendData = [
    { date: "Nov 1", healthScore: 72, broodCoverage: 78 },
    { date: "Nov 5", healthScore: 75, broodCoverage: 80 },
    { date: "Nov 10", healthScore: 78, broodCoverage: 82 },
    { date: "Nov 15", healthScore: 75, broodCoverage: 80 },
    { date: "Nov 18", healthScore: 82, broodCoverage: 88 },
    { date: "Nov 20", healthScore: 78, broodCoverage: 85 },
  ]

  const queenCellData = [
    { date: "Nov 1", mature: 0, semiMature: 2, capped: 3 },
    { date: "Nov 5", mature: 1, semiMature: 2, capped: 2 },
    { date: "Nov 10", mature: 2, semiMature: 3, capped: 1 },
    { date: "Nov 15", mature: 1, semiMature: 2, capped: 3 },
    { date: "Nov 18", mature: 3, semiMature: 2, capped: 1 },
    { date: "Nov 20", mature: 2, semiMature: 2, capped: 2 },
  ]

  const stats = [
    {
      label: "Average Health Score",
      value: "77",
      change: "+3%",
      icon: <TrendingUp className="w-5 h-5 text-success" />,
    },
    {
      label: "Total Analyses",
      value: "24",
      change: "Last 30 days",
      icon: <CheckCircle className="w-5 h-5 text-accent" />,
    },
    {
      label: "Avg. Brood Coverage",
      value: "82%",
      change: "Very healthy",
      icon: <CheckCircle className="w-5 h-5 text-success" />,
    },
    {
      label: "Queen Cells Emerged",
      value: "8",
      change: "This season",
      icon: <Calendar className="w-5 h-5 text-accent" />,
    },
  ]

  const chartColors = {
    primary: "#FFB3B3", // Pastel Red
    secondary: "#ADD8E6", // Pastel Blue
    accent: "#FFCC99", // Pastel Orange
    muted: "#FFD9B3", // Light Pastel Orange
    success: "#B3E5FC", // Pastel Light Blue
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-muted">{stat.label}</h3>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-text-primary mb-2">{stat.value}</p>
            <p className="text-xs text-muted">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Health Score Trend */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-6">Health Score & Brood Coverage Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={healthTrendData}>
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
            <Line
              type="monotone"
              dataKey="healthScore"
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={{ fill: chartColors.primary, r: 5 }}
              activeDot={{ r: 7 }}
              name="Health Score"
            />
            <Line
              type="monotone"
              dataKey="broodCoverage"
              stroke={chartColors.secondary}
              strokeWidth={2}
              dot={{ fill: chartColors.secondary, r: 5 }}
              activeDot={{ r: 7 }}
              name="Brood Coverage %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Queen Cell Trend */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-6">Queen Cell Development Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={queenCellData}>
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
            <Bar dataKey="mature" stackId="a" fill={chartColors.primary} name="Mature" />
            <Bar dataKey="semiMature" stackId="a" fill={chartColors.accent} name="Semi-Mature" />
            <Bar dataKey="capped" stackId="a" fill={chartColors.secondary} name="Capped" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            <h3 className="font-heading font-semibold text-text-primary">Active Alerts</h3>
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-text-primary">• Monitor brood pattern - slight decrease detected</li>
            <li className="text-sm text-text-primary">• 2 mature queen cells detected - plan management</li>
            <li className="text-sm text-text-primary">• Dead cells slightly elevated - ensure ventilation</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
            <h3 className="font-heading font-semibold text-text-primary">Positive Indicators</h3>
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-text-primary">• Brood coverage stable and healthy</li>
            <li className="text-sm text-text-primary">• Consistent egg laying pattern</li>
            <li className="text-sm text-text-primary">• No disease signs detected</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
