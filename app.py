"""
Hugging Face Space entry point for iBrood app
"""

import os
import sys

# Set environment variable to tell main.py we're in Hugging Face
os.environ['HF_SPACE'] = '1'

# Import and get the app
from main import app

__all__ = ["app"]


