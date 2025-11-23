"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import ImageUploader from "@/components/image-uploader"
import BroodPatternResults from "@/components/brood-pattern-results"
import BroodHistory from "@/components/brood-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BroodPatternPage() {
  const [analysisResults, setAnalysisResults] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleImageCapture = async (imageData: string) => {
    // Simulated analysis - in production, this would call an AI API
    const mockResults = {
      hiveHealthScore: 78,
      riskLevel: "medium",
      broodCoverage: 85,
      cells: {
        egg: 22,
        larva: 35,
        pupa: 28,
        dead_larvae_pupae: 5,
        empty_comb: 8,
        nectar_uncapped: 2,
        nectar_capped: 0,
      },
      cellBreakdown: [
        {
          type: "Egg",
          percentage: 22,
          count: 180,
          description: "Healthy egg laying pattern",
          color: "bg-yellow-300",
        },
        {
          type: "Larva",
          percentage: 35,
          count: 287,
          description: "Active brood development",
          color: "bg-blue-400",
        },
        {
          type: "Pupa",
          percentage: 28,
          count: 230,
          description: "Late-stage pupation",
          color: "bg-purple-400",
        },
        {
          type: "Dead/Diseased",
          percentage: 5,
          count: 41,
          description: "Monitor for disease signs",
          color: "bg-red-400",
        },
        {
          type: "Empty Comb",
          percentage: 8,
          count: 65,
          description: "Normal variation",
          color: "bg-gray-300",
        },
        {
          type: "Nectar (Uncapped)",
          percentage: 2,
          count: 16,
          description: "Honey production",
          color: "bg-orange-300",
        },
      ],
      recommendations: [
        "Continue regular monitoring of brood pattern consistency",
        "Ensure adequate feed supply to support developing brood",
        "Monitor dead larvae percentage - currently within normal range",
        "Check for signs of disease or pests",
      ],
      imagePreview: imageData,
    }
    setAnalysisResults(mockResults)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">Brood Pattern Analysis</h1>
          <p className="text-muted">
            Upload or capture an image to assess brood health, coverage, and colony condition
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {!showResults ? (
              <div>
                <ImageUploader onImageCapture={handleImageCapture} />
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setShowResults(false)}
                  className="mb-6 px-4 py-2 text-accent hover:bg-surface rounded-lg transition-colors font-medium"
                >
                  ← Analyze Another Image
                </button>
                <BroodPatternResults results={analysisResults} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <BroodHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
