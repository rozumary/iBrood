#!/usr/bin/env python3
"""
Test script to verify model loading and basic functionality
Run this before deployment to catch issues early
"""

import os
import sys
from ultralytics import YOLO
from huggingface_hub import hf_hub_download

def test_model_loading():
    """Test if model can be loaded from various sources"""
    print("Testing model loading...")
    
    # Test local model
    local_paths = ['best-seg.pt', '/app/api/best-seg.pt', 'api/best-seg.pt']
    local_model_found = False
    
    for path in local_paths:
        if os.path.exists(path):
            print(f"Found local model: {path}")
            try:
                model = YOLO(path)
                print(f"Local model loads successfully: {path}")
                local_model_found = True
                break
            except Exception as e:
                print(f"Local model failed to load: {e}")
    
    if not local_model_found:
        print("No local model found, testing Hugging Face...")
        try:
            model_path = hf_hub_download(
                repo_id="Rozu1726/ibrood-api", 
                filename="best-seg.pt",
                cache_dir="/tmp/huggingface"
            )
            model = YOLO(model_path)
            print(f"Hugging Face model loads successfully: {model_path}")
        except Exception as e:
            print(f"Hugging Face model failed: {e}")
            return False
    
    return True

def test_flask_imports():
    """Test if all required packages can be imported"""
    print("Testing imports...")
    
    try:
        from flask import Flask, request, jsonify
        from flask_cors import CORS
        import cv2
        import numpy as np
        import base64
        from PIL import Image
        import io
        print("All imports successful")
        return True
    except ImportError as e:
        print(f"Import failed: {e}")
        return False

def main():
    print("Starting deployment tests...")
    
    # Test imports first
    if not test_flask_imports():
        print("Import test failed")
        sys.exit(1)
    
    # Test model loading
    if not test_model_loading():
        print("Model loading test failed")
        sys.exit(1)
    
    print("All tests passed! Ready for deployment.")

if __name__ == "__main__":
    main()