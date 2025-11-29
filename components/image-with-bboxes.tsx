"use client"

import { useRef, useEffect } from "react"

interface BoundingBox {
  id: number
  type: string
  bbox: [number, number, number, number] // [x, y, width, height]
  confidence: number
}

interface ImageWithBboxesProps {
  imageUrl: string
  detections: BoundingBox[]
}

export default function ImageWithBboxes({ imageUrl, detections }: ImageWithBboxesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const getColor = (type: string) => {
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

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawBboxes = () => {
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
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      // Calculate scale factors
      const scaleX = canvas.width / img.naturalWidth
      const scaleY = canvas.height / img.naturalHeight
      
      // Draw bounding boxes
      detections.forEach((detection) => {
        const [x, y, width, height] = detection.bbox
        const scaledX = x * scaleX
        const scaledY = y * scaleY
        const scaledWidth = width * scaleX
        const scaledHeight = height * scaleY
        
        const color = getColor(detection.type)
        
        // Draw bounding box
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)
        
        // Draw label background
        const label = `${detection.type} (${detection.confidence}%)`
        ctx.font = '14px Arial'
        const textWidth = ctx.measureText(label).width
        
        ctx.fillStyle = color
        ctx.fillRect(scaledX, scaledY - 25, textWidth + 10, 20)
        
        // Draw label text
        ctx.fillStyle = 'white'
        ctx.fillText(label, scaledX + 5, scaledY - 10)
      })
    }

    if (img.complete) {
      drawBboxes()
    } else {
      img.onload = drawBboxes
    }
  }, [detections, imageUrl])

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
        width={800}
        height={600}
        className="w-full max-h-96 object-contain border border-border rounded-lg"
      />
    </div>
  )
}
