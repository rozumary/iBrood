import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const imageData = body.data?.[0]
    
    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      )
    }
    
    console.log('Calling FastAPI API...')
    
    const API_URL = process.env.API_URL || 'http://localhost:8000'
    
    // Check FastAPI health first
    try {
      const healthCheck = await fetch(`${API_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })
      if (!healthCheck.ok) {
        console.log('FastAPI health check failed')
      }
    } catch (healthError) {
      console.log('FastAPI not responding to health check:', healthError)
    }
    
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData }),
      signal: AbortSignal.timeout(60000) // 60 second timeout
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`API failed with status: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log('FastAPI API success')
    return NextResponse.json({ data: [null, result] })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
