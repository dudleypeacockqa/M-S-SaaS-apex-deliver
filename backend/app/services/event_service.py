"""Event Management Service (F-012)."""
import logging
from typing import List, Optional, Dict, Any
from sqlalchemy import select, desc, func
from sqlalchemy.orm import Session
from datetime import datetime, UTC
from decimal import Decimal

from app.models.event import (
    Event,
    EventSession,
    EventTicket,
    EventRegistration,
    EventAnalytics,
    EventType,
    EventStatus,
    TicketStatus,
    RegistrationStatus,
)
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventSessionCreate,
    EventSessionUpdate,
    EventTicketCreate,
    EventTicketUpdate,
    EventRegistrationCreate,
    EventRegistrationUpdate,
)
from app.services import event_reminder_service

logger = logging.getLogger(__name__)


class EventService:
    """Service for managing events"""

    # ========================================================================
    # Event CRUD Operations
    # ========================================================================

    @staticmethod
    def create_event(
        db: Session,
        event_data: EventCreate,
    ) -> Event:
        """Create a new event"""
        event = Event(
            name=event_data.name,
            description=event_data.description,
            event_type=EventType(event_data.event_type),
            status=EventStatus(event_data.status),
            start_date=event_data.start_date,
            end_date=event_data.end_date,
            registration_deadline=event_data.registration_deadline,
            location=event_data.location,
            virtual_link=event_data.virtual_link,
            capacity=event_data.capacity,
            base_price=event_data.base_price,
            currency=event_data.currency,
            organization_id=event_data.organization_id,
            created_by_user_id=event_data.created_by_user_id,
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def get_event(
        db: Session,
        event_id: str,
        organization_id: str,
    ) -> Optional[Event]:
        """Get an event by ID (with organization check)"""
        return db.scalar(
            select(Event).where(
                Event.id == event_id,
                Event.organization_id == organization_id,
            )
        )

    @staticmethod
    def list_events(
        db: Session,
        organization_id: str,
        status: Optional[str] = None,
        event_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Event]:
        """List events for an organization with optional filters"""
        query = select(Event).where(
            Event.organization_id == organization_id
        )

        if status:
            query = query.where(Event.status == status)
        if event_type:
            query = query.where(Event.event_type == event_type)

        query = query.order_by(desc(Event.created_at))
        query = query.offset(skip).limit(limit)

        return list(db.scalars(query).all())

    @staticmethod
    def update_event(
        db: Session,
        event_id: str,
        organization_id: str,
        update_data: EventUpdate,
    ) -> Optional[Event]:
        """Update an existing event"""
        event = EventService.get_event(db, event_id, organization_id)
        if not event:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            if field == "event_type":
                event.event_type = EventType(value)
            elif field == "status":
                event.status = EventStatus(value)
            else:
                setattr(event, field, value)

        event.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def delete_event(
        db: Session,
        event_id: str,
        organization_id: str,
    ) -> bool:
        """Delete an event (soft delete by setting status to cancelled)"""
        event = EventService.get_event(db, event_id, organization_id)
        if not event:
            return False

        event.status = EventStatus.CANCELLED
        event.updated_at = datetime.now(UTC)
        db.commit()
        return True

    # ========================================================================
    # Event Session Operations
    # ========================================================================

    @staticmethod
    def create_session(
        db: Session,
        session_data: EventSessionCreate,
    ) -> EventSession:
        """Create a new event session"""
        # Verify event exists and belongs to organization
        event = EventService.get_event(
            db, session_data.event_id, session_data.organization_id
        )
        if not event:
            raise ValueError(f"Event {session_data.event_id} not found")

        session = EventSession(
            event_id=session_data.event_id,
            name=session_data.name,
            description=session_data.description,
            start_time=session_data.start_time,
            end_time=session_data.end_time,
            location=session_data.location,
            virtual_link=session_data.virtual_link,
            capacity=session_data.capacity,
            speaker_name=session_data.speaker_name,
            speaker_bio=session_data.speaker_bio,
            organization_id=session_data.organization_id,
            created_by_user_id=session_data.created_by_user_id,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def list_sessions(
        db: Session,
        event_id: str,
        organization_id: str,
    ) -> List[EventSession]:
        """List sessions for an event"""
        # Verify event exists and belongs to organization
        event = EventService.get_event(db, event_id, organization_id)
        if not event:
            return []

        sessions = db.scalars(
            select(EventSession)
            .where(
                EventSession.event_id == event_id,
                EventSession.organization_id == organization_id,
            )
            .order_by(EventSession.start_time)
        ).all()

        return list(sessions)

    @staticmethod
    def update_session(
        db: Session,
        session_id: str,
        organization_id: str,
        update_data: EventSessionUpdate,
    ) -> Optional[EventSession]:
        """Update an existing event session"""
        session = db.scalar(
            select(EventSession).where(
                EventSession.id == session_id,
                EventSession.organization_id == organization_id,
            )
        )
        if not session:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(session, field, value)

        session.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def delete_session(
        db: Session,
        session_id: str,
        organization_id: str,
    ) -> bool:
        """Delete an event session"""
        session = db.scalar(
            select(EventSession).where(
                EventSession.id == session_id,
                EventSession.organization_id == organization_id,
            )
        )
        if not session:
            return False

        db.delete(session)
        db.commit()
        return True

    # ========================================================================
    # Event Ticket Operations
    # ========================================================================

    @staticmethod
    def create_ticket(
        db: Session,
        ticket_data: EventTicketCreate,
    ) -> EventTicket:
        """Create a new event ticket"""
        # Verify event exists and belongs to organization
        event = EventService.get_event(
            db, ticket_data.event_id, ticket_data.organization_id
        )
        if not event:
            raise ValueError(f"Event {ticket_data.event_id} not found")

        ticket = EventTicket(
            event_id=ticket_data.event_id,
            name=ticket_data.name,
            description=ticket_data.description,
            price=ticket_data.price,
            currency=ticket_data.currency,
            quantity_available=ticket_data.quantity_available,
            status=TicketStatus(ticket_data.status),
            sale_start_date=ticket_data.sale_start_date,
            sale_end_date=ticket_data.sale_end_date,
            organization_id=ticket_data.organization_id,
            created_by_user_id=ticket_data.created_by_user_id,
        )
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def list_tickets(
        db: Session,
        event_id: str,
        organization_id: str,
    ) -> List[EventTicket]:
        """List tickets for an event"""
        # Verify event exists and belongs to organization
        event = EventService.get_event(db, event_id, organization_id)
        if not event:
            return []

        tickets = db.scalars(
            select(EventTicket)
            .where(
                EventTicket.event_id == event_id,
                EventTicket.organization_id == organization_id,
            )
            .order_by(EventTicket.price)
        ).all()

        return list(tickets)

    @staticmethod
    def update_ticket(
        db: Session,
        ticket_id: str,
        organization_id: str,
        update_data: EventTicketUpdate,
    ) -> Optional[EventTicket]:
        """Update an existing event ticket"""
        ticket = db.scalar(
            select(EventTicket).where(
                EventTicket.id == ticket_id,
                EventTicket.organization_id == organization_id,
            )
        )
        if not ticket:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            if field == "status":
                ticket.status = TicketStatus(value)
            else:
                setattr(ticket, field, value)

        ticket.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def delete_ticket(
        db: Session,
        ticket_id: str,
        organization_id: str,
    ) -> bool:
        """Delete an event ticket"""
        ticket = db.scalar(
            select(EventTicket).where(
                EventTicket.id == ticket_id,
                EventTicket.organization_id == organization_id,
            )
        )
        if not ticket:
            return False

        db.delete(ticket)
        db.commit()
        return True

    # ========================================================================
    # Event Registration Operations
    # ========================================================================

    @staticmethod
    def create_registration(
        db: Session,
        registration_data: EventRegistrationCreate,
    ) -> EventRegistration:
        """Create a new event registration"""
        # Verify event exists and belongs to organization
        event = EventService.get_event(
            db, registration_data.event_id, registration_data.organization_id
        )
        if not event:
            raise ValueError(f"Event {registration_data.event_id} not found")

        # Verify ticket exists if provided
        ticket = None
        if registration_data.ticket_id:
            ticket = db.scalar(
                select(EventTicket).where(
                    EventTicket.id == registration_data.ticket_id,
                    EventTicket.event_id == registration_data.event_id,
                    EventTicket.organization_id == registration_data.organization_id,
                )
            )
            if not ticket:
                raise ValueError(f"Ticket {registration_data.ticket_id} not found")

            # Check ticket availability
            if ticket.quantity_available is not None:
                if ticket.quantity_sold >= ticket.quantity_available:
                    raise ValueError(f"Ticket {ticket.name} is sold out")

        # Verify session exists if provided
        session = None
        if registration_data.session_id:
            session = db.scalar(
                select(EventSession).where(
                    EventSession.id == registration_data.session_id,
                    EventSession.event_id == registration_data.event_id,
                    EventSession.organization_id == registration_data.organization_id,
                )
            )
            if not session:
                raise ValueError(f"Session {registration_data.session_id} not found")

        # Calculate payment amount
        payment_amount = ticket.price if ticket else event.base_price
        currency = ticket.currency if ticket else event.currency

        # Create registration
        registration = EventRegistration(
            event_id=registration_data.event_id,
            session_id=registration_data.session_id,
            ticket_id=registration_data.ticket_id,
            attendee_name=registration_data.attendee_name,
            attendee_email=registration_data.attendee_email,
            attendee_phone=registration_data.attendee_phone,
            payment_amount=payment_amount,
            currency=currency,
            payment_status="pending",
            status=RegistrationStatus.PENDING,
            organization_id=registration_data.organization_id,
            registered_by_user_id=registration_data.registered_by_user_id,
        )
        db.add(registration)

        # Update ticket quantity sold if ticket provided
        if ticket:
            ticket.quantity_sold += 1
            if ticket.quantity_available is not None:
                if ticket.quantity_sold >= ticket.quantity_available:
                    ticket.status = TicketStatus.SOLD_OUT

        db.commit()
        db.refresh(registration)

        # Schedule reminders only if registered_by_user_id is provided and not empty
        if registration.registered_by_user_id and (isinstance(registration.registered_by_user_id, str) and registration.registered_by_user_id.strip()):
            try:
                event_reminder_service.schedule_event_reminders(
                    db=db,
                    event=event,
                    user_id=registration.registered_by_user_id,
                )
            except Exception as exc:  # pragma: no cover - non-critical
                logger.warning(
                    "Failed to schedule reminders for registration %s: %s",
                    registration.id,
                    exc,
                )
        return registration

    @staticmethod
    def list_registrations(
        db: Session,
        event_id: str,
        organization_id: str,
        status: Optional[str] = None,
    ) -> List[EventRegistration]:
        """List registrations for an event"""
        # Verify event exists and belongs to organization
        event = EventService.get_event(db, event_id, organization_id)
        if not event:
            return []

        query = select(EventRegistration).where(
            EventRegistration.event_id == event_id,
            EventRegistration.organization_id == organization_id,
        )

        if status:
            query = query.where(EventRegistration.status == status)

        query = query.order_by(desc(EventRegistration.created_at))

        return list(db.scalars(query).all())

    @staticmethod
    def update_registration(
        db: Session,
        registration_id: str,
        organization_id: str,
        update_data: EventRegistrationUpdate,
    ) -> Optional[EventRegistration]:
        """Update an existing event registration"""
        registration = db.scalar(
            select(EventRegistration).where(
                EventRegistration.id == registration_id,
                EventRegistration.organization_id == organization_id,
            )
        )
        if not registration:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            if field == "status":
                registration.status = RegistrationStatus(value)
            elif field == "checked_in" and value:
                registration.checked_in = True
                registration.checked_in_at = datetime.now(UTC)
            else:
                setattr(registration, field, value)

        registration.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(registration)
        return registration

    @staticmethod
    def delete_registration(
        db: Session,
        registration_id: str,
        organization_id: str,
    ) -> bool:
        """Cancel an event registration"""
        registration = db.scalar(
            select(EventRegistration).where(
                EventRegistration.id == registration_id,
                EventRegistration.organization_id == organization_id,
            )
        )
        if not registration:
            return False

        # Update ticket quantity sold if ticket provided
        if registration.ticket_id:
            ticket = db.scalar(
                select(EventTicket).where(EventTicket.id == registration.ticket_id)
            )
            if ticket:
                ticket.quantity_sold = max(0, ticket.quantity_sold - 1)
                if ticket.status == TicketStatus.SOLD_OUT and ticket.quantity_available:
                    if ticket.quantity_sold < ticket.quantity_available:
                        ticket.status = TicketStatus.ACTIVE

        registration.status = RegistrationStatus.CANCELLED
        registration.updated_at = datetime.now(UTC)
        db.commit()
        return True

    # ========================================================================
    # Event Analytics Operations
    # ========================================================================

    @staticmethod
    def get_event_analytics(
        db: Session,
        event_id: str,
        organization_id: str,
    ) -> Optional[EventAnalytics]:
        """Get or create event analytics"""
        # Verify event exists and belongs to organization
        event = EventService.get_event(db, event_id, organization_id)
        if not event:
            return None

        # Get or create analytics
        analytics = db.scalar(
            select(EventAnalytics).where(
                EventAnalytics.event_id == event_id,
                EventAnalytics.organization_id == organization_id,
            )
        )

        if not analytics:
            # Calculate metrics
            total_registrations = db.scalar(
                select(func.count(EventRegistration.id))
                .where(EventRegistration.event_id == event_id)
            ) or 0

            total_attendees = db.scalar(
                select(func.count(EventRegistration.id))
                .where(
                    EventRegistration.event_id == event_id,
                    EventRegistration.status == RegistrationStatus.ATTENDED,
                )
            ) or 0

            total_revenue = db.scalar(
                select(func.sum(EventRegistration.payment_amount))
                .where(
                    EventRegistration.event_id == event_id,
                    EventRegistration.payment_status == "paid",
                )
            ) or Decimal("0.00")

            # Calculate session metrics
            sessions = EventService.list_sessions(db, event_id, organization_id)
            session_metrics = {}
            for session in sessions:
                session_registrations = db.scalar(
                    select(func.count(EventRegistration.id))
                    .where(EventRegistration.session_id == session.id)
                ) or 0
                session_attendees = db.scalar(
                    select(func.count(EventRegistration.id))
                    .where(
                        EventRegistration.session_id == session.id,
                        EventRegistration.status == RegistrationStatus.ATTENDED,
                    )
                ) or 0
                session_revenue = db.scalar(
                    select(func.sum(EventRegistration.payment_amount))
                    .where(
                        EventRegistration.session_id == session.id,
                        EventRegistration.payment_status == "paid",
                    )
                ) or Decimal("0.00")

                session_metrics[str(session.id)] = {
                    "registrations": session_registrations,
                    "attendees": session_attendees,
                    "revenue": float(session_revenue),
                }

            # Create analytics record
            analytics = EventAnalytics(
                event_id=event_id,
                total_registrations=total_registrations,
                total_attendees=total_attendees,
                total_revenue=total_revenue,
                currency=event.currency,
                session_metrics=session_metrics,
                organization_id=organization_id,
            )
            db.add(analytics)
            db.commit()
            db.refresh(analytics)
        else:
            # Update existing analytics
            total_registrations = db.scalar(
                select(func.count(EventRegistration.id))
                .where(EventRegistration.event_id == event_id)
            ) or 0

            total_attendees = db.scalar(
                select(func.count(EventRegistration.id))
                .where(
                    EventRegistration.event_id == event_id,
                    EventRegistration.status == RegistrationStatus.ATTENDED,
                )
            ) or 0

            total_revenue = db.scalar(
                select(func.sum(EventRegistration.payment_amount))
                .where(
                    EventRegistration.event_id == event_id,
                    EventRegistration.payment_status == "paid",
                )
            ) or Decimal("0.00")

            analytics.total_registrations = total_registrations
            analytics.total_attendees = total_attendees
            analytics.total_revenue = total_revenue
            analytics.recorded_at = datetime.now(UTC)

            # Update session metrics
            sessions = EventService.list_sessions(db, event_id, organization_id)
            session_metrics = {}
            for session in sessions:
                session_registrations = db.scalar(
                    select(func.count(EventRegistration.id))
                    .where(EventRegistration.session_id == session.id)
                ) or 0
                session_attendees = db.scalar(
                    select(func.count(EventRegistration.id))
                    .where(
                        EventRegistration.session_id == session.id,
                        EventRegistration.status == RegistrationStatus.ATTENDED,
                    )
                ) or 0
                session_revenue = db.scalar(
                    select(func.sum(EventRegistration.payment_amount))
                    .where(
                        EventRegistration.session_id == session.id,
                        EventRegistration.payment_status == "paid",
                    )
                ) or Decimal("0.00")

                session_metrics[str(session.id)] = {
                    "registrations": session_registrations,
                    "attendees": session_attendees,
                    "revenue": float(session_revenue),
                }

            analytics.session_metrics = session_metrics
            db.commit()
            db.refresh(analytics)

        return analytics

