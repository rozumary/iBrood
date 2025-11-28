"""
Hugging Face Space entry point for iBrood app
"""

import os
import sys

# Add backend to path so we can import main
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

# Set environment variable to tell main.py we're in Hugging Face
os.environ['HF_SPACE'] = '1'

# Import and get the app
from main import app

__all__ = ["app"]


