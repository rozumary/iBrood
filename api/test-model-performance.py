#!/usr/bin/env python3
"""
Model Performance Diagnostic Tool
Tests your YOLO model with different settings to find optimal parameters
"""

import os
import sys
import numpy as np
from PIL import Image
import base64
import io
from ultralytics import YOLO
from huggingface_hub import hf_hub_download

def load_model():
    """Load model from local or HuggingFace"""
    model = None
    
    # Try local first
    local_paths = ['best-seg.pt', 'api/best-seg.pt']
    for path in local_paths:
        if os.path.exists(path):
            try:
                model = YOLO(path)
                print(f"Loaded local model: {path}")
                return model
            except Exception as e:
                print(f"Local model failed: {e}")
    
    # Try HuggingFace
    try:
        print("Loading from HuggingFace...")
        model_path = hf_hub_download(
            repo_id="Rozu1726/ibrood-api", 
            filename="best-seg.pt",
            force_download=False
        )
        model = YOLO(model_path)
        print(f"Loaded HF model: {model_path}")
        return model
    except Exception as e:
        print(f"HuggingFace failed: {e}")
    
    return None

def create_test_image():
    """Create a test image with queen cell-like shapes"""
    img = Image.new('RGB', (800, 600), color='#f4e4bc')  # Honeycomb color
    
    # Add some cell-like shapes (circles and ovals)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    
    # Draw some oval shapes that might look like queen cells
    shapes = [
        (100, 100, 150, 180),  # x1, y1, x2, y2
        (200, 150, 250, 230),
        (350, 200, 400, 280),
        (500, 120, 550, 200),
        (600, 250, 650, 330),
    ]
    
    for shape in shapes:
        draw.ellipse(shape, fill='#8B4513', outline='#654321', width=2)
    
    return img

def test_model_settings(model, test_image):
    """Test different model settings"""
    image_np = np.array(test_image)
    
    settings = [
        {'conf': 0.1, 'iou': 0.2, 'name': 'Very Aggressive'},
        {'conf': 0.15, 'iou': 0.2, 'name': 'Aggressive (Current)'},
        {'conf': 0.25, 'iou': 0.3, 'name': 'Moderate (Old)'},
        {'conf': 0.3, 'iou': 0.4, 'name': 'Conservative'},
        {'conf': 0.5, 'iou': 0.5, 'name': 'Very Conservative'},
    ]
    
    print("\n Testing different detection settings:")
    print("-" * 60)
    
    for setting in settings:
        try:
            results = model(
                image_np, 
                conf=setting['conf'], 
                iou=setting['iou'], 
                imgsz=640,
                verbose=False
            )
            
            detection_count = 0
            if results and len(results) > 0:
                boxes = results[0].boxes
                if boxes is not None:
                    detection_count = len(boxes)
            
            print(f"{setting['name']:20} | conf={setting['conf']:4.2f} iou={setting['iou']:4.2f} | Detections: {detection_count}")
            
        except Exception as e:
            print(f"{setting['name']:20} | ERROR: {str(e)}")
    
    print("-" * 60)

def test_with_real_image():
    """Test with a base64 image if provided"""
    print("\n📷 To test with your own image:")
    print("1. Convert your image to base64")
    print("2. Paste it here (or press Enter to skip)")
    
    try:
        user_input = input("Base64 image data (data:image/...): ").strip()
        if user_input and user_input.startswith('data:image'):
            image_data = user_input.split(',')[1]
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            print(f"Loaded user image: {image.size}")
            return image
    except Exception as e:
        print(f"Failed to load user image: {e}")
    
    return None

def main():
    print("iBrood Model Performance Diagnostic")
    print("=" * 50)
    
    # Load model
    model = load_model()
    if not model:
        print("Could not load model!")
        return
    
    # Test with synthetic image
    print("\nCreating test image...")
    test_img = create_test_image()
    test_img.save('test_image.jpg')
    print("Test image saved as 'test_image.jpg'")
    
    # Test different settings
    test_model_settings(model, test_img)
    
    # Test with user image
    user_img = test_with_real_image()
    if user_img:
        print("\nTesting with your image:")
        test_model_settings(model, user_img)
    
    print("\nRecommendations:")
    print("- If you see 0 detections everywhere, your model might need retraining")
    print("- If 'Very Aggressive' shows detections but others don't, lower the confidence threshold")
    print("- If you get too many false positives, increase the confidence threshold")
    print("- Check that your model classes match the expected queen cell types")

if __name__ == "__main__":
    main()