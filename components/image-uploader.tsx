"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X } from "lucide-react"

interface ImageUploaderProps {
  onImageCapture: (imageData: string) => void
}

export default function ImageUploader({ onImageCapture }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        setPreview(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        setPreview(imageData)
        setIsCapturing(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = () => {
    if (preview) {
      onImageCapture(preview)
    }
  }

  const clearPreview = () => {
    setPreview(null)
  }

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="relative">
            <img
              src={preview || "/placeholder.svg"}
              alt="Hive frame preview"
              className="w-full max-h-96 object-contain rounded-lg"
            />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAnalyze}
            className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors"
          >
            Analyze Image
          </button>
          <button
            onClick={clearPreview}
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-surface-hover transition-colors"
          >
            Choose Different Image
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {/* Upload Card */}
      <div
        className="bg-surface rounded-lg border-2 border-dashed border-border p-6 sm:p-8 cursor-pointer hover:border-accent hover:bg-surface-hover transition-all group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-yellow-100 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
            <Upload className="w-8 h-8 text-accent group-hover:text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-text-primary mb-2">Upload Image</h3>
            <p className="text-sm text-muted">Click to select an image from your device</p>
          </div>
        </div>
      </div>

      {/* Camera Card */}
      <div
        className="bg-surface rounded-lg border-2 border-dashed border-border p-6 sm:p-8 cursor-pointer hover:border-accent hover:bg-surface-hover transition-all group"
        onClick={() => cameraInputRef.current?.click()}
      >
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-yellow-100 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
            <Camera className="w-8 h-8 text-accent group-hover:text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-text-primary mb-2">Take Photo</h3>
            <p className="text-sm text-muted">Use your device camera to capture</p>
          </div>
        </div>
      </div>
    </div>
  )
}
