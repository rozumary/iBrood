"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import ImageUploader from "@/components/image-uploader"
import BroodPatternResults from "@/components/brood-pattern-results"
import BroodHistory from "@/components/brood-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// API URL - use HuggingFace directly or local API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://rozu1726-ibrood-app.hf.space"

export default function BroodPatternPage() {
  const [analysisResults, setAnalysisResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageCapture = async (imageData: string) => {
    try {
      setIsLoading(true)
      console.log('🔄 Starting brood pattern analysis...')
      
      // Convert base64 to blob for FormData
      const base64Data = imageData.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })
      
      // Create FormData
      const formData = new FormData()
      formData.append('file', blob, 'brood_image.jpg')
      
      // Call the brood detection API directly on HuggingFace
      const response = await fetch(`${API_URL}/brood_detect`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        let errorMessage = `Analysis failed: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // Response wasn't JSON
        }
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      console.log('✅ Brood detection result:', result)
      
      // Transform API results to match UI format - ONLY 3 CLASSES
      const counts = result.counts || { egg: 0, larva: 0, pupa: 0 }
      const health = result.health || { status: 'UNKNOWN', score: 0, total_brood: 0, total_cells: 0 }
      const totalCells = health.total_cells || (counts.egg + counts.larva + counts.pupa)
      
      const transformedResults = {
        hiveHealthScore: health.score,
        healthStatus: health.status,
        riskLevel: health.status === 'EXCELLENT' ? 'Low' : health.status === 'GOOD' ? 'Low' : health.status === 'FAIR' ? 'Medium' : 'High',
        broodCoverage: 100, // All detected cells are brood
        totalDetections: result.count || 0,
        counts: counts,
        cellBreakdown: [
          {
            type: "Egg",
            percentage: totalCells > 0 ? Math.round((counts.egg / totalCells) * 100) : 0,
            count: counts.egg,
            description: "Early development stage (1-3 days old)",
            color: "bg-orange-300",  // Pastel Orange
          },
          {
            type: "Larva",
            percentage: totalCells > 0 ? Math.round((counts.larva / totalCells) * 100) : 0,
            count: counts.larva,
            description: "Active growth stage (3-8 days old)",
            color: "bg-cyan-300",   // Pastel Cyan
          },
          {
            type: "Pupa",
            percentage: totalCells > 0 ? Math.round((counts.pupa / totalCells) * 100) : 0,
            count: counts.pupa,
            description: "Pre-emergence stage (8-21 days old)",
            color: "bg-fuchsia-300", // Pastel Purple
          },
        ],
        recommendations: result.recommendations || ['Continue regular monitoring'],
        // Use annotated image (with bounding boxes) as the primary image
        imagePreview: result.annotated_image || imageData,
        annotatedImage: result.annotated_image || null,
        annotatedImageWithLabels: result.annotated_image_with_labels || null,
        originalImage: imageData,
        detections: result.detections || []
      }
      
      console.log('✅ Analysis complete:', transformedResults)
      setAnalysisResults(transformedResults)
      setShowResults(true)
      
    } catch (error: any) {
      console.error('❌ Analysis error:', error)
      alert(`Analysis failed: ${error.message}. Please try again.`)
    } finally {
      setIsLoading(false)
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
                {isLoading && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg font-medium">Analyzing brood pattern...</p>
                      <p className="text-sm text-muted">This may take a few seconds</p>
                    </div>
                  </div>
                )}
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
