"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Clock, TrendingUp, Check } from "lucide-react"
import ImageWithMasks from "./image-with-masks"

interface QueenCellResult {
  id: number
  type: string
  percentage: number
  estimatedHatchingDays: number
  confidence: number
  description: string
}

interface Results {
  totalQueenCells: number
  cells: QueenCellResult[]
  recommendations: string[]
  imagePreview: string
}

interface QueenCellResultsProps {
  results: Results | null
}

export default function QueenCellResults({ results }: QueenCellResultsProps) {
  const [showToast, setShowToast] = useState(false)
  
  if (!results) return null
  
  const handleSave = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const getCellColor = (type: string) => {
    const normalized = type.toLowerCase().replace(/[\s-]/g, '')
    if (normalized.includes('mature') && !normalized.includes('semi')) return "bg-purple-600"
    if (normalized.includes('semi')) return "bg-blue-700"
    if (normalized.includes('capped')) return "bg-yellow-500"
    if (normalized.includes('open')) return "bg-orange-500"
    if (normalized.includes('failed')) return "bg-red-600"
    return "bg-gray-500"
  }

  const getCellLightColor = (type: string) => {
    switch (type) {
      case "Mature":
        return "bg-purple-50 text-purple-600"
      case "Semi-Mature":
        return "bg-yellow-50 text-warning"
      case "Capped":
        return "bg-blue-50 text-info"
      case "Open":
        return "bg-blue-50 text-info"
      default:
        return "bg-gray-50 text-muted"
    }
  }

  return (
    <div className="space-y-8">
      {/* Image Preview with Bounding Boxes */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="relative">
          <ImageWithMasks 
            imageUrl={results.imagePreview || "/placeholder.svg"}
            detections={results.cells.map(cell => ({
              id: cell.id,
              type: cell.type,
              bbox: cell.bbox || [0, 0, 0, 0],
              confidence: cell.confidence,
              mask: cell.mask
            }))}
          />
          <div className="absolute top-6 right-6 bg-accent text-white px-4 py-2 rounded-lg font-semibold">
            {results.totalQueenCells} Cells Detected
          </div>
        </div>
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
                  <div className={`p-3 rounded-lg text-white font-bold text-lg ${getCellColor(cell.type)}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-text-primary">{cell.type} Queen Cell</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCellLightColor(cell.type)}`}>
                        {cell.percentage}%
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
                <div className={`h-full ${getCellColor(cell.type)}`} style={{ width: `${cell.percentage}%` }} />
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
        className="w-full px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors cursor-pointer"
      >
        Save This Analysis
      </button>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <Check className="w-5 h-5" />
          <span className="font-medium">Analysis saved successfully!</span>
        </div>
      )}
    </div>
  )
}
