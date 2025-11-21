from decimal import Decimal
from datetime import date

from sqlalchemy import select, func

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
from app.services.master_admin_seed_service import seed_master_admin_demo


def test_seed_master_admin_demo_creates_sample_data(db_session, master_admin_user):
    result = seed_master_admin_demo(db_session, user_id=str(master_admin_user.id))

    assert len(result.prospects) == 2
    assert len(result.deals) == 1
    assert len(result.campaigns) == 1
    assert len(result.campaign_recipients) == 2
    assert len(result.content_scripts) == 1
    assert len(result.content_pieces) == 1
    assert len(result.lead_captures) == 1
    assert len(result.collateral) == 1

    def count(model):
        stmt = select(func.count()).select_from(model)
        if hasattr(model, "user_id"):
            stmt = stmt.where(model.user_id == str(master_admin_user.id))
        elif model is AdminCampaignRecipient:
            stmt = stmt.join(
                AdminCampaign,
                AdminCampaign.id == AdminCampaignRecipient.campaign_id,
            ).where(AdminCampaign.user_id == str(master_admin_user.id))
        return db_session.scalar(stmt)

    assert count(AdminProspect) == 2
    assert count(AdminDeal) == 1
    assert count(AdminCampaign) == 1
    assert count(AdminCampaignRecipient) == 2
    assert count(AdminContentScript) == 1
    assert count(AdminContentPiece) == 1
    assert count(AdminLeadCapture) == 1
    assert count(AdminCollateral) == 1


def test_seed_master_admin_demo_is_idempotent(db_session, master_admin_user):
    first = seed_master_admin_demo(db_session, user_id=str(master_admin_user.id))
    second = seed_master_admin_demo(db_session, user_id=str(master_admin_user.id))

    assert first.prospects == second.prospects
    assert first.deals == second.deals
    assert first.campaigns == second.campaigns
    assert db_session.scalar(select(func.count()).select_from(AdminProspect)) == 2
    assert db_session.scalar(select(func.count()).select_from(AdminDeal)) == 1
    assert db_session.scalar(select(func.count()).select_from(AdminCampaignRecipient)) == 2
