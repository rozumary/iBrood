"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Beef as Bee, Grid3X3 } from "lucide-react"
import Navigation from "@/components/navigation"
import HiveHealthCard from "@/components/hive-health-card"
import Footer from "@/components/footer"
import { getLatestAnalysis, getTotalInspections } from "@/lib/storage"

export default function Dashboard() {
  const [lastAnalysis, setLastAnalysis] = useState<any>(null)
  const [totalInspections, setTotalInspections] = useState(0)

  useEffect(() => {
    setLastAnalysis(getLatestAnalysis())
    setTotalInspections(getTotalInspections())
  }, [])

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-3">Welcome to iBrood</h1>
          <p className="text-lg text-muted mb-6">
            Intelligent monitoring of your hive's queen cell development and brood health
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link
            href="/queen-cell"
            className="group p-6 bg-surface rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                <Bee className="w-6 h-6 text-accent group-hover:text-white" />
              </div>
              <h2 className="font-heading font-semibold">Queen Cell</h2>
            </div>
            <p className="text-sm text-muted">Analyze queen cell maturity and hatching time</p>
          </Link>

          <Link
            href="/brood-pattern"
            className="group p-6 bg-surface rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                <Grid3X3 className="w-6 h-6 text-accent group-hover:text-white" />
              </div>
              <h2 className="font-heading font-semibold">Brood Pattern</h2>
            </div>
            <p className="text-sm text-muted">Assess brood coverage and health</p>
          </Link>
        </div>

        {/* Hive Health Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <HiveHealthCard />
          </div>
          <div className="bg-surface rounded-lg border border-border p-6">
            <h3 className="font-heading font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted">Last Queen Cell Analysis</span>
                <span className="text-sm font-medium">
                  {lastAnalysis ? getTimeAgo(lastAnalysis.timestamp) : 'No data'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted">Cells Detected</span>
                <span className="text-sm font-medium">
                  {lastAnalysis ? `${lastAnalysis.totalQueenCells} cells` : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Total Inspections</span>
                <span className="text-sm font-medium">{totalInspections}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}