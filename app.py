"""
Hugging Face Space entry point for iBrood app
This imports the FastAPI app from backend/huggingface-deploy/main.py
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend", "huggingface-deploy"))

# Import the FastAPI app from main.py
from main import app

# Export for uvicorn
__all__ = ["app"]
