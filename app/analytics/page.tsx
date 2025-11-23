"use client"

import Navigation from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QueenCellAnalytics from "@/components/queen-cell-analytics"
import BroodPatternAnalytics from "@/components/brood-pattern-analytics"
import OverallTrends from "@/components/overall-trends"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">Analytics & Statistics</h1>
          <p className="text-muted">Track trends and patterns in your hive monitoring data over time</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="queen">Queen Cells</TabsTrigger>
            <TabsTrigger value="brood">Brood Pattern</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverallTrends />
          </TabsContent>

          <TabsContent value="queen" className="space-y-6">
            <QueenCellAnalytics />
          </TabsContent>

          <TabsContent value="brood" className="space-y-6">
            <BroodPatternAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
