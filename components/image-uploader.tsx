"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X, Search } from "lucide-react"

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
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)')
        return
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image too large. Please select an image smaller than 10MB.')
        return
      }
      
      processAndResizeImage(file)
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)')
        return
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image too large. Please select an image smaller than 10MB.')
        return
      }
      
      processAndResizeImage(file)
      setIsCapturing(false)
    }
  }

  const handleAnalyze = () => {
    if (preview) {
      onImageCapture(preview)
    }
  }

  const processAndResizeImage = (file: File) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions (max 1280px on longest side)
      const maxSize = 1280
      let { width, height } = img
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }
      
      // Set canvas size
      canvas.width = width
      canvas.height = height
      
      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height)
      
      // Convert to JPEG with quality compression
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
      setPreview(compressedDataUrl)
    }
    
    img.onerror = () => {
      alert('Failed to process image. Please try a different image.')
    }
    
    // Load the image
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const clearPreview = () => {
    setPreview(null)
  }

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
          <div className="relative">
            <img
              src={preview || "/placeholder.svg"}
              alt="Hive frame preview"
              className="w-full max-h-96 object-contain rounded-xl"
            />
            <button
              onClick={clearPreview}
              className="absolute top-3 right-3 p-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAnalyze}
            className="flex-1 px-6 py-4 bg-[#FFA95C] text-white rounded-xl font-semibold hover:bg-[#ff9b40] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" /> Analyze Image
          </button>
          <button
            onClick={clearPreview}
            className="px-6 py-4 border-2 border-amber-200 bg-white/80 rounded-xl font-semibold hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 text-amber-700"
          >
            Choose Different Image
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Upload Card */}
      <div
        className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-amber-200 p-8 cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
            <Upload className="w-10 h-10 text-amber-600 group-hover:text-white transition-colors" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-amber-900 mb-2 text-lg">Upload Image</h3>
            <p className="text-sm text-amber-700/70">Click to select an image from your device</p>
          </div>
        </div>
      </div>

      {/* Camera Card */}
      <div
        className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-amber-200 p-8 cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
        onClick={() => cameraInputRef.current?.click()}
      >
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
            <Camera className="w-10 h-10 text-amber-600 group-hover:text-white transition-colors" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-amber-900 mb-2 text-lg">Take Photo</h3>
            <p className="text-sm text-amber-700/70">Use your device camera to capture</p>
          </div>
        </div>
      </div>
    </div>
  )
}
