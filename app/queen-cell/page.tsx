"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import ImageUploader from "@/components/image-uploader"
import QueenCellResults from "@/components/queen-cell-results"
import QueenCellLogs from "@/components/queen-cell-logs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from "@/components/footer"
import { yoloService } from "@/lib/yolo-service"
import { saveAnalysis } from "@/lib/storage"

export default function QueenCellPage() {
  const [analysisResults, setAnalysisResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageCapture = async (imageData: string) => {
    setIsAnalyzing(true)
    try {
      const results = await yoloService.analyzeImage(imageData)
      
      if (results.totalQueenCells === 0) {
        alert('⚠️ No queen cells detected!\n\nPlease make sure the queen cell is visible. Try using lighter images or avoid blurry photos.')
        setIsAnalyzing(false)
        return
      }
      
      saveAnalysis(results)
      setAnalysisResults(results)
      setShowResults(true)
    } catch (error) {
      console.error('Analysis failed:', error)
      if (error instanceof Error && error.message.includes('quota')) {
        localStorage.clear()
        alert('Storage was full. Cleared and ready to try again!')
      } else {
        alert('Analysis failed. Please try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-text-primary mb-2">Queen Cell Analysis</h1>
          <p className="text-sm sm:text-base text-muted">
            Upload or capture an image of your hive frame to analyze queen cell maturity and predict hatching time
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="logs">Cell Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {!showResults ? (
              <div>
                {isAnalyzing ? (
                  <div className="bg-surface rounded-lg border border-border p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-text-primary">Analyzing Queen Cells...</p>
                    <p className="text-sm text-muted mt-2">Running YOLO detection</p>
                  </div>
                ) : (
                  <>
                    <ImageUploader onImageCapture={handleImageCapture} />
                    <button
                      onClick={() => { localStorage.clear(); alert('Storage cleared!') }}
                      className="mt-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear Storage
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setShowResults(false)}
                  className="mb-6 px-4 py-2 text-accent hover:bg-surface rounded-lg transition-colors font-medium"
                >
                  ← Analyze Another Image
                </button>
                <QueenCellResults results={analysisResults} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs">
            <QueenCellLogs />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
