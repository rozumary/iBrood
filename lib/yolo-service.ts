interface Detection {
  class: string
  confidence: number
  bbox: [number, number, number, number] // [x, y, width, height]
}

interface QueenCellAnalysis {
  totalQueenCells: number
  cells: Array<{
    id: number
    type: string
    confidence: number
    bbox: [number, number, number, number]
    maturityPercentage: number
    estimatedHatchingDays: number
    description: string
  }>
  maturityDistribution: {
    open: number
    capped: number
    mature: number
    semiMature: number
    failed: number
  }
  recommendations: string[]
  imagePreview: string
}

export class YOLOQueenCellService {
  private model: any = null
  private isLoaded = false

  async loadModel() {
    if (this.isLoaded) return
    
    try {
      // Load YOLO model - replace with your actual model loading logic
      // This could be TensorFlow.js, ONNX.js, or API call
      console.log('Loading YOLO 11 model...')
      // this.model = await tf.loadLayersModel('/models/yolo11-queen-cell.json')
      this.isLoaded = true
    } catch (error) {
      console.error('Failed to load YOLO model:', error)
      throw error
    }
  }

  async analyzeImage(imageData: string): Promise<QueenCellAnalysis> {
    console.log('🔍 Starting YOLO analysis...')
    
    // Validate image data format
    if (!imageData || !imageData.includes('data:image')) {
      throw new Error('Invalid image format. Please select a valid image file.')
    }
    
    // Check image size (rough estimate from base64 length)
    const sizeInBytes = (imageData.length * 3) / 4
    if (sizeInBytes > 15 * 1024 * 1024) { // 15MB limit
      throw new Error('Image too large. Please use an image smaller than 10MB.')
    }
    
    const maxRetries = 2
    let lastError: Error | null = null
    
    // Call HuggingFace API directly
    const HF_API_URL = "https://rozu1726-ibrood-app.hf.space"
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📡 Calling HuggingFace API (attempt ${attempt})...`)
        
        // Convert base64 to blob for FormData
        const base64Data = imageData.split(',')[1]
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'image/jpeg' })
        
        // Create FormData
        const formData = new FormData()
        formData.append('file', blob, 'queen_cell_image.jpg')
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000)
        
        const response = await fetch(`${HF_API_URL}/queen_detect`, {
          method: 'POST',
          body: formData,
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const result = await response.json()
          console.log('✅ HuggingFace API Results:', result)
          
          // Transform the response to match expected format
          return {
            totalQueenCells: result.total_detections || result.totalQueenCells || 0,
            cells: result.cells || result.detections || [],
            maturityDistribution: result.maturity_distribution || result.maturityDistribution || {
              open: 0, capped: 0, mature: 0, semiMature: 0, failed: 0
            },
            recommendations: result.recommendations || [],
            imagePreview: imageData,
            annotatedImage: result.annotated_image || result.annotatedImage || null
          }
        } else {
          const errorText = await response.text()
          throw new Error(`Server error: ${response.status} - ${errorText}`)
        }
      } catch (error) {
        lastError = error as Error
        console.warn(`HuggingFace API attempt ${attempt} failed:`, error)
        
        if (attempt < maxRetries && !lastError.message.includes('abort')) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }
    
    // All attempts failed
    const errorMessage = lastError?.message || 'Unknown error'
    if (errorMessage.includes('abort') || errorMessage.includes('timeout')) {
      throw new Error('Request timed out. The server may be busy. Please try again.')
    } else if (errorMessage.includes('fetch')) {
      throw new Error('API connection failed. Please check your internet connection and try again.')
    } else {
      throw new Error(`Analysis failed: ${errorMessage}`)
    }
  }



  private removeOverlappingBoxes(detections: Detection[]): Detection[] {
    const filtered: Detection[] = []
    
    for (const detection of detections) {
      let shouldAdd = true
      
      for (let i = 0; i < filtered.length; i++) {
        const existing = filtered[i]
        const overlap = this.calculateOverlap(detection.bbox, existing.bbox)
        
        if (overlap > 0.1) { // 10% overlap threshold - more aggressive
          if (detection.confidence > existing.confidence) {
            filtered[i] = detection // Replace with higher confidence
          }
          shouldAdd = false
          break
        }
      }
      
      if (shouldAdd) {
        filtered.push(detection)
      }
    }
    
    return filtered
  }

  private calculateOverlap(bbox1: [number, number, number, number], bbox2: [number, number, number, number]): number {
    const [x1, y1, w1, h1] = bbox1
    const [x2, y2, w2, h2] = bbox2
    
    const left = Math.max(x1, x2)
    const top = Math.max(y1, y2)
    const right = Math.min(x1 + w1, x2 + w2)
    const bottom = Math.min(y1 + h1, y2 + h2)
    
    if (left >= right || top >= bottom) return 0
    
    const intersectionArea = (right - left) * (bottom - top)
    const area1 = w1 * h1
    const area2 = w2 * h2
    const unionArea = area1 + area2 - intersectionArea
    
    return intersectionArea / unionArea
  }

  private processDetections(detections: Detection[], imageData: string): QueenCellAnalysis {
    const classMapping = {
      'open': { days: 10, description: 'Newly formed, larva visible' },
      'capped': { days: 7, description: 'Partially sealed, transition stage' },
      'semi-mature': { days: 5, description: 'Uniform color, consistent development' },
      'mature': { days: 2, description: 'Conical tip dark, ready to hatch' },
      'failed': { days: 0, description: 'Development stopped, requires removal' }
    }

    // Remove overlapping boxes, keep highest confidence
    const filteredDetections = this.removeOverlappingBoxes(detections)
    
    const distribution = { open: 0, capped: 0, mature: 0, semiMature: 0, failed: 0 }
    
    const cells = filteredDetections.map((detection, index) => {
      const type = detection.class.replace('-', '')
      distribution[type as keyof typeof distribution]++
      
      const maturityPercentage = this.calculateMaturityPercentage(detection.class)
      const classInfo = classMapping[detection.class as keyof typeof classMapping]
      
      return {
        id: index + 1,
        type: detection.class.charAt(0).toUpperCase() + detection.class.slice(1).replace('-', '-'),
        confidence: Math.round(detection.confidence * 100),
        bbox: detection.bbox,
        maturityPercentage,
        estimatedHatchingDays: classInfo.days,
        description: classInfo.description
      }
    })

    const recommendations = this.generateRecommendations(distribution, cells.length)

    return {
      totalQueenCells: cells.length,
      cells,
      maturityDistribution: distribution,
      recommendations,
      imagePreview: imageData
    }
  }

  private calculateMaturityPercentage(cellType: string): number {
    const maturityMap = {
      'open': 10,
      'capped': 40,
      'semi-mature': 70,
      'mature': 95,
      'failed': 0
    }
    return maturityMap[cellType as keyof typeof maturityMap] || 0
  }

  private generateRecommendations(distribution: any, totalCells: number): string[] {
    const recommendations = []
    
    if (distribution.mature > 0) {
      recommendations.push(`Monitor ${distribution.mature} mature cell(s) for emergence within 2-3 days`)
    }
    if (distribution.failed > 0) {
      recommendations.push(`Remove ${distribution.failed} failed cell(s) to prevent disease`)
    }
    if (totalCells > 5) {
      recommendations.push('High queen cell count - consider swarm prevention measures')
    }
    if (distribution.semiMature > 0) {
      recommendations.push('Prepare secondary nucleus for cell separation')
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue regular monitoring']
  }


}

export const yoloService = new YOLOQueenCellService()

// Helper function to validate and compress images on the client side
export const validateAndCompressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      reject(new Error('Invalid file type. Please use JPEG, PNG, or WebP images.'))
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('File too large. Please use an image smaller than 10MB.'))
      return
    }
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      try {
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
        
        if (width < 320 || height < 320) {
          reject(new Error('Image too small. Minimum size is 320x320 pixels.'))
          return
        }
        
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
        resolve(compressedDataUrl)
      } catch (error) {
        reject(new Error('Failed to process image. Please try a different image.'))
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image. Please check the file and try again.'))
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try again.'))
    }
    reader.readAsDataURL(file)
  })
}
