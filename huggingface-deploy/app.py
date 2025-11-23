import gradio as gr
from ultralytics import YOLO
import json

model = YOLO('best-seg.pt')

CLASS_NAMES = {0: 'Capped Cell', 1: 'Failed Cell', 2: 'Matured Cell', 3: 'Open Cell', 4: 'Semi-Matured Cell'}
MATURITY_MAP = {
    'Open Cell': {'days': 10, 'percentage': 10},
    'Capped Cell': {'days': 7, 'percentage': 40},
    'Semi-Matured Cell': {'days': 5, 'percentage': 70},
    'Matured Cell': {'days': 2, 'percentage': 95},
    'Failed Cell': {'days': 0, 'percentage': 0}
}

def analyze(image):
    results = model(image)
    detections = []
    distribution = {'open': 0, 'capped': 0, 'mature': 0, 'semiMature': 0, 'failed': 0}
    
    for r in results:
        if r.boxes is not None:
            for i, box in enumerate(r.boxes):
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                class_name = CLASS_NAMES.get(cls, 'Unknown')
                maturity_info = MATURITY_MAP.get(class_name, {'days': 0, 'percentage': 0})
                
                detections.append({
                    'id': i + 1,
                    'type': class_name,
                    'confidence': round(conf * 100),
                    'bbox': [int(x1), int(y1), int(x2-x1), int(y2-y1)],
                    'percentage': maturity_info['percentage'],
                    'estimatedHatchingDays': maturity_info['days']
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
    
    return json.dumps({
        'totalQueenCells': len(detections),
        'cells': detections,
        'maturityDistribution': distribution
    }, indent=2)

demo = gr.Interface(
    fn=analyze,
    inputs=gr.Image(type="numpy"),
    outputs=gr.JSON(),
    title="iBrood Queen Cell Analyzer"
)

demo.launch()
