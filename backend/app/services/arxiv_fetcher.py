"""
ArXiv Paper Fetcher Service
"""
import arxiv
import uuid
import logging
from typing import Dict
from pathlib import Path
import json
import httpx
import re

logger = logging.getLogger(__name__)


class ArxivFetcher:
    """Service for fetching papers from ArXiv"""
    
    def __init__(self, storage_path: str = "/tmp/research_partner"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.documents: Dict[str, Dict] = {}
    
    async def fetch_paper(self, arxiv_url: str) -> Dict:
        """
        Fetch a paper from ArXiv
        
        Args:
            arxiv_url: ArXiv URL or paper ID
            
        Returns:
            Document dictionary
        """
        try:
            # Extract arxiv ID from URL
            arxiv_id = self._extract_arxiv_id(arxiv_url)
            
            if not arxiv_id:
                raise ValueError("Invalid ArXiv URL or ID")
            
            logger.info(f"Fetching ArXiv paper: {arxiv_id}")
            
            # Search for paper
            search = arxiv.Search(id_list=[arxiv_id])
            paper = next(search.results())
            
            # Download PDF
            pdf_path = self.storage_path / f"{arxiv_id}.pdf"
            paper.download_pdf(str(pdf_path))
            
            # Extract text from PDF
            from app.services.pdf_processor import PDFProcessor
            pdf_processor = PDFProcessor(str(self.storage_path))
            doc_data = pdf_processor.process_pdf(str(pdf_path))
            
            # Create document with ArXiv metadata
            document_id = str(uuid.uuid4())
            document = {
                "document_id": document_id,
                "title": paper.title,
                "authors": [author.name for author in paper.authors],
                "abstract": paper.summary,
                "text": doc_data["text"],
                "page_count": doc_data["page_count"],
                "source": "arxiv",
                "arxiv_id": arxiv_id,
                "arxiv_url": paper.entry_id,
                "published": paper.published.isoformat() if paper.published else None,
            }
            
            self.documents[document_id] = document
            
            # Save to disk
            self._save_document(document)
            
            logger.info(f"Fetched ArXiv paper: {paper.title}")
            return document
            
        except Exception as e:
            logger.error(f"Error fetching ArXiv paper: {str(e)}")
            raise
    
    def _extract_arxiv_id(self, url_or_id: str) -> str:
        """Extract ArXiv ID from URL or return the ID if already extracted"""
        # Pattern for arxiv ID: YYMM.NNNNN or older format
        patterns = [
            r'arxiv\.org/abs/(\d+\.\d+)',
            r'arxiv\.org/pdf/(\d+\.\d+)',
            r'^(\d+\.\d+)$',
            r'arxiv\.org/abs/([a-z\-]+/\d+)',
            r'^([a-z\-]+/\d+)$'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url_or_id)
            if match:
                return match.group(1)
        
        return ""
    
    def _save_document(self, document: Dict):
        """Save document metadata to disk"""
        doc_path = self.storage_path / f"{document['document_id']}.json"
        with open(doc_path, 'w') as f:
            json.dump(document, f)
