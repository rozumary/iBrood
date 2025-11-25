import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const imageData = body.data?.[0]
    
    console.log('🚀 Calling Flask API on Render...')
    
    const API_URL = process.env.API_URL || 'https://ibrood-api.onrender.com'
    
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData })
    })
    
    if (!response.ok) {
      throw new Error(`API failed with status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('✅ Flask API success')
    return NextResponse.json({ data: [null, result] })
    
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
