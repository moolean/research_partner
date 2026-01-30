# Research Partner - AI-Powered Research Paper Analysis System

A production-grade, full-stack application that uses AI agents to read, analyze, and annotate research papers with interactive Q&A capabilities.

## Features

### Core Capabilities
- 📄 **PDF Upload** - Upload research papers in PDF format
- 🔗 **ArXiv Integration** - Fetch papers directly from ArXiv using URLs or paper IDs
- 🤖 **AI Analysis** - Automatic paper summarization and key insight extraction
- 📝 **Smart Annotations** - AI-generated notes highlighting key concepts, findings, and methodologies
- 💬 **Interactive Chat** - Ask follow-up questions and explore concepts in depth
- 🔧 **Configurable** - Use your own OpenAI API key and custom endpoints

### Technical Highlights
- **Industrial-grade architecture** - Production-ready code structure
- **Async processing** - High-performance asynchronous operations
- **Modern stack** - FastAPI backend, React TypeScript frontend
- **Tool calling** - Advanced AI agent system with function calling
- **Real-time updates** - WebSocket support for streaming responses
- **Containerized** - Docker and Docker Compose deployment

## Architecture

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **AI Integration**: OpenAI API with function calling
- **PDF Processing**: PyMuPDF
- **ArXiv Integration**: arxiv Python library
- **Async Operations**: Full async/await support for optimal performance

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

### Agent System
The system uses predefined prompts to guide the AI in:
1. **Document Analysis** - Comprehensive reading and understanding
2. **Summarization** - Structured summaries with key findings
3. **Annotation Generation** - Smart highlighting of important concepts
4. **Deep Dives** - Expanded explanations for complex topics
5. **Q&A** - Interactive questioning with context awareness

## Quick Start

### Prerequisites
- Docker and Docker Compose (recommended)
- OR: Python 3.11+, Node.js 20+, npm

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/moolean/research_partner.git
cd research_partner

# Start the application
docker-compose up --build

# Access the application at http://localhost
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Or build for production
npm run build
npm run preview
```

## Usage Guide

### 1. Configure API Settings
- Click the "API Configuration" button in the top right
- Enter your OpenAI API key
- (Optional) Customize the API base URL and model
- Click "Save Configuration"

### 2. Upload a Paper
Choose one of two methods:

**Upload PDF**:
- Click "Upload PDF" tab
- Select a PDF file from your computer
- Wait for processing

**Fetch from ArXiv**:
- Click "ArXiv Link" tab
- Enter an ArXiv URL (e.g., `https://arxiv.org/abs/2301.00001`) or paper ID (e.g., `2301.00001`)
- Click "Fetch Paper"

### 3. Review Analysis
The AI will automatically:
- Generate a comprehensive summary
- Extract key insights
- Create detailed annotations with notes
- Highlight important concepts, findings, and methodologies

### 4. Explore with Chat
- Use the chat interface to ask questions
- Request clarifications on complex topics
- Explore connections and implications
- Get expanded explanations

## API Endpoints

### Document Management
- `POST /api/upload` - Upload PDF file
- `POST /api/arxiv` - Fetch ArXiv paper

### AI Analysis
- `POST /api/analyze` - Analyze document and generate annotations
- `POST /api/chat` - Send chat message
- `WS /ws/chat/{session_id}` - WebSocket for streaming chat

### Health Check
- `GET /` - Service health check

## Configuration

### Environment Variables (Backend)
Create a `.env` file in the `backend` directory:

```env
# Server settings
HOST=0.0.0.0
PORT=8000
DEBUG=false

# Storage
STORAGE_PATH=/tmp/research_partner

# Default OpenAI settings (can be overridden by users)
DEFAULT_API_BASE=https://api.openai.com/v1
DEFAULT_MODEL=gpt-4-turbo-preview
```

### Supported Models
- `gpt-4-turbo-preview` (recommended)
- `gpt-4`
- `gpt-3.5-turbo`
- Any OpenAI-compatible model endpoint

## Project Structure

```
research_partner/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration management
│   │   ├── services/
│   │   │   ├── pdf_processor.py # PDF processing service
│   │   │   ├── arxiv_fetcher.py # ArXiv integration
│   │   │   └── agent.py         # AI agent system
│   │   ├── models/              # Data models
│   │   └── utils/               # Utility functions
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ConfigPanel.tsx
│   │   │   ├── UploadPanel.tsx
│   │   │   ├── DocumentViewer.tsx
│   │   │   └── ChatInterface.tsx
│   │   ├── services/            # API services
│   │   ├── store/               # State management
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
└── docker-compose.yml
```

## Prompt Engineering

The system uses carefully crafted prompts for optimal performance:

### System Prompt
Establishes the agent as an expert research assistant with specific capabilities and guidelines.

### Summarization Prompt
Directs the AI to create structured summaries covering:
- Main contributions
- Methodology
- Key results
- Implications

### Annotation Prompt
Guides the AI to identify and annotate:
- Concepts and definitions
- Novel findings
- Methodologies
- Important results
- Interesting insights

## Performance Considerations

### Token Optimization
- Documents are truncated to 50,000 characters to manage token limits
- Summaries and annotations are generated in separate calls for better quality
- Chat maintains conversation history efficiently

### Async Operations
- All AI calls are asynchronous
- File processing runs concurrently with API calls
- WebSocket support for real-time streaming

### Caching
- Documents are cached in memory and on disk
- Session state is preserved across API calls

## Security Best Practices

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure allowed origins appropriately for production
3. **Rate Limiting**: Implement rate limiting for production deployments
4. **Input Validation**: All inputs are validated before processing
5. **Error Handling**: Comprehensive error handling throughout the stack
6. **Dependency Security**: All dependencies updated to patched versions (see SECURITY.md)

### Security Updates

All known vulnerabilities have been patched:
- ✅ FastAPI 0.109.1 (fixes ReDoS)
- ✅ python-multipart 0.0.22 (fixes file write, DoS, ReDoS)
- ✅ pdfjs-dist 4.2.67 (fixes arbitrary JS execution)

See [SECURITY.md](SECURITY.md) for details on security updates and monitoring.

## Deployment

### Production Deployment

1. **Update CORS settings** in `backend/app/main.py`
2. **Set environment variables** for production
3. **Use HTTPS** with a reverse proxy (e.g., Nginx, Traefik)
4. **Enable rate limiting** to prevent abuse
5. **Set up monitoring** and logging

### Scaling Considerations

- **Horizontal scaling**: Run multiple backend instances behind a load balancer
- **Document storage**: Use S3 or similar for persistent document storage
- **Database**: Add PostgreSQL or MongoDB for production data persistence
- **Caching**: Implement Redis for session and result caching
- **Queue system**: Use Celery or RQ for background processing

## Troubleshooting

### Common Issues

**PDF Processing Fails**
- Ensure PyMuPDF is properly installed
- Check PDF is not encrypted or corrupted

**ArXiv Fetch Fails**
- Verify the ArXiv URL or ID is correct
- Check internet connectivity
- ArXiv may rate-limit requests

**API Errors**
- Verify OpenAI API key is valid
- Check API base URL is correct
- Ensure sufficient API credits

**WebSocket Connection Issues**
- Check firewall settings
- Verify proxy configuration for WebSocket upgrades

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure code passes linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- OpenAI for the GPT models
- FastAPI for the excellent web framework
- React team for the UI library
- ArXiv for providing open access to research papers

---

Built with ❤️ for researchers and academics