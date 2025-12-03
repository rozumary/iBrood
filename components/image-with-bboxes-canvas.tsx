"use client"

import { useRef, useEffect, useState } from "react"

interface Detection {
  class: number
  class_name: string
  confidence: number
  bbox: [number, number, number, number]
}

interface ImageWithBboxesCanvasProps {
  imageUrl: string
  detections: Detection[]
  showLabels: boolean
}

// Colors matching the API (Orange, Cyan, Purple)
const BROOD_COLORS: Record<number, string> = {
  0: '#FFA500',  // Orange for Egg
  1: '#00FFFF',  // Cyan for Larva
  2: '#7700FF'   // Purple for Pupa (matching queen cell purple)
}

export default function ImageWithBboxesCanvas({ imageUrl, detections, showLabels }: ImageWithBboxesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      // Set canvas size to match image
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      detections.forEach((detection) => {
        const [x1, y1, x2, y2] = detection.bbox
        const width = x2 - x1
        const height = y2 - y1
        const color = BROOD_COLORS[detection.class] || '#FFFFFF'

        // Draw THIN bounding box - clean modern style
        ctx.strokeStyle = color
        ctx.lineWidth = 1  // Thin line like in the screenshot
        ctx.strokeRect(x1, y1, width, height)

        // Draw percentage label if enabled - JUST THE PERCENTAGE
        if (showLabels) {
          const percentage = Math.round(detection.confidence * 100)
          const label = `${percentage}%`
          
          // Small, clean font size
          const fontSize = Math.max(10, Math.min(12, canvas.width / 80))
          ctx.font = `500 ${fontSize}px "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
          
          // Position at top-left corner of box, slightly inside
          const textX = x1 + 2
          const textY = y1 + fontSize + 2

          // Draw text with the same color as box (no background)
          ctx.fillStyle = color
          ctx.textBaseline = 'top'
          ctx.fillText(label, textX, y1 + 2)
        }
      })
    }

    if (img.complete) {
      draw()
    } else {
      img.onload = draw
    }
  }, [detections, imageUrl, showLabels])

  return (
    <div className="relative w-full">
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Analysis"
        className="hidden"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-auto max-h-[600px] object-contain mx-auto"
      />
    </div>
  )
}
