#!/bin/bash

# Research Partner - Quick Start Script

echo "=========================================="
echo "Research Partner - Quick Start"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Check if .env file exists for backend
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating default .env file for backend..."
    cat > backend/.env << EOL
HOST=0.0.0.0
PORT=8000
DEBUG=false
STORAGE_PATH=/tmp/research_partner
DEFAULT_API_BASE=https://api.openai.com/v1
DEFAULT_MODEL=gpt-4-turbo-preview
EOL
    echo "✅ Created backend/.env"
fi

echo ""
echo "🚀 Starting Research Partner..."
echo ""

# Build and start containers
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Research Partner is running!"
    echo ""
    echo "📍 Access the application:"
    echo "   Frontend: http://localhost"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo ""
    echo "📚 Next steps:"
    echo "   1. Open http://localhost in your browser"
    echo "   2. Click 'API Configuration' and enter your OpenAI API key"
    echo "   3. Upload a PDF or fetch a paper from ArXiv"
    echo "   4. Review the AI-generated analysis and annotations"
    echo "   5. Chat with the agent about the paper"
    echo ""
    echo "🛑 To stop: docker-compose down"
    echo "📋 View logs: docker-compose logs -f"
else
    echo ""
    echo "❌ Failed to start services. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi
