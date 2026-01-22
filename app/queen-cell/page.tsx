"use client"

import { useState } from "react"
import { Crown, AlertTriangle, AlertCircle, X } from "lucide-react"
import Navigation from "@/components/navigation"
import NavigationResearch from "@/components/navigation-research"
import { useEffect, useState as useStateLocal } from "react"
import ImageUploader from "@/components/image-uploader"
import QueenCellResults from "@/components/queen-cell-results"
import QueenCellLogs from "@/components/queen-cell-logs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from "@/components/footer"
import { yoloService } from "@/lib/yolo-service"

export default function QueenCellPage() {
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({ title: '', message: '', tips: [] as string[] })

  const showDialog = (title: string, message: string, tips: string[] = []) => {
    setDialogContent({ title, message, tips })
    setDialogOpen(true)
  }

  const handleImageCapture = async (imageData: string) => {
    setIsAnalyzing(true)
    try {
      const results = await yoloService.analyzeImage(imageData)
      
      if (results.totalQueenCells === 0) {
        showDialog('No queen cells detected!', 'Tips for better detection:', [
          'Ensure good lighting',
          'Avoid blurry or dark images',
          'Make sure queen cells are clearly visible',
          'Try a different angle or closer shot'
        ])
        setIsAnalyzing(false)
        return
      }
      
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
      
      showDialog('Error', errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Using inline styles for reliable sticky footer behavior
  const [isResearchMode, setIsResearchMode] = useStateLocal(false)
  useEffect(() => {
    try {
      const user = localStorage.getItem('ibrood_current_user')
      if (user) {
        const parsed = JSON.parse(user)
        if (parsed.role === 'researcher' || parsed.role === 'student') {
          setIsResearchMode(true)
        }
      }
    } catch {}
  }, [])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      {/* Removed navigation bar to match requested layout */}

      <main style={{ flex: '1' }} className="w-full px-4 sm:px-6 py-4 sm:py-8 flex-grow">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Queen Cell</h1>
            </div>
            {/* Inline Back Button next to heading */}
            <a href={isResearchMode ? "/research-mode/playground" : "/dashboard"} title="Back" className="flex items-center justify-center p-2 bg-white/90 dark:bg-gray-900/80 rounded-xl shadow hover:bg-amber-100 dark:hover:bg-amber-800/80 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </a>
          </div>
          <p className="text-amber-700/70 dark:text-amber-300/70 ml-12 sm:ml-14 text-sm sm:text-base">
            Upload or capture an image to analyze queen cell maturity
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="flex w-full max-w-md overflow-x-auto mb-6 sm:mb-8 bg-amber-100/50 dark:bg-amber-900/30 p-1 rounded-xl gap-1">
            <TabsTrigger value="analyze" className="flex-1 px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-sm text-amber-800 dark:text-amber-200">Analyze</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1 px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-sm text-amber-800 dark:text-amber-200">Logs</TabsTrigger>
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
                      onClick={() => { localStorage.clear(); showDialog('Success', 'Storage cleared!') }}
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

      {/* Custom Dialog Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDialogOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-xl border border-amber-200 dark:border-amber-700/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100">{dialogContent.title}</h3>
              </div>
              <button onClick={() => setDialogOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-amber-800 dark:text-amber-200 mb-4">{dialogContent.message}</p>
            {dialogContent.tips.length > 0 && (
              <ul className="space-y-2 mb-6">
                {dialogContent.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setDialogOpen(false)}
              className="w-full px-4 py-2.5 bg-[#FFA95C] hover:bg-[#FF9A3C] text-white rounded-xl font-semibold transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
