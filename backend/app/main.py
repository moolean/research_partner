"""
Main FastAPI application for Research Partner Agent System
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
import os

from app.services.pdf_processor import PDFProcessor
from app.services.arxiv_fetcher import ArxivFetcher
from app.services.agent import ResearchAgent
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Research Partner API",
    description="AI-powered research paper analysis and annotation system",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_processor = PDFProcessor()
arxiv_fetcher = ArxivFetcher()


class APIConfig(BaseModel):
    """OpenAI API configuration"""
    api_key: str
    api_base: Optional[str] = "https://api.openai.com/v1"
    model: str = "gpt-4-turbo-preview"


class ArxivRequest(BaseModel):
    """Request to process arxiv paper"""
    arxiv_url: str
    api_config: APIConfig


class ChatMessage(BaseModel):
    """Chat message for Q&A"""
    session_id: str
    message: str
    api_config: APIConfig


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Research Partner API"}


@app.post("/api/upload")
async def upload_pdf(
    file: UploadFile = File(...),
):
    """
    Upload and process a PDF file
    Returns document ID and extracted text
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Save uploaded file temporarily
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Process PDF
        document = pdf_processor.process_pdf(file_path)
        
        # Clean up
        os.remove(file_path)
        
        return {
            "document_id": document["document_id"],
            "title": document["title"],
            "page_count": document["page_count"],
            "text_preview": document["text"][:500] + "..." if len(document["text"]) > 500 else document["text"]
        }
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@app.post("/api/arxiv")
async def process_arxiv(request: ArxivRequest):
    """
    Fetch and process a paper from arxiv
    """
    try:
        # Fetch paper from arxiv
        document = await arxiv_fetcher.fetch_paper(request.arxiv_url)
        
        return {
            "document_id": document["document_id"],
            "title": document["title"],
            "authors": document["authors"],
            "abstract": document["abstract"],
            "text_preview": document["text"][:500] + "..." if len(document["text"]) > 500 else document["text"]
        }
        
    except Exception as e:
        logger.error(f"Error processing arxiv paper: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing arxiv paper: {str(e)}")


@app.post("/api/analyze")
async def analyze_document(
    document_id: str,
    api_config: APIConfig
):
    """
    Analyze document and generate summary with annotations
    """
    try:
        # Initialize agent with user's API config
        agent = ResearchAgent(
            api_key=api_config.api_key,
            api_base=api_config.api_base,
            model=api_config.model
        )
        
        # Get document from storage
        document = pdf_processor.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Generate analysis
        analysis = await agent.analyze_document(document)
        
        return {
            "document_id": document_id,
            "summary": analysis["summary"],
            "annotations": analysis["annotations"],
            "key_insights": analysis["key_insights"]
        }
        
    except Exception as e:
        logger.error(f"Error analyzing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing document: {str(e)}")


@app.post("/api/chat")
async def chat(request: ChatMessage):
    """
    Chat with the agent about the document
    """
    try:
        # Initialize agent
        agent = ResearchAgent(
            api_key=request.api_config.api_key,
            api_base=request.api_config.api_base,
            model=request.api_config.model
        )
        
        # Get response
        response = await agent.chat(request.session_id, request.message)
        
        return {
            "response": response["message"],
            "sources": response.get("sources", [])
        }
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")


@app.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time chat
    """
    await websocket.accept()
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_json()
            
            # Initialize agent with provided config
            api_config = data.get("api_config", {})
            agent = ResearchAgent(
                api_key=api_config.get("api_key"),
                api_base=api_config.get("api_base", "https://api.openai.com/v1"),
                model=api_config.get("model", "gpt-4-turbo-preview")
            )
            
            # Stream response
            message = data.get("message", "")
            async for chunk in agent.chat_stream(session_id, message):
                await websocket.send_json(chunk)
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        await websocket.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
