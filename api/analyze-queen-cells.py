from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np
import base64
from PIL import Image
import io
import os
from huggingface_hub import hf_hub_download

app = Flask(__name__)
CORS(app)

# Initialize model variables
model = None
model_loaded = False

@app.route('/health', methods=['GET'])
def health_check():
    try:
        return jsonify({
            'status': 'healthy', 
            'model_loaded': model_loaded,
            'model_available': model is not None
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def load_model():
    global model, model_loaded
    
    if model_loaded and model is not None:
        return True
    
    # Try local model first (faster for production)
    local_paths = ['best-seg.pt', 'api/best-seg.pt', os.path.join(os.path.dirname(__file__), 'best-seg.pt')]
    
    for path in local_paths:
        print(f"🔍 Checking local model: {path}")
        if os.path.exists(path):
            try:
                model = YOLO(path)
                model_loaded = True
                print(f"✅ Local model loaded: {path}")
                return True
            except Exception as e:
                print(f"❌ Local model failed: {e}")
                continue
    
    # Fallback to Hugging Face with better caching
    try:
        print("🤖 Loading model from Hugging Face...")
        # Use Render's persistent storage if available
        cache_dir = os.environ.get('RENDER_CACHE_DIR', os.path.join(os.path.dirname(__file__), 'model_cache'))
        os.makedirs(cache_dir, exist_ok=True)
        
        model_path = hf_hub_download(
            repo_id="Rozu1726/ibrood-api", 
            filename="best-seg.pt",
            cache_dir=cache_dir,
            force_download=False
        )
        model = YOLO(model_path)
        model_loaded = True
        print(f"✅ Model loaded from Hugging Face: {model_path}")
        return True
    except Exception as e:
        print(f"❌ Hugging Face failed: {e}")
        model_loaded = False
        return False

# Load model on startup
load_model()

# Warm up model with dummy inference
if model is not None:
    try:
        dummy_img = np.zeros((640, 640, 3), dtype=np.uint8)
        model(dummy_img, conf=0.5)
        print("✅ Model warmed up")
    except:
        pass

CLASS_NAMES = {
    0: 'Capped Cell',
    1: 'Failed Cell', 
    2: 'Matured Cell',
    3: 'Open Cell',
    4: 'Semi-Matured Cell'
}

MATURITY_MAP = {
    'Open Cell': {'days': 10, 'percentage': 10, 'description': 'Elongated, open-ended; larva is seen (3-5 days old)'},
    'Capped Cell': {'days': 7, 'percentage': 40, 'description': 'Partially sealed cell; transition stage (4-6 days old)'},
    'Semi-Matured Cell': {'days': 5, 'percentage': 70, 'description': 'Uniform color (5-8 days old)'},
    'Matured Cell': {'days': 2, 'percentage': 95, 'description': 'Conical tip dark; dotted lines on conical tip evident; ready to hatch'},
    'Failed Cell': {'days': 0, 'percentage': 0, 'description': 'Dead cell; failed process'}
}

@app.route('/analyze', methods=['POST'])
def analyze_image():
    print('📡 Received analysis request')
    
    if model is None:
        print('❌ Model not loaded, attempting to reload...')
        if not load_model():
            return jsonify({
                'error': 'Model not available. Please check server logs.',
                'details': 'Model loading failed during startup and retry'
            }), 503
    
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
            
        print(f'🖼️ Image data length: {len(data["image"])} characters')
        
        # Validate base64 format
        if ',' not in data['image']:
            return jsonify({'error': 'Invalid image format'}), 400
            
        image_data = data['image'].split(',')[1]
        
        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Resize large images for faster processing
            if image.size[0] > 1280 or image.size[1] > 1280:
                image.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
            
            image_np = np.array(image)
        except Exception as e:
            return jsonify({'error': f'Invalid image data: {str(e)}'}), 400
        
        print('🤖 Running YOLO model inference...')
        try:
            # Optimize inference parameters
            results = model(image_np, conf=0.3, iou=0.5, imgsz=640, half=True)
            print(f'📊 Model results: {len(results)} result(s)')
        except Exception as model_error:
            return jsonify({'error': f'Model inference failed: {str(model_error)}'}), 500
        
        detections = []
        distribution = {'open': 0, 'capped': 0, 'mature': 0, 'semiMature': 0, 'failed': 0}
        
        for r in results:
            boxes = r.boxes
            masks = r.masks
            
            if boxes is not None and len(boxes) > 0:
                for i, box in enumerate(boxes):
                    try:
                        cls = int(box.cls[0])
                        conf = float(box.conf[0])
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        
                        class_name = CLASS_NAMES.get(cls, 'Unknown')
                        maturity_info = MATURITY_MAP.get(class_name, {'days': 0, 'percentage': 0, 'description': 'Unknown'})
                        
                        mask_data = None
                        if masks is not None and hasattr(masks, 'data') and i < len(masks.data):
                            try:
                                mask = masks.data[i].cpu().numpy().astype('uint8') * 255
                                mask_encoded = base64.b64encode(mask.tobytes()).decode('utf-8')
                                mask_data = {'data': mask_encoded, 'shape': list(mask.shape)}
                            except Exception as mask_error:
                                print(f'⚠️ Mask processing error: {mask_error}')
                        
                        detection = {
                            'id': i + 1,
                            'type': class_name,
                            'confidence': round(conf * 100),
                            'bbox': [int(x1), int(y1), int(x2-x1), int(y2-y1)],
                            'maturityPercentage': maturity_info['percentage'],
                            'estimatedHatchingDays': maturity_info['days'],
                            'description': maturity_info['description'],
                            'mask': mask_data
                        }
                        detections.append(detection)
                    except Exception as detection_error:
                        print(f'⚠️ Detection processing error: {detection_error}')
                        continue
                    
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
        
        recommendations = generate_recommendations(distribution, len(detections))
        
        response = {
            'totalQueenCells': len(detections),
            'cells': detections,
            'maturityDistribution': distribution,
            'recommendations': recommendations,
            'imagePreview': data['image']
        }
        
        return jsonify(response)
        
    except FileNotFoundError as e:
        return jsonify({'error': f'Model file not found: {str(e)}'}), 500
    except Exception as e:
        print(f'❌ Analysis error: {str(e)}')
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

def generate_recommendations(distribution, total_cells):
    recommendations = []
    
    if distribution['mature'] > 0:
        recommendations.append(f"Monitor {distribution['mature']} mature cell(s) for emergence within 2-3 days")
    if distribution['failed'] > 0:
        recommendations.append(f"Remove {distribution['failed']} failed cell(s) to prevent disease")
    if total_cells > 5:
        recommendations.append('High queen cell count - consider swarm prevention measures')
    if distribution['semiMature'] > 0:
        recommendations.append('Prepare secondary nucleus for cell separation')
    
    return recommendations if recommendations else ['Continue regular monitoring']

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    print(f'🚀 Starting Flask on port {port}')
    app.run(debug=debug, host='0.0.0.0', port=port)