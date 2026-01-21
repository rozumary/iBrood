// ==================== INTERFACES ====================
interface QueenCellAnalysis {
  id: string
  timestamp: number
  type: 'queen'
  totalQueenCells: number
  cells: any[]
  maturityDistribution: any
  recommendations: string[]
  imagePreview: string
}

interface BroodAnalysis {
  id: string
  timestamp: number
  type: 'brood'
  totalDetections: number
  counts: { egg: number; larva: number; pupa: number }
  healthScore: number
  healthStatus: string
  broodCoverage: number
  recommendations: string[]
  imagePreview: string
}

type Analysis = QueenCellAnalysis | BroodAnalysis

// ==================== STORAGE KEYS ====================
const getSessionKey = (base: string) => {
  if (typeof window === 'undefined') return base
  const userRaw = localStorage.getItem('ibrood_current_user')
  if (!userRaw) return base
  try {
    const user = JSON.parse(userRaw)
    // Use userId (persistent) if available, otherwise fall back to name-based key
    const userId = user.userId || `${user.name?.trim() || user.role?.trim() || 'default'}`
    const safe = userId.replace(/[^a-zA-Z0-9_-]/g, '_')
    return `${base}_${safe}`
  } catch {
    return base
  }
}
const QUEEN_STORAGE_KEY = getSessionKey('ibrood_queen_cell_analyses')
const BROOD_STORAGE_KEY = getSessionKey('ibrood_brood_analyses')
const MOCK_DATA_INITIALIZED = 'ibrood_mock_data_initialized'

// ==================== MOCK DATA INITIALIZATION ====================
// This creates sample data for demo purposes - only runs once
export const initializeMockData = () => {
  if (typeof window === 'undefined') return
  
  // Check if mock data already initialized
  if (localStorage.getItem(MOCK_DATA_INITIALIZED)) return
  
  // Create mock queen cell analyses for Dec 2-3, 2025
  const mockQueenAnalyses: QueenCellAnalysis[] = [
    {
      id: '1733184000000',
      timestamp: new Date('2025-12-02T09:00:00').getTime(),
      type: 'queen',
      totalQueenCells: 3,
      cells: [],
      maturityDistribution: { capped: 1, 'semi-mature': 1, mature: 1 },
      recommendations: ['Monitor mature cell closely', 'Prepare for potential emergence'],
      imagePreview: ''
    },
    {
      id: '1733227200000',
      timestamp: new Date('2025-12-02T14:00:00').getTime(),
      type: 'queen',
      totalQueenCells: 2,
      cells: [],
      maturityDistribution: { capped: 1, mature: 1 },
      recommendations: ['Good queen cell development', 'Continue regular monitoring'],
      imagePreview: ''
    },
    {
      id: '1733270400000',
      timestamp: new Date('2025-12-03T08:00:00').getTime(),
      type: 'queen',
      totalQueenCells: 4,
      cells: [],
      maturityDistribution: { capped: 1, 'semi-mature': 0, mature: 3 },
      recommendations: ['Multiple mature cells detected', 'Consider splitting hive'],
      imagePreview: ''
    },
    {
      id: '1733299200000',
      timestamp: new Date('2025-12-03T10:00:00').getTime(),
      type: 'queen',
      totalQueenCells: 2,
      cells: [],
      maturityDistribution: { 'semi-mature': 1, mature: 1 },
      recommendations: ['Healthy queen cell activity', 'Continue monitoring'],
      imagePreview: ''
    }
  ]

  // Create mock brood analyses for Dec 2-3, 2025
  const mockBroodAnalyses: BroodAnalysis[] = [
    {
      id: '1733180400000',
      timestamp: new Date('2025-12-02T08:00:00').getTime(),
      type: 'brood',
      totalDetections: 156,
      counts: { egg: 45, larva: 67, pupa: 44 },
      healthScore: 78,
      healthStatus: 'GOOD',
      broodCoverage: 82,
      recommendations: ['Good brood pattern', 'Queen is actively laying'],
      imagePreview: ''
    },
    {
      id: '1733220000000',
      timestamp: new Date('2025-12-02T12:00:00').getTime(),
      type: 'brood',
      totalDetections: 189,
      counts: { egg: 52, larva: 78, pupa: 59 },
      healthScore: 85,
      healthStatus: 'EXCELLENT',
      broodCoverage: 88,
      recommendations: ['Excellent colony health', 'Brood pattern is optimal'],
      imagePreview: ''
    },
    {
      id: '1733266800000',
      timestamp: new Date('2025-12-03T07:00:00').getTime(),
      type: 'brood',
      totalDetections: 134,
      counts: { egg: 38, larva: 56, pupa: 40 },
      healthScore: 75,
      healthStatus: 'GOOD',
      broodCoverage: 79,
      recommendations: ['Healthy brood development', 'Continue regular feeding'],
      imagePreview: ''
    },
    {
      id: '1733295600000',
      timestamp: new Date('2025-12-03T09:30:00').getTime(),
      type: 'brood',
      totalDetections: 167,
      counts: { egg: 48, larva: 72, pupa: 47 },
      healthScore: 82,
      healthStatus: 'EXCELLENT',
      broodCoverage: 85,
      recommendations: ['Strong colony performance', 'Excellent egg laying rate'],
      imagePreview: ''
    }
  ]

  // Save mock data
  localStorage.setItem(QUEEN_STORAGE_KEY, JSON.stringify(mockQueenAnalyses))
  localStorage.setItem(BROOD_STORAGE_KEY, JSON.stringify(mockBroodAnalyses))
  localStorage.setItem(MOCK_DATA_INITIALIZED, 'true')
  
  // Trigger update event
  window.dispatchEvent(new Event('analysisUpdated'))
}

// ==================== QUEEN CELL FUNCTIONS ====================
export const saveAnalysis = (analysis: any) => {
  try {
    const key = getSessionKey('ibrood_queen_cell_analyses')
    const analyses = getAnalyses()
    const { imagePreview, ...analysisWithoutImage } = analysis
    
    // Check if this exact analysis already exists (prevent duplicates)
    const exists = analyses.some(a => 
      a.totalQueenCells === analysis.totalQueenCells &&
      JSON.stringify(a.maturityDistribution) === JSON.stringify(analysis.maturityDistribution) &&
      Math.abs(a.timestamp - Date.now()) < 5000
    )
    if (exists) {
      console.log('Duplicate queen analysis prevented')
      return analyses[0]
    }
    
    const newAnalysis: QueenCellAnalysis = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: 'queen',
      ...analysisWithoutImage,
      imagePreview: ''
    }
    analyses.unshift(newAnalysis)
    localStorage.setItem(key, JSON.stringify(analyses.slice(0, 20)))
    return newAnalysis
  } catch (error) {
    const key = getSessionKey('ibrood_queen_cell_analyses')
    console.warn('Storage quota exceeded, clearing old data')
    localStorage.removeItem(key)
    return { id: Date.now().toString(), timestamp: Date.now(), type: 'queen', ...analysis, imagePreview: '' }
  }
}

export const getAnalyses = (): QueenCellAnalysis[] => {
  if (typeof window === 'undefined') return []
  const key = getSessionKey('ibrood_queen_cell_analyses')
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

export const getLatestAnalysis = (): QueenCellAnalysis | null => {
  const analyses = getAnalyses()
  return analyses.length > 0 ? analyses[0] : null
}

// ==================== BROOD ANALYSIS FUNCTIONS ====================
export const saveBroodAnalysis = (analysis: any) => {
  try {
    const key = getSessionKey('ibrood_brood_analyses')
    const analyses = getBroodAnalyses()
    const { imagePreview, annotatedImage, annotatedImageWithLabels, originalImage, ...analysisWithoutImage } = analysis
    
    // Check if this exact analysis already exists (prevent duplicates)
    const exists = analyses.some(a => 
      a.totalDetections === (analysis.totalDetections || 0) &&
      a.healthScore === (analysis.hiveHealthScore || analysis.health?.score || 0) &&
      JSON.stringify(a.counts) === JSON.stringify(analysis.counts || { egg: 0, larva: 0, pupa: 0 }) &&
      Math.abs(a.timestamp - Date.now()) < 5000
    )
    if (exists) {
      console.log('Duplicate brood analysis prevented')
      return analyses[0]
    }
    
    const newAnalysis: BroodAnalysis = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: 'brood',
      totalDetections: analysis.totalDetections || 0,
      counts: analysis.counts || { egg: 0, larva: 0, pupa: 0 },
      healthScore: analysis.hiveHealthScore || analysis.health?.score || 0,
      healthStatus: analysis.healthStatus || analysis.health?.status || 'Unknown',
      broodCoverage: analysis.broodCoverage || 0,
      recommendations: analysis.recommendations || [],
      imagePreview: ''
    }
    analyses.unshift(newAnalysis)
    localStorage.setItem(key, JSON.stringify(analyses.slice(0, 20)))
    return newAnalysis
  } catch (error) {
    const key = getSessionKey('ibrood_brood_analyses')
    console.warn('Storage quota exceeded, clearing old data')
    localStorage.removeItem(key)
    return { id: Date.now().toString(), timestamp: Date.now(), type: 'brood', ...analysis, imagePreview: '' }
  }
}

export const getBroodAnalyses = (): BroodAnalysis[] => {
  if (typeof window === 'undefined') return []
  const key = getSessionKey('ibrood_brood_analyses')
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

export const getLatestBroodAnalysis = (): BroodAnalysis | null => {
  const analyses = getBroodAnalyses()
  return analyses.length > 0 ? analyses[0] : null
}

// ==================== COMBINED FUNCTIONS ====================
export const getTotalInspections = (): number => {
  return getAnalyses().length + getBroodAnalyses().length
}

export const getLatestActivity = (): { queen: QueenCellAnalysis | null, brood: BroodAnalysis | null } => {
  return {
    queen: getLatestAnalysis(),
    brood: getLatestBroodAnalysis()
  }
}

export const getOverallHealthData = () => {
  const latestQueen = getLatestAnalysis()
  const latestBrood = getLatestBroodAnalysis()
  
  let healthScore = 0
  let healthStatus = 'Unknown'
  let queenCellInfo = { count: 0, mature: 0 }
  let broodCoverage = 0
  let alert = { title: 'No Recent Data', message: 'Perform an analysis to see health overview' }
  
  // Extract queen cell info
  if (latestQueen) {
    const dist = latestQueen.maturityDistribution || {}
    queenCellInfo = {
      count: latestQueen.totalQueenCells || 0,
      mature: dist.mature || 0
    }
  }
  
  // Calculate combined health score from both analyses
  if (latestBrood && latestQueen) {
    // Both analyses available - weighted average (70% brood, 30% queen)
    const broodScore = latestBrood.healthScore || 0
    
    // Queen score based on maturity distribution
    let queenScore = 0
    const dist = latestQueen.maturityDistribution || {}
    const total = latestQueen.totalQueenCells || 0
    const failed = dist.failed || 0
    const mature = dist.mature || 0
    
    if (total > 0) {
      const failureRate = failed / total
      const maturityRate = mature / total
      
      if (failureRate > 0.5) queenScore = 40 // High failure
      else if (failureRate > 0.3) queenScore = 60 // Moderate failure
      else if (mature > 3) queenScore = 70 // Too many mature (swarm risk)
      else if (maturityRate > 0.3 && maturityRate < 0.7) queenScore = 90 // Good balance
      else queenScore = 80 // Normal
    } else {
      queenScore = 85 // No queen cells is usually good
    }
    
    healthScore = Math.round(broodScore * 0.7 + queenScore * 0.3)
    healthStatus = latestBrood.healthStatus || 'Unknown'
    broodCoverage = latestBrood.broodCoverage || 0
    
    alert = {
      title: healthScore >= 80 ? 'Colony Thriving' : healthScore >= 60 ? 'Monitor Closely' : 'Action Needed',
      message: latestBrood.recommendations?.[0] || latestQueen.recommendations?.[0] || 'Continue monitoring'
    }
  } else if (latestBrood) {
    // Only brood data
    healthScore = latestBrood.healthScore || 0
    healthStatus = latestBrood.healthStatus || 'Unknown'
    broodCoverage = latestBrood.broodCoverage || 0
    
    alert = {
      title: healthScore >= 80 ? 'Colony Thriving' : 'Monitor Closely',
      message: latestBrood.recommendations?.[0] || 'Continue monitoring'
    }
  } else if (latestQueen) {
    // Only queen data - calculate score from queen cells
    const dist = latestQueen.maturityDistribution || {}
    const total = latestQueen.totalQueenCells || 0
    const failed = dist.failed || 0
    const mature = dist.mature || 0
    
    if (total === 0) {
      healthScore = 85
      healthStatus = 'GOOD'
    } else {
      const failureRate = failed / total
      const maturityRate = mature / total
      
      if (failureRate > 0.5) {
        healthScore = 45
        healthStatus = 'POOR'
      } else if (failureRate > 0.3) {
        healthScore = 65
        healthStatus = 'FAIR'
      } else if (mature > 3) {
        healthScore = 70
        healthStatus = 'FAIR'
      } else if (maturityRate > 0.3 && maturityRate < 0.7) {
        healthScore = 88
        healthStatus = 'EXCELLENT'
      } else {
        healthScore = 78
        healthStatus = 'GOOD'
      }
    }
    
    alert = {
      title: 'Queen Cell Activity',
      message: latestQueen.recommendations?.[0] || 'Continue monitoring'
    }
  }
  
  return {
    healthScore,
    healthStatus,
    queenCellInfo,
    broodCoverage,
    alert,
    hasData: !!(latestQueen || latestBrood)
  }
}