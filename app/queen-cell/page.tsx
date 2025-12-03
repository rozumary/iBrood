"use client"

import { useState } from "react"
import { Crown, AlertTriangle } from "lucide-react"
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
        alert('No queen cells detected!\n\nTips for better detection:\n• Ensure good lighting\n• Avoid blurry or dark images\n• Make sure queen cells are clearly visible\n• Try a different angle or closer shot')
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main style={{ flex: '1' }} className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl">
              <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Queen Cell</h1>
          </div>
          <p className="text-amber-700/70 dark:text-amber-300/70 ml-12 sm:ml-14 text-sm sm:text-base">
            Upload or capture an image to analyze queen cell maturity
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="flex w-full max-w-md overflow-x-auto mb-6 sm:mb-8 bg-amber-100/50 dark:bg-amber-900/30 p-1 rounded-xl gap-1">
            <TabsTrigger value="analyze" className="flex-1 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg font-semibold text-sm text-amber-800 dark:text-amber-200">Analyze</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg font-semibold text-sm text-amber-800 dark:text-amber-200">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {!showResults ? (
              <div>
                {isAnalyzing ? (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-5 shadow-xl border border-amber-200 dark:border-amber-700/50 mx-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg sm:text-xl font-semibold text-amber-900 dark:text-amber-100">Analyzing Queen Cells...</p>
                      <p className="text-amber-700/70 dark:text-amber-300/70 text-sm sm:text-base">Processing image and running AI detection</p>
                      <p className="text-xs sm:text-sm text-amber-600/60 dark:text-amber-400/60">This may take a few seconds</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageUploader onImageCapture={handleImageCapture} />
                    <button
                      onClick={() => { localStorage.clear(); alert('Storage cleared!') }}
                      className="mt-4 px-4 py-2 text-sm text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 dark:hover:text-amber-300 rounded-lg transition-all duration-300"
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
                  className="mb-6 px-5 py-2.5 text-amber-600 hover:bg-amber-100 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2"
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
