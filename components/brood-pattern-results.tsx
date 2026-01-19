"use client"

import { AlertCircle, TrendingUp, BarChart3, Heart, Activity, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import ImageWithBboxesCanvas from "./image-with-bboxes-canvas"
import { saveBroodAnalysis } from "@/lib/storage"
import { useTranslation } from "@/lib/translation-context"

interface BroodCell {
  type: string
  percentage: number
  count: number
  description: string
  color: string
}

interface Results {
  hiveHealthScore: number
  healthStatus?: string
  riskLevel: string
  broodCoverage: number
  totalDetections?: number
  counts?: {
    egg: number
    larva: number
    pupa: number
  }
  cellBreakdown: BroodCell[]
  recommendations: string[]
  imagePreview: string
  annotatedImage?: string | null
  annotatedImageWithLabels?: string | null
  originalImage?: string
  detections?: any[]
}

interface BroodPatternResultsProps {
  results: Results | null
}

export default function BroodPatternResults({ results }: BroodPatternResultsProps) {
  const { t } = useTranslation()
  const [showToast, setShowToast] = useState(false)
  const [showAnnotated, setShowAnnotated] = useState(true)
  const [showLabels, setShowLabels] = useState(false)
  const hasAutoSaved = useRef(false)
  
  // Auto-save analysis when results are displayed
  useEffect(() => {
    if (results && !hasAutoSaved.current) {
      hasAutoSaved.current = true
      saveBroodAnalysis(results)
      window.dispatchEvent(new Event('analysisUpdated'))
      console.log('Brood analysis auto-saved to storage')
    }
  }, [results])
  
  // Reset auto-save flag when results change (new analysis)
  useEffect(() => {
    return () => {
      hasAutoSaved.current = false
    }
  }, [])
  
  if (!results) return null

  const handleSave = () => {
    // Save brood analysis to storage
    saveBroodAnalysis(results)
    
    // Dispatch custom event to notify dashboard
    window.dispatchEvent(new Event('analysisUpdated'))
    
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-success text-white"
      case "medium":
        return "bg-warning text-white"
      case "high":
        return "bg-danger text-white"
      default:
        return "bg-muted text-white"
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-sky-50 border-sky-200"
      case "medium":
        return "bg-yellow-50 border-yellow-200"
      case "high":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getHealthColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "EXCELLENT":
        return "text-sky-600 bg-sky-100"
      case "GOOD":
        return "text-blue-600 bg-blue-100"
      case "FAIR":
        return "text-yellow-600 bg-yellow-100"
      case "POOR":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  // Use annotated image if available, otherwise fall back to preview
  // Show labels version if toggle is on
  const getDisplayImage = () => {
    if (!showAnnotated) {
      return results.originalImage || results.imagePreview
    }
    if (showLabels && results.annotatedImageWithLabels) {
      return results.annotatedImageWithLabels
    }
    return results.annotatedImage || results.originalImage || results.imagePreview
  }
  
  const displayImage = getDisplayImage()

  const totalDetected = results.totalDetections || 
    (results.counts ? results.counts.egg + results.counts.larva + results.counts.pupa : 0)

  return (
    <div className="space-y-8">
      {/* Image Preview with Toggle */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">Detection Results</h3>
            <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
              {totalDetected} cells detected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Show Labels Toggle */}
            {showAnnotated && results.annotatedImage && (
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showLabels 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showLabels ? 'Hide Labels' : 'Show Labels'}
              </button>
            )}
            {/* Show Original/Detections Toggle */}
            {results.annotatedImage && (
              <button
                onClick={() => setShowAnnotated(!showAnnotated)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAnnotated 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showAnnotated ? 'Show Original' : 'Show Detections'}
              </button>
            )}
          </div>
        </div>
        <div className="p-2 bg-gray-100">
          {showAnnotated && results.detections && results.detections.length > 0 ? (
            <ImageWithBboxesCanvas 
              imageUrl={results.originalImage || results.imagePreview}
              detections={results.detections}
              showLabels={showLabels}
            />
          ) : (
            <img
              src={displayImage || "/placeholder.svg"}
              alt="Brood pattern analysis"
              className="w-full h-auto max-h-[600px] object-contain mx-auto"
            />
          )}
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted">Health Score</h3>
          </div>
          <p className="text-4xl font-bold text-text-primary">{results.hiveHealthScore || 0}</p>
          <p className={`text-xs mt-2 px-2 py-1 rounded-full w-fit ${getHealthColor(results.healthStatus || '')}`}>
            {results.healthStatus || 'Analyzing...'}
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted">Risk Level</h3>
          </div>
          <p className={`text-xl font-bold px-3 py-1 rounded-full w-fit capitalize ${getRiskColor(results.riskLevel)}`}>
            {results.riskLevel || 'Unknown'}
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted">Total Detected</h3>
          </div>
          <p className="text-4xl font-bold text-text-primary">{totalDetected}</p>
          <p className="text-xs text-muted mt-2">Cells analyzed</p>
        </div>
      </div>

      {/* Individual Counts - ONLY 3 CLASSES */}
      {results.counts && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-orange-100 rounded-lg border border-orange-300 p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{results.counts.egg}</p>
            <p className="text-sm text-orange-700 font-medium">Eggs</p>
          </div>
          <div className="bg-cyan-100 rounded-lg border border-cyan-300 p-4 text-center">
            <p className="text-3xl font-bold text-cyan-600">{results.counts.larva}</p>
            <p className="text-sm text-cyan-700 font-medium">Larvae</p>
          </div>
          <div className="bg-fuchsia-100 rounded-lg border border-fuchsia-300 p-4 text-center">
            <p className="text-3xl font-bold text-fuchsia-600">{results.counts.pupa}</p>
            <p className="text-sm text-fuchsia-700 font-medium">Pupae</p>
          </div>
        </div>
      )}

      {/* Cell Type Breakdown */}
      <div className="bg-surface rounded-lg border border-border p-8">
        <h3 className="font-heading font-semibold text-xl mb-6">Brood Composition Analysis</h3>
        <div className="space-y-6">
          {results.cellBreakdown.map((cell, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${cell.color}`} />
                  <div>
                    <h4 className="font-semibold text-text-primary">{cell.type}</h4>
                    <p className="text-sm text-muted">{cell.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-text-primary">{cell.percentage}%</p>
                  <p className="text-xs text-muted">{cell.count} cells</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                <div className={`h-full ${cell.color}`} style={{ width: `${cell.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-surface rounded-lg border border-border p-8">
        <h3 className="font-heading font-semibold text-lg mb-6">Cell Distribution</h3>
        <div className="flex items-center justify-center gap-2 h-32 mb-4">
          {results.cellBreakdown.filter(c => c.percentage > 0).map((cell, index) => (
            <div
              key={index}
              className={`h-full rounded-lg ${cell.color} hover:shadow-lg transition-shadow flex items-end justify-center pb-2`}
              style={{ width: `${Math.max(cell.percentage, 5)}%`, opacity: 0.9 }}
              title={`${cell.type}: ${cell.percentage}%`}
            >
              <span className="text-xs font-bold text-white drop-shadow">{cell.percentage}%</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {results.cellBreakdown.map((cell, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${cell.color}`} />
              <span className="text-muted">
                {cell.type} ({cell.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className={`rounded-lg border p-6 ${getRiskBgColor(results.riskLevel)}`}>
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Management Recommendations</h3>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-text-primary flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Save Analysis Button */}
      <button 
        onClick={handleSave}
        className="w-full px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors"
      >
        Save This Analysis
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-sky-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <Check className="w-5 h-5" />
          <span className="font-medium">Analysis saved successfully!</span>
        </div>
      )}
    </div>
  )
}
