from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import os
import logging
from PIL import Image
import io
import base64

# ==================== INITIALIZE APP ====================
app = FastAPI(title="iBrood Detection API", version="1.0.0")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== CORS ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== LOAD MODEL ====================
os.environ['DISPLAY'] = ':0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'
os.environ['OPENCV_IO_ENABLE_OPENEXR'] = '0'

model = None
try:
    import cv2
    logger.info("Γ£à OpenCV imported successfully")
    
    if os.path.exists('best-seg.pt'):
        file_size = os.path.getsize('best-seg.pt')
        logger.info(f"Model file size: {file_size} bytes")
        
        if file_size > 1000:
            model = YOLO('best-seg.pt')
            model.overrides['verbose'] = False
            dummy_img = Image.new('RGB', (640, 640), color='white')
            _ = model(dummy_img, verbose=False)
            logger.info("Γ£à Model loaded and optimized successfully")
        else:
            logger.error("Γ¥î Model file too small, likely corrupted")
    else:
        logger.error("Γ¥î Model file 'best-seg.pt' not found")
        
except ImportError as e:
    logger.error(f"Γ¥î OpenCV import error: {e}")
except Exception as e:
    logger.error(f"Γ¥î Error loading model: {e}")

# ==================== DETECTION FUNCTIONS ====================
def process_detection(results, original_image):
    """Process YOLO results and return formatted response with annotated image"""
    import cv2
    import numpy as np
    
    detections = []
    
    # Convert PIL to OpenCV format
    img_array = np.array(original_image)
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    
    # Class names and neon colors
    class_names = {0: 'Capped', 1: 'Failed', 2: 'Matured', 3: 'Open', 4: 'Semi-Matured'}
    colors = {
        0: (0, 255, 255),      # Neon Yellow for Capped
        1: (0, 50, 255),       # Neon Red for Failed
        2: (255, 100, 255),    # Neon Purple for Matured
        3: (0, 200, 255),      # Neon Orange for Open
        4: (255, 150, 0)       # Neon Blue for Semi-Mature
    }
    
    # Text colors (lighter versions)
    text_colors = {
        0: (150, 255, 255),    # Light Yellow
        1: (150, 150, 255),    # Light Red
        2: (255, 200, 255),    # Light Purple
        3: (150, 255, 255),    # Light Orange
        4: (255, 200, 150)     # Light Blue
    }
    
    # Modern styling
    thickness = 3
    font_scale = 0.6
    
    for result in results:
        if result.boxes is not None:
            for box in result.boxes:
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                
                detection = {
                    "confidence": conf,
                    "class": cls,
                    "bbox": [x1, y1, x2, y2]
                }
                detections.append(detection)
                
                # Draw modern bounding box
                color = colors.get(cls, (255, 255, 255))
                cv2.rectangle(img_array, (x1, y1), (x2, y2), color, thickness)
                
                # Create shorter label
                label = f"{class_names.get(cls, 'Unknown')} {conf:.0%}"
                
                # Draw text with matching neon color (Space Grotesque style)
                text_color = text_colors.get(cls, (255, 255, 255))
                cv2.putText(img_array, label, (x1, y1 - 8), cv2.FONT_HERSHEY_DUPLEX, font_scale, text_color, 2)
    
    # Convert back to PIL and encode to base64
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
    
    annotated_image = Image.fromarray(img_array)
    
    # Convert to base64 with maximum speed
    buffered = io.BytesIO()
    annotated_image.save(buffered, format="JPEG", quality=70)
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    return {
        "detections": detections, 
        "count": len(detections),
        "annotated_image": f"data:image/jpeg;base64,{img_base64}"
    }

# ==================== QUEEN DETECTION ====================
@app.post("/queen_detect")
async def detect_queen(file: UploadFile = File(...)):
    try:
        if model is None:
            return JSONResponse({
                "error": "Model not loaded", 
                "message": "Model file may be corrupted. Please check the best-seg.pt file."
            }, status_code=500)
            
        # Read and process image
        file_content = await file.read()
        image = Image.open(io.BytesIO(file_content))
        
        # Keep original image size for quality
        max_size = 640
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Fast detection settings
        results = model(image, verbose=False, conf=0.3, iou=0.5, imgsz=640)
        response = process_detection(results, image)
        
        return response
        
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# ==================== BROOD DETECTION ====================
@app.post("/detect")
async def detect_brood(file: UploadFile = File(...)):
    try:
        if model is None:
            return JSONResponse({
                "error": "Model not loaded", 
                "message": "Model file may be corrupted. Please check the best-seg.pt file."
            }, status_code=500)
            
        # Read and process image
        file_content = await file.read()
        image = Image.open(io.BytesIO(file_content))
        
        # Keep original image size for quality
        max_size = 640
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Fast detection settings
        results = model(image, verbose=False, conf=0.3, iou=0.5, imgsz=640)
        response = process_detection(results, image)
        
        return response
        
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/")
async def home():
    return {"message": "iBrood Detection API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "message": "iBrood Detection API is running",
        "model_loaded": model is not None
    }
