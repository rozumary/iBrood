from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import os
import logging
from PIL import Image
import io
import base64
import cv2
import numpy as np

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

# ==================== LOAD MODELS ====================
# Set environment variables for headless operation
os.environ['DISPLAY'] = ':0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'
os.environ['OPENCV_IO_ENABLE_OPENEXR'] = '0'

# Queen Cell Model (Segmentation)
queen_model = None
# Brood Model (Object Detection)
brood_model = None

try:
    import cv2
    logger.info("OpenCV imported successfully")
    
    # Load Queen Cell Model (best-seg.pt)
    if os.path.exists('best-seg.pt'):
        file_size = os.path.getsize('best-seg.pt')
        logger.info(f"Queen model file size: {file_size} bytes")
        
        if file_size > 1000:
            queen_model = YOLO('best-seg.pt')
            logger.info("Queen Cell model (best-seg.pt) loaded successfully")
        else:
            logger.error("Queen model file too small, likely corrupted")
    else:
        logger.error("Queen model file 'best-seg.pt' not found")
    
    # Load Brood Model (best-od.pt)
    if os.path.exists('best-od.pt'):
        file_size = os.path.getsize('best-od.pt')
        logger.info(f"Brood model file size: {file_size} bytes")
        
        if file_size > 1000:
            brood_model = YOLO('best-od.pt')
            logger.info("Brood model (best-od.pt) loaded successfully")
        else:
            logger.error("Brood model file too small, likely corrupted")
    else:
        logger.error("Brood model file 'best-od.pt' not found")
        
except ImportError as e:
    logger.error(f"OpenCV import error: {e}")
except Exception as e:
    logger.error(f"Error loading models: {e}")

# ==================== CLASS CONFIGURATIONS ====================
# Queen Cell Classes
QUEEN_CLASS_NAMES = {
    0: 'Capped Cell', 
    1: 'Failed Cell', 
    2: 'Matured Cell', 
    3: 'Open Cell', 
    4: 'Semi-Matured Cell'
}

QUEEN_COLORS = {
    0: (0, 93, 253),      # Orange for Capped
    1: (0, 0, 255),       # Red for Failed
    2: (255, 0, 119),     # Purple for Matured
    3: (255, 0, 25),      # Blue for Open
    4: (236, 229, 10)     # Cyan for Semi-Mature
}

# Brood Classes - ONLY 3 CLASSES
BROOD_CLASS_NAMES = {
    0: 'egg',
    1: 'larva',
    2: 'pupa'
}

# Vibrant/Neon colors matching queen cell style (BGR format)
BROOD_COLORS = {
    0: (0, 165, 255),     # Orange for Egg (BGR)
    1: (255, 255, 0),     # Cyan for Larva (BGR)
    2: (255, 0, 119)      # Purple/Magenta for Pupa (BGR)
}

# Text colors for labels (matching box colors)
BROOD_TEXT_COLORS = {
    0: (0, 165, 255),     # Orange for Egg
    1: (255, 255, 0),     # Cyan for Larva  
    2: (255, 0, 119)      # Purple for Pupa
}

BROOD_CLASS_ATTRIBUTES = {
    "egg": {
        "display_name": "Egg",
        "description": "Early development stage - tiny white elongated shape",
        "age": "1-3 days old",
        "health": "HEALTHY"
    },
    "larva": {
        "display_name": "Larva",
        "description": "Active growth stage - C-shaped white grub",
        "age": "3-8 days old",
        "health": "HEALTHY"
    },
    "pupa": {
        "display_name": "Pupa",
        "description": "Pre-emergence stage - capped cell with developing bee",
        "age": "8-21 days old",
        "health": "HEALTHY"
    }
}

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
            <h1> iBrood Detection API</h1>
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
                    const response = await fetch('/brood_detect', {
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
    # List files in current directory for debugging
    current_dir_files = os.listdir('.') if os.path.exists('.') else []
    
    return {
        "status": "healthy", 
        "message": "iBrood Detection API is running",
        "queen_model_loaded": queen_model is not None,
        "brood_model_loaded": brood_model is not None,
        "queen_model_file_exists": os.path.exists('best-seg.pt'),
        "brood_model_file_exists": os.path.exists('best-od.pt'),
        "files_in_directory": current_dir_files
    }

# ==================== HELPER FUNCTIONS ====================
def optimize_image_for_inference(image, max_size=1280):
    """Resize image if too large to speed up inference"""
    width, height = image.size
    if max(width, height) > max_size:
        ratio = max_size / max(width, height)
        new_size = (int(width * ratio), int(height * ratio))
        return image.resize(new_size, Image.LANCZOS), ratio
    return image, 1.0

# ==================== DETECTION FUNCTIONS ====================
def process_queen_detection(results, original_image):
    """Process YOLO results for Queen Cell detection with segmentation masks"""
    detections = []
    
    img_array = np.array(original_image)
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    
    for result in results:
        if result.boxes is not None:
            boxes_data = result.boxes
            masks_data = result.masks if hasattr(result, 'masks') and result.masks is not None else None
            
            for idx, box in enumerate(boxes_data):
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                
                detection = {
                    "confidence": conf,
                    "class": cls,
                    "bbox": [x1, y1, x2, y2]
                }
                
                # Extract segmentation mask if available
                if masks_data is not None and idx < len(masks_data.data):
                    try:
                        mask = masks_data.data[idx].cpu().numpy()
                        mask_height, mask_width = mask.shape
                        
                        # Convert mask to polygon points for frontend rendering
                        binary_mask = (mask * 255).astype(np.uint8)
                        contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                        
                        if contours:
                            # Get the largest contour (main mask area)
                            largest_contour = max(contours, key=cv2.contourArea)
                            # Simplify the contour to reduce points
                            epsilon = 0.005 * cv2.arcLength(largest_contour, True)
                            approx = cv2.approxPolyDP(largest_contour, epsilon, True)
                            
                            # Scale contour points to original image size
                            # PIL Image.size returns (width, height)
                            img_width, img_height = original_image.size
                            scale_x = img_width / mask_width
                            scale_y = img_height / mask_height
                            
                            # Convert to list of [x, y] points
                            polygon_points = []
                            for point in approx:
                                px, py = point[0]
                                polygon_points.append([float(px * scale_x), float(py * scale_y)])
                            
                            detection["mask"] = {
                                "type": "polygon",
                                "points": polygon_points,
                                "imageShape": [img_height, img_width]
                            }
                    except Exception as e:
                        logger.warning(f"Mask extraction failed: {e}")
                
                detections.append(detection)
                
                color = QUEEN_COLORS.get(cls, (255, 255, 255))
                cv2.rectangle(img_array, (x1, y1), (x2, y2), color, 2)
                
                label = f"{QUEEN_CLASS_NAMES.get(cls, 'Unknown')} {conf:.0%}"
                cv2.putText(img_array, label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
    
    annotated_image = Image.fromarray(img_array)
    
    buffered = io.BytesIO()
    annotated_image.save(buffered, format="JPEG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    return {
        "detections": detections, 
        "count": len(detections),
        "annotated_image": f"data:image/jpeg;base64,{img_base64}"
    }

def process_brood_detection(results, original_image, show_labels=True):
    """Process YOLO results for Brood detection with health assessment"""
    detections = []
    counts = {"egg": 0, "larva": 0, "pupa": 0}
    
    img_array = np.array(original_image)
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    
    # Styling - THIN lines for clean modern look like the screenshot
    thickness = 1  # Thin line
    font_scale = 0.35  # Small font
    font_thickness = 1
    
    for result in results:
        if result.boxes is not None:
            boxes_data = result.boxes
            
            for idx, box in enumerate(boxes_data):
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                
                class_name = BROOD_CLASS_NAMES.get(cls, 'unknown')
                
                detection = {
                    "confidence": conf,
                    "class": cls,
                    "class_name": class_name,
                    "bbox": [x1, y1, x2, y2],
                    "attributes": BROOD_CLASS_ATTRIBUTES.get(class_name, {})
                }
                
                detections.append(detection)
                
                # Update counts
                if class_name in counts:
                    counts[class_name] += 1
                
                # Draw THIN bounding box - clean modern style
                color = BROOD_COLORS.get(cls, (255, 255, 255))
                cv2.rectangle(img_array, (x1, y1), (x2, y2), color, thickness)
                
                # Only draw labels if show_labels is True - JUST PERCENTAGE
                if show_labels:
                    label = f"{int(conf * 100)}%"  # Just percentage, no class name
                    text_color = BROOD_TEXT_COLORS.get(cls, (255, 255, 255))
                    # Position inside box at top-left corner
                    cv2.putText(img_array, label, (x1 + 2, y1 + 12), cv2.FONT_HERSHEY_SIMPLEX, font_scale, text_color, font_thickness)
    
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
    
    annotated_image = Image.fromarray(img_array)
    
    buffered = io.BytesIO()
    annotated_image.save(buffered, format="PNG")  # PNG for better quality
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    # Calculate health assessment
    total_brood = counts["egg"] + counts["larva"] + counts["pupa"]
    total_cells = total_brood
    
    health_status = "UNKNOWN"
    health_score = 0
    recommendations = []
    
    if total_cells > 0:
        # Calculate health based on brood distribution
        egg_ratio = counts["egg"] / total_cells if total_cells > 0 else 0
        larva_ratio = counts["larva"] / total_cells if total_cells > 0 else 0
        pupa_ratio = counts["pupa"] / total_cells if total_cells > 0 else 0
        
        # Good brood pattern has balanced stages
        if egg_ratio > 0.1 and larva_ratio > 0.2 and pupa_ratio > 0.2:
            health_status = "EXCELLENT"
            health_score = 95
            recommendations.append("Colony is thriving with excellent brood pattern")
        elif (egg_ratio > 0 or larva_ratio > 0.3) and pupa_ratio > 0.1:
            health_status = "GOOD"
            health_score = 80
            recommendations.append("Healthy brood pattern - continue regular monitoring")
        elif total_brood > 10:
            health_status = "FAIR"
            health_score = 60
            recommendations.append("Moderate brood presence - check queen activity")
        else:
            health_status = "POOR"
            health_score = 30
            recommendations.append("Low brood count - inspect for queen issues")
        
        # Additional recommendations based on counts
        if counts["egg"] == 0 and total_brood > 0:
            recommendations.append("No eggs detected - verify queen is laying")
        if counts["larva"] > counts["pupa"] * 3:
            recommendations.append("High larva count - ensure adequate food supply")
        if counts["pupa"] == 0 and counts["larva"] > 0:
            recommendations.append("No pupae detected - monitor for development issues")
    
    return {
        "detections": detections,
        "count": len(detections),
        "counts": counts,
        "health": {
            "status": health_status,
            "score": health_score,
            "total_brood": total_brood,
            "total_cells": total_cells
        },
        "recommendations": recommendations if recommendations else ["Continue regular monitoring"],
        "annotated_image": f"data:image/png;base64,{img_base64}"
    }

# ==================== QUEEN DETECTION ====================
@app.post("/queen_detect")
async def detect_queen(file: UploadFile = File(...)):
    try:
        if queen_model is None:
            return JSONResponse({
                "error": "Queen model not loaded", 
                "message": "Model file 'best-seg.pt' may be missing or corrupted."
            }, status_code=500)
            
        logger.info("Starting Queen Cell Detection...")
        
        file_content = await file.read()
        image = Image.open(io.BytesIO(file_content))
        
        # Optimize for faster inference
        optimized_image, _ = optimize_image_for_inference(image, max_size=1280)
        
        results = queen_model(optimized_image, verbose=False)
        response = process_queen_detection(results, optimized_image)
        
        logger.info(f"Queen detection completed: {response['count']} detections")
        return response
        
    except Exception as e:
        logger.error(f"Error in queen detection: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)

def process_brood_detection_optimized(results, original_image, optimized_image, scale_ratio):
    """Optimized: Process YOLO results and generate both annotated versions in one pass"""
    detections = []
    counts = {"egg": 0, "larva": 0, "pupa": 0}
    
    # Work on original image for output quality
    img_array = np.array(original_image)
    if len(img_array.shape) == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    
    img_with_labels = img_array.copy()
    img_no_labels = img_array.copy()
    
    thickness = 1
    font_scale = 0.35
    font_thickness = 1
    
    for result in results:
        if result.boxes is not None:
            for idx, box in enumerate(result.boxes):
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                # Scale coordinates back to original image size
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                if scale_ratio != 1.0:
                    x1 = int(x1 / scale_ratio)
                    y1 = int(y1 / scale_ratio)
                    x2 = int(x2 / scale_ratio)
                    y2 = int(y2 / scale_ratio)
                
                class_name = BROOD_CLASS_NAMES.get(cls, 'unknown')
                
                detection = {
                    "confidence": conf,
                    "class": cls,
                    "class_name": class_name,
                    "bbox": [x1, y1, x2, y2],
                    "attributes": BROOD_CLASS_ATTRIBUTES.get(class_name, {})
                }
                detections.append(detection)
                
                if class_name in counts:
                    counts[class_name] += 1
                
                color = BROOD_COLORS.get(cls, (255, 255, 255))
                text_color = BROOD_TEXT_COLORS.get(cls, (255, 255, 255))
                
                # Draw on both images
                cv2.rectangle(img_no_labels, (x1, y1), (x2, y2), color, thickness)
                cv2.rectangle(img_with_labels, (x1, y1), (x2, y2), color, thickness)
                
                # Labels only on one version
                label = f"{int(conf * 100)}%"
                cv2.putText(img_with_labels, label, (x1 + 2, y1 + 12), cv2.FONT_HERSHEY_SIMPLEX, font_scale, text_color, font_thickness)
    
    # Convert back to RGB
    img_no_labels = cv2.cvtColor(img_no_labels, cv2.COLOR_BGR2RGB)
    img_with_labels = cv2.cvtColor(img_with_labels, cv2.COLOR_BGR2RGB)
    
    # Encode images
    buf1 = io.BytesIO()
    Image.fromarray(img_no_labels).save(buf1, format="PNG", optimize=True)
    img_no_labels_b64 = base64.b64encode(buf1.getvalue()).decode()
    
    buf2 = io.BytesIO()
    Image.fromarray(img_with_labels).save(buf2, format="PNG", optimize=True)
    img_with_labels_b64 = base64.b64encode(buf2.getvalue()).decode()
    
    # Health assessment
    total_brood = sum(counts.values())
    health_status, health_score, recommendations = "UNKNOWN", 0, []
    
    if total_brood > 0:
        egg_r = counts["egg"] / total_brood
        larva_r = counts["larva"] / total_brood
        pupa_r = counts["pupa"] / total_brood
        
        if egg_r > 0.1 and larva_r > 0.2 and pupa_r > 0.2:
            health_status, health_score = "EXCELLENT", 95
            recommendations.append("Colony is thriving with excellent brood pattern")
        elif (egg_r > 0 or larva_r > 0.3) and pupa_r > 0.1:
            health_status, health_score = "GOOD", 80
            recommendations.append("Healthy brood pattern - continue regular monitoring")
        elif total_brood > 10:
            health_status, health_score = "FAIR", 60
            recommendations.append("Moderate brood presence - check queen activity")
        else:
            health_status, health_score = "POOR", 30
            recommendations.append("Low brood count - inspect for queen issues")
        
        if counts["egg"] == 0 and total_brood > 0:
            recommendations.append("No eggs detected - verify queen is laying")
    
    return {
        "detections": detections,
        "count": len(detections),
        "counts": counts,
        "health": {"status": health_status, "score": health_score, "total_brood": total_brood, "total_cells": total_brood},
        "recommendations": recommendations or ["Continue regular monitoring"],
        "annotated_image": f"data:image/png;base64,{img_no_labels_b64}",
        "annotated_image_with_labels": f"data:image/png;base64,{img_with_labels_b64}"
    }

# ==================== BROOD DETECTION ====================
@app.post("/brood_detect")
async def detect_brood(file: UploadFile = File(...), show_labels: bool = False):
    try:
        if brood_model is None:
            return JSONResponse({
                "error": "Brood model not loaded", 
                "message": "Model file 'best-od.pt' may be missing or corrupted."
            }, status_code=500)
            
        logger.info("Starting Brood Detection...")
        
        file_content = await file.read()
        image = Image.open(io.BytesIO(file_content))
        
        # Optimize image size for faster inference
        optimized_image, scale_ratio = optimize_image_for_inference(image, max_size=1280)
        
        # Run inference ONCE
        results = brood_model(optimized_image, verbose=False)
        
        # Process results and generate BOTH annotated versions in one pass
        response = process_brood_detection_optimized(results, image, optimized_image, scale_ratio)
        
        logger.info(f"Brood detection completed: {response['count']} detections")
        return response
        
    except Exception as e:
        logger.error(f"Error in brood detection: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)

# ==================== ANALYZE ENDPOINT (Frontend Compatibility) ====================
@app.post("/analyze")
async def analyze_image(request: Request):
    """
    Compatibility endpoint for frontend - expects JSON with base64 image
    Returns queen cell analysis with segmentation masks
    """
    try:
        logger.info("STARTING ANALYSIS FROM FRONTEND...")
        
        data = await request.json()
        image_data = data.get('image', '')
        
        if not image_data or 'data:image' not in image_data:
            return JSONResponse(
                content={"error": "Invalid image format"},
                status_code=400
            )
        
        # Extract base64 data
        image_base64 = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_base64)
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        img_width, img_height = image.size
        
        if queen_model is None:
            return JSONResponse(
                content={"error": "Queen model not loaded"},
                status_code=500
            )
        
        # Optimize image for faster inference
        optimized_image, scale_ratio = optimize_image_for_inference(image, max_size=1280)
        
        # Run YOLO inference with verbose=False for speed
        results = queen_model(optimized_image, verbose=False)
        
        cells = []
        maturity_distribution = {
            "open": 0,
            "capped": 0,
            "mature": 0,
            "semiMature": 0,
            "failed": 0
        }
        
        # Class info for recommendations
        class_info = {
            "Open Cell": {"days": 5, "desc": "Newly formed queen cell, larva visible", "maturity": 20},
            "Capped Cell": {"days": 4, "desc": "Sealed cell, pupa developing inside", "maturity": 50},
            "Semi-Matured Cell": {"days": 2, "desc": "Development progressing, darkening tip", "maturity": 75},
            "Matured Cell": {"days": 1, "desc": "Ready to emerge, dark conical tip", "maturity": 95},
            "Failed Cell": {"days": 0, "desc": "Development stopped, cell failed", "maturity": 0}
        }
        
        for result in results:
            if result.boxes is not None:
                boxes_data = result.boxes
                masks_data = result.masks if hasattr(result, 'masks') and result.masks is not None else None
                
                for idx, box in enumerate(boxes_data):
                    cls = int(box.cls[0])
                    conf = float(box.conf[0])
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    
                    # Scale coordinates back to original image size
                    if scale_ratio != 1.0:
                        x1 = int(x1 / scale_ratio)
                        y1 = int(y1 / scale_ratio)
                        x2 = int(x2 / scale_ratio)
                        y2 = int(y2 / scale_ratio)
                    
                    class_name = QUEEN_CLASS_NAMES.get(cls, 'Unknown')
                    info = class_info.get(class_name, {"days": 3, "desc": "Unknown cell type", "maturity": 50})
                    
                    # Update distribution
                    if class_name == "Open Cell":
                        maturity_distribution["open"] += 1
                    elif class_name == "Capped Cell":
                        maturity_distribution["capped"] += 1
                    elif class_name == "Semi-Matured Cell":
                        maturity_distribution["semiMature"] += 1
                    elif class_name == "Matured Cell":
                        maturity_distribution["mature"] += 1
                    elif class_name == "Failed Cell":
                        maturity_distribution["failed"] += 1
                    
                    cell = {
                        "id": idx + 1,
                        "type": class_name,
                        "confidence": round(conf * 100),
                        "bbox": [x1, y1, x2 - x1, y2 - y1],  # Convert to [x, y, width, height]
                        "maturityPercentage": info["maturity"],
                        "estimatedHatchingDays": info["days"],
                        "description": info["desc"]
                    }
                    
                    # Extract segmentation mask if available
                    if masks_data is not None and idx < len(masks_data.data):
                        try:
                            mask = masks_data.data[idx].cpu().numpy()
                            mask_height, mask_width = mask.shape
                            
                            # Convert mask to polygon points
                            binary_mask = (mask * 255).astype(np.uint8)
                            contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                            
                            if contours:
                                largest_contour = max(contours, key=cv2.contourArea)
                                # Less aggressive simplification for smoother masks
                                epsilon = 0.002 * cv2.arcLength(largest_contour, True)
                                approx = cv2.approxPolyDP(largest_contour, epsilon, True)
                                
                                # Scale to original image size (accounting for optimization resize)
                                opt_w, opt_h = optimized_image.size
                                scale_x = (img_width / mask_width)
                                scale_y = (img_height / mask_height)
                                
                                polygon_points = []
                                for point in approx:
                                    px, py = point[0]
                                    polygon_points.append([float(px * scale_x), float(py * scale_y)])
                                
                                cell["mask"] = {
                                    "type": "polygon",
                                    "points": polygon_points,
                                    "imageShape": [img_height, img_width]
                                }
                        except Exception as e:
                            logger.warning(f"Mask extraction failed for cell {idx + 1}: {e}")
                    
                    cells.append(cell)
        
        # Generate recommendations
        recommendations = []
        if maturity_distribution["mature"] > 0:
            recommendations.append(f"{maturity_distribution['mature']} mature cell(s) ready to emerge - monitor closely!")
        if maturity_distribution["semiMature"] > 0:
            recommendations.append(f"{maturity_distribution['semiMature']} semi-mature cell(s) - emergence in 1-2 days")
        if maturity_distribution["failed"] > 0:
            recommendations.append(f"Remove {maturity_distribution['failed']} failed cell(s) to prevent disease")
        if len(cells) > 5:
            recommendations.append("High queen cell count detected - consider swarm prevention")
        if not recommendations:
            recommendations.append("Continue regular monitoring of queen cell development")
        
        response = {
            "totalQueenCells": len(cells),
            "cells": cells,
            "maturityDistribution": maturity_distribution,
            "recommendations": recommendations,
            "imagePreview": image_data
        }
        
        logger.info(f"Analysis complete: {len(cells)} cells detected")
        return JSONResponse(content=response)
        
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )
