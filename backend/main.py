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
HF_API_URL = "https://huggingface.co/spaces/Rozu1726/ibrood-api"
logger.info("✅ Using Hugging Face API for model inference")

# ==================== QUEEN CELL CLASSES - ONLY 5 CLASSES ====================

# Exact mapping from model output to friendly names
QUEEN_CLASS_MAP = {
    0: "Open Queen Cell",      # Index 0
    1: "Capped Queen Cell",    # Index 1
    2: "Semi-Mature Cell",     # Index 2
    3: "Matured Cell",         # Index 3
    4: "Failed Cell"           # Index 4
}

QUEEN_CLASS_ATTRIBUTES = {
    "Open Queen Cell": {
        "description": "Elongated, open-ended; larva is seen",
        "age": "3-5 days old",
        "hatching": "3-5 days until hatch",
        "color": "#1900FF"
    },
    "Capped Queen Cell": {
        "description": "Partially sealed cell; transition stage",
        "age": "4-6 days old",
        "hatching": "1-3 days until hatch",
        "color": "#FD5D00"
    },
    "Semi-Mature Cell": {
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
    "Open Queen Cell": "Open",
    "Capped Queen Cell": "Capped",
    "Semi-Mature Cell": "Semi-M",
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
            
            return response.json()

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
            
            return response.json()

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

