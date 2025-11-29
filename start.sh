#!/bin/bash
set -e

# Create cache directories
mkdir -p /tmp/hf_cache /tmp/model_cache

echo "🚀 Starting Flask API..."
cd /app/api

# Set environment variables for Flask
export FLASK_ENV=production
export FLASK_PORT=5000
export HUGGINGFACE_HUB_CACHE=/tmp/hf_cache
export RENDER_CACHE_DIR=/tmp/model_cache

# Start Flask in background
python analyze-queen-cells.py &
FLASK_PID=$!

echo "⏳ Waiting for Flask to be ready..."
sleep 20

# Check if Flask is running
if ! kill -0 $FLASK_PID 2>/dev/null; then
    echo "❌ Flask failed to start"
    tail -20 /app/api/*.log 2>/dev/null || echo "No logs found"
    exit 1
fi

# Test Flask health endpoint with retries
echo "🔍 Testing Flask health..."
for i in {1..15}; do
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        echo "✅ Flask is healthy"
        break
    fi
    echo "⏳ Attempt $i/15 - Flask not ready yet..."
    sleep 5
done

echo "✅ Flask started (PID: $FLASK_PID)"
echo "🚀 Starting Next.js..."
cd /app
export API_URL=http://localhost:5000
npm start
