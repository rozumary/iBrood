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
  const analyses = getAnalyses()
  const newAnalysis: QueenCellAnalysis = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    ...analysis
  }
  analyses.unshift(newAnalysis)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses.slice(0, 50))) // Keep last 50
  return newAnalysis
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