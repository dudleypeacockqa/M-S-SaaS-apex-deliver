"""
Document AI Service
Feature: F-009 Automated Document Generation - AI Suggestions
Uses OpenAI GPT-4 to generate AI-powered document suggestions
"""
import os
from typing import List, Optional, Dict, Any
from datetime import datetime, UTC
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

try:
    from openai import AsyncOpenAI
    _OPENAI_AVAILABLE = True
except ModuleNotFoundError:
    AsyncOpenAI = None
    _OPENAI_AVAILABLE = False

from app.models.document_generation import (
    GeneratedDocument,
    DocumentAISuggestion,
    SuggestionStatus,
)
from app.core.config import get_settings

# Lazy OpenAI client proxy
_openai_client_instance = None


class _MissingOpenAIClient:
    """Placeholder when OpenAI SDK is unavailable."""
    class chat:
        class completions:
            @staticmethod
            async def create(*_args, **_kwargs):
                raise ModuleNotFoundError("openai package is not installed. Install backend requirements before generating suggestions.")


class _OpenAIClientProxy:
    """Proxy that lazily instantiates AsyncOpenAI when available."""
    async def _ensure_async(self):
        return self

    def __getattr__(self, name):
        if name.startswith('_'):
            raise AttributeError(name)
        global _openai_client_instance
        if _openai_client_instance is None:
            if not _OPENAI_AVAILABLE:
                _openai_client_instance = _MissingOpenAIClient()
            else:
                settings = get_settings()
                api_key = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
                if not api_key:
                    raise RuntimeError("OPENAI_API_KEY is not configured.")
                _openai_client_instance = AsyncOpenAI(api_key=api_key)
        return getattr(_openai_client_instance, name)


openai_client = _OpenAIClientProxy()


class DocumentAIService:
    """Service for generating AI suggestions for documents"""

    @staticmethod
    async def generate_suggestions(
        db: Session,
        document_id: str,
        organization_id: str,
        user_id: str,
        context: Optional[str] = None,
        content: Optional[str] = None,
        tone: Optional[str] = None,
    ) -> List[DocumentAISuggestion]:
        """
        Generate AI suggestions for a document using OpenAI GPT-4.

        Args:
            db: Database session
            document_id: Document ID
            organization_id: Organization ID
            user_id: User ID
            context: Optional context for suggestions
            content: Optional content to analyze
            tone: Optional tone (professional, casual, formal, friendly)

        Returns:
            List of AI suggestions

        Raises:
            ValueError: If document not found
            Exception: If OpenAI API call fails
        """
        # Get document
        document = db.scalar(
            select(GeneratedDocument).where(
                GeneratedDocument.id == document_id,
                GeneratedDocument.organization_id == organization_id,
            )
        )

        if not document:
            raise ValueError(f"Document {document_id} not found")

        # Build prompt for GPT-4
        prompt = _build_suggestion_prompt(
            document_content=document.generated_content,
            context=context,
            content=content,
            tone=tone or "professional",
        )

        # Call OpenAI API
        start_time = datetime.now(UTC)

        response = await openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional document editor and writing assistant. Provide helpful suggestions to improve document quality, clarity, and effectiveness."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.7,
        )

        # Parse response
        suggestions_content = response.choices[0].message.content
        suggestions = _parse_suggestions_response(suggestions_content)

        # Create suggestion records
        suggestion_objects = []
        for suggestion_data in suggestions:
            suggestion = DocumentAISuggestion(
                document_id=document_id,
                title=suggestion_data.get("title", "Suggestion"),
                content=suggestion_data.get("content", ""),
                confidence=suggestion_data.get("confidence", 75),
                reasoning=suggestion_data.get("reasoning", ""),
                status=SuggestionStatus.PENDING,
                organization_id=organization_id,
                created_by_user_id=user_id,
            )
            db.add(suggestion)
            suggestion_objects.append(suggestion)

        db.commit()

        # Refresh suggestions
        for suggestion in suggestion_objects:
            db.refresh(suggestion)

        return suggestion_objects

    @staticmethod
    def accept_suggestion(
        db: Session,
        suggestion_id: str,
        organization_id: str,
    ) -> Optional[DocumentAISuggestion]:
        """
        Accept an AI suggestion.

        Args:
            db: Database session
            suggestion_id: Suggestion ID
            organization_id: Organization ID

        Returns:
            Updated suggestion or None if not found
        """
        suggestion = db.scalar(
            select(DocumentAISuggestion).where(
                DocumentAISuggestion.id == suggestion_id,
                DocumentAISuggestion.organization_id == organization_id,
            )
        )

        if not suggestion:
            return None

        suggestion.status = SuggestionStatus.ACCEPTED
        suggestion.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(suggestion)

        return suggestion

    @staticmethod
    def reject_suggestion(
        db: Session,
        suggestion_id: str,
        organization_id: str,
    ) -> Optional[DocumentAISuggestion]:
        """
        Reject an AI suggestion.

        Args:
            db: Database session
            suggestion_id: Suggestion ID
            organization_id: Organization ID

        Returns:
            Updated suggestion or None if not found
        """
        suggestion = db.scalar(
            select(DocumentAISuggestion).where(
                DocumentAISuggestion.id == suggestion_id,
                DocumentAISuggestion.organization_id == organization_id,
            )
        )

        if not suggestion:
            return None

        suggestion.status = SuggestionStatus.REJECTED
        suggestion.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(suggestion)

        return suggestion

    @staticmethod
    def apply_suggestion(
        db: Session,
        suggestion_id: str,
        organization_id: str,
    ) -> Optional[GeneratedDocument]:
        """
        Apply an AI suggestion to the document.

        Args:
            db: Database session
            suggestion_id: Suggestion ID
            organization_id: Organization ID

        Returns:
            Updated document or None if not found
        """
        suggestion = db.scalar(
            select(DocumentAISuggestion).where(
                DocumentAISuggestion.id == suggestion_id,
                DocumentAISuggestion.organization_id == organization_id,
            )
        )

        if not suggestion:
            return None

        # Get document
        document = db.scalar(
            select(GeneratedDocument).where(
                GeneratedDocument.id == suggestion.document_id,
                GeneratedDocument.organization_id == organization_id,
            )
        )

        if not document:
            return None

        # Apply suggestion to document content
        # For now, append the suggestion content to the document
        # In a real implementation, you might want to replace specific sections
        document.generated_content += f"\n\n{suggestion.content}"
        document.updated_at = datetime.now(UTC)

        # Update suggestion status
        suggestion.status = SuggestionStatus.APPLIED
        suggestion.applied_at = datetime.now(UTC)
        suggestion.updated_at = datetime.now(UTC)

        db.commit()
        db.refresh(document)
        db.refresh(suggestion)

        return document

    @staticmethod
    def list_suggestions(
        db: Session,
        document_id: str,
        organization_id: str,
        status: Optional[str] = None,
    ) -> List[DocumentAISuggestion]:
        """
        List AI suggestions for a document.

        Args:
            db: Database session
            document_id: Document ID
            organization_id: Organization ID
            status: Optional status filter

        Returns:
            List of suggestions
        """
        query = select(DocumentAISuggestion).where(
            DocumentAISuggestion.document_id == document_id,
            DocumentAISuggestion.organization_id == organization_id,
        )

        if status:
            query = query.where(DocumentAISuggestion.status == status)

        query = query.order_by(desc(DocumentAISuggestion.created_at))

        return list(db.scalars(query).all())


def _build_suggestion_prompt(
    document_content: str,
    context: Optional[str] = None,
    content: Optional[str] = None,
    tone: str = "professional",
) -> str:
    """
    Build a prompt for GPT-4 to generate document suggestions.

    Args:
        document_content: Current document content
        context: Optional context for suggestions
        content: Optional content to analyze
        tone: Document tone (professional, casual, formal, friendly)

    Returns:
        Formatted prompt string
    """
    prompt = f"""Analyze the following document and provide 3-5 specific suggestions to improve its quality, clarity, and effectiveness.

## Document Content

{document_content[:2000]}  # Limit to first 2000 chars
"""

    if context:
        prompt += f"\n## Context\n{context}\n"

    if content:
        prompt += f"\n## Additional Content\n{content}\n"

    prompt += f"""
## Requirements

1. Provide 3-5 specific, actionable suggestions
2. Each suggestion should have:
   - A clear title (max 50 characters)
   - Detailed content explaining the suggestion
   - A confidence score (0-100)
   - Reasoning for why this suggestion improves the document

3. Tone: {tone}
4. Focus on: clarity, professionalism, effectiveness, and readability

## Response Format

Return your suggestions in the following JSON format:
{{
    "suggestions": [
        {{
            "title": "Suggestion title",
            "content": "Detailed suggestion content",
            "confidence": 85,
            "reasoning": "Why this suggestion improves the document"
        }},
        ...
    ]
}}
"""

    return prompt


def _parse_suggestions_response(response_content: str) -> List[Dict[str, Any]]:
    """
    Parse GPT-4 response to extract suggestions.

    Args:
        response_content: GPT-4 response content

    Returns:
        List of suggestion dictionaries
    """
    import json
    import re

    # Try to extract JSON from response
    json_match = re.search(r'\{.*\}', response_content, re.DOTALL)
    if json_match:
        try:
            data = json.loads(json_match.group())
            return data.get("suggestions", [])
        except json.JSONDecodeError:
            pass

    # Fallback: parse as plain text
    suggestions = []
    lines = response_content.split("\n")
    current_suggestion = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Try to detect suggestion titles (lines starting with numbers or bullets)
        if re.match(r'^\d+\.|^[-*]', line):
            if current_suggestion:
                suggestions.append(current_suggestion)
            current_suggestion = {
                "title": line.lstrip('0123456789.-* ')[:50],
                "content": "",
                "confidence": 75,
                "reasoning": "",
            }
        elif current_suggestion:
            current_suggestion["content"] += line + "\n"

    if current_suggestion:
        suggestions.append(current_suggestion)

    # If no suggestions found, create a default one
    if not suggestions:
        suggestions.append({
            "title": "Review document",
            "content": "Please review the document for clarity and effectiveness.",
            "confidence": 50,
            "reasoning": "General suggestion for document improvement",
        })

    return suggestions

