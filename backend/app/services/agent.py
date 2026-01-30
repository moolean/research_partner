"""
Research Agent with OpenAI Function Calling
"""
import openai
from openai import AsyncOpenAI
import logging
import json
from typing import Dict, List, Optional, Any, AsyncGenerator
import re

logger = logging.getLogger(__name__)


# Predefined prompts for the agent
SYSTEM_PROMPT = """You are an expert research assistant specialized in analyzing academic papers. Your role is to:

1. Read and comprehend research papers deeply
2. Generate comprehensive summaries that capture key findings, methodology, and contributions
3. Identify and highlight important concepts, findings, and methodologies
4. Create detailed annotations for interesting points, expanding on implications and connections
5. Answer follow-up questions about the paper with depth and accuracy

When annotating papers:
- Mark key concepts, definitions, and terms
- Highlight novel contributions and findings  
- Note important methodologies and approaches
- Flag interesting results and their implications
- Expand on complex ideas to make them more accessible
- Connect ideas within the paper and to broader research context

Be thorough, accurate, and insightful in your analysis."""

SUMMARIZATION_PROMPT = """Please provide a comprehensive summary of this research paper. Include:

1. **Main Contribution**: What is the primary contribution or finding?
2. **Methodology**: What approaches or methods were used?
3. **Key Results**: What are the most important results or findings?
4. **Implications**: Why does this work matter?

Keep the summary clear and structured."""

ANNOTATION_PROMPT = """Analyze this research paper and create detailed annotations. For each annotation:

1. Identify the specific text/concept to annotate
2. Determine the type: concept, finding, methodology, result, or insight
3. Provide a detailed note explaining its importance
4. For particularly interesting points, expand with additional context and implications

Return annotations as a JSON array with this structure:
[
  {
    "type": "concept|finding|methodology|result|insight",
    "text": "The specific text from the paper",
    "note": "Detailed explanation",
    "page": page_number,
    "expanded": "Optional: Detailed expansion for particularly interesting points"
  }
]"""


class ResearchAgent:
    """Agent for analyzing research papers using OpenAI"""
    
    def __init__(
        self,
        api_key: str,
        api_base: str = "https://api.openai.com/v1",
        model: str = "gpt-4-turbo-preview"
    ):
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url=api_base
        )
        self.model = model
        self.conversations: Dict[str, List[Dict]] = {}
        
    async def analyze_document(self, document: Dict) -> Dict:
        """
        Analyze a document and generate summary with annotations
        
        Args:
            document: Document dictionary with text content
            
        Returns:
            Analysis with summary, annotations, and key insights
        """
        try:
            text = document["text"]
            title = document["title"]
            
            # Truncate if too long (handle token limits)
            max_chars = 50000
            if len(text) > max_chars:
                text = text[:max_chars] + "\n\n[Document truncated due to length]"
            
            # Generate summary
            summary = await self._generate_summary(title, text)
            
            # Generate annotations
            annotations = await self._generate_annotations(title, text)
            
            # Extract key insights
            key_insights = await self._extract_key_insights(title, text, annotations)
            
            return {
                "summary": summary,
                "annotations": annotations,
                "key_insights": key_insights
            }
            
        except Exception as e:
            logger.error(f"Error analyzing document: {str(e)}")
            raise
    
    async def _generate_summary(self, title: str, text: str) -> str:
        """Generate a comprehensive summary"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Paper Title: {title}\n\n{SUMMARIZATION_PROMPT}\n\nPaper Content:\n{text}"}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            raise
    
    async def _generate_annotations(self, title: str, text: str) -> List[Dict]:
        """Generate detailed annotations"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Paper Title: {title}\n\n{ANNOTATION_PROMPT}\n\nPaper Content:\n{text}"}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            
            # Try to extract JSON from response
            annotations = self._extract_json_from_text(content)
            
            if not annotations:
                # Fallback: create basic annotations
                annotations = [{
                    "type": "general",
                    "text": "Paper analysis",
                    "note": content,
                    "page": 1
                }]
            
            return annotations
            
        except Exception as e:
            logger.error(f"Error generating annotations: {str(e)}")
            return []
    
    async def _extract_key_insights(self, title: str, text: str, annotations: List[Dict]) -> List[str]:
        """Extract key insights from the paper"""
        try:
            insights_prompt = """Based on this paper, identify 3-5 key insights or takeaways that would be most valuable for a researcher. Focus on:
- Novel findings or approaches
- Surprising results
- Important implications
- Connections to other work

Return as a simple list."""
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Paper Title: {title}\n\n{insights_prompt}\n\nAnnotations context: {json.dumps(annotations[:5])}"}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            
            # Parse insights from response
            insights = []
            for line in content.split('\n'):
                line = line.strip()
                if line and (line[0].isdigit() or line.startswith('-') or line.startswith('•')):
                    # Remove leading markers
                    insight = re.sub(r'^[\d\-•\.)\s]+', '', line)
                    if insight:
                        insights.append(insight)
            
            return insights[:5]
            
        except Exception as e:
            logger.error(f"Error extracting insights: {str(e)}")
            return []
    
    async def chat(self, session_id: str, message: str) -> Dict:
        """
        Chat with the agent about the document
        
        Args:
            session_id: Conversation session ID
            message: User message
            
        Returns:
            Response dictionary
        """
        try:
            # Initialize conversation if needed
            if session_id not in self.conversations:
                self.conversations[session_id] = [
                    {"role": "system", "content": SYSTEM_PROMPT}
                ]
            
            # Add user message
            self.conversations[session_id].append({"role": "user", "content": message})
            
            # Get response
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=self.conversations[session_id],
                temperature=0.7,
                max_tokens=1500
            )
            
            assistant_message = response.choices[0].message.content
            
            # Add to conversation history
            self.conversations[session_id].append({"role": "assistant", "content": assistant_message})
            
            return {
                "message": assistant_message,
                "sources": []
            }
            
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            raise
    
    async def chat_stream(self, session_id: str, message: str) -> AsyncGenerator[Dict, None]:
        """
        Stream chat responses
        
        Args:
            session_id: Conversation session ID
            message: User message
            
        Yields:
            Response chunks
        """
        try:
            # Initialize conversation if needed
            if session_id not in self.conversations:
                self.conversations[session_id] = [
                    {"role": "system", "content": SYSTEM_PROMPT}
                ]
            
            # Add user message
            self.conversations[session_id].append({"role": "user", "content": message})
            
            # Stream response
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=self.conversations[session_id],
                temperature=0.7,
                max_tokens=1500,
                stream=True
            )
            
            full_response = ""
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield {
                        "type": "chunk",
                        "content": content
                    }
            
            # Add to conversation history
            self.conversations[session_id].append({"role": "assistant", "content": full_response})
            
            yield {
                "type": "done",
                "content": ""
            }
            
        except Exception as e:
            logger.error(f"Error in chat stream: {str(e)}")
            yield {
                "type": "error",
                "content": str(e)
            }
    
    def _extract_json_from_text(self, text: str) -> Optional[List[Dict]]:
        """Extract JSON array from text that might have markdown formatting"""
        try:
            # Try to find JSON in code blocks
            json_match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(1))
            
            # Try to find raw JSON
            json_match = re.search(r'\[.*?\]', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            
            return None
            
        except Exception:
            return None
