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
    alert('🚧 Brood Pattern Analysis Coming Soon!\n\n✅ Queen Cell Analysis is fully functional\n🔬 Brood pattern model is in development\n\nPlease use Queen Cell Analysis for now.')
    return
  }

  const handleImageCaptureOld = async (imageData: string) => {
    try {
      console.log('🔄 Starting brood pattern analysis... [NO MOCK DATA v2.0]')
      
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [imageData] })
      })
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`)
      }
      
      const result = await response.json()
      const aiResults = result.data[1]
      
      // Validate AI results exist
      if (!aiResults) {
        throw new Error('No analysis results received from AI model')
      }
      
      // Transform AI results to match UI format - NO FALLBACKS
      const transformedResults = {
        hiveHealthScore: Math.round(aiResults.health_score * 100),
        riskLevel: aiResults.risk_level,
        broodCoverage: Math.round(aiResults.brood_coverage * 100),
        cellBreakdown: [
          {
            type: "Egg",
            percentage: Math.round(aiResults.cells.egg * 100),
            count: Math.round(aiResults.cells.egg * 820),
            description: "Healthy egg laying pattern",
            color: "bg-yellow-300",
          },
          {
            type: "Larva",
            percentage: Math.round(aiResults.cells.larva * 100),
            count: Math.round(aiResults.cells.larva * 820),
            description: "Active brood development",
            color: "bg-blue-400",
          },
          {
            type: "Pupa",
            percentage: Math.round(aiResults.cells.pupa * 100),
            count: Math.round(aiResults.cells.pupa * 820),
            description: "Late-stage pupation",
            color: "bg-purple-400",
          },
          {
            type: "Dead/Diseased",
            percentage: Math.round(aiResults.cells.dead_larvae_pupae * 100),
            count: Math.round(aiResults.cells.dead_larvae_pupae * 820),
            description: "Monitor for disease signs",
            color: "bg-red-400",
          },
          {
            type: "Empty Comb",
            percentage: Math.round(aiResults.cells.empty_comb * 100),
            count: Math.round(aiResults.cells.empty_comb * 820),
            description: "Normal variation",
            color: "bg-gray-300",
          },
          {
            type: "Nectar (Uncapped)",
            percentage: Math.round(aiResults.cells.nectar_uncapped * 100),
            count: Math.round(aiResults.cells.nectar_uncapped * 820),
            description: "Honey production",
            color: "bg-orange-300",
          },
        ],
        recommendations: aiResults.recommendations,
        imagePreview: imageData,
      }
      
      console.log('✅ Analysis complete:', transformedResults)
      setAnalysisResults(transformedResults)
      setShowResults(true)
      
    } catch (error) {
      console.error('❌ Analysis error:', error)
      alert(`Analysis failed: ${error.message}. Please check your internet connection and try again.`)
    }
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
