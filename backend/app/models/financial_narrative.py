"""Financial Narrative Model - DEV-010."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Numeric, Integer
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base
from app.db.types import JSONType

class FinancialNarrative(Base):
    """Stores AI-generated financial narratives."""
    __tablename__ = "financial_narratives"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    summary = Column(Text, nullable=False)
    strengths = Column(JSONType, nullable=True)
    weaknesses = Column(JSONType, nullable=True)
    red_flags = Column(JSONType, nullable=True)
    growth_signals = Column(JSONType, nullable=True)
    
    readiness_score = Column(Numeric(5, 2), nullable=True)
    readiness_score_breakdown = Column(JSONType, nullable=True)
    data_quality_score = Column(Numeric(5, 2), nullable=True)
    financial_health_score = Column(Numeric(5, 2), nullable=True)
    growth_trajectory_score = Column(Numeric(5, 2), nullable=True)
    risk_assessment_score = Column(Numeric(5, 2), nullable=True)
    recommendations = Column(JSONType, nullable=True)
    
    ai_model = Column(String(100), nullable=False, default='gpt-4')
    prompt_version = Column(String(50), nullable=True)
    token_count = Column(Integer, nullable=True)
    generation_time_ms = Column(Integer, nullable=True)
    version = Column(Integer, nullable=False, default=1)
    supersedes_id = Column(String(36), ForeignKey("financial_narratives.id"), nullable=True)
    
    generated_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="financial_narratives")
    supersedes = relationship("FinancialNarrative", remote_side=[id], uselist=False)
