"""
Pydantic schemas for DEV-018 Deal Matching
Request/response models for matching API endpoints
"""

from typing import Dict, List, Optional
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field, ConfigDict


class MatchCriteriaCreate(BaseModel):
    """Request model for creating match criteria"""
    name: str = Field(..., description="Name for this criteria set")
    deal_type: str = Field(..., description="buy_side or sell_side")
    industries: List[str] = Field(..., description="Target industries")
    min_deal_size: float = Field(..., description="Minimum deal size in currency")
    max_deal_size: float = Field(..., description="Maximum deal size in currency")
    geographies: Optional[List[str]] = Field(None, description="Target geographies")
    structures: Optional[List[str]] = Field(None, description="Deal structures")
    negative_filters: Optional[Dict] = Field(None, description="Exclusion criteria")
    weights: Optional[Dict[str, float]] = Field(None, description="Factor weights")


class MatchCriteriaResponse(BaseModel):
    """Response model for match criteria"""
    id: str
    user_id: str
    organization_id: str
    name: str
    deal_type: str
    industries: List
    min_deal_size: str  # Decimal serialized as string
    max_deal_size: str
    geographies: Optional[List]
    structures: Optional[List]
    negative_filters: Optional[Dict]
    weights: Optional[Dict]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FindMatchesRequest(BaseModel):
    """Request model for finding matches"""
    criteria: Dict = Field(..., description="Matching criteria as dict")
    min_score: Optional[float] = Field(40.0, description="Minimum match score threshold")
    limit: Optional[int] = Field(10, description="Maximum number of results")


class MatchExplanation(BaseModel):
    """Explanation of why deals matched"""
    industry: Dict
    size: Dict
    geography: Dict
    overall: Dict


class MatchItem(BaseModel):
    """Individual match result"""
    deal_id: str
    deal_name: str
    score: float
    confidence: str
    explanation: Dict


class FindMatchesResponse(BaseModel):
    """Response model for find matches"""
    matches: List[MatchItem]
    total_count: int


class DealMatchResponse(BaseModel):
    """Response model for stored deal matches"""
    id: str
    deal_id: str
    matched_deal_id: str
    match_score: float
    confidence: str
    explanation: Dict
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
