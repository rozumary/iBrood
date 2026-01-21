"use client"

import { useEffect, useRef } from "react"
import { CheckCircle, AlertCircle, Clock, TrendingUp } from "lucide-react"
import ImageWithMasks from "./image-with-masks"
import { saveAnalysis } from "@/lib/storage"

interface QueenCellResult {
  id: number
  type: string
  confidence: number
  bbox: [number, number, number, number]
  mask?: {
    data: string
    shape: [number, number]
  }
  maturityPercentage: number
  estimatedHatchingDays: number
  description: string
}

interface Results {
  totalQueenCells: number
  cells: QueenCellResult[]
  recommendations: string[]
  imagePreview: string
  maturityDistribution?: any
}

interface QueenCellResultsProps {
  results: Results | null
}

export default function QueenCellResults({ results }: QueenCellResultsProps) {
  const hasAutoSaved = useRef(false)
  const savedResultId = useRef<string | null>(null)
  
  // Auto-save analysis when results are displayed
  useEffect(() => {
    if (results && !hasAutoSaved.current) {
      const resultId = `${results.totalQueenCells}_${JSON.stringify(results.maturityDistribution)}`
      if (savedResultId.current === resultId) return
      
      const timer = setTimeout(() => {
        hasAutoSaved.current = true
        savedResultId.current = resultId
        saveAnalysis(results)
        window.dispatchEvent(new Event('analysisUpdated'))
        console.log('Queen cell analysis auto-saved to storage')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [results])
  
  // Reset auto-save flag when component unmounts
  useEffect(() => {
    return () => {
      hasAutoSaved.current = false
      savedResultId.current = null
    }
  }, [])
  
  if (!results) return null

  const getCellColor = (type: string) => {
    // Updated to match the correct class names and hex colors
    switch (type) {
      case "Open Cell":
        return "#1900FF" // vibrant blue
      case "Capped Cell":
        return "#FD5D00" // vibrant orange
      case "Semi-Matured Cell":
        return "#0AE5EC" // cyan
      case "Matured Cell":
        return "#7700FF" // purple
      case "Failed Cell":
        return "#FF0000" // red
      default:
        return "#6b7280" // gray
    }
  }

  const getCellLightColor = (type: string) => {
    // Exact mapping to match the correct class names
    switch (type) {
      case "Open Cell":
        return "bg-blue-50 text-blue-600"
      case "Capped Cell":
        return "bg-orange-50 text-orange-600"
      case "Semi-Matured Cell":
        return "bg-cyan-50 text-cyan-600"
      case "Matured Cell":
        return "bg-purple-50 text-purple-600"
      case "Failed Cell":
        return "bg-red-50 text-red-600"
      default:
        return "bg-gray-50 text-muted"
    }
  }

  return (
    <div className="space-y-8">
      {/* Image Preview with Bounding Boxes */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <ImageWithMasks 
            imageUrl={results.imagePreview || "/placeholder.svg"}
            detections={results.cells.map(cell => ({
              id: cell.id,
              type: cell.type,
              bbox: cell.bbox || [0, 0, 0, 0],
              confidence: cell.confidence,
              mask: cell.mask
            }))}
            totalCount={results.totalQueenCells}
          />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted">Total Queen Cells</h3>
          </div>
          <p className="text-3xl font-bold text-text-primary">{results.totalQueenCells}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-sm text-muted">Earliest Emergence</h3>
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {Math.min(...results.cells.map((c) => c.estimatedHatchingDays))} days
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-sm text-muted">Avg. Confidence</h3>
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {Math.round(results.cells.reduce((sum, c) => sum + c.confidence, 0) / results.cells.length)}%
          </p>
        </div>
      </div>

      {/* Detailed Cell Analysis */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg mb-6">Cell-by-Cell Breakdown</h3>
        <div className="space-y-4">
          {results.cells.map((cell, index) => (
            <div key={cell.id} className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg text-white font-bold text-lg" style={{ backgroundColor: getCellColor(cell.type) }}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-text-primary">{cell.type}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCellLightColor(cell.type)}`}>
                        {cell.maturityPercentage}%
                      </span>
                    </div>
                    <p className="text-sm text-muted mb-2">{cell.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-text-primary">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Hatching in ~{cell.estimatedHatchingDays} days
                      </span>
                      <span className="text-success">{cell.confidence}% confidence</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${cell.maturityPercentage}%`,
                    backgroundColor: getCellColor(cell.type)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-text-primary">
                  {rec.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F910}-\u{1F96B}\u{1F980}-\u{1F9E0}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}\u{2623}\u{2626}\u{262A}\u{262E}\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}\u{269C}\u{26A0}\u{26A1}\u{26AA}\u{26AB}\u{26B0}\u{26B1}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26C8}\u{26CE}\u{26CF}\u{26D1}\u{26D3}\u{26D4}\u{26E9}\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{00A9}\u{00AE}\u{203C}\u{2049}\u{2122}\u{2139}\u{2194}-\u{2199}\u{21A9}\u{21AA}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}\u{2623}\u{2626}\u{262A}\u{262E}\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}\u{269C}\u{26A0}\u{26A1}\u{26AA}\u{26AB}\u{26B0}\u{26B1}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26C8}\u{26CE}\u{26CF}\u{26D1}\u{26D3}\u{26D4}\u{26E9}\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu, '').trim()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
