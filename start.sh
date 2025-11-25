#!/bin/bash
set -e

echo "🚀 Starting Flask API..."
cd /app/api

# Set environment variables for Flask
export FLASK_ENV=production
export PORT=5000

# Start Flask in background
python analyze-queen-cells.py &
FLASK_PID=$!

echo "⏳ Waiting for Flask to be ready..."
sleep 10

# Check if Flask is running
if ! kill -0 $FLASK_PID 2>/dev/null; then
    echo "❌ Flask failed to start"
    exit 1
fi

# Test Flask health endpoint
echo "🔍 Testing Flask health..."
for i in {1..5}; do
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        echo "✅ Flask is healthy"
        break
    fi
    echo "⏳ Attempt $i/5 - Flask not ready yet..."
    sleep 2
done

echo "✅ Flask started (PID: $FLASK_PID)"
echo "🚀 Starting Next.js..."
cd /app
export API_URL=http://localhost:5000
npm start
