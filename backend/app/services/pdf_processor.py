"""
PDF Processing Service
"""
import fitz  # PyMuPDF
import uuid
import logging
from typing import Dict, Optional, List
from pathlib import Path
import json

logger = logging.getLogger(__name__)


class PDFProcessor:
    """Service for processing PDF documents"""
    
    def __init__(self, storage_path: str = "/tmp/research_partner"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.documents: Dict[str, Dict] = {}
    
    def process_pdf(self, pdf_path: str) -> Dict:
        """
        Process a PDF file and extract text with structure
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Document dictionary with ID, text, and metadata
        """
        try:
            doc = fitz.open(pdf_path)
            document_id = str(uuid.uuid4())
            
            # Extract text from all pages
            full_text = ""
            pages = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                full_text += text + "\n\n"
                
                pages.append({
                    "page_number": page_num + 1,
                    "text": text,
                    "bbox": page.rect
                })
            
            # Try to extract title from first page
            title = self._extract_title(pages[0]["text"]) if pages else "Untitled Document"
            
            # Store document
            document = {
                "document_id": document_id,
                "title": title,
                "text": full_text,
                "page_count": len(doc),
                "pages": pages,
                "source": "pdf",
                "source_path": pdf_path
            }
            
            self.documents[document_id] = document
            
            # Save to disk
            self._save_document(document)
            
            doc.close()
            
            logger.info(f"Processed PDF: {title} ({len(doc)} pages)")
            return document
            
        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            raise
    
    def get_document(self, document_id: str) -> Optional[Dict]:
        """Get a document by ID"""
        if document_id in self.documents:
            return self.documents[document_id]
        
        # Try to load from disk
        doc_path = self.storage_path / f"{document_id}.json"
        if doc_path.exists():
            with open(doc_path, 'r') as f:
                document = json.load(f)
                self.documents[document_id] = document
                return document
        
        return None
    
    def _extract_title(self, first_page_text: str) -> str:
        """Extract title from first page (heuristic)"""
        lines = first_page_text.strip().split('\n')
        # Take first non-empty line as title
        for line in lines:
            line = line.strip()
            if line and len(line) > 10:
                return line[:200]  # Limit title length
        return "Untitled Document"
    
    def _save_document(self, document: Dict):
        """Save document to disk"""
        doc_path = self.storage_path / f"{document['document_id']}.json"
        # Don't save full pages to reduce size
        save_doc = {
            "document_id": document["document_id"],
            "title": document["title"],
            "text": document["text"],
            "page_count": document["page_count"],
            "source": document["source"]
        }
        with open(doc_path, 'w') as f:
            json.dump(save_doc, f)
