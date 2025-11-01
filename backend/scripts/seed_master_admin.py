"""Seed sample data for the Master Admin portal."""
from __future__ import annotations

import os
import sys
from datetime import date, datetime, timedelta
from decimal import Decimal
from pathlib import Path
from typing import Iterable

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

# Make sure backend/app modules are importable whether running locally or on Render.
POSSIBLE_BACKEND_ROOTS: Iterable[Path] = (
    Path(__file__).resolve().parents[1],   # backend/
    Path.cwd() / "backend",                # repo root -> backend
    Path("/app/backend"),                  # Render deployment
)

for backend_root in POSSIBLE_BACKEND_ROOTS:
    if backend_root.exists():
        sys.path.insert(0, str(backend_root))
        break

from app.db.base import Base  # noqa: E402
from app.models.user import User, UserRole  # noqa: E402
from app.models.master_admin import (  # noqa: E402
    ActivityStatus,
    ActivityType,
    AdminActivity,
    AdminCampaign,
    AdminCampaignRecipient,
    AdminCollateral,
    AdminCollateralUsage,
    AdminContentPiece,
    AdminContentScript,
    AdminDeal,
    AdminGoal,
    AdminLeadCapture,
    AdminMeeting,
    AdminProspect,
    AdminScore,
    CampaignStatus,
    CampaignType,
    ContentStatus,
    ContentType,
    DealStage,
    MeetingType,
    ProspectStatus,
)

MASTER_ADMIN_USER_ID = "11111111-1111-1111-1111-111111111111"


def get_session() -> Session:
    """Create a database session using DATABASE_URL."""
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    engine = create_engine(database_url)
    Base.metadata.bind = engine
    return sessionmaker(bind=engine)()


def get_or_create_seed_user(session: Session) -> User:
    """Ensure a demo user exists for attaching Master Admin data."""
    user = session.get(User, MASTER_ADMIN_USER_ID)
    if user:
        return user

    user = User(
        id=MASTER_ADMIN_USER_ID,
        clerk_user_id="demo-master-admin",
        email="master.admin@example.com",
        first_name="Master",
        last_name="Admin",
        role=UserRole.admin,
        is_active=True,
    )
    session.add(user)
    session.flush()
    return user


def seed_goals_scores(session: Session, user: User) -> None:
    """Create a weekly goal and daily score sample."""
    week_start = date.today() - timedelta(days=date.today().weekday())

    goal = session.query(AdminGoal).filter_by(user_id=user.id, week_start=week_start).one_or_none()
    if not goal:
        session.add(
            AdminGoal(
                user_id=user.id,
                week_start=week_start,
                target_discoveries=5,
                target_emails=20,
                target_videos=2,
                target_calls=12,
            )
        )

    score = session.query(AdminScore).filter_by(user_id=user.id, date=week_start).one_or_none()
    if not score:
        session.add(
            AdminScore(
                user_id=user.id,
                date=week_start,
                score=82,
                streak_days=3,
                activities_count=14,
            )
        )


def seed_prospects_and_deals(session: Session, user: User) -> list[AdminProspect]:
    """Create prospects and deals for pipeline demo data."""
    sample_definitions = [
        {
            "name": "Acme Manufacturing",
            "email": "ceo@acmemfg.com",
            "company": "Acme Manufacturing",
            "title": "CEO",
            "status": "qualified",
            "source": "referral",
        },
        {
            "name": "Northwind Holdings",
            "email": "invest@northwind.com",
            "company": "Northwind Holdings",
            "title": "Head of Corporate Development",
            "status": "engaged",
            "source": "inbound",
        },
    ]

    prospects: list[AdminProspect] = []
    for entry in sample_definitions:
        prospect = session.query(AdminProspect).filter_by(user_id=user.id, email=entry["email"]).one_or_none()
        if not prospect:
            prospect = AdminProspect(
                user_id=user.id,
                voice_notes_url=None,
                notes="Sample prospect seeded for demo purposes.",
                last_contacted=datetime.utcnow(),
                **entry,
            )
            session.add(prospect)
            session.flush()
        prospects.append(prospect)

        deal_title = f"{entry['name']} Strategic Partnership"
        deal = session.query(AdminDeal).filter_by(user_id=user.id, title=deal_title).one_or_none()
        if not deal:
            session.add(
                AdminDeal(
                    user_id=user.id,
                    prospect_id=prospect.id,
                    title=deal_title,
                    stage="discovery" if len(prospects) == 1 else "proposal",
                    value=Decimal("2500000") if len(prospects) == 1 else Decimal("1800000"),
                    probability=40 if len(prospects) == 1 else 55,
                    expected_close_date=date.today() + timedelta(days=60),
                    notes="Initial value estimate captured during seeding.",
                )
            )

    return prospects


def seed_activities(session: Session, user: User, prospect: AdminProspect | None) -> None:
    """Add a few daily activities tied to the first prospect."""
    activity_date = date.today() - timedelta(days=1)
    templates = [
        ("discovery", "done", "Discovery call complete"),
        ("email", "done", "Sent recap email with next steps"),
        ("call", "pending", "Schedule diligence follow-up"),
    ]

    for activity_type, status, notes in templates:
        exists = (
            session.query(AdminActivity)
            .filter(
                AdminActivity.user_id == user.id,
                AdminActivity.date == activity_date,
                AdminActivity.type == activity_type,
                AdminActivity.notes == notes,
            )
            .one_or_none()
        )
        if exists:
            continue
        session.add(
            AdminActivity(
                user_id=user.id,
                type=activity_type,
                status=status,
                date=activity_date,
                amount=1,
                notes=notes,
                prospect_id=prospect.id if prospect else None,
            )
        )


def seed_meeting_templates(session: Session, user: User) -> None:
    """Create reusable meeting templates covering each meeting type."""
    templates = {
        "discovery": "Discovery Call Template",
        "demo": "Product Demo Playbook",
        "negotiation": "Negotiation Checklist",
        "closing": "Closing Review Agenda",
    }

    for meeting_type, title in templates.items():
        existing = (
            session.query(AdminMeeting)
            .filter(
                AdminMeeting.user_id == user.id,
                AdminMeeting.type == meeting_type,
            )
            .first()
        )
        if existing:
            continue
        session.add(
            AdminMeeting(
                user_id=user.id,
                title=title,
                type=meeting_type,
                duration_minutes=60,
                agenda="Preset agenda covering goals, requirements, and follow-up actions.",
                questions="What success metrics matter most? What is your timeline?",
                follow_up_tasks="Send summary email and attach relevant collateral.",
            )
        )


def seed_campaigns(session: Session, user: User, prospects: list[AdminProspect]) -> None:
    """Seed two campaign templates and link recipients."""
    campaign_defs = [
        {
            "name": "Onboarding Email Sequence",
            "type": "email",
            "status": "draft",
            "subject": "Kick-off your transformation",
            "content": "Three-touch campaign designed to educate new prospects.",
        },
        {
            "name": "Quarterly SMS Check-in",
            "type": "sms",
            "status": "scheduled",
            "subject": "Quick pulse check",
            "content": "Short SMS cadence to re-engage dormant prospects.",
            "scheduled_at": datetime.utcnow() + timedelta(days=3),
        },
    ]

    for definition in campaign_defs:
        campaign = session.query(AdminCampaign).filter_by(user_id=user.id, name=definition["name"]).one_or_none()
        if not campaign:
            campaign = AdminCampaign(user_id=user.id, total_recipients=len(prospects), **definition)
            session.add(campaign)
            session.flush()

            for prospect in prospects:
                if (
                    session.query(AdminCampaignRecipient)
                    .filter_by(campaign_id=campaign.id, prospect_id=prospect.id)
                    .first()
                ):
                    continue
                session.add(
                    AdminCampaignRecipient(
                        campaign_id=campaign.id,
                        prospect_id=prospect.id,
                        sent=False,
                        opened=False,
                        clicked=False,
                        bounced=False,
                    )
                )


def seed_content(session: Session, user: User) -> None:
    """Create sample scripts and content pieces."""
    script = session.query(AdminContentScript).filter_by(user_id=user.id, title="Discovery Call Script").one_or_none()
    if not script:
        script = AdminContentScript(
            user_id=user.id,
            title="Discovery Call Script",
            content_type="blog",
            script_text="Opening questions, qualification checklist, and KPI prompts.",
            duration_minutes=15,
            keywords="[\"discovery\", \"qualification\", \"sales\"]",
        )
        session.add(script)
        session.flush()

    piece = session.query(AdminContentPiece).filter_by(user_id=user.id, title="2025 Strategic Planning Guide").one_or_none()
    if not piece:
        session.add(
            AdminContentPiece(
                user_id=user.id,
                title="2025 Strategic Planning Guide",
                type="blog",
                status="ready",
                script_id=script.id,
                recording_url="https://cdn.example.com/videos/strategic-planning.mp4",
                edited_url="https://cdn.example.com/videos/strategic-planning-final.mp4",
                thumbnail_url="https://cdn.example.com/thumbnails/strategic-planning.jpg",
                description="High-level planning framework for revenue leaders.",
                tags="[\"planning\", \"strategy\"]",
                youtube_url="https://youtu.be/example",
                views_count=0,
            )
        )


def seed_collateral(session: Session, user: User) -> None:
    """Create collateral items and usage records."""
    collateral = session.query(AdminCollateral).filter_by(user_id=user.id, title="Executive Summary Deck").one_or_none()
    if not collateral:
        collateral = AdminCollateral(
            user_id=user.id,
            title="Executive Summary Deck",
            type="presentation",
            description="Updated executive overview of the ApexDeliver platform.",
            file_url="https://cdn.example.com/collateral/executive-summary.pdf",
            file_size=5242880,
            mime_type="application/pdf",
            tags="[\"overview\", \"executive\"]",
        )
        session.add(collateral)
        session.flush()

    if not session.query(AdminCollateralUsage).filter_by(collateral_id=collateral.id).first():
        session.add(
            AdminCollateralUsage(
                collateral_id=collateral.id,
                prospect_id=None,
                context="Shared during discovery follow-up",
            )
        )

    checklist = session.query(AdminCollateral).filter_by(user_id=user.id, title="Implementation Checklist").one_or_none()
    if not checklist:
        session.add(
            AdminCollateral(
                user_id=user.id,
                title="Implementation Checklist",
                type="worksheet",
                description="Step-by-step checklist for onboarding new customers.",
                file_url="https://cdn.example.com/collateral/implementation-checklist.xlsx",
                mime_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                tags="[\"onboarding\", \"operations\"]",
            )
        )


def seed_lead_capture(session: Session, user: User) -> None:
    """Optionally create a lead capture record to round out the dataset."""
    capture = session.query(AdminLeadCapture).filter_by(user_id=user.id, email="lead@tradefair.com").one_or_none()
    if capture:
        return

    session.add(
        AdminLeadCapture(
            user_id=user.id,
            name="Jayla Rivers",
            email="lead@tradefair.com",
            phone="(555) 555-1212",
            company="TradeFair Expo",
            event_name="Growth Expo",
            event_date=date.today() - timedelta(days=15),
            interest_level="high",
            follow_up_type="email",
            notes="Met at booth #214; interested in product tour.",
            synced_to_ghl=False,
        )
    )


def run_seed() -> None:
    session = get_session()
    try:
        user = get_or_create_seed_user(session)
        seed_goals_scores(session, user)
        prospects = seed_prospects_and_deals(session, user)
        primary_prospect = prospects[0] if prospects else None
        seed_activities(session, user, primary_prospect)
        seed_meeting_templates(session, user)
        seed_campaigns(session, user, prospects)
        seed_content(session, user)
        seed_collateral(session, user)
        seed_lead_capture(session, user)

        session.commit()
        print("[SUCCESS] Master Admin sample data seeded successfully.")
    except Exception as exc:  # pragma: no cover - diagnostic output
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    run_seed()
