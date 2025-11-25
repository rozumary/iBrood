import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const imageData = body.data?.[0]
    
    console.log('🚀 Calling Hugging Face Gradio API...')
    
    const response = await fetch('https://rozu1726-ibrood-api.hf.space/call/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [imageData] })
    })
    
    if (!response.ok) {
      throw new Error(`Call failed: ${response.status}`)
    }
    
    const { event_id } = await response.json()
    console.log('📡 Event ID:', event_id)
    
    const eventResponse = await fetch(`https://rozu1726-ibrood-api.hf.space/call/analyze/${event_id}`)
    const reader = eventResponse.body?.getReader()
    const decoder = new TextDecoder()
    
    let finalResult = null
    
    while (true) {
      const { done, value } = await reader!.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data[0] === 'complete') {
              finalResult = data[1]
            }
          } catch (e) {}
        }
      }
    }
    
    console.log('✅ Analysis complete')
    return NextResponse.json({ data: [null, finalResult] })
    
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
