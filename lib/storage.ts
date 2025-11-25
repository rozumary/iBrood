interface QueenCellAnalysis {
  id: string
  timestamp: number
  totalQueenCells: number
  cells: any[]
  maturityDistribution: any
  recommendations: string[]
  imagePreview: string
}

const STORAGE_KEY = 'ibrood_queen_cell_analyses'

export const saveAnalysis = (analysis: any) => {
  try {
    const analyses = getAnalyses()
    const { imagePreview, ...analysisWithoutImage } = analysis
    const newAnalysis: QueenCellAnalysis = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...analysisWithoutImage,
      imagePreview: '' // Don't store large images
    }
    analyses.unshift(newAnalysis)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses.slice(0, 20)))
    return newAnalysis
  } catch (error) {
    console.warn('Storage quota exceeded, clearing old data')
    localStorage.removeItem(STORAGE_KEY)
    return { id: Date.now().toString(), timestamp: Date.now(), ...analysis, imagePreview: '' }
  }
}

export const getAnalyses = (): QueenCellAnalysis[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const getLatestAnalysis = (): QueenCellAnalysis | null => {
  const analyses = getAnalyses()
  return analyses.length > 0 ? analyses[0] : null
}

export const getTotalInspections = (): number => {
  return getAnalyses().length
}