"use client"

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

export default function QueenCellAnalytics() {
  const chartColors = {
    mature: "#FFB3B3", // Pastel Red
    semiMature: "#FFCC99", // Pastel Orange
    capped: "#ADD8E6", // Pastel Blue
    open: "#FFD9B3", // Light Pastel Orange
  }

  const cellTypeDistribution = [
    { name: "Mature", value: 28, color: chartColors.mature },
    { name: "Semi-Mature", value: 32, color: chartColors.semiMature },
    { name: "Capped", value: 24, color: chartColors.capped },
    { name: "Open", value: 16, color: chartColors.open },
  ]

  const hatchingTimeline = [
    { day: "0-2 days", count: 8, percentage: 35 },
    { day: "3-5 days", count: 7, percentage: 30 },
    { day: "6-8 days", count: 6, percentage: 26 },
    { day: "9+ days", count: 2, percentage: 9 },
  ]

  const emergenceData = [
    { date: "Nov 24", capped: 1, mature: 3, semiMature: 2 },
  ]

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-sm text-muted mb-2">Total Cells Analyzed</h3>
          <p className="text-3xl font-bold text-text-primary">156</p>
          <p className="text-xs text-muted mt-2">All time</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-sm text-muted mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-success">94%</p>
          <p className="text-xs text-muted mt-2">Emerged successfully</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-sm text-muted mb-2">Avg. Maturity</h3>
          <p className="text-3xl font-bold text-accent">6.2</p>
          <p className="text-xs text-muted mt-2">Days old</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-sm text-muted mb-2">Mature Cells</h3>
          <p className="text-3xl font-bold text-text-primary">28</p>
          <p className="text-xs text-muted mt-2">Ready to hatch</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cell Type Pie Chart */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="font-heading font-semibold text-lg mb-6">Cell Type Distribution</h3>
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
                  backgroundColor: "#FFFEF0",
                  border: "1px solid #F0E8D8",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {cellTypeDistribution.map((type, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                <span className="text-sm text-muted">
                  {type.name} ({type.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hatching Timeline */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="font-heading font-semibold text-lg mb-6">Estimated Hatching Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hatchingTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D8" />
              <XAxis dataKey="day" stroke="#666666" style={{ fontSize: "12px" }} />
              <YAxis stroke="#666666" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFEF0",
                  border: "1px solid #F0E8D8",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill={chartColors.semiMature} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Queen Cell Development Over Time */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-6">Queen Cell Development Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={emergenceData}>
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
            <Bar dataKey="capped" fill={chartColors.capped} name="Capped" radius={[8, 8, 0, 0]} />
            <Bar dataKey="mature" fill={chartColors.mature} name="Mature" radius={[8, 8, 0, 0]} />
            <Bar dataKey="semiMature" fill={chartColors.semiMature} name="Semi-Mature" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-info flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-2">Key Insights</h3>
            <ul className="space-y-1 text-sm text-text-primary">
              <li>• Your queen cell emergence rate (94%) exceeds typical industry standards</li>
              <li>• Semi-mature cells represent the largest category, suggesting active development</li>
              <li>• Most cells are ready to hatch within 0-5 days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
