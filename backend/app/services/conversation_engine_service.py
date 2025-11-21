"""
Conversation Engine Service

AI-powered conversation management with sentiment analysis, intent detection, and BANT qualification.
Ported from Cold-Outreach-Hub TypeScript implementation.
"""
import os
import json
import uuid
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select

from openai import OpenAI

from app.models.master_admin import ConversationSession, VoiceCall, AdminProspect, AdminDeal
from app.models.enums import AdminDealStage, ProspectStatus

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None


class ConversationContext:
    """Conversation context for managing AI conversations."""
    
    def __init__(
        self,
        session_id: str,
        campaign_id: Optional[int] = None,
        contact_id: Optional[int] = None,
        lead_data: Optional[Dict] = None,
    ):
        self.session_id = session_id
        self.campaign_id = campaign_id
        self.contact_id = contact_id
        self.lead_data = lead_data or {}
        self.conversation_history: List[Dict] = []
        self.metadata = {
            "start_time": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            "total_duration": 0,
            "lead_score": 0,
            "sentiment": "neutral",
            "intent": "unknown",
            "objections": [],
        }


def create_conversation_context(
    session_id: Optional[str] = None,
    campaign_id: Optional[int] = None,
    contact_id: Optional[int] = None,
    lead_data: Optional[Dict] = None,
    db: Optional[Session] = None
) -> ConversationContext:
    """
    Create a new conversation context.
    
    Args:
        session_id: Optional session ID (generated if not provided)
        campaign_id: Optional campaign ID
        contact_id: Optional contact ID
        lead_data: Optional lead data dictionary
        db: Optional database session to create ConversationSession record
        
    Returns:
        ConversationContext instance
    """
    if not session_id:
        session_id = str(uuid.uuid4())
    
    context = ConversationContext(
        session_id=session_id,
        campaign_id=campaign_id,
        contact_id=contact_id,
        lead_data=lead_data or {},
    )
    
    # Add system message
    system_prompt = _build_system_prompt(context)
    context.conversation_history.append({
        "role": "system",
        "content": system_prompt,
        "timestamp": datetime.utcnow().isoformat(),
    })
    
    # Create database record if db provided
    if db:
        org_id = lead_data.get("organization_id") if lead_data else None
        voice_call_id = lead_data.get("voice_call_id") if lead_data else None
        
        if org_id:
            conversation_session = ConversationSession(
                organization_id=org_id,
                voice_call_id=voice_call_id,
                session_id=session_id,
                conversation_history=context.conversation_history,
            )
            db.add(conversation_session)
            db.commit()
            db.refresh(conversation_session)
    
    return context


def process_message(
    session_id: str,
    user_message: str,
    db: Optional[Session] = None
) -> Dict:
    """
    Process a user message and generate AI response.
    
    Args:
        session_id: Conversation session ID
        user_message: User's message
        db: Optional database session
        
    Returns:
        Dictionary with response, context, and metadata
    """
    if not openai_client:
        raise ValueError("OpenAI API key not configured")
    
    # Get or create context
    # In production, this would be stored in Redis or database
    # For now, we'll fetch from database if db provided
    context = None
    if db:
        result = db.execute(
            select(ConversationSession).where(ConversationSession.session_id == session_id)
        )
        session = result.scalar_one_or_none()
        if session:
            context = ConversationContext(
                session_id=session.session_id,
                campaign_id=None,  # Could be extracted from metadata
                contact_id=None,
                lead_data={"organization_id": session.organization_id},
            )
            context.conversation_history = session.conversation_history or []
            context.metadata = {
                "start_time": session.created_at,
                "last_activity": session.updated_at,
                "total_duration": 0,
                "lead_score": session.lead_score or 0,
                "sentiment": session.sentiment or "neutral",
                "intent": session.intent or "unknown",
                "objections": [],
            }
    
    if not context:
        # Create new context if not found
        context = create_conversation_context(session_id=session_id, db=db)
    
    start_time = datetime.utcnow()
    
    # Add user message
    user_msg = {
        "role": "user",
        "content": user_message,
        "timestamp": start_time.isoformat(),
    }
    context.conversation_history.append(user_msg)
    
    # Analyze sentiment and intent in parallel
    sentiment = analyze_sentiment(user_message)
    intent = detect_intent(user_message)
    
    # Generate response
    response = _generate_response(context, sentiment, intent)
    
    # Add assistant response
    assistant_msg = {
        "role": "assistant",
        "content": response,
        "timestamp": datetime.utcnow().isoformat(),
        "metadata": {
            "confidence": intent.get("confidence", 0),
            "intent": intent.get("intent", "unknown"),
            "sentiment": sentiment.get("sentiment", "neutral"),
        },
    }
    context.conversation_history.append(assistant_msg)
    
    # Update context metadata
    context.metadata["last_activity"] = datetime.utcnow()
    context.metadata["sentiment"] = sentiment.get("sentiment", "neutral")
    context.metadata["intent"] = intent.get("intent", "unknown")
    context.metadata["total_duration"] = (datetime.utcnow() - start_time).total_seconds()
    
    # Qualify lead
    lead_qualification = qualify_lead(context, db)
    context.metadata["lead_score"] = lead_qualification.get("score", 0)
    
    response_time = (datetime.utcnow() - start_time).total_seconds()
    
    # Update database if db provided
    if db:
        result = db.execute(
            select(ConversationSession).where(ConversationSession.session_id == session_id)
        )
        session = result.scalar_one_or_none()
        if session:
            session.conversation_history = context.conversation_history
            session.lead_score = lead_qualification.get("score")
            session.sentiment = sentiment.get("sentiment")
            session.intent = intent.get("intent")
            session.qualification_data = lead_qualification
            db.commit()
            
            # Integrate with Deal Pipeline: Create deal from qualified leads
            # If lead score is high enough (>= 70), create a deal in the pipeline
            if lead_qualification.get("score", 0) >= 70 and session.voice_call_id:
                voice_call_result = db.execute(
                    select(VoiceCall).where(VoiceCall.id == session.voice_call_id)
                )
                voice_call = voice_call_result.scalar_one_or_none()
                
                if voice_call and voice_call.contact_id:
                    prospect_result = db.execute(
                        select(AdminProspect).where(AdminProspect.id == voice_call.contact_id)
                    )
                    prospect = prospect_result.scalar_one_or_none()
                    
                    if prospect:
                        # Check if deal already exists
                        existing_deal_result = db.execute(
                            select(AdminDeal).where(
                                AdminDeal.prospect_id == prospect.id,
                                AdminDeal.stage == AdminDealStage.QUALIFICATION
                            )
                        )
                        existing_deal = existing_deal_result.scalar_one_or_none()
                        
                        if not existing_deal:
                            # Create new deal from qualified lead
                            deal = AdminDeal(
                                user_id=prospect.user_id,
                                prospect_id=prospect.id,
                                name=f"Deal: {prospect.name}",
                                stage=AdminDealStage.QUALIFICATION,
                                value=lead_qualification.get("qualification_data", {}).get("budget", 0),
                                notes=f"Auto-created from voice call qualification. Score: {lead_qualification.get('score')}",
                            )
                            db.add(deal)
                            
                            # Update prospect status
                            prospect.status = ProspectStatus.QUALIFIED
                            db.commit()
    
    return {
        "response": response,
        "context": {
            "session_id": context.session_id,
            "campaign_id": context.campaign_id,
            "contact_id": context.contact_id,
        },
        "metadata": {
            "response_time": response_time,
            "intent": intent.get("intent"),
            "sentiment": sentiment,
            "lead_qualification": lead_qualification,
        },
    }


def analyze_sentiment(text: str) -> Dict:
    """
    Analyze sentiment of text.
    
    Args:
        text: Text to analyze
        
    Returns:
        Dictionary with sentiment analysis results
    """
    if not openai_client:
        return {
            "sentiment": "neutral",
            "confidence": 0,
            "emotions": [],
            "keywords": [],
        }
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """Analyze the sentiment and emotions in the user's message. 
                    
                    Respond with JSON only: {
                      "sentiment": "positive|neutral|negative",
                      "confidence": 0.0-1.0,
                      "emotions": [{"emotion": "string", "intensity": 0.0-1.0}],
                      "keywords": ["array of significant words"]
                    }
                    
                    Common emotions: happy, excited, frustrated, angry, confused, interested, bored, skeptical, trusting""",
                },
                {
                    "role": "user",
                    "content": text,
                },
            ],
            temperature=0.1,
            max_tokens=200,
        )
        
        content = response.choices[0].message.content
        if not content:
            raise ValueError("No response from sentiment analysis")
        
        return json.loads(content)
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        return {
            "sentiment": "neutral",
            "confidence": 0,
            "emotions": [],
            "keywords": [],
        }


def detect_intent(text: str) -> Dict:
    """
    Detect user intent from text.
    
    Args:
        text: Text to analyze
        
    Returns:
        Dictionary with intent detection results
    """
    if not openai_client:
        return {
            "intent": "unknown",
            "confidence": 0,
            "should_interrupt": False,
        }
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are a fast intent classifier for sales calls. Analyze the user's message and classify the intent. 
                    
                    Common intents: greeting, interested, not_interested, price_objection, time_objection, authority_objection, 
                    need_info, ready_to_buy, callback_request, hang_up, complaint, question.
                    
                    Respond with JSON only: {"intent": "string", "confidence": 0.0-1.0, "shouldInterrupt": boolean, "suggestedResponse": "optional"}
                    
                    shouldInterrupt should be true for: hang_up, complaint, urgent objections
                    suggestedResponse should be provided for common objections or when interruption is needed.""",
                },
                {
                    "role": "user",
                    "content": text,
                },
            ],
            temperature=0.1,
            max_tokens=150,
        )
        
        content = response.choices[0].message.content
        if not content:
            raise ValueError("No response from intent detection")
        
        result = json.loads(content)
        # Normalize key names
        if "shouldInterrupt" in result:
            result["should_interrupt"] = result.pop("shouldInterrupt")
        
        return result
    except Exception as e:
        print(f"Intent detection error: {e}")
        return {
            "intent": "unknown",
            "confidence": 0,
            "should_interrupt": False,
        }


def qualify_lead(context: ConversationContext, db: Optional[Session] = None) -> Dict:
    """
    Qualify lead using BANT criteria (Budget, Authority, Need, Timeline).
    
    Args:
        context: Conversation context
        db: Optional database session
        
    Returns:
        Dictionary with qualification results
    """
    if not openai_client:
        return {
            "score": 0,
            "qualification_level": "unqualified",
            "reasons": ["Analysis failed"],
            "next_action": "follow_up",
        }
    
    # Build conversation text
    conversation = "\n".join([
        f"{msg['role']}: {msg['content']}"
        for msg in context.conversation_history
        if msg["role"] != "system"
    ])
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": """You are a lead qualification expert. Analyze this sales conversation and score the lead using BANT criteria (Budget, Authority, Need, Timeline).
                    
                    Respond with JSON only: {
                      "score": 0-100,
                      "qualificationLevel": "hot|warm|cold|unqualified",
                      "reasons": ["array of qualification reasons"],
                      "nextAction": "schedule_demo|follow_up|nurture|disqualify",
                      "timeline": "immediate|1-3months|3-6months|6+months|unknown",
                      "budget": "qualified|unqualified|unknown",
                      "authority": "decision_maker|influencer|researcher|unknown",
                      "need": "urgent|moderate|low|none|unknown"
                    }
                    
                    Scoring guide:
                    - Hot (80-100): High budget, authority, urgent need, immediate timeline
                    - Warm (60-79): 3/4 BANT criteria met
                    - Cold (40-59): 2/4 BANT criteria met
                    - Unqualified (0-39): 0-1 BANT criteria met""",
                },
                {
                    "role": "user",
                    "content": conversation,
                },
            ],
            temperature=0.2,
            max_tokens=300,
        )
        
        content = response.choices[0].message.content
        if not content:
            raise ValueError("No response from lead qualification")
        
        result = json.loads(content)
        # Normalize key names
        if "qualificationLevel" in result:
            result["qualification_level"] = result.pop("qualificationLevel")
        if "nextAction" in result:
            result["next_action"] = result.pop("nextAction")
        
        return result
    except Exception as e:
        print(f"Lead qualification error: {e}")
        return {
            "score": 0,
            "qualification_level": "unqualified",
            "reasons": ["Analysis failed"],
            "next_action": "follow_up",
        }


def _generate_response(
    context: ConversationContext,
    sentiment: Dict,
    intent: Dict
) -> str:
    """
    Generate AI response based on conversation context.
    
    Args:
        context: Conversation context
        sentiment: Sentiment analysis results
        intent: Intent detection results
        
    Returns:
        Generated response text
    """
    if not openai_client:
        return "I'm sorry, I'm having trouble understanding. Could you please repeat that?"
    
    # Get last 10 messages for context
    messages = context.conversation_history[-10:]
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                *[
                    {
                        "role": msg["role"],
                        "content": msg["content"],
                    }
                    for msg in messages
                ],
                {
                    "role": "system",
                    "content": f"""Current sentiment: {sentiment.get('sentiment', 'neutral')} ({sentiment.get('confidence', 0)})
                    Current intent: {intent.get('intent', 'unknown')} ({intent.get('confidence', 0)})
                    Lead score: {context.metadata.get('lead_score', 0)}
                    
                    Respond naturally and keep the conversation flowing. Be helpful and professional.
                    Keep responses under 50 words for voice calls. Use a conversational tone.""",
                },
            ],
            temperature=0.7,
            max_tokens=150,
        )
        
        return response.choices[0].message.content or "I'm sorry, could you repeat that?"
    except Exception as e:
        print(f"Response generation error: {e}")
        return "I'm having trouble understanding. Could you please repeat that?"


def _build_system_prompt(context: ConversationContext) -> str:
    """
    Build system prompt for conversation.
    
    Args:
        context: Conversation context
        
    Returns:
        System prompt string
    """
    return f"""You are a professional sales AI assistant conducting a cold outreach call. 

Your goal is to:
1. Build rapport and trust
2. Understand the prospect's needs
3. Qualify the lead (BANT criteria)
4. Schedule a demo or follow-up if qualified
5. Handle objections professionally

Context:
- Campaign: {context.campaign_id or 'General outreach'}
- Lead data: {json.dumps(context.lead_data)}

Guidelines:
- Be conversational and natural
- Keep responses short (under 50 words)
- Ask open-ended questions
- Listen actively and respond appropriately
- Handle objections with empathy
- Always be helpful and professional
- End with a clear next step

Remember: This is a voice call, so speak naturally and pause for responses."""

