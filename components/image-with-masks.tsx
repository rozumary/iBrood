"use client"

import { useRef, useEffect, useState } from "react"

interface Detection {
  id: number
  type: string
  bbox: [number, number, number, number]
  confidence: number
  mask?: {
    type?: string
    points?: number[][]
    data?: string
    shape?: [number, number]
    imageShape?: [number, number]
  }
}

interface ImageWithMasksProps {
  imageUrl: string
  detections: Detection[]
  totalCount?: number
}

export default function ImageWithMasks({ imageUrl, detections, totalCount }: ImageWithMasksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [showMasks, setShowMasks] = useState(true) // Default to showing masks
  const [showLabels, setShowLabels] = useState(false) // Default to hiding labels (less clutter)

  const getColor = (type: string) => {
    // Updated to match the correct class names
    switch (type) {
      case "Open Cell":
        return '#1900FF' // vibrant blue
      case "Capped Cell":
        return '#FD5D00' // vibrant orange
      case "Semi-Matured Cell":
        return '#0AE5EC' // cyan
      case "Matured Cell":
        return '#7700FF' // purple
      case "Failed Cell":
        return '#FF0000' // red
      default:
        return '#6b7280' // gray for unknown
    }
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
        let maskRendered = false

        // Draw segmentation overlay if masks are available and enabled
        if (showMasks && detection.mask) {
          try {
            const maskInfo = detection.mask as any

            if (maskInfo.type === 'polygon' && maskInfo.points?.length > 0) {
              const points = maskInfo.points
              const [imgHeight, imgWidth] = maskInfo.imageShape || [img.naturalHeight, img.naturalWidth]
              
              const polyScaleX = canvasWidth / imgWidth
              const polyScaleY = canvasHeight / imgHeight

              // Convert hex to RGB
              const r = parseInt(color.slice(1, 3), 16)
              const g = parseInt(color.slice(3, 5), 16)
              const b = parseInt(color.slice(5, 7), 16)

              ctx.beginPath()
              ctx.moveTo(points[0][0] * polyScaleX, points[0][1] * polyScaleY)
              
              for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0] * polyScaleX, points[i][1] * polyScaleY)
              }
              ctx.closePath()

              // Fill with semi-transparent color
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`
              ctx.fill()
              
              // Draw outline
              ctx.strokeStyle = color
              ctx.lineWidth = 2
              ctx.stroke()

              maskRendered = true
            }
          } catch (error) {
            console.warn(`⚠️ Mask failed:`, error)
          }
        }

        // Draw bounding box - always visible
        ctx.strokeStyle = color
        ctx.lineWidth = showMasks ? 2 : 2
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)

        // Fill bounding box if mask wasn't rendered but masks are enabled
        if (showMasks && !maskRendered) {
          const r = parseInt(color.slice(1, 3), 16)
          const g = parseInt(color.slice(3, 5), 16)
          const b = parseInt(color.slice(5, 7), 16)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`
          ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight)
        }

        // Only draw labels if showLabels is enabled
        if (showLabels) {
          const label = `${detection.type} ${detection.confidence}%`
          ctx.font = 'bold 14px "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          const textWidth = ctx.measureText(label).width

          // Label background - positioned above the box
          ctx.fillStyle = color
          ctx.fillRect(scaledX, scaledY - 28, textWidth + 16, 24)

          // Label text
          ctx.fillStyle = 'white'
          ctx.textBaseline = 'top'
          ctx.fillText(label, scaledX + 8, scaledY - 24)
        }
      })
    }

    if (img.complete) {
      draw()
    } else {
      img.onload = draw
    }
  }, [detections, imageUrl, showMasks, showLabels])

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowMasks(!showMasks)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showMasks 
              ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showMasks ? 'Hide Masks' : 'Show Masks'}
        </button>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showLabels 
              ? 'bg-purple-500 text-white hover:bg-purple-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
        {totalCount !== undefined && (
          <span className="bg-accent text-white px-3 py-2 rounded-lg text-sm font-semibold">
            {totalCount} Cells Detected
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">
        Toggle masks and labels for cleaner view
      </p>
      
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
