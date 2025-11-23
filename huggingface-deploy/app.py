import gradio as gr
from ultralytics import YOLO
import numpy as np
import base64
import cv2

model = YOLO('best-seg.pt')

CLASS_NAMES = {0: 'Capped Cell', 1: 'Failed Cell', 2: 'Matured Cell', 3: 'Open Cell', 4: 'Semi-Matured Cell'}
MATURITY_MAP = {
    'Open Cell': {'days': 10, 'percentage': 10, 'description': 'Elongated, open-ended; larva is seen (3-5 days old)'},
    'Capped Cell': {'days': 7, 'percentage': 40, 'description': 'Partially sealed cell; transition stage (4-6 days old)'},
    'Semi-Matured Cell': {'days': 5, 'percentage': 70, 'description': 'Uniform color (5-8 days old)'},
    'Matured Cell': {'days': 2, 'percentage': 95, 'description': 'Conical tip dark; ready to hatch'},
    'Failed Cell': {'days': 0, 'percentage': 0, 'description': 'Dead cell; failed process'}
}

def analyze(image):
    results = model(image)
    detections = []
    distribution = {'open': 0, 'capped': 0, 'mature': 0, 'semiMature': 0, 'failed': 0}
    
    for r in results:
        boxes = r.boxes
        masks = r.masks
        
        if boxes is not None:
            for i, box in enumerate(boxes):
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                class_name = CLASS_NAMES.get(cls, 'Unknown')
                maturity_info = MATURITY_MAP.get(class_name, {'days': 0, 'percentage': 0, 'description': 'Unknown'})
                
                mask_data = None
                if masks is not None and i < len(masks.data):
                    mask = masks.data[i].cpu().numpy().astype('uint8') * 255
                    mask_encoded = base64.b64encode(mask.tobytes()).decode('utf-8')
                    mask_data = {'data': mask_encoded, 'shape': list(mask.shape)}
                
                detections.append({
                    'id': i + 1,
                    'type': class_name,
                    'confidence': round(conf * 100),
                    'bbox': [int(x1), int(y1), int(x2-x1), int(y2-y1)],
                    'percentage': maturity_info['percentage'],
                    'estimatedHatchingDays': maturity_info['days'],
                    'description': maturity_info['description'],
                    'mask': mask_data
                })
                
                if 'Semi-Matured' in class_name:
                    distribution['semiMature'] += 1
                elif 'Matured' in class_name:
                    distribution['mature'] += 1
                elif 'Capped' in class_name:
                    distribution['capped'] += 1
                elif 'Open' in class_name:
                    distribution['open'] += 1
                elif 'Failed' in class_name:
                    distribution['failed'] += 1
    
    recommendations = []
    if distribution['mature'] > 0:
        recommendations.append(f"Monitor {distribution['mature']} mature cell(s) for emergence within 2-3 days")
    if distribution['failed'] > 0:
        recommendations.append(f"Remove {distribution['failed']} failed cell(s) to prevent disease")
    if len(detections) > 5:
        recommendations.append('High queen cell count - consider swarm prevention measures')
    
    return {
        'totalQueenCells': len(detections),
        'cells': detections,
        'maturityDistribution': distribution,
        'recommendations': recommendations if recommendations else ['Continue regular monitoring']
    }

demo = gr.Interface(
    fn=analyze,
    inputs=gr.Image(type="numpy"),
    outputs=gr.JSON(),
    title="iBrood Queen Cell Analyzer",
    api_name="analyze"
)

demo.launch()
