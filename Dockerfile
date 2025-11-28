FROM python:3.10-slim

WORKDIR /app

# Copy requirements and install
COPY backend/huggingface-deploy/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files: copy full backend folder so paths remain consistent
COPY backend/ ./backend/
COPY app.py ./

# Copy frontend files (templates and static)
COPY frontend/ ./frontend/

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Run with uvicorn on 0.0.0.0:7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
