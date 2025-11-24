import gradio as gr
from ultralytics import YOLO
import numpy as np
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
    results = model(image, conf=0.25, iou=0.45)
    
    annotated = image.copy()
    detections = []
    distribution = {'open': 0, 'capped': 0, 'mature': 0, 'semiMature': 0, 'failed': 0}
    
    color_map = {
        'Open Cell': (255, 165, 0),
        'Capped Cell': (255, 255, 0),
        'Semi-Matured Cell': (225, 105, 65),
        'Matured Cell': (128, 0, 128),
        'Failed Cell': (255, 99, 71)
    }
    
    for r in results:
        boxes = r.boxes
        masks = r.masks
        
        if boxes is not None:
            for i, box in enumerate(boxes):
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                
                class_name = CLASS_NAMES.get(cls, 'Unknown')
                maturity_info = MATURITY_MAP.get(class_name, {'days': 0, 'percentage': 0, 'description': 'Unknown'})
                
                color = color_map.get(class_name, (255, 255, 255))
                
                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
                cv2.putText(annotated, f"{class_name} {conf:.0%}", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                
                if masks is not None and i < len(masks.data):
                    mask = masks.data[i].cpu().numpy()
                    mask_resized = cv2.resize(mask, (annotated.shape[1], annotated.shape[0]))
                    annotated[mask_resized > 0.5] = annotated[mask_resized > 0.5] * 0.5 + np.array(color) * 0.5
                
                detections.append({
                    'id': i + 1,
                    'type': class_name,
                    'confidence': round(conf * 100),
                    'bbox': [x1, y1, x2-x1, y2-y1],
                    'percentage': maturity_info['percentage'],
                    'estimatedHatchingDays': maturity_info['days'],
                    'description': maturity_info['description']
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
    
    result = {
        'totalQueenCells': len(detections),
        'cells': detections,
        'maturityDistribution': distribution,
        'recommendations': recommendations if recommendations else ['Continue regular monitoring']
    }
    
    return annotated, result

demo = gr.Interface(
    fn=analyze,
    inputs=gr.Image(type="numpy"),
    outputs=[gr.Image(label="Detected Queen Cells"), gr.JSON(label="Analysis Results")],
    title="iBrood Queen Cell Analyzer",
    api_name="analyze"
)

demo.launch()
