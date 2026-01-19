"use client"

import { useState } from "react"
import { Grid3X3 } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
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
      console.log('Starting brood pattern analysis...')
      
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
      console.log('Brood detection result:', result)
      
      // Transform API results to match UI format - ONLY 3 CLASSES
      const counts = result.counts || { egg: 0, larva: 0, pupa: 0 }
      const health = result.health || { status: 'UNKNOWN', score: 0, total_brood: 0, total_cells: 0 }
      const totalCells = health.total_cells || (counts.egg + counts.larva + counts.pupa)
      
      // Calculate brood coverage from API response
      // If health object has brood coverage data, use it; otherwise calculate from counts
      const totalBrood = health.total_brood || (counts.egg + counts.larva + counts.pupa)
      const broodCoverageValue = health.total_cells > 0 
        ? Math.round((totalBrood / health.total_cells) * 100) 
        : (totalCells > 0 ? Math.round((totalBrood / totalCells) * 100) : 0)
      
      const transformedResults = {
        hiveHealthScore: health.score,
        healthStatus: health.status,
        riskLevel: health.status === 'EXCELLENT' ? 'Low' : health.status === 'GOOD' ? 'Low' : health.status === 'FAIR' ? 'Medium' : 'High',
        broodCoverage: broodCoverageValue,
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
      
      console.log('Analysis complete:', transformedResults)
      setAnalysisResults(transformedResults)
      setShowResults(true)
      
    } catch (error: any) {
      console.error('Analysis error:', error)
      alert(`Analysis failed: ${error.message}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main style={{ flex: '1' }} className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl">
              <Grid3X3 className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Brood Pattern</h1>
          </div>
          <p className="text-amber-700/70 dark:text-amber-300/70 ml-12 sm:ml-14 text-sm sm:text-base">
            Upload or capture an image to assess brood health
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="flex w-full max-w-md overflow-x-auto mb-6 sm:mb-8 bg-amber-100/50 dark:bg-amber-900/30 p-1 rounded-xl gap-1">
            <TabsTrigger value="analyze" className="flex-1 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg font-semibold text-sm text-amber-800 dark:text-amber-200">Analyze</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg font-semibold text-sm text-amber-800 dark:text-amber-200">History</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {!showResults ? (
              <div>
                {isLoading && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-5 shadow-xl border border-amber-200 dark:border-amber-700/50 mx-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg sm:text-xl font-semibold text-amber-900 dark:text-amber-100">Analyzing brood pattern...</p>
                      <p className="text-amber-700/70 dark:text-amber-300/70 text-sm sm:text-base">This may take a few seconds</p>
                    </div>
                  </div>
                )}
                <ImageUploader onImageCapture={handleImageCapture} />
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setShowResults(false)}
                  className="mb-6 px-5 py-2.5 text-amber-600 hover:bg-amber-100 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2"
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

      <Footer />
    </div>
  )
}
