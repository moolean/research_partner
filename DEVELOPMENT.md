# Research Partner Development Guide

## Development Setup

### Backend Development

1. Install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Run with auto-reload:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. API documentation will be available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend Development

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Access at: http://localhost:3000

### Code Quality

#### Backend
```bash
# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/
```

#### Frontend
```bash
# Lint
npm run lint

# Type checking
npx tsc --noEmit
```

## Architecture Details

### Backend Services

#### PDF Processor
- Extracts text from PDF files
- Handles multi-page documents
- Provides page-level text segmentation

#### ArXiv Fetcher
- Fetches papers from ArXiv API
- Downloads PDF and extracts metadata
- Handles various ArXiv URL formats

#### Agent System
- OpenAI integration with function calling
- Predefined prompts for consistent output
- Conversation history management
- Streaming support for real-time responses

### Frontend Components

#### ConfigPanel
- API configuration management
- Persistent settings storage
- Validation and error handling

#### UploadPanel
- File upload with drag-and-drop
- ArXiv URL input
- Progress indication

#### DocumentViewer
- Document display
- Annotations sidebar
- Summary presentation
- Key insights highlighting

#### ChatInterface
- Message history
- Real-time responses
- Context-aware conversations

## API Usage Examples

### Upload PDF
```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@paper.pdf"
```

### Process ArXiv Paper
```bash
curl -X POST http://localhost:8000/api/arxiv \
  -H "Content-Type: application/json" \
  -d '{
    "arxiv_url": "https://arxiv.org/abs/2301.00001",
    "api_config": {
      "api_key": "sk-...",
      "model": "gpt-4-turbo-preview"
    }
  }'
```

### Analyze Document
```bash
curl -X POST "http://localhost:8000/api/analyze?document_id=<doc_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "api_config": {
      "api_key": "sk-...",
      "model": "gpt-4-turbo-preview"
    }
  }'
```

### Chat
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-123",
    "message": "What is the main contribution?",
    "api_config": {
      "api_key": "sk-...",
      "model": "gpt-4-turbo-preview"
    }
  }'
```

## Customization

### Adding New Annotation Types

1. Update the annotation type in `frontend/src/types/api.ts`
2. Update the annotation generation logic in `backend/app/services/agent.py`
3. Update the UI styling in `frontend/src/components/DocumentViewer.tsx`

### Custom Prompts

Edit prompts in `backend/app/services/agent.py`:
- `SYSTEM_PROMPT` - Agent's role and capabilities
- `SUMMARIZATION_PROMPT` - Summary generation instructions
- `ANNOTATION_PROMPT` - Annotation generation guidelines

### Styling

Frontend uses Tailwind CSS. Customize:
- Colors: `frontend/tailwind.config.js`
- Base styles: `frontend/src/index.css`
- Component styles: Individual component files

## Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Performance Optimization

### Backend
- Use async operations for all I/O
- Implement caching for repeated requests
- Consider adding Redis for session storage
- Use connection pooling for database operations

### Frontend
- Implement virtual scrolling for large documents
- Lazy load components
- Optimize bundle size with code splitting
- Use React.memo for expensive components

## Deployment Checklist

- [ ] Update CORS origins for production
- [ ] Set secure environment variables
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up logging and monitoring
- [ ] Implement error tracking (e.g., Sentry)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Load test the application
- [ ] Security audit

## Troubleshooting

### Backend Issues
- Check logs: `docker-compose logs backend`
- Verify Python version: `python --version`
- Ensure all dependencies installed: `pip list`

### Frontend Issues
- Check console for errors
- Clear browser cache
- Verify Node version: `node --version`
- Check network tab for API errors

### Docker Issues
- Rebuild containers: `docker-compose up --build`
- Check container logs: `docker-compose logs -f`
- Clean Docker: `docker system prune`
