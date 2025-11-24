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
    const endpoint = '/api/predict'
    
    console.log(`📡 Calling API at ${endpoint}`)
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({data: [imageData]}),
      headers: {'Content-Type': 'application/json'}
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const result = await response.json()
    console.log('✅ YOLO Results:', result)
    
    return {...result.data[1], imagePreview: imageData}
  }

  private async runInference(image: HTMLImageElement): Promise<Detection[]> {
    // TODO: Replace with actual YOLO inference
    // Example structure for when you integrate the real model:
    /*
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = 640
    canvas.height = 640
    ctx.drawImage(image, 0, 0, 640, 640)
    
    const imageData = ctx.getImageData(0, 0, 640, 640)
    const tensor = tf.browser.fromPixels(imageData).expandDims(0).div(255.0)
    
    const predictions = await this.model.predict(tensor)
    return this.parseYOLOOutput(predictions)
    */
    
    // Mock detections for now
    return [
      { class: 'mature', confidence: 0.94, bbox: [100, 150, 80, 120] },
      { class: 'semi-mature', confidence: 0.89, bbox: [300, 200, 75, 110] },
      { class: 'capped', confidence: 0.91, bbox: [500, 180, 70, 100] }
    ]
  }

  private processDetections(detections: Detection[], imageData: string): QueenCellAnalysis {
    const classMapping = {
      'open': { days: 10, description: 'Newly formed, larva visible' },
      'capped': { days: 7, description: 'Partially sealed, transition stage' },
      'semi-mature': { days: 5, description: 'Uniform color, consistent development' },
      'mature': { days: 2, description: 'Conical tip dark, ready to hatch' },
      'failed': { days: 0, description: 'Development stopped, requires removal' }
    }

    const distribution = { open: 0, capped: 0, mature: 0, semiMature: 0, failed: 0 }
    
    const cells = detections.map((detection, index) => {
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