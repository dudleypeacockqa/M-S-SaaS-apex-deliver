"""Utilities for seeding Master Admin Portal demo data."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, date, timezone
from decimal import Decimal
import json
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.master_admin import (
    AdminProspect,
    AdminDeal,
    AdminCampaign,
    AdminCampaignRecipient,
    AdminContentScript,
    AdminContentPiece,
    AdminLeadCapture,
    AdminCollateral,
)
from app.models.enums import (
    ProspectStatus,
    AdminDealStage,
    CampaignType,
    CampaignStatus,
    ContentType,
    ContentStatus,
)


@dataclass(slots=True)
class MasterAdminSeedResult:
    """IDs for the demo records that were ensured by the seeding routine."""

    prospects: List[int] = field(default_factory=list)
    deals: List[int] = field(default_factory=list)
    campaigns: List[int] = field(default_factory=list)
    campaign_recipients: List[int] = field(default_factory=list)
    content_scripts: List[int] = field(default_factory=list)
    content_pieces: List[int] = field(default_factory=list)
    lead_captures: List[int] = field(default_factory=list)
    collateral: List[int] = field(default_factory=list)


def seed_master_admin_demo(db: Session, *, user_id: str) -> MasterAdminSeedResult:
    """Ensure a handful of Master Admin demo records exist for the given user.

    This helper is idempotent – calling it multiple times returns the existing
    IDs without creating duplicates.
    """

    summary = MasterAdminSeedResult()

    def _get_or_create(model, **filters):
        stmt = select(model).filter_by(**filters)
        instance = db.scalar(stmt)
        return instance

    def _ensure_prospect(name: str, **fields) -> AdminProspect:
        existing = db.scalar(
            select(AdminProspect).where(
                AdminProspect.user_id == user_id,
                AdminProspect.name == name,
            )
        )
        if existing:
            return existing
        prospect = AdminProspect(
            user_id=user_id,
            name=name,
            status=fields.get("status", ProspectStatus.QUALIFIED),
            email=fields.get("email"),
            company=fields.get("company"),
            tags=json.dumps(fields.get("tags", ["qa"])),
            source=fields.get("source", "qa-seed"),
            notes=fields.get("notes", "QA seed data"),
        )
        db.add(prospect)
        db.flush()
        return prospect

    def _ensure_deal(title: str, prospect: AdminProspect, **fields) -> AdminDeal:
        existing = db.scalar(
            select(AdminDeal).where(
                AdminDeal.user_id == user_id,
                AdminDeal.title == title,
            )
        )
        if existing:
            return existing
        deal = AdminDeal(
            user_id=user_id,
            title=title,
            prospect_id=prospect.id,
            stage=fields.get("stage", AdminDealStage.NEGOTIATION),
            value=fields.get("value", Decimal("7500000")),
            probability=fields.get("probability", 45),
            expected_close_date=fields.get("expected_close_date", date.today()),
            notes="QA seed deal",
        )
        db.add(deal)
        db.flush()
        return deal

    def _ensure_campaign(name: str, **fields) -> AdminCampaign:
        existing = db.scalar(
            select(AdminCampaign).where(
                AdminCampaign.user_id == user_id,
                AdminCampaign.name == name,
            )
        )
        if existing:
            return existing
        campaign = AdminCampaign(
            user_id=user_id,
            name=name,
            type=fields.get("type", CampaignType.EMAIL),
            status=fields.get("status", CampaignStatus.SCHEDULED),
            subject=fields.get("subject", "QA Outreach"),
            content=fields.get("content", "Hello from QA"),
            schedule_at=fields.get("schedule_at", datetime.now(timezone.utc)),
            total_recipients=fields.get("total_recipients", 0),
        )
        db.add(campaign)
        db.flush()
        return campaign

    def _ensure_campaign_recipient(campaign: AdminCampaign, prospect: AdminProspect) -> AdminCampaignRecipient:
        existing = db.scalar(
            select(AdminCampaignRecipient).where(
                AdminCampaignRecipient.campaign_id == campaign.id,
                AdminCampaignRecipient.prospect_id == prospect.id,
            )
        )
        if existing:
            return existing
        recipient = AdminCampaignRecipient(
            campaign_id=campaign.id,
            prospect_id=prospect.id,
            sent=False,
        )
        db.add(recipient)
        db.flush()
        return recipient

    def _ensure_content_script(title: str, **fields) -> AdminContentScript:
        existing = db.scalar(
            select(AdminContentScript).where(
                AdminContentScript.user_id == user_id,
                AdminContentScript.title == title,
            )
        )
        if existing:
            return existing
        script = AdminContentScript(
            user_id=user_id,
            title=title,
            content_type=fields.get("content_type", ContentType.YOUTUBE),
            script_text=fields.get("script_text", "Demo script body"),
            duration_minutes=fields.get("duration_minutes", 4),
            keywords=json.dumps(fields.get("keywords", ["qa", "demo"])),
        )
        db.add(script)
        db.flush()
        return script

    def _ensure_content_piece(title: str, script: AdminContentScript, **fields) -> AdminContentPiece:
        existing = db.scalar(
            select(AdminContentPiece).where(
                AdminContentPiece.user_id == user_id,
                AdminContentPiece.title == title,
            )
        )
        if existing:
            return existing
        piece = AdminContentPiece(
            user_id=user_id,
            title=title,
            type=fields.get("type", ContentType.YOUTUBE),
            status=fields.get("status", ContentStatus.SCRIPTING),
            script_id=script.id,
            description="QA seed content",
            tags=json.dumps(fields.get("tags", ["qa", "demo"])),
        )
        db.add(piece)
        db.flush()
        return piece

    def _ensure_lead_capture(email: str, **fields) -> AdminLeadCapture:
        existing = db.scalar(
            select(AdminLeadCapture).where(
                AdminLeadCapture.user_id == user_id,
                AdminLeadCapture.email == email,
            )
        )
        if existing:
            return existing
        lead = AdminLeadCapture(
            user_id=user_id,
            name=fields.get("name", "QA Lead"),
            email=email,
            company=fields.get("company", "QA Industries"),
            event_name=fields.get("event_name", "QA Summit"),
            event_date=fields.get("event_date", date.today()),
            source=fields.get("source", "qa-seed"),
        )
        db.add(lead)
        db.flush()
        return lead

    def _ensure_collateral(title: str, **fields) -> AdminCollateral:
        existing = db.scalar(
            select(AdminCollateral).where(
                AdminCollateral.user_id == user_id,
                AdminCollateral.title == title,
            )
        )
        if existing:
            return existing
        collateral = AdminCollateral(
            user_id=user_id,
            title=title,
            type=fields.get("type", "one-pager"),
            description=fields.get("description", "QA reference asset"),
            file_url=fields.get("file_url", "https://example.com/qa-collateral.pdf"),
            file_size=fields.get("file_size", 1024),
            mime_type=fields.get("mime_type", "application/pdf"),
            tags=json.dumps(fields.get("tags", ["qa", "collateral"])),
        )
        db.add(collateral)
        db.flush()
        return collateral

    # Prospects & deals
    atlas = _ensure_prospect(
        "Atlas Industrial QA",
        email="atlas.qa@example.com",
        company="Atlas Industrial",
        tags=["qa", "industrial"],
        source="qa-seed",
        status=ProspectStatus.QUALIFIED,
    )
    summary.prospects.append(atlas.id)

    beacon = _ensure_prospect(
        "Beacon Analytics QA",
        email="beacon.qa@example.com",
        company="Beacon Analytics",
        tags=["analytics", "warm"],
        status=ProspectStatus.NEGOTIATION,
    )
    summary.prospects.append(beacon.id)

    deal = _ensure_deal(
        "Atlas Industrial Platform Rollout",
        prospect=atlas,
        stage=AdminDealStage.NEGOTIATION,
        value=Decimal("9500000"),
        probability=55,
    )
    summary.deals.append(deal.id)

    # Campaign + recipients
    campaign = _ensure_campaign(
        "QA Warm Outreach",
        type=CampaignType.EMAIL,
        status=CampaignStatus.SCHEDULED,
        subject="QA Outreach",
        content="Testing the master admin campaign flow",
    )
    summary.campaigns.append(campaign.id)
    for prospect in (atlas, beacon):
        recipient = _ensure_campaign_recipient(campaign, prospect)
        summary.campaign_recipients.append(recipient.id)

    # Content
    script = _ensure_content_script(
        "Integration Readiness Script",
        content_type=ContentType.YOUTUBE,
        script_text="Intro + CTA for platform readiness",
    )
    summary.content_scripts.append(script.id)

    piece = _ensure_content_piece(
        "Integration Readiness Walkthrough",
        script=script,
        type=ContentType.YOUTUBE,
        status=ContentStatus.SCRIPTING,
    )
    summary.content_pieces.append(piece.id)

    # Lead capture & collateral
    lead = _ensure_lead_capture(
        "marketing.qa+lead@example.com",
        name="QA Expo Lead",
        company="QA Expo",
        event_name="QA Expo",
    )
    summary.lead_captures.append(lead.id)

    collateral = _ensure_collateral(
        "QA Sales One-Pager",
        description="One-pager seeded for QA",
    )
    summary.collateral.append(collateral.id)

    db.commit()
    return summary
