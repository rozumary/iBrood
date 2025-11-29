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
            const maskData = detection.mask.data
            const [maskHeight, maskWidth] = detection.mask.shape

            // Check if mask data is valid
            if (!maskData || maskHeight <= 0 || maskWidth <= 0) {
              throw new Error('Invalid mask data')
            }

            const maskBytes = Uint8Array.from(atob(maskData), c => c.charCodeAt(0))

            // Create a temporary canvas for mask rendering
            const maskCanvas = document.createElement('canvas')
            maskCanvas.width = maskWidth
            maskCanvas.height = maskHeight
            const maskCtx = maskCanvas.getContext('2d')
            if (!maskCtx) throw new Error('Cannot get mask canvas context')

            // Create image data for the mask
            const imageData = maskCtx.createImageData(maskWidth, maskHeight)
            const data = imageData.data

            let hasNonZeroPixels = false

            // Draw only mask boundary pixels for accurate cell shape tracing
            for (let i = 0; i < maskHeight; i++) {
              for (let j = 0; j < maskWidth; j++) {
                const maskIdx = i * maskWidth + j
                if (maskIdx < maskBytes.length && maskBytes[maskIdx] > 0) {
                  hasNonZeroPixels = true

                  // Check if this is a boundary pixel (has at least one neighbor that is 0)
                  let isBoundary = false
                  const neighbors = [
                    [i-1, j], [i+1, j], [i, j-1], [i, j+1],
                    [i-1, j-1], [i-1, j+1], [i+1, j-1], [i+1, j+1]
                  ]

                  for (const [ni, nj] of neighbors) {
                    if (ni >= 0 && ni < maskHeight && nj >= 0 && nj < maskWidth) {
                      const neighborIdx = ni * maskWidth + nj
                      if (neighborIdx < maskBytes.length && maskBytes[neighborIdx] === 0) {
                        isBoundary = true
                        break
                      }
                    } else {
                      // Edge of mask area is also boundary
                      isBoundary = true
                      break
                    }
                  }

                  if (isBoundary) {
                    // Convert hex color to RGB
                    const r = parseInt(color.slice(1, 3), 16)
                    const g = parseInt(color.slice(3, 5), 16)
                    const b = parseInt(color.slice(5, 7), 16)

                    const pixelIdx = (i * maskWidth + j) * 4
                    data[pixelIdx] = r     // R
                    data[pixelIdx + 1] = g // G
                    data[pixelIdx + 2] = b // B
                    data[pixelIdx + 3] = 200 // Alpha (higher for boundary visibility)
                  }
                }
              }
            }

            if (!hasNonZeroPixels) {
              throw new Error('Mask has no non-zero pixels')
            }

            maskCtx.putImageData(imageData, 0, 0)

            // Position and scale the mask overlay to match the detection bounding box
            ctx.globalAlpha = 0.8
            ctx.drawImage(maskCanvas, 0, 0, maskWidth, maskHeight, scaledX, scaledY, scaledWidth, scaledHeight)
            ctx.globalAlpha = 1.0
            maskRendered = true

            console.log(`✅ Rendered mask for ${detection.type}: ${maskWidth}x${maskHeight}`)

          } catch (error) {
            console.warn(`⚠️  Mask rendering failed for ${detection.type}, using enhanced box:`, error instanceof Error ? error.message : String(error))
            // Fallback: draw enhanced bounding box only (no fill to distinguish from mask)
            ctx.strokeStyle = color
            ctx.lineWidth = 8
            ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)
            ctx.globalAlpha = 1.0
          }
        }

        if (showMasks) {
          // When masks are "shown", display filled bounding boxes with higher opacity for emphasis only if mask wasn't rendered
          ctx.strokeStyle = color
          ctx.lineWidth = 6
          ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)

          // Only fill with box if mask wasn't successfully rendered
          if (!maskRendered) {
            ctx.fillStyle = color
            ctx.globalAlpha = 0.35
            ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight)
            ctx.globalAlpha = 1.0
          }
        } else {
          // Default view: show standard bounding boxes
          ctx.strokeStyle = color
          ctx.lineWidth = 4
          ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)

          ctx.fillStyle = color
          ctx.globalAlpha = 0.15
          ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight)
          ctx.globalAlpha = 1.0
        }

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
          {showMasks ? 'Segmentation overlay - colored masks show exact queen cell boundaries' : 'Standard bounding boxes - outline detection areas'}
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
