"""
Event Payment Models (DEV-019)
Stores payment information for event ticket purchases via Stripe.
"""
from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base import Base


class PaymentStatus(str, enum.Enum):
    """Payment status"""
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"


class EventPayment(Base):
    """Event payment model - stores Stripe payment information for event tickets"""
    __tablename__ = "event_payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_intent_id = Column(String(255), unique=True, nullable=False, index=True)
    event_id = Column(String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Payment details
    amount = Column(Integer, nullable=False)  # in cents
    currency = Column(String(3), nullable=False, default="GBP")
    status = Column(SQLEnum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    
    # Ticket details
    ticket_type = Column(String(50), nullable=False)  # e.g., "vip", "standard", "early_bird"
    quantity = Column(Integer, nullable=False)
    
    # Receipt reference
    receipt_id = Column(String(36), ForeignKey("event_payment_receipts.id", ondelete="SET NULL"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    event = relationship("Event", foreign_keys=[event_id])
    user = relationship("User", foreign_keys=[user_id])
    organization = relationship("Organization", foreign_keys=[organization_id])
    receipt = relationship("EventPaymentReceipt", foreign_keys=[receipt_id], back_populates="payment")

    def __repr__(self):
        return f"<EventPayment(id={self.id}, payment_intent_id={self.payment_intent_id}, status={self.status})>"


class EventPaymentReceipt(Base):
    """Event payment receipt model - stores receipt information for payments"""
    __tablename__ = "event_payment_receipts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_id = Column(String(36), ForeignKey("event_payments.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    receipt_number = Column(String(50), unique=True, nullable=False, index=True)
    
    # Receipt data
    pdf_path = Column(String(500), nullable=True)  # Path to generated PDF
    receipt_data = Column(Text, nullable=False)  # JSON string of receipt data
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    payment = relationship("EventPayment", foreign_keys=[payment_id], back_populates="receipt")

    def __repr__(self):
        return f"<EventPaymentReceipt(id={self.id}, receipt_number={self.receipt_number})>"

