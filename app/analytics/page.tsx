"use client"

import { BarChart3 } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QueenCellAnalytics from "@/components/queen-cell-analytics"
import BroodPatternAnalytics from "@/components/brood-pattern-analytics"
import OverallTrends from "@/components/overall-trends"

export default function AnalyticsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <main style={{ flex: '1' }} className="w-full max-w-[1500px] px-6 py-8 mx-0">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Analytics
            </h1>
          </div>
          <p className="text-amber-700/70 dark:text-amber-300/70 ml-12 sm:ml-14 text-sm sm:text-base">Track trends and patterns in your hive monitoring data</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full max-w-md overflow-x-auto mb-6 bg-amber-100/50 dark:bg-amber-900/30 p-1 rounded-xl gap-1">
            <TabsTrigger value="overview" className="flex-shrink-0 px-3 sm:px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-xs sm:text-sm text-amber-800 dark:text-amber-200">Overview</TabsTrigger>
            <TabsTrigger value="queen" className="flex-shrink-0 px-3 sm:px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-xs sm:text-sm text-amber-800 dark:text-amber-200">Queen</TabsTrigger>
            <TabsTrigger value="brood" className="flex-shrink-0 px-3 sm:px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-xs sm:text-sm text-amber-800 dark:text-amber-200">Brood</TabsTrigger>
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

      <Footer />
    </div>
  )
}
