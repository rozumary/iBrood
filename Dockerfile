# Use Python base image (includes both Python and can install Node.js)
FROM python:3.11-slim

# Install system dependencies for OpenCV and YOLO
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies
COPY api/requirements.txt ./api/
RUN pip install --no-cache-dir -r api/requirements.txt

# Copy and install Node.js dependencies
COPY package*.json ./
RUN npm ci

# Copy all files
COPY . .

# Ensure model file is in the right place
COPY api/best-seg.pt ./api/best-seg.pt

# Build Next.js
RUN npm run build

# Set environment variables
ENV FLASK_ENV=production
ENV NODE_ENV=production
ENV API_URL=https://rozu1726-ibrood-app.hf.space
ENV NEXT_PUBLIC_API_URL=https://rozu1726-ibrood-app.hf.space
ENV PORT=3000

# Expose ports
EXPOSE 3000 5000

# Start script
COPY start.sh ./
RUN chmod +x start.sh
CMD ["./start.sh"]
