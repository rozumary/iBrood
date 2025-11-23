# YOLO 11 Queen Cell Model Integration Guide

## Overview
Your YOLO 11 model integration is set up to detect and classify queen cells into 5 categories:
- **Open**: Newly formed, larva visible (10% maturity)
- **Capped**: Partially sealed, transition stage (40% maturity) 
- **Semi-Mature**: Uniform color, consistent development (70% maturity)
- **Mature**: Conical tip dark, ready to hatch (95% maturity)
- **Failed**: Development stopped, requires removal (0% maturity)

## Integration Options

### Option 1: TensorFlow.js (Browser-based)
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-converter
```

Update `lib/yolo-service.ts` line 20-21:
```typescript
import * as tf from '@tensorflow/tfjs'
this.model = await tf.loadLayersModel('/models/yolo11-queen-cell.json')
```

### Option 2: ONNX.js (Browser-based)
```bash
npm install onnxjs
```

### Option 3: API Endpoint (Recommended for production)
Create an API endpoint that runs your YOLO model server-side.

## Model File Placement
1. Convert your YOLO 11 model to web format (TensorFlow.js or ONNX)
2. Place model files in `public/models/` directory
3. Update the model path in `yolo-service.ts`

## Current Implementation
- The service is ready to accept your model
- Mock data is provided for testing
- Bounding boxes and confidence scores are supported
- Maturity percentages are calculated automatically
- Recommendations are generated based on detection results

## Next Steps
1. Convert your YOLO 11 model to web format
2. Replace the mock inference in `runInference()` method
3. Test with real images
4. Adjust confidence thresholds as needed

## Model Output Expected Format
```typescript
interface Detection {
  class: 'open' | 'capped' | 'semi-mature' | 'mature' | 'failed'
  confidence: number // 0-1
  bbox: [x, y, width, height] // pixel coordinates
}
```