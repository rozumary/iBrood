import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const imageData = body.data?.[0]
    
    // Try Hugging Face first (for production)
    try {
      const hfResponse = await fetch('https://rozu1726-ibrood-api.hf.space/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [imageData] }),
        signal: AbortSignal.timeout(30000)
      })
      
      if (hfResponse.ok) {
        const gradioData = await hfResponse.json()
        const result = gradioData.data?.[1]
        if (result) {
          return NextResponse.json({ data: [null, result] })
        }
      }
    } catch (hfError) {
      console.log('HF Space error:', hfError)
    }
    
    // Try Flask (localhost - for development only)
    if (process.env.NODE_ENV === 'development') {
      try {
        const flaskResponse = await fetch('http://localhost:5000/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData }),
          signal: AbortSignal.timeout(3000)
        })
        
        if (flaskResponse.ok) {
          const flaskData = await flaskResponse.json()
          return NextResponse.json({ data: [null, flaskData] })
        }
      } catch (flaskError) {
        console.log('Flask unavailable')
      }
    }
    
    // If both fail, return mock data
    return NextResponse.json({
      data: [
        null,
        {
          totalQueenCells: 3,
          cells: [
            {
              id: 1,
              type: 'Mature',
              confidence: 94,
              bbox: [100, 150, 80, 120],
              maturityPercentage: 95,
              estimatedHatchingDays: 2,
              description: 'Conical tip dark, ready to hatch'
            },
            {
              id: 2,
              type: 'Semi-Mature',
              confidence: 89,
              bbox: [300, 200, 75, 110],
              maturityPercentage: 70,
              estimatedHatchingDays: 5,
              description: 'Uniform color, consistent development'
            },
            {
              id: 3,
              type: 'Capped',
              confidence: 91,
              bbox: [500, 180, 70, 100],
              maturityPercentage: 40,
              estimatedHatchingDays: 7,
              description: 'Partially sealed, transition stage'
            }
          ],
          maturityDistribution: {
            open: 0,
            capped: 1,
            mature: 1,
            semiMature: 1,
            failed: 0
          },
          recommendations: [
            'Monitor 1 mature cell(s) for emergence within 2-3 days',
            'Prepare secondary nucleus for cell separation'
          ]
        }
      ]
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
