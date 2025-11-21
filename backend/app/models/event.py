"""
Event Management Models
Feature: F-012 Event Management Hub
"""
from datetime import datetime, UTC
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Integer, DateTime, Enum as SQLEnum, Numeric, Boolean
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base import Base


class EventType(str, enum.Enum):
    """Event type"""
    VIRTUAL = "virtual"
    IN_PERSON = "in_person"
    HYBRID = "hybrid"


class EventStatus(str, enum.Enum):
    """Event status"""
    DRAFT = "draft"
    PUBLISHED = "published"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class TicketStatus(str, enum.Enum):
    """Ticket status"""
    ACTIVE = "active"
    SOLD_OUT = "sold_out"
    CANCELLED = "cancelled"


class RegistrationStatus(str, enum.Enum):
    """Registration status"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    ATTENDED = "attended"
    NO_SHOW = "no_show"


class Event(Base):
    """Event model"""
    __tablename__ = "events"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    event_type = Column(SQLEnum(EventType), nullable=False, default=EventType.VIRTUAL)
    status = Column(SQLEnum(EventStatus), nullable=False, default=EventStatus.DRAFT)
    
    # Dates
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    registration_deadline = Column(DateTime(timezone=True), nullable=True)
    
    # Location
    location = Column(String)  # Physical location or virtual link
    virtual_link = Column(String)  # Virtual event link (Zoom, Teams, etc.)
    
    # Capacity & Pricing
    capacity = Column(Integer, nullable=True)  # None = unlimited
    base_price = Column(Numeric(10, 2), default=0.00)  # Base ticket price
    currency = Column(String(3), default="GBP")  # Currency code
    
    # Multi-tenancy
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    
    # Audit fields
    created_by_user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))
    
    # Relationships
    organization = relationship("Organization", foreign_keys=[organization_id])
    sessions = relationship("EventSession", back_populates="event", cascade="all, delete-orphan")
    tickets = relationship("EventTicket", back_populates="event", cascade="all, delete-orphan")
    registrations = relationship("EventRegistration", back_populates="event", cascade="all, delete-orphan")
    analytics = relationship("EventAnalytics", back_populates="event", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Event(id={self.id}, name={self.name}, status={self.status})>"


class EventSession(Base):
    """Event session model (for multi-session events)"""
    __tablename__ = "event_sessions"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    
    # Dates
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    
    # Location
    location = Column(String)  # Session-specific location
    virtual_link = Column(String)  # Session-specific virtual link
    
    # Capacity
    capacity = Column(Integer, nullable=True)  # None = unlimited
    
    # Speaker
    speaker_name = Column(String)
    speaker_bio = Column(Text)
    
    # Multi-tenancy
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    
    # Audit fields
    created_by_user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))
    
    # Relationships
    event = relationship("Event", back_populates="sessions")
    registrations = relationship("EventRegistration", back_populates="session")

    def __repr__(self):
        return f"<EventSession(id={self.id}, name={self.name}, event_id={self.event_id})>"


class EventTicket(Base):
    """Event ticket model (pricing tiers)"""
    __tablename__ = "event_tickets"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "Early Bird", "Standard", "VIP"
    description = Column(Text)
    
    # Pricing
    price = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="GBP")
    
    # Capacity
    quantity_available = Column(Integer, nullable=True)  # None = unlimited
    quantity_sold = Column(Integer, default=0)
    
    # Status
    status = Column(SQLEnum(TicketStatus), nullable=False, default=TicketStatus.ACTIVE)
    
    # Sale dates
    sale_start_date = Column(DateTime(timezone=True), nullable=True)
    sale_end_date = Column(DateTime(timezone=True), nullable=True)
    
    # Multi-tenancy
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    
    # Audit fields
    created_by_user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))
    
    # Relationships
    event = relationship("Event", back_populates="tickets")
    registrations = relationship("EventRegistration", back_populates="ticket")

    def __repr__(self):
        return f"<EventTicket(id={self.id}, name={self.name}, price={self.price})>"


class EventRegistration(Base):
    """Event registration model"""
    __tablename__ = "event_registrations"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(String(36), ForeignKey("event_sessions.id", ondelete="SET NULL"), nullable=True)
    ticket_id = Column(String(36), ForeignKey("event_tickets.id", ondelete="SET NULL"), nullable=True)
    
    # Attendee info
    attendee_name = Column(String, nullable=False)
    attendee_email = Column(String, nullable=False)
    attendee_phone = Column(String, nullable=True)
    
    # Payment
    payment_status = Column(String, default="pending")  # pending, paid, refunded
    payment_amount = Column(Numeric(10, 2), default=0.00)
    currency = Column(String(3), default="GBP")
    stripe_payment_intent_id = Column(String)  # Stripe payment intent ID
    
    # Status
    status = Column(SQLEnum(RegistrationStatus), nullable=False, default=RegistrationStatus.PENDING)
    checked_in = Column(Boolean, default=False)
    checked_in_at = Column(DateTime(timezone=True), nullable=True)
    
    # Multi-tenancy
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    
    # Audit fields
    registered_by_user_id = Column(String, nullable=True)  # Null for external registrations
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))
    
    # Relationships
    event = relationship("Event", back_populates="registrations")
    session = relationship("EventSession", back_populates="registrations")
    ticket = relationship("EventTicket", back_populates="registrations")

    def __repr__(self):
        return f"<EventRegistration(id={self.id}, attendee_email={self.attendee_email}, status={self.status})>"


class EventAnalytics(Base):
    """Event analytics model"""
    __tablename__ = "event_analytics"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    
    # Metrics
    total_registrations = Column(Integer, default=0)
    total_attendees = Column(Integer, default=0)
    total_revenue = Column(Numeric(10, 2), default=0.00)
    currency = Column(String(3), default="GBP")
    
    # Session metrics (stored as JSON)
    session_metrics = Column(JSON, default=dict)  # {session_id: {registrations, attendees, revenue}}
    
    # Timestamps
    recorded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    
    # Multi-tenancy
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    
    # Relationships
    event = relationship("Event", back_populates="analytics")

    def __repr__(self):
        return f"<EventAnalytics(id={self.id}, event_id={self.event_id}, total_registrations={self.total_registrations})>"

