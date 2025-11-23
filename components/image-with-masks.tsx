"use client"

import { useRef, useEffect, useState } from "react"

interface Detection {
  id: number
  type: string
  bbox: [number, number, number, number]
  confidence: number
  mask?: {
    data: string
    shape: [number, number]
  }
}

interface ImageWithMasksProps {
  imageUrl: string
  detections: Detection[]
}

export default function ImageWithMasks({ imageUrl, detections }: ImageWithMasksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [showMasks, setShowMasks] = useState(false)

  const getColor = (type: string) => {
    const normalized = type.toLowerCase().replace(/[\s-]/g, '')
    if (normalized.includes('open')) return '#f97316' // orange
    if (normalized.includes('capped')) return '#eab308' // yellow
    if (normalized.includes('semi') || normalized.includes('semimatured')) return '#1d4ed8' // royal blue
    if (normalized.includes('matured') && !normalized.includes('semi')) return '#9333ea' // purple
    if (normalized.includes('failed')) return '#dc2626' // red
    return '#6b7280'
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      // Set canvas size to match image aspect ratio
      const maxWidth = 800
      const maxHeight = 600
      const imgAspect = img.naturalWidth / img.naturalHeight
      
      let canvasWidth = maxWidth
      let canvasHeight = maxWidth / imgAspect
      
      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight
        canvasWidth = maxHeight * imgAspect
      }
      
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      const scaleX = canvasWidth / img.naturalWidth
      const scaleY = canvasHeight / img.naturalHeight
      
      detections.forEach((detection) => {
        const [x, y, width, height] = detection.bbox
        const scaledX = x * scaleX
        const scaledY = y * scaleY
        const scaledWidth = width * scaleX
        const scaledHeight = height * scaleY
        
        const color = getColor(detection.type)
        
        // Draw masks if enabled and available
        if (showMasks && detection.mask) {
          try {
            const maskBytes = Uint8Array.from(atob(detection.mask.data), c => c.charCodeAt(0))
            const [maskHeight, maskWidth] = detection.mask.shape
            
            // Set overlay style for masks
            ctx.globalAlpha = 0.4
            ctx.fillStyle = color
            
            // Draw mask pixels as overlay
            for (let i = 0; i < maskHeight; i++) {
              for (let j = 0; j < maskWidth; j++) {
                const maskIdx = i * maskWidth + j
                if (maskBytes[maskIdx] > 0) {
                  const pixelX = (j / maskWidth) * canvasWidth
                  const pixelY = (i / maskHeight) * canvasHeight
                  ctx.fillRect(pixelX, pixelY, canvasWidth / maskWidth, canvasHeight / maskHeight)
                }
              }
            }
            
            ctx.globalAlpha = 1.0
          } catch (error) {
            console.error('Error rendering mask:', error)
          }
        }
        
        // Draw bounding box with thicker border
        ctx.strokeStyle = color
        ctx.lineWidth = 4
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)
        
        // Draw semi-transparent fill
        ctx.fillStyle = color
        ctx.globalAlpha = 0.15
        ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight)
        ctx.globalAlpha = 1.0
        
        // Draw label with Space Grotesk font
        const label = `${detection.type} ${detection.confidence}%`
        ctx.font = 'bold 16px "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        const textWidth = ctx.measureText(label).width
        
        // Label background
        ctx.fillStyle = color
        ctx.fillRect(scaledX, scaledY - 34, textWidth + 24, 30)
        
        // Label text
        ctx.fillStyle = 'white'
        ctx.textBaseline = 'top'
        ctx.fillText(label, scaledX + 12, scaledY - 30)
      })
    }

    if (img.complete) {
      draw()
    } else {
      img.onload = draw
    }
  }, [detections, imageUrl, showMasks])

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <button
          onClick={() => setShowMasks(!showMasks)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showMasks 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showMasks ? 'Hide Masks' : 'Show Masks'}
        </button>
        <span className="text-sm text-gray-600">
          Toggle segmentation masks overlay
        </span>
      </div>
      
      <div className="relative">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Analysis"
          className="hidden"
          crossOrigin="anonymous"
        />
        <canvas
          ref={canvasRef}
          className="border border-border rounded-lg mx-auto block"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  )
}