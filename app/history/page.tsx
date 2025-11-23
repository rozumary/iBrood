"use client"

import Navigation from "@/components/navigation"
import QueenCellLogs from "@/components/queen-cell-logs"
import BroodHistory from "@/components/brood-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">Analysis History</h1>
          <p className="text-muted">
            View your past queen cell and brood pattern analysis records
          </p>
        </div>

        <Tabs defaultValue="queen-cell" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="queen-cell">Queen Cell Logs</TabsTrigger>
            <TabsTrigger value="brood-pattern">Brood History</TabsTrigger>
          </TabsList>

          <TabsContent value="queen-cell">
            <QueenCellLogs />
          </TabsContent>

          <TabsContent value="brood-pattern">
            <BroodHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}