from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from PIL import Image, ImageDraw, ImageFont
import uuid
import shutil
import os
import logging
import base64
import httpx
import json
import io

# ==================== INITIALIZE APP ====================
HF_API_URL = "https://rozu1726-ibrood-app.hf.space"

app = FastAPI()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define paths
backend_path = os.path.dirname(os.path.abspath(__file__))

# Check if running in Hugging Face Space
if os.environ.get('HF_SPACE') == '1':
    # In HF, main.py is in /app (or /app/backend) and frontend is in /app/frontend
    app_root = os.path.abspath(backend_path)
    frontend_path = os.path.join(app_root, "frontend")
else:
    # Local development: main.py is in /backend and frontend is in /frontend
    frontend_path = os.path.abspath(os.path.join(backend_path, "..", "frontend"))

templates_path = os.path.join(frontend_path, "templates")

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
if os.path.exists(os.path.join(frontend_path, "static")):
    app.mount("/static", StaticFiles(directory=os.path.join(frontend_path, "static")), name="static")

# Setup templates
templates = Jinja2Templates(directory=templates_path)

# ==================== LOCAL MODEL CONFIG ====================
# from ultralytics import YOLO
# import cv2
# import numpy as np

# Load the local model
logger.info("Using Hugging Face API for inference...")
# model = YOLO('best-seg.pt')
# logger.info("✅ Using local YOLO model for inference")

# ==================== QUEEN CELL CLASSES - ONLY 5 CLASSES ====================
# CORRECTED CLASS MAPPING - BASED ON YOUR MODEL OUTPUTS
QUEEN_CLASS_MAP = {
    0: "Capped Cell",
    1: "Failed Cell",
    2: "Matured Cell",
    3: "Open Cell",
    4: "Semi-Matured Cell"
}

QUEEN_CLASS_ATTRIBUTES = {
    "Open Cell": {
        "description": "Elongated, open-ended; larva is seen",
        "age": "3-5 days old",
        "hatching": "3-5 days until hatch",
        "color": "#1900FF"
    },
    "Capped Cell": {
        "description": "Partially sealed cell; transition stage",
        "age": "4-6 days old",
        "hatching": "1-3 days until hatch",
        "color": "#FD5D00"
    },
    "Semi-Matured Cell": {
        "description": "Uniform color; development stage",
        "age": "5-8 days old",
        "hatching": "1-2 days until hatch",
        "color": "#0AE5EC"
    },
    "Matured Cell": {
        "description": "Conical tip dark; dotted lines evident; ready to hatch",
        "age": "9-10 days old",
        "hatching": "Due anytime - IMMEDIATE HATCH EXPECTED",
        "color": "#7700FF"
    },
    "Failed Cell": {
        "description": "Dead cell; failed development process",
        "age": "Development ceased",
        "hatching": "No hatch expected",
        "color": "#FF0000"
    }
}

QUEEN_LABEL_SHORT = {
    "Open Cell": "Open",
    "Capped Cell": "Capped",
    "Semi-Matured Cell": "Semi-M",
    "Matured Cell": "MATURE",
    "Failed Cell": "Failed"
}

# ==================== BROOD CLASSES - ONLY 3 CLASSES ====================
BROOD_CLASS_MAP = {
    0: "egg",
    1: "larva",
    2: "pupa"
}

BROOD_CLASS_ATTRIBUTES = {
    "egg": {
        "display_name": "Egg",
        "description": "Early development stage",
        "age": "1-3 days old",
        "health": "HEALTHY",
        "color": "#FFD700"
    },
    "larva": {
        "display_name": "Larva",
        "description": "Active growth stage",
        "age": "3-8 days old",
        "health": "HEALTHY",
        "color": "#33CC33"
    },
    "pupa": {
        "display_name": "Pupa",
        "description": "Pre-emergence stage",
        "age": "8-12 days old",
        "health": "HEALTHY",
        "color": "#3366FF"
    }
}

# Healthy brood classes
HEALTHY_BROOD_CLASSES = {"egg", "larva", "pupa"}

# ==================== ROUTES ====================
@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    """Serve main index page"""
    try:
        return templates.TemplateResponse("index.html", {"request": request})
    except Exception as e:
        logger.error(f"Error loading index: {e}")
        return HTMLResponse("<h1>Error loading page</h1>")

@app.get("/queen.html", response_class=HTMLResponse)
async def queen_page(request: Request):
    """Serve queen detection page"""
    try:
        return templates.TemplateResponse("queen.html", {"request": request})
    except Exception as e:
        logger.error(f"Error loading queen page: {e}")
        return HTMLResponse("<h1>Error loading queen page</h1>")

@app.get("/brood.html", response_class=HTMLResponse)
async def brood_page(request: Request):
    """Serve brood status page"""
    try:
        return templates.TemplateResponse("brood.html", {"request": request})
    except Exception as e:
        logger.error(f"Error loading brood page: {e}")
        return HTMLResponse("<h1>Error loading brood page</h1>")

# ==================== QUEEN CELL DETECTION ENDPOINT ====================
@app.post("/queen_detect")
async def detect_queen(file: UploadFile = File(...)):
    """
    Detect queen cells: Open, Capped, Semi-Mature, Matured, Failed
    Returns: Maturity breakdown percentages, hatching timeline, and annotated image
    """
    try:
        logger.info("🔍 STARTING QUEEN CELL DETECTION...")

        # Read file content
        file_content = await file.read()

        # Call Hugging Face API
        async with httpx.AsyncClient(timeout=60.0) as client:
            files = {"file": (file.filename, file_content, file.content_type)}
            response = await client.post(f"{HF_API_URL}/queen_detect", files=files)
            
            if response.status_code != 200:
                logger.error(f"HF API error: {response.status_code}")
                return JSONResponse(
                    content={"error": "Model API unavailable"},
                    status_code=500
                )

        data = response.json()  # Get detections

        # Annotate the image
        img = Image.open(io.BytesIO(file_content))
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.load_default()
        except:
            font = ImageFont.truetype("arial.ttf", 15) if os.path.exists("arial.ttf") else ImageFont.load_default()
        
        for det in data.get("detections", []):
            x1, y1, x2, y2 = det["bbox"]
            cls = det["class"]
            label = QUEEN_CLASS_MAP.get(cls, str(cls))
            color = QUEEN_CLASS_ATTRIBUTES.get(label, {}).get("color", "#FF0000")
            draw.rectangle([x1, y1, x2, y2], outline=color, width=3)
            draw.text((x1, y1 - 10), label, fill=color, font=font)

        # Convert annotated image to Base64
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG")
        img_str = base64.b64encode(buffer.getvalue()).decode()

        # Prepare summary
        summary = {QUEEN_CLASS_MAP.get(d["class"], str(d["class"])): 0 for d in data.get("detections", [])}
        for det in data.get("detections", []):
            summary[QUEEN_CLASS_MAP.get(det["class"], str(det["class"]))] += 1

        return {"image_base64": img_str, "summary": summary, "cells": data.get("detections", [])}

    except Exception as e:
        logger.error(f"❌ Error in queen detection: {str(e)}")
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

# ==================== COMPATIBILITY ENDPOINT FOR FRONTEND ====================
@app.post("/analyze")
async def analyze_image(request: Request):
    """
    Compatibility endpoint for frontend - expects JSON with base64 image
    """
    try:
        logger.info("🔍 STARTING ANALYSIS FROM FRONTEND...")
        
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
        
        # Convert to PIL Image to get dimensions and save as bytes
        img = Image.open(io.BytesIO(image_bytes))
        
        # Call Hugging Face API for queen detection
        async with httpx.AsyncClient(timeout=60.0) as client:
            # Process image in memory
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG")
            buffer.seek(0)
            
            # Send to Hugging Face API
            files = {"file": ("image.jpg", buffer, "image/jpeg")}
            response = await client.post(f"{HF_API_URL}/queen_detect", files=files)
            
            if response.status_code != 200:
                logger.error(f"HF API error: {response.status_code}")
                return JSONResponse(
                    content={"error": "Model API unavailable"},
                    status_code=500
                )
        
        detections = response.json().get("detections", [])
        
        # Process detections to match frontend expectations
        cells = []
        distribution = {'open': 0, 'capped': 0, 'mature': 0, 'semiMature': 0, 'failed': 0}
        
        for i, det in enumerate(detections):
            x1, y1, x2, y2 = det["bbox"]
            cls_idx = det["class"]
            class_name = QUEEN_CLASS_MAP.get(cls_idx, str(cls_idx))
            
            # Map to frontend-friendly names - UPDATED TO MATCH MODEL'S CLASS NAMES
            type_mapping = {
                "Open Cell": "open",
                "Capped Cell": "capped",
                "Semi-Matured Cell": "semi-mature",
                "Matured Cell": "mature",
                "Failed Cell": "failed"
            }

            type_for_dist = type_mapping.get(class_name, "unknown")
            if type_for_dist in distribution:
                distribution[type_for_dist] += 1

            # Get maturity info
            maturity_percentage = {
                "Open Cell": 10,
                "Capped Cell": 40,
                "Semi-Matured Cell": 70,
                "Matured Cell": 95,
                "Failed Cell": 0
            }.get(class_name, 0)

            hatching_days = {
                "Open Cell": 10,
                "Capped Cell": 7,
                "Semi-Matured Cell": 5,
                "Matured Cell": 2,
                "Failed Cell": 0
            }.get(class_name, 0)

            description = {
                "Open Cell": "Elongated, open-ended; larva is seen (3-5 days old)",
                "Capped Cell": "Partially sealed cell; transition stage (4-6 days old)",
                "Semi-Matured Cell": "Uniform color (5-8 days old)",
                "Matured Cell": "Conical tip dark; dotted lines on conical tip evident; ready to hatch",
                "Failed Cell": "Dead cell; failed process"
            }.get(class_name, "Unknown cell type")
            
            # Handle mask data if available
            mask_data = None
            if "mask" in det:
                # The mask should be binary data encoded as base64
                mask_data = {
                    "data": det["mask"]["data"] if isinstance(det["mask"], dict) and "data" in det["mask"] else det.get("mask", ""),
                    "shape": det["mask"]["shape"] if isinstance(det["mask"], dict) and "shape" in det["mask"] else [int(y2-y1), int(x2-x1)]
                }

            cell = {
                "id": i + 1,
                "type": class_name,
                "confidence": round(det.get("confidence", 0) * 100),
                "bbox": [int(x1), int(y1), int(x2-x1), int(y2-y1)],  # Convert to [x, y, width, height]
                "mask": mask_data,  # Include mask data if available
                "maturityPercentage": maturity_percentage,
                "estimatedHatchingDays": hatching_days,
                "description": description
            }
            cells.append(cell)
        
        # Generate recommendations
        recommendations = []
        if distribution['mature'] > 0:
            recommendations.append(f"Monitor {distribution['mature']} mature cell(s) for emergence within 2-3 days")
        if distribution['failed'] > 0:
            recommendations.append(f"Remove {distribution['failed']} failed cell(s) to prevent disease")
        if len(cells) > 5:
            recommendations.append('High queen cell count - consider swarm prevention measures')
        if distribution['semiMature'] > 0:
            recommendations.append('Prepare secondary nucleus for cell separation')
        
        result = {
            "totalQueenCells": len(cells),
            "cells": cells,
            "maturityDistribution": distribution,
            "recommendations": recommendations if recommendations else ['Continue regular monitoring'],
            "imagePreview": image_data
        }
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"❌ Error in analysis: {str(e)}")
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

# ==================== BROOD STATUS DETECTION ENDPOINT ====================
@app.post("/brood_detect")
async def detect_brood(file: UploadFile = File(...)):
    """
    Detect brood status: Egg, Larva, Pupa, Empty Comb
    Returns: Percentage breakdown and hive health status
    """
    try:
        logger.info("🔍 STARTING BROOD STATUS DETECTION...")

        # Read file content
        file_content = await file.read()

        # Call Hugging Face API
        async with httpx.AsyncClient(timeout=60.0) as client:
            files = {"file": (file.filename, file_content, file.content_type)}
            response = await client.post(f"{HF_API_URL}/brood_detect", files=files)
            
            if response.status_code != 200:
                logger.error(f"HF API error: {response.status_code}")
                return JSONResponse(
                    content={"error": "Model API unavailable"},
                    status_code=500
                )
            
            data = response.json()
            
            # Format response for frontend
            result = {
                "detections": data.get("detections", []),
                "count": data.get("count", 0),
                "counts": data.get("counts", {"egg": 0, "larva": 0, "pupa": 0, "empty_comb": 0}),
                "health": data.get("health", {"status": "UNKNOWN", "score": 0}),
                "recommendations": data.get("recommendations", []),
                "annotated_image": data.get("annotated_image", ""),
                "annotated_image_with_labels": data.get("annotated_image_with_labels", "")
            }
            
            return JSONResponse(content=result)
            
    except Exception as e:
        logger.error(f"❌ Error in brood detection: {str(e)}")
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

# ==================== BROOD STATUS INFO ====================
@app.get("/brood_status")
async def get_brood_status():
    """Get current brood status information"""
    return JSONResponse(content={
        "status": "Ready for brood analysis",
        "endpoint": "/brood_detect",
        "method": "POST",
        "classes": ["egg", "larva", "pupa", "empty_comb"]
    })

# ==================== HEALTH CHECK ====================
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(content={"status": "healthy", "service": "queen-cell-analysis-api"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
