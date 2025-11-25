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
    
    // Try Flask API first (port 5000)
    try {
      const host = window.location.hostname
      const flaskEndpoint = `http://${host}:5000/analyze`
      console.log(`📡 Trying Flask API at ${flaskEndpoint}`)
      
      const flaskResponse = await fetch(flaskEndpoint, {
        method: 'POST',
        body: JSON.stringify({image: imageData}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
      
      if (flaskResponse.ok) {
        const result = await flaskResponse.json()
        console.log('✅ Flask API Results:', result)
        return result
      }
    } catch (error) {
      console.warn('Flask API unavailable:', error)
    }
    
    // Try Next.js API route
    try {
      const nextEndpoint = '/api/predict'
      console.log(`📡 Trying Next.js API at ${nextEndpoint}`)
      
      const nextResponse = await fetch(nextEndpoint, {
        method: 'POST',
        body: JSON.stringify({data: [imageData]}),
        headers: {'Content-Type': 'application/json'}
      })
      
      if (nextResponse.ok) {
        const result = await nextResponse.json()
        console.log('✅ Next.js API Results:', result)
        return {...result.data[1], imagePreview: imageData}
      }
    } catch (error) {
      console.warn('Next.js API unavailable:', error)
    }
    
    // No fallback - throw error if APIs fail
    throw new Error('All API endpoints failed. Please check your connection and try again.')
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
