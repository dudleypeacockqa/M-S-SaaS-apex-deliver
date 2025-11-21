"""
Event Management API Routes
Feature: F-012 Event Management Hub
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
import csv
import io
import json

from app.db.session import get_db
from app.api.dependencies.auth import get_current_user
from app.models.user import User
from app.models.event import EventTicket
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
    EventSessionCreateRequest,
    EventSessionCreate,
    EventSessionUpdate,
    EventSessionResponse,
    EventTicketCreateRequest,
    EventTicketCreate,
    EventTicketUpdate,
    EventTicketResponse,
    EventRegistrationCreateRequest,
    EventRegistrationCreate,
    EventRegistrationUpdate,
    EventRegistrationResponse,
    EventAnalyticsResponse,
)
from app.services.event_service import EventService
from app.services.event_notification_service import send_registration_confirmation_email


router = APIRouter(prefix="/events", tags=["events"])


# ============================================================================
# Event Endpoints
# ============================================================================

@router.post("/", response_model=EventResponse, status_code=201)
def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new event
    
    Requires authentication and organization membership.
    """
    # Ensure user can only create events for their organization
    if event_data.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Cannot create event for another organization")

    # Override created_by_user_id with current user
    event_data.created_by_user_id = current_user.id

    try:
        event = EventService.create_event(db, event_data)
        return event
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[EventResponse])
def list_events(
    status: Optional[str] = Query(None, pattern="^(draft|published|cancelled|completed)$"),
    event_type: Optional[str] = Query(None, pattern="^(virtual|in_person|hybrid)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all events for the current user's organization
    
    Optional filters:
    - status: draft, published, cancelled, or completed
    - event_type: virtual, in_person, or hybrid
    """
    events = EventService.list_events(
        db,
        organization_id=current_user.organization_id,
        status=status,
        event_type=event_type,
        skip=skip,
        limit=limit,
    )
    return events


@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific event by ID"""
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return event


@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: str,
    update_data: EventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing event"""
    event = EventService.update_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
        update_data=update_data,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return event


@router.delete("/{event_id}", status_code=204)
def delete_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel an event (soft delete)"""
    deleted = EventService.delete_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not deleted:
        raise HTTPException(status_code=404, detail="Event not found")

    return None


# ============================================================================
# Event Session Endpoints
# ============================================================================

@router.post("/{event_id}/sessions", response_model=EventSessionResponse, status_code=201)
def create_session(
    event_id: str,
    session_data: EventSessionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new event session
    
    Requires authentication and organization membership.
    """
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Create full schema with fields set by route
    full_session_data = EventSessionCreate(
        **session_data.model_dump(),
        event_id=event_id,
        organization_id=current_user.organization_id,
        created_by_user_id=current_user.id,
    )

    try:
        session = EventService.create_session(db, full_session_data)
        return session
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{event_id}/sessions", response_model=List[EventSessionResponse])
def list_sessions(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all sessions for an event"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    sessions = EventService.list_sessions(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )
    return sessions


@router.put("/{event_id}/sessions/{session_id}", response_model=EventSessionResponse)
def update_session(
    event_id: str,
    session_id: str,
    update_data: EventSessionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing event session"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    session = EventService.update_session(
        db,
        session_id=session_id,
        organization_id=current_user.organization_id,
        update_data=update_data,
    )

    if not session:
        raise HTTPException(status_code=404, detail="Event session not found")

    return session


@router.delete("/{event_id}/sessions/{session_id}", status_code=204)
def delete_session(
    event_id: str,
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an event session"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    deleted = EventService.delete_session(
        db,
        session_id=session_id,
        organization_id=current_user.organization_id,
    )

    if not deleted:
        raise HTTPException(status_code=404, detail="Event session not found")

    return None


# ============================================================================
# Event Ticket Endpoints
# ============================================================================

@router.post("/{event_id}/tickets", response_model=EventTicketResponse, status_code=201)
def create_ticket(
    event_id: str,
    ticket_data: EventTicketCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new event ticket
    
    Requires authentication and organization membership.
    """
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Create full schema with fields set by route
    full_ticket_data = EventTicketCreate(
        **ticket_data.model_dump(),
        event_id=event_id,
        organization_id=current_user.organization_id,
        created_by_user_id=current_user.id,
    )

    try:
        ticket = EventService.create_ticket(db, full_ticket_data)
        return ticket
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{event_id}/tickets", response_model=List[EventTicketResponse])
def list_tickets(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all tickets for an event"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    tickets = EventService.list_tickets(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )
    return tickets


@router.put("/{event_id}/tickets/{ticket_id}", response_model=EventTicketResponse)
def update_ticket(
    event_id: str,
    ticket_id: str,
    update_data: EventTicketUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing event ticket"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    ticket = EventService.update_ticket(
        db,
        ticket_id=ticket_id,
        organization_id=current_user.organization_id,
        update_data=update_data,
    )

    if not ticket:
        raise HTTPException(status_code=404, detail="Event ticket not found")

    return ticket


@router.delete("/{event_id}/tickets/{ticket_id}", status_code=204)
def delete_ticket(
    event_id: str,
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an event ticket"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    deleted = EventService.delete_ticket(
        db,
        ticket_id=ticket_id,
        organization_id=current_user.organization_id,
    )

    if not deleted:
        raise HTTPException(status_code=404, detail="Event ticket not found")

    return None


# ============================================================================
# Event Registration Endpoints
# ============================================================================

@router.post("/{event_id}/registrations", response_model=EventRegistrationResponse, status_code=201)
def create_registration(
    event_id: str,
    registration_data: EventRegistrationCreateRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new event registration
    
    Requires authentication and organization membership.
    """
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Create full schema with fields set by route
    full_registration_data = EventRegistrationCreate(
        **registration_data.model_dump(),
        event_id=event_id,
        organization_id=current_user.organization_id,
        registered_by_user_id=current_user.id,
    )

    try:
        registration = EventService.create_registration(db, full_registration_data)

        ticket_name = None
        if registration.ticket_id:
            ticket = db.scalar(
                select(EventTicket).where(
                    EventTicket.id == registration.ticket_id,
                    EventTicket.event_id == event_id,
                )
            )
            if ticket:
                ticket_name = ticket.name

        # Queue confirmation email in the background (best-effort)
        background_tasks.add_task(
            send_registration_confirmation_email,
            {
                "attendee_email": registration.attendee_email,
                "attendee_name": registration.attendee_name,
                "event_name": event.name,
                "event_start": event.start_date.isoformat() if event.start_date else None,
                "event_location": event.location or event.virtual_link or "",
                "ticket_name": ticket_name,
                "payment_amount": str(registration.payment_amount),
                "currency": registration.currency,
            },
        )

        return registration
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{event_id}/registrations", response_model=List[EventRegistrationResponse])
def list_registrations(
    event_id: str,
    status: Optional[str] = Query(None, pattern="^(pending|confirmed|cancelled|attended|no_show)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all registrations for an event"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    registrations = EventService.list_registrations(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
        status=status,
    )
    return registrations


@router.put("/{event_id}/registrations/{registration_id}", response_model=EventRegistrationResponse)
def update_registration(
    event_id: str,
    registration_id: str,
    update_data: EventRegistrationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing event registration"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    registration = EventService.update_registration(
        db,
        registration_id=registration_id,
        organization_id=current_user.organization_id,
        update_data=update_data,
    )

    if not registration:
        raise HTTPException(status_code=404, detail="Event registration not found")

    return registration


@router.delete("/{event_id}/registrations/{registration_id}", status_code=204)
def delete_registration(
    event_id: str,
    registration_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel an event registration"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    deleted = EventService.delete_registration(
        db,
        registration_id=registration_id,
        organization_id=current_user.organization_id,
    )

    if not deleted:
        raise HTTPException(status_code=404, detail="Event registration not found")

    return None


# ============================================================================
# Event Analytics Endpoints
# ============================================================================

@router.get("/{event_id}/analytics", response_model=EventAnalyticsResponse)
def get_event_analytics(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get event analytics"""
    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    analytics = EventService.get_event_analytics(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not analytics:
        raise HTTPException(status_code=404, detail="Event analytics not found")

    return analytics


# ============================================================================
# Event Export Endpoints
# ============================================================================

@router.get("/{event_id}/registrations/export")
def export_registrations(
    event_id: str,
    format: str = Query("csv", pattern="^(csv|json)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Export event registrations as CSV or JSON
    
    Returns a file download of all registrations for an event.
    """
    from fastapi.responses import StreamingResponse
    import csv
    import io
    import json

    # Verify event exists and belongs to user's organization
    event = EventService.get_event(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Get registrations
    registrations = EventService.list_registrations(
        db,
        event_id=event_id,
        organization_id=current_user.organization_id,
    )

    if format == "csv":
        # Generate CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            "Registration ID",
            "Attendee Name",
            "Attendee Email",
            "Attendee Phone",
            "Ticket Name",
            "Payment Amount",
            "Payment Status",
            "Status",
            "Checked In",
            "Registered At",
        ])
        
        # Write data
        for registration in registrations:
            ticket_name = None
            if registration.ticket_id:
                from app.models.event import EventTicket
                ticket = db.scalar(
                    select(EventTicket).where(EventTicket.id == registration.ticket_id)
                )
                ticket_name = ticket.name if ticket else None
            
            writer.writerow([
                registration.id,
                registration.attendee_name,
                registration.attendee_email,
                registration.attendee_phone or "",
                ticket_name or "",
                str(registration.payment_amount),
                registration.payment_status,
                registration.status.value,
                "Yes" if registration.checked_in else "No",
                registration.created_at.isoformat(),
            ])
        
        # Return CSV file
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=event-{event_id}-registrations.csv"},
        )
    else:
        # Generate JSON
        registrations_data = []
        for registration in registrations:
            ticket_name = None
            if registration.ticket_id:
                from app.models.event import EventTicket
                ticket = db.scalar(
                    select(EventTicket).where(EventTicket.id == registration.ticket_id)
                )
                ticket_name = ticket.name if ticket else None
            
            registrations_data.append({
                "id": registration.id,
                "attendee_name": registration.attendee_name,
                "attendee_email": registration.attendee_email,
                "attendee_phone": registration.attendee_phone,
                "ticket_name": ticket_name,
                "payment_amount": str(registration.payment_amount),
                "payment_status": registration.payment_status,
                "status": registration.status.value,
                "checked_in": registration.checked_in,
                "registered_at": registration.created_at.isoformat(),
            })
        
        # Return JSON file
        return StreamingResponse(
            io.BytesIO(json.dumps(registrations_data, indent=2).encode("utf-8")),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=event-{event_id}-registrations.json"},
        )

