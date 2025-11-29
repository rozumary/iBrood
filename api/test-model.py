from ultralytics import YOLO
import cv2

print('Loading model...')
model = YOLO('best-seg.pt')
print('Model loaded successfully!')
print(f'Model classes: {model.names}')

# Test with lower confidence threshold for better semi-mature detection
results = model.predict('path/to/your/image.jpg', conf=0.5, save=True)

for result in results:
    for box in result.boxes:
        conf = box.conf.item()
        cls = int(box.cls.item())
        class_name = model.names[cls]
        print(f'Detected: {class_name} with {conf:.2%} confidence')
        
        # Flag potential misclassifications for semi-mature cells
        if class_name == 'Matured Cell' and conf < 0.8:
            print(f'⚠️  Low confidence mature detection - possibly semi-mature')
