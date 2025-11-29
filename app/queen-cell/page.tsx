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
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageCapture = async (imageData: string) => {
    setIsAnalyzing(true)
    try {
      const results = await yoloService.analyzeImage(imageData)
      
      if (results.totalQueenCells === 0) {
        alert('⚠️ No queen cells detected!\n\nTips for better detection:\n• Ensure good lighting\n• Avoid blurry or dark images\n• Make sure queen cells are clearly visible\n• Try a different angle or closer shot')
        setIsAnalyzing(false)
        return
      }
      
      saveAnalysis(results)
      setAnalysisResults(results)
      setShowResults(true)
    } catch (error) {
      console.error('Analysis failed:', error)
      let errorMessage = 'Analysis failed. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          localStorage.clear()
          errorMessage = 'Storage was full. Cleared and ready to try again!'
        } else if (error.message.includes('too small')) {
          errorMessage = 'Image too small. Please use an image at least 320x320 pixels.'
        } else if (error.message.includes('too large')) {
          errorMessage = 'Image too large. Please use an image smaller than 10MB.'
        } else if (error.message.includes('format')) {
          errorMessage = 'Invalid image format. Please use JPEG, PNG, or WebP images.'
        } else if (error.message.includes('API')) {
          errorMessage = 'Server connection failed. Please check your internet connection and try again.'
        }
      }
      
      alert(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Using inline styles for reliable sticky footer behavior
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />

      <main style={{ flex: '1' }} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
                    <p className="text-sm text-muted mt-2">Processing image and running AI detection</p>
                    <p className="text-xs text-muted mt-1">This may take 10-30 seconds</p>
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
