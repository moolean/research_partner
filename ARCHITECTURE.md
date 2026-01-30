# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Research Partner System                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │  ConfigPanel   │  │  UploadPanel   │  │ DocumentViewer │        │
│  │                │  │                │  │                │        │
│  │ - API Config   │  │ - PDF Upload   │  │ - Summary      │        │
│  │ - Model Select │  │ - ArXiv Input  │  │ - Annotations  │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
│                                                                      │
│  ┌────────────────┐         ┌─────────────────────┐                │
│  │ ChatInterface  │         │   State (Zustand)    │                │
│  │                │         │                      │                │
│  │ - Q&A          │◄────────│ - Documents          │                │
│  │ - Streaming    │         │ - Analysis           │                │
│  └────────────────┘         │ - Chat History       │                │
│                             └─────────────────────┘                │
└────────────────────┬────────────────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
┌────────────────────▼────────────────────────────────────────────────┐
│                       BACKEND (FastAPI)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                     API Routes                            │       │
│  │  /api/upload  /api/arxiv  /api/analyze  /api/chat       │       │
│  └────────────────┬───────────────┬──────────────┬──────────┘       │
│                   │               │              │                  │
│  ┌────────────────▼─┐  ┌─────────▼────────┐  ┌──▼───────────────┐  │
│  │  PDF Processor   │  │ ArXiv Fetcher    │  │  Research Agent  │  │
│  │                  │  │                  │  │                  │  │
│  │ - Extract Text   │  │ - Fetch Papers   │  │ - Summarize      │  │
│  │ - Parse Pages    │  │ - Download PDFs  │  │ - Annotate       │  │
│  │ - Store Docs     │  │ - Get Metadata   │  │ - Chat/Q&A       │  │
│  └──────────────────┘  └──────────────────┘  └──────┬───────────┘  │
│                                                      │              │
└──────────────────────────────────────────────────────┼──────────────┘
                                                       │
                                                       │ OpenAI API
                                                       │
                                            ┌──────────▼──────────┐
                                            │   OpenAI GPT-4      │
                                            │                     │
                                            │ - Function Calling  │
                                            │ - Streaming         │
                                            │ - Chat Completion   │
                                            └─────────────────────┘
```

## Data Flow

### 1. Document Upload Flow
```
User uploads PDF
    ↓
UploadPanel → API → PDFProcessor
    ↓
Extract text & metadata
    ↓
Store in cache
    ↓
Return document ID
```

### 2. ArXiv Fetch Flow
```
User enters ArXiv URL
    ↓
UploadPanel → API → ArxivFetcher
    ↓
Fetch paper metadata
    ↓
Download PDF
    ↓
Extract text (via PDFProcessor)
    ↓
Return document with metadata
```

### 3. Analysis Flow
```
Document loaded
    ↓
DocumentViewer → API → ResearchAgent
    ↓
┌─────────────────────────────┐
│ Parallel AI Calls:          │
│ 1. Generate Summary         │
│ 2. Generate Annotations     │
│ 3. Extract Key Insights     │
└─────────────────────────────┘
    ↓
Combine results
    ↓
Display in UI with annotations sidebar
```

### 4. Chat Flow
```
User asks question
    ↓
ChatInterface → API → ResearchAgent
    ↓
Add to conversation history
    ↓
Send to OpenAI with context
    ↓
Stream response back
    ↓
Display in chat interface
```

## Agent Prompt Strategy

### System Prompt
Defines the agent's role as an expert research assistant with specific capabilities.

### Task-Specific Prompts

1. **Summarization Prompt**
   - Main contribution
   - Methodology
   - Key results
   - Implications

2. **Annotation Prompt**
   - Identify concepts, findings, methodology
   - Create detailed notes
   - Expand on interesting points
   - Return structured JSON

3. **Insight Extraction Prompt**
   - Novel findings
   - Surprising results
   - Important implications
   - Connections to other work

## Technology Stack

### Backend
- **FastAPI**: High-performance async web framework
- **OpenAI API**: GPT-4 for analysis and chat
- **PyMuPDF**: PDF text extraction
- **arxiv**: Paper fetching from ArXiv
- **Pydantic**: Data validation
- **aiosqlite**: Async database (optional)

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management
- **Axios**: HTTP client
- **Lucide React**: Icons

### Deployment
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy and static file serving

## Performance Optimizations

1. **Async Processing**: All I/O operations are async
2. **Parallel AI Calls**: Summary and annotations generated concurrently
3. **Document Caching**: In-memory + disk caching
4. **Streaming Responses**: WebSocket for real-time chat
5. **Token Management**: Smart truncation to stay within limits
6. **Connection Pooling**: Efficient API calls

## Security Features

1. **User-provided API keys**: No central API key storage
2. **Input validation**: Pydantic models for all inputs
3. **CORS configuration**: Configurable origins
4. **Error handling**: Comprehensive error catching
5. **Type safety**: TypeScript throughout frontend
