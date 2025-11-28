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

# ==================== INITIALIZE APP ====================
app = FastAPI()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define paths
backend_path = os.path.dirname(__file__)
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

# ==================== HUGGING FACE API CONFIG ====================
HF_API_URL = "https://rozu1726-ibrood-app.hf.space"
logger.info("✅ Using Hugging Face API for model inference")

# ==================== QUEEN CELL CLASSES - ONLY 5 CLASSES ====================

# Exact mapping from model output to friendly names
QUEEN_CLASS_MAP = {
    0: "Capped Cell",         # Index 0
    1: "Failed Cell",         # Index 1
    2: "Matured Cell",        # Index 2
    3: "Open Cell",           # Index 3
    4: "Semi-Matured Cell"    # Index 4
}

QUEEN_CLASS_ATTRIBUTES = {
    "Open Cell": {
        "description": "Elongated, open-ended; larva is seen",
        "age": "3-5 days old",
        "hatching": "5-7 days until hatch",
        "color": "#FF6500"
    },
    "Capped Cell": {
        "description": "Partially sealed cell; transition stage",
        "age": "4-6 days old",
        "hatching": "3-5 days until hatch",
        "color": "#FFD700"
    },
    "Semi-Matured Cell": {
        "description": "Uniform color",
        "age": "5-8 days old",
        "hatching": "1-3 days until hatch",
        "color": "#E16941"
    },
    "Matured Cell": {
        "description": "Conical tip dark; dotted lines on conical tip evident; ready to hatch",
        "age": "8-10 days old",
        "hatching": "Ready to hatch anytime",
        "color": "#800080"
    },
    "Failed Cell": {
        "description": "Dead cell; failed process",
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

# ==================== BROOD CLASSES - ONLY 4 CLASSES ====================

# Exact mapping from model output to friendly names
BROOD_CLASS_MAP = {
    0: "egg",
    1: "empty_comb",
    2: "larva",
    3: "pupa"
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
    },
    "empty_comb": {
        "display_name": "Empty Comb",
        "description": "Available for laying or food storage",
        "age": "N/A",
        "health": "NEUTRAL",
        "color": "#999999"
    }
}

# Healthy brood classes
HEALTHY_BROOD_CLASSES = {"egg", "larva", "pupa"}

# ==================== PROCESSING FUNCTIONS ====================

def process_queen_detections(hf_result):
    """Process HF API response into detailed queen cell analysis"""
    detections = hf_result.get('detections', [])
    annotated_image = hf_result.get('annotated_image', '')
    
    # Count by class
    class_counts = {}
    processed_cells = []
    
    for i, detection in enumerate(detections):
        class_id = detection.get('class', 0)
        confidence = detection.get('confidence', 0)
        bbox = detection.get('bbox', [])
        
        # Map class ID to name
        class_name = QUEEN_CLASS_MAP.get(class_id, "Unknown")
        attributes = QUEEN_CLASS_ATTRIBUTES.get(class_name, {})
        
        # Count classes
        class_counts[class_name] = class_counts.get(class_name, 0) + 1
        
        # Build detailed cell info
        cell_info = {
            "id": i + 1,
            "type": class_name,
            "confidence": round(confidence * 100) if confidence < 1 else round(confidence),
            "bbox": bbox,
            "description": attributes.get('description', ''),
            "age": attributes.get('age', ''),
            "estimated_hatching": attributes.get('hatching', ''),
            "color": attributes.get('color', '#000000')
        }
        processed_cells.append(cell_info)
    
    # Generate recommendations
    recommendations = []
    mature_count = class_counts.get('Matured Cell', 0)
    failed_count = class_counts.get('Failed Cell', 0)
    total_count = len(detections)
    
    if mature_count > 0:
        recommendations.append(f"URGENT: {mature_count} mature cell(s) ready to hatch - monitor closely")
    if failed_count > 0:
        recommendations.append(f"Remove {failed_count} failed cell(s) to prevent disease spread")
    if total_count > 5:
        recommendations.append("High queen cell count - consider swarm prevention measures")
    if total_count == 0:
        recommendations.append("No queen cells detected - colony may need queen assessment")
    
    return {
        "totalQueenCells": total_count,
        "cells": processed_cells,
        "summary": class_counts,
        "maturityDistribution": class_counts,
        "recommendations": recommendations if recommendations else ["Continue regular monitoring"],
        "image_base64": annotated_image.replace('data:image/jpeg;base64,', '') if annotated_image else None
    }

def process_brood_detections(hf_result):
    """Process HF API response into detailed brood analysis"""
    detections = hf_result.get('detections', [])
    
    # Count by class
    class_counts = {}
    processed_items = []
    
    for i, detection in enumerate(detections):
        class_id = detection.get('class', 0)
        confidence = detection.get('confidence', 0)
        bbox = detection.get('bbox', [])
        
        # Map class ID to name
        class_name = BROOD_CLASS_MAP.get(class_id, "unknown")
        attributes = BROOD_CLASS_ATTRIBUTES.get(class_name, {})
        
        # Count classes
        display_name = attributes.get('display_name', class_name)
        class_counts[display_name] = class_counts.get(display_name, 0) + 1
        
        # Build detailed item info
        item_info = {
            "id": i + 1,
            "type": display_name,
            "confidence": round(confidence * 100) if confidence < 1 else round(confidence),
            "bbox": bbox,
            "description": attributes.get('description', ''),
            "age": attributes.get('age', ''),
            "health": attributes.get('health', 'UNKNOWN'),
            "color": attributes.get('color', '#000000')
        }
        processed_items.append(item_info)
    
    # Calculate health metrics
    total_count = len(detections)
    healthy_count = sum(1 for d in detections if BROOD_CLASS_MAP.get(d.get('class', 0)) in HEALTHY_BROOD_CLASSES)
    empty_count = class_counts.get('Empty Comb', 0)
    
    health_percentage = (healthy_count / total_count * 100) if total_count > 0 else 0
    
    # Generate recommendations
    recommendations = []
    if health_percentage > 80:
        recommendations.append("Excellent brood health - colony is thriving")
    elif health_percentage > 60:
        recommendations.append("Good brood health - continue monitoring")
    else:
        recommendations.append("Monitor brood health closely - consider veterinary consultation")
    
    if empty_count > total_count * 0.3:
        recommendations.append("High empty comb ratio - check queen laying pattern")
    
    return {
        "totalDetections": total_count,
        "items": processed_items,
        "broodDistribution": class_counts,
        "healthMetrics": {
            "healthyBrood": healthy_count,
            "totalBrood": total_count,
            "healthPercentage": round(health_percentage, 1)
        },
        "recommendations": recommendations if recommendations else ["Continue regular monitoring"]
    }

# ==================== ROUTES ====================

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    """Serve main index page"""
    try:
        return templates.TemplateResponse("index.html", {"request": request})
    except Exception as e:
        logger.error(f"Error loading index: {e}")
        return "<h1>Error loading page</h1>"

@app.get("/queen.html", response_class=HTMLResponse)
async def queen_page(request: Request):
    """Serve queen detection page"""
    try:
        return templates.TemplateResponse("queen.html", {"request": request})
    except Exception as e:
        logger.error(f"Error loading queen page: {e}")
        return "<h1>Error loading queen page</h1>"

@app.get("/brood.html", response_class=HTMLResponse)
async def brood_page(request: Request):
    """Serve brood status page"""
    try:
        return templates.TemplateResponse("brood.html", {"request": request})
    except Exception as e:
        logger.error(f"Error loading brood page: {e}")
        return "<h1>Error loading brood page</h1>"

# ==================== QUEEN CELL DETECTION ENDPOINT ====================

@app.post("/queen_detect")
async def detect_queen(file: UploadFile = File(...)):
    """
    Detect queen cells: Open, Capped, Semi-Mature, Matured, Failed
    Returns: Maturity breakdown percentages and hatching timeline
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
            
            # Process HF API response
            hf_result = response.json()
            
            # Transform to detailed analysis
            processed_result = process_queen_detections(hf_result)
            
            logger.info(f"✅ Queen detection completed: {processed_result['totalQueenCells']} cells found")
            return processed_result

    except Exception as e:
        logger.error(f"❌ Error in queen detection: {str(e)}")
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

# ==================== BROOD STATUS DETECTION ENDPOINT ====================

@app.post("/detect")
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
            response = await client.post(f"{HF_API_URL}/detect", files=files)
            
            if response.status_code != 200:
                logger.error(f"HF API error: {response.status_code}")
                return JSONResponse(
                    content={"error": "Model API unavailable"},
                    status_code=500
                )
            
            # Process HF API response
            hf_result = response.json()
            
            # Transform to detailed analysis
            processed_result = process_brood_detections(hf_result)
            
            logger.info(f"✅ Brood detection completed: {processed_result['totalDetections']} items found")
            return processed_result

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
        "endpoint": "/detect",
        "method": "POST",
        "classes": ["egg", "larva", "pupa", "empty_comb"]
    })

