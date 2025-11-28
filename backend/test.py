from ultralytics import YOLO

model = YOLO("C:/Users/ASUS/Desktop/iBrood YOLOV8/backend/best.pt")
results = model("sample.jpg", save=True)

print(results[0].boxes)
