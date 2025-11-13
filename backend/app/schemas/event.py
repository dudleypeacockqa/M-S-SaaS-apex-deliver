"""
Event Management Pydantic Schemas
Feature: F-012 Event Management Hub
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


# ============================================================================
# Event Schemas
# ============================================================================

class EventBase(BaseModel):
    """Base schema for events"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    event_type: str = Field(..., pattern="^(virtual|in_person|hybrid)$")
    status: str = Field(default="draft", pattern="^(draft|published|cancelled|completed)$")
    
    # Dates
    start_date: datetime
    end_date: datetime
    registration_deadline: Optional[datetime] = None
    
    # Location
    location: Optional[str] = None
    virtual_link: Optional[str] = None
    
    # Capacity & Pricing
    capacity: Optional[int] = Field(None, ge=1)
    base_price: Decimal = Field(default=Decimal("0.00"), ge=0)
    currency: str = Field(default="GBP", max_length=3)


class EventCreate(EventBase):
    """Schema for creating a new event"""
    organization_id: str = Field(..., min_length=1)
    created_by_user_id: str = Field(..., min_length=1)


class EventUpdate(BaseModel):
    """Schema for updating an existing event"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    event_type: Optional[str] = Field(None, pattern="^(virtual|in_person|hybrid)$")
    status: Optional[str] = Field(None, pattern="^(draft|published|cancelled|completed)$")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    location: Optional[str] = None
    virtual_link: Optional[str] = None
    capacity: Optional[int] = Field(None, ge=1)
    base_price: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)

    model_config = ConfigDict(from_attributes=True)


class EventResponse(EventBase):
    """Schema for event responses"""
    id: str
    organization_id: str
    created_by_user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Event Session Schemas
# ============================================================================

class EventSessionBase(BaseModel):
    """Base schema for event sessions"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    virtual_link: Optional[str] = None
    capacity: Optional[int] = Field(None, ge=1)
    speaker_name: Optional[str] = None
    speaker_bio: Optional[str] = None


class EventSessionCreate(EventSessionBase):
    """Schema for creating a new event session"""
    event_id: str = Field(..., min_length=1)
    organization_id: str = Field(..., min_length=1)
    created_by_user_id: str = Field(..., min_length=1)


class EventSessionUpdate(BaseModel):
    """Schema for updating an existing event session"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    virtual_link: Optional[str] = None
    capacity: Optional[int] = Field(None, ge=1)
    speaker_name: Optional[str] = None
    speaker_bio: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class EventSessionResponse(EventSessionBase):
    """Schema for event session responses"""
    id: str
    event_id: str
    organization_id: str
    created_by_user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Event Ticket Schemas
# ============================================================================

class EventTicketBase(BaseModel):
    """Base schema for event tickets"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., ge=0)
    currency: str = Field(default="GBP", max_length=3)
    quantity_available: Optional[int] = Field(None, ge=1)
    status: str = Field(default="active", pattern="^(active|sold_out|cancelled)$")
    sale_start_date: Optional[datetime] = None
    sale_end_date: Optional[datetime] = None


class EventTicketCreate(EventTicketBase):
    """Schema for creating a new event ticket"""
    event_id: str = Field(..., min_length=1)
    organization_id: str = Field(..., min_length=1)
    created_by_user_id: str = Field(..., min_length=1)


class EventTicketUpdate(BaseModel):
    """Schema for updating an existing event ticket"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
    quantity_available: Optional[int] = Field(None, ge=1)
    status: Optional[str] = Field(None, pattern="^(active|sold_out|cancelled)$")
    sale_start_date: Optional[datetime] = None
    sale_end_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class EventTicketResponse(EventTicketBase):
    """Schema for event ticket responses"""
    id: str
    event_id: str
    quantity_sold: int
    organization_id: str
    created_by_user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Event Registration Schemas
# ============================================================================

class EventRegistrationBase(BaseModel):
    """Base schema for event registrations"""
    attendee_name: str = Field(..., min_length=1, max_length=255)
    attendee_email: str = Field(..., pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    attendee_phone: Optional[str] = None
    session_id: Optional[str] = Field(None, min_length=1)
    ticket_id: Optional[str] = Field(None, min_length=1)


class EventRegistrationCreate(EventRegistrationBase):
    """Schema for creating a new event registration"""
    event_id: str = Field(..., min_length=1)
    organization_id: str = Field(..., min_length=1)
    registered_by_user_id: Optional[str] = Field(None, min_length=1)


class EventRegistrationUpdate(BaseModel):
    """Schema for updating an existing event registration"""
    status: Optional[str] = Field(None, pattern="^(pending|confirmed|cancelled|attended|no_show)$")
    checked_in: Optional[bool] = None
    payment_status: Optional[str] = None
    payment_amount: Optional[Decimal] = Field(None, ge=0)
    stripe_payment_intent_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class EventRegistrationResponse(EventRegistrationBase):
    """Schema for event registration responses"""
    id: str
    event_id: str
    payment_status: str
    payment_amount: Decimal
    currency: str
    status: str
    checked_in: bool
    checked_in_at: Optional[datetime] = None
    organization_id: str
    registered_by_user_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Event Analytics Schemas
# ============================================================================

class EventAnalyticsResponse(BaseModel):
    """Schema for event analytics responses"""
    id: str
    event_id: str
    total_registrations: int
    total_attendees: int
    total_revenue: Decimal
    currency: str
    session_metrics: Dict[str, Any]
    recorded_at: datetime
    organization_id: str

    model_config = ConfigDict(from_attributes=True)

