#!/bin/bash

# InvaStop Iteration1 Deployment Script
# This script helps deploy the iteration1 version to Vercel

echo "🚀 InvaStop Iteration1 Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the iteration1-deployment directory"
    exit 1
fi

echo "📋 Deployment Options:"
echo "1. Deploy Frontend to Vercel"
echo "2. Deploy Backend to Vercel"
echo "3. Deploy Both"
echo "4. Test Locally"
echo "5. Build for Production"

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo "🎨 Deploying Frontend to Vercel..."
        cd frontend
        echo "📦 Installing dependencies..."
        npm install
        echo "🔨 Building for production..."
        npm run build:iteration1
        echo "🚀 Deploying to Vercel..."
        npx vercel --prod
        ;;
    2)
        echo "⚙️ Deploying Backend to Vercel..."
        cd backend
        echo "📦 Installing dependencies..."
        pip install -r requirements.txt
        echo "🚀 Deploying to Vercel..."
        npx vercel --prod
        ;;
    3)
        echo "🚀 Deploying Both Frontend and Backend..."
        
        # Deploy Backend first
        echo "⚙️ Deploying Backend..."
        cd backend
        npx vercel --prod
        cd ..
        
        # Deploy Frontend
        echo "🎨 Deploying Frontend..."
        cd frontend
        npm install
        npm run build:iteration1
        npx vercel --prod
        ;;
    4)
        echo "🧪 Testing Locally..."
        
        # Start Backend
        echo "⚙️ Starting Backend..."
        cd backend
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
        BACKEND_PID=$!
        cd ..
        
        # Start Frontend
        echo "🎨 Starting Frontend..."
        cd frontend
        npm install
        npm start &
        FRONTEND_PID=$!
        cd ..
        
        echo "✅ Both services started!"
        echo "Backend: http://localhost:8000"
        echo "Frontend: http://localhost:3000"
        echo "Press Ctrl+C to stop both services"
        
        # Wait for user to stop
        wait
        ;;
    5)
        echo "🔨 Building for Production..."
        cd frontend
        npm install
        npm run build:iteration1
        echo "✅ Frontend built successfully!"
        echo "📁 Build files are in the 'build' directory"
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-5."
        exit 1
        ;;
esac

echo "✅ Deployment process completed!"
echo "🌐 Your app should be available at: https://invastop.vercel.app/iteration1"
