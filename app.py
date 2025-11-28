"""
Hugging Face Space entry point for iBrood app
This imports the FastAPI app from backend/huggingface-deploy/main.py
"""

import sys
import os

# When running in Hugging Face, main.py is in the root /app directory
# Add root path so we can import main directly
sys.path.insert(0, os.path.dirname(__file__))

# Import the FastAPI app from main.py
from main import app

# Export for uvicorn
__all__ = ["app"]
