from fastapi import FastAPI, UploadFile, File, Request
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
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
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
# Set environment variables for headless operation
os.environ['DISPLAY'] = ':0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'
os.environ['OPENCV_IO_ENABLE_OPENEXR'] = '0'

model = None
try:
    import cv2
    logger.info("✅ OpenCV imported successfully")
    
    # Check if model file exists and is valid
    if os.path.exists('best-seg.pt'):
        file_size = os.path.getsize('best-seg.pt')
        logger.info(f"Model file size: {file_size} bytes")
        
        if file_size > 1000:  # Basic size check
            model = YOLO('best-seg.pt')
            logger.info("✅ Model loaded successfully")
        else:
            logger.error("❌ Model file too small, likely corrupted")
    else:
        logger.error("❌ Model file 'best-seg.pt' not found")
        
except ImportError as e:
    logger.error(f"❌ OpenCV import error: {e}")
except Exception as e:
    logger.error(f"❌ Error loading model: {e}")
    logger.error("Model file may be corrupted. Please re-upload a valid best-seg.pt file")

# ==================== ROUTES ====================
@app.get("/", response_class=HTMLResponse)
async def home():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>iBrood Detection API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .container { text-align: center; }
            .upload-section { margin: 20px 0; padding: 20px; border: 2px dashed #ccc; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; }
            button:hover { background: #0056b3; }
            .result { margin: 20px 0; padding: 10px; background: #f8f9fa; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🐝 iBrood Detection API</h1>
            <p>Upload an image to detect queens or brood in beehive frames</p>
            
            <div class="upload-section">
                <h3>Queen Detection</h3>
                <input type="file" id="queenFile" accept="image/*">
                <button onclick="detectQueen()">Detect Queen</button>
                <div id="queenResult" class="result"></div>
            </div>
            
            <div class="upload-section">
                <h3>Brood Detection</h3>
                <input type="file" id="broodFile" accept="image/*">
                <button onclick="detectBrood()">Detect Brood</button>
                <div id="broodResult" class="result"></div>
            </div>
        </div>
        
        <script>
            async function detectQueen() {
                const fileInput = document.getElementById('queenFile');
                const resultDiv = document.getElementById('queenResult');
                
                if (!fileInput.files[0]) {
                    resultDiv.innerHTML = 'Please select an image first';
                    return;
                }
                
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                
                resultDiv.innerHTML = 'Processing...';
                
                try {
                    const response = await fetch('/queen_detect', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    resultDiv.innerHTML = `<strong>Result:</strong> ${result.count} queen(s) detected<br><pre>${JSON.stringify(result, null, 2)}</pre>`;
                } catch (error) {
                    resultDiv.innerHTML = `Error: ${error.message}`;
                }
            }
            
            async function detectBrood() {
                const fileInput = document.getElementById('broodFile');
                const resultDiv = document.getElementById('broodResult');
                
                if (!fileInput.files[0]) {
                    resultDiv.innerHTML = 'Please select an image first';
                    return;
                }
                
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                
                resultDiv.innerHTML = 'Processing...';
                
                try {
                    const response = await fetch('/detect', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    resultDiv.innerHTML = `<strong>Result:</strong> ${result.count} brood(s) detected<br><pre>${JSON.stringify(result, null, 2)}</pre>`;
                } catch (error) {
                    resultDiv.innerHTML = `Error: ${error.message}`;
                }
            }
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/health")
async def health_check():
    model_info = "Model loaded successfully" if model is not None else "Model failed to load - check best-seg.pt file"
    model_file_exists = os.path.exists('best-seg.pt')
    model_file_size = os.path.getsize('best-seg.pt') if model_file_exists else 0
    
    return {
        "status": "healthy", 
        "message": "iBrood Detection API is running",
        "model_loaded": model is not None,
        "model_info": model_info,
        "model_file_exists": model_file_exists,
        "model_file_size": model_file_size
    }

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
    
    # Class names and colors
    class_names = {0: 'Capped Cell', 1: 'Failed Cell', 2: 'Matured Cell', 3: 'Open Cell', 4: 'Semi-Matured Cell'}
    colors = {
        0: (0, 255, 255),    # Yellow for Capped
        1: (0, 0, 255),      # Red for Failed
        2: (255, 0, 255),    # Magenta for Matured
        3: (255, 165, 0),    # Orange for Open
        4: (225, 105, 65)    # Brown for Semi-Mature
    }
    
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
                
                # Draw bounding box
                color = colors.get(cls, (255, 255, 255))
                cv2.rectangle(img_array, (x1, y1), (x2, y2), color, 2)
                
                # Draw label
                label = f"{class_names.get(cls, 'Unknown')} {conf:.0%}"
                cv2.putText(img_array, label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    
    # Convert back to PIL and encode to base64
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
    
    annotated_image = Image.fromarray(img_array)
    
    # Convert to base64
    buffered = io.BytesIO()
    annotated_image.save(buffered, format="JPEG")
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
            
        logger.info("🔍 Starting Queen Detection...")
        
        # Read and process image
        file_content = await file.read()
        image = Image.open(io.BytesIO(file_content))
        
        # Run detection
        results = model(image)
        response = process_detection(results, image)
        
        logger.info(f"✅ Queen detection completed: {response['count']} detections")
        return response
        
    except Exception as e:
        logger.error(f"Error in queen detection: {str(e)}")
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
            
        logger.info("🔍 Starting Brood Detection...")
        
        # Read and process image
        file_content = await file.read()
        image = Image.open(io.BytesIO(file_content))
        
        # Run detection
        results = model(image)
        response = process_detection(results, image)
        
        logger.info(f"✅ Brood detection completed: {response['count']} detections")
        return response
        
    except Exception as e:
        logger.error(f"Error in brood detection: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)
