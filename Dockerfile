FROM python:3.10-slim

WORKDIR /app

COPY backend/huggingface-deploy/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/huggingface-deploy/ .
COPY frontend/ ../frontend/

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Run with uvicorn on 0.0.0.0:7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
