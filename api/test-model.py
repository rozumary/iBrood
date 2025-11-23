from ultralytics import YOLO

print('Loading model...')
model = YOLO('best-seg.pt')
print('Model loaded successfully!')
print(f'Model type: {type(model)}')
print(f'Model classes: {model.names}')
