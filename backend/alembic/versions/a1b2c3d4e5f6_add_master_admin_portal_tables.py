"""Add Master Admin Portal tables

Revision ID: a1b2c3d4e5f6
Revises: de0a8956401c
Create Date: 2025-10-31 20:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "de0a8956401c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enum types for PostgreSQL
    activity_type_enum = sa.Enum("discovery", "email", "video", "call", name="activitytype")
    activity_status_enum = sa.Enum("done", "pending", "cancelled", name="activitystatus")
    nudge_type_enum = sa.Enum("reminder", "suggestion", "alert", "celebration", name="nudgetype")
    nudge_priority_enum = sa.Enum("low", "normal", "high", "urgent", name="nudgepriority")
    meeting_type_enum = sa.Enum("discovery", "demo", "negotiation", "closing", name="meetingtype")
    prospect_status_enum = sa.Enum(
        "new", "qualified", "engaged", "proposal", "negotiation", "closed_won", "closed_lost",
        name="prospectstatus"
    )
    admin_deal_stage_enum = sa.Enum(
        "discovery", "qualification", "proposal", "negotiation", "closing", "won", "lost",
        name="admindealstage"
    )
    campaign_type_enum = sa.Enum("email", "sms", "mixed", name="campaigntype")
    campaign_status_enum = sa.Enum(
        "draft", "scheduled", "sending", "sent", "paused", "cancelled",
        name="campaignstatus"
    )
    content_type_enum = sa.Enum("youtube", "podcast", "blog", "social", name="contenttype")
    content_status_enum = sa.Enum(
        "idea", "scripting", "recording", "editing", "ready", "published",
        name="contentstatus"
    )

    # NOTE: Enums are created automatically by SQLAlchemy when creating tables
    # No need to explicitly create them here - commenting out to avoid duplicates
    # activity_type_enum.create(op.get_bind(), checkfirst=True)
    # activity_status_enum.create(op.get_bind(), checkfirst=True)
    # nudge_type_enum.create(op.get_bind(), checkfirst=True)
    # nudge_priority_enum.create(op.get_bind(), checkfirst=True)
    # meeting_type_enum.create(op.get_bind(), checkfirst=True)
    # prospect_status_enum.create(op.get_bind(), checkfirst=True)
    # admin_deal_stage_enum.create(op.get_bind(), checkfirst=True)
    # campaign_type_enum.create(op.get_bind(), checkfirst=True)
    # campaign_status_enum.create(op.get_bind(), checkfirst=True)
    # content_type_enum.create(op.get_bind(), checkfirst=True)
    # content_status_enum.create(op.get_bind(), checkfirst=True)

    # ========================================================================
    # Activity Tracker Tables
    # ========================================================================
    
    # admin_goals table
    op.create_table(
        "admin_goals",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("week_start", sa.Date(), nullable=False),
        sa.Column("target_discoveries", sa.Integer(), server_default="0"),
        sa.Column("target_emails", sa.Integer(), server_default="0"),
        sa.Column("target_videos", sa.Integer(), server_default="0"),
        sa.Column("target_calls", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "week_start", name="uq_admin_goals_user_week"),
    )
    op.create_index("idx_admin_goals_user_week", "admin_goals", ["user_id", "week_start"])
    
    # admin_activities table
    op.create_table(
        "admin_activities",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("type", activity_type_enum, nullable=False),
        sa.Column("status", activity_status_enum, nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("amount", sa.Integer(), server_default="1"),
        sa.Column("notes", sa.Text()),
        sa.Column("prospect_id", sa.Integer()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_activities_user_date", "admin_activities", ["user_id", "date"])
    
    # admin_scores table
    op.create_table(
        "admin_scores",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("streak_days", sa.Integer(), server_default="0"),
        sa.Column("activities_count", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("score >= 0 AND score <= 100", name="ck_admin_scores_range"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "date", name="uq_admin_scores_user_date"),
    )
    op.create_index("idx_admin_scores_user_date", "admin_scores", ["user_id", "date"])
    
    # admin_focus_sessions table
    op.create_table(
        "admin_focus_sessions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("start_time", sa.DateTime(), nullable=False),
        sa.Column("end_time", sa.DateTime()),
        sa.Column("duration_minutes", sa.Integer(), server_default="50"),
        sa.Column("completed", sa.Boolean(), server_default="false"),
        sa.Column("interrupted", sa.Boolean(), server_default="false"),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_focus_sessions_user_start", "admin_focus_sessions", ["user_id", "start_time"])
    
    # admin_nudges table
    op.create_table(
        "admin_nudges",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("type", nudge_type_enum, nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("priority", nudge_priority_enum, server_default="normal"),
        sa.Column("read", sa.Boolean(), server_default="false"),
        sa.Column("action_url", sa.Text()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("expires_at", sa.DateTime()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_nudges_user_read", "admin_nudges", ["user_id", "read", "created_at"])
    
    # admin_meetings table
    op.create_table(
        "admin_meetings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("type", meeting_type_enum, nullable=False),
        sa.Column("duration_minutes", sa.Integer(), server_default="60"),
        sa.Column("agenda", sa.Text()),
        sa.Column("questions", sa.Text()),
        sa.Column("follow_up_tasks", sa.Text()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_meetings_user_type", "admin_meetings", ["user_id", "type"])
    
    # ========================================================================
    # Prospect & Pipeline Tables
    # ========================================================================
    
    # admin_prospects table
    op.create_table(
        "admin_prospects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=320)),
        sa.Column("phone", sa.String(length=50)),
        sa.Column("company", sa.String(length=255)),
        sa.Column("title", sa.String(length=255)),
        sa.Column("status", prospect_status_enum, server_default="new"),
        sa.Column("source", sa.String(length=100)),
        sa.Column("tags", sa.Text()),
        sa.Column("notes", sa.Text()),
        sa.Column("voice_notes_url", sa.Text()),
        sa.Column("ghl_contact_id", sa.String(length=100)),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("last_contacted", sa.DateTime()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_prospects_user_status", "admin_prospects", ["user_id", "status"])
    op.create_index("idx_admin_prospects_email", "admin_prospects", ["email"])
    op.create_index("idx_admin_prospects_ghl", "admin_prospects", ["ghl_contact_id"])
    
    # Add FK constraint for admin_activities.prospect_id (now that admin_prospects exists)
    op.create_foreign_key(
        "fk_admin_activities_prospect_id",
        "admin_activities",
        "admin_prospects",
        ["prospect_id"],
        ["id"],
        ondelete="SET NULL"
    )
    op.create_index("idx_admin_activities_prospect", "admin_activities", ["prospect_id"])
    
    # admin_deals table
    op.create_table(
        "admin_deals",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("prospect_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("stage", admin_deal_stage_enum, server_default="discovery"),
        sa.Column("value", sa.Numeric(precision=12, scale=2)),
        sa.Column("probability", sa.Integer(), server_default="0"),
        sa.Column("expected_close_date", sa.Date()),
        sa.Column("actual_close_date", sa.Date()),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["prospect_id"], ["admin_prospects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_deals_user_stage", "admin_deals", ["user_id", "stage"])
    op.create_index("idx_admin_deals_prospect", "admin_deals", ["prospect_id"])
    
    # ========================================================================
    # Campaign Management Tables
    # ========================================================================
    
    # admin_campaigns table
    op.create_table(
        "admin_campaigns",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("type", campaign_type_enum, nullable=False),
        sa.Column("status", campaign_status_enum, server_default="draft"),
        sa.Column("subject", sa.String(length=500)),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("scheduled_at", sa.DateTime()),
        sa.Column("sent_at", sa.DateTime()),
        sa.Column("total_recipients", sa.Integer(), server_default="0"),
        sa.Column("sent_count", sa.Integer(), server_default="0"),
        sa.Column("opened_count", sa.Integer(), server_default="0"),
        sa.Column("clicked_count", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_campaigns_user_status", "admin_campaigns", ["user_id", "status"])
    
    # admin_campaign_recipients table
    op.create_table(
        "admin_campaign_recipients",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("campaign_id", sa.Integer(), nullable=False),
        sa.Column("prospect_id", sa.Integer(), nullable=False),
        sa.Column("sent", sa.Boolean(), server_default="false"),
        sa.Column("opened", sa.Boolean(), server_default="false"),
        sa.Column("clicked", sa.Boolean(), server_default="false"),
        sa.Column("bounced", sa.Boolean(), server_default="false"),
        sa.Column("sent_at", sa.DateTime()),
        sa.Column("opened_at", sa.DateTime()),
        sa.Column("clicked_at", sa.DateTime()),
        sa.ForeignKeyConstraint(["campaign_id"], ["admin_campaigns.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["prospect_id"], ["admin_prospects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_campaign_recipients_campaign", "admin_campaign_recipients", ["campaign_id"])
    op.create_index("idx_admin_campaign_recipients_prospect", "admin_campaign_recipients", ["prospect_id"])
    
    # ========================================================================
    # Content Creation Tables
    # ========================================================================
    
    # admin_content_scripts table
    op.create_table(
        "admin_content_scripts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content_type", content_type_enum, nullable=False),
        sa.Column("script_text", sa.Text(), nullable=False),
        sa.Column("duration_minutes", sa.Integer()),
        sa.Column("keywords", sa.Text()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_content_scripts_user_type", "admin_content_scripts", ["user_id", "content_type"])
    
    # admin_content_pieces table
    op.create_table(
        "admin_content_pieces",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=500), nullable=False),
        sa.Column("type", content_type_enum, nullable=False),
        sa.Column("status", content_status_enum, server_default="idea"),
        sa.Column("script_id", sa.Integer()),
        sa.Column("recording_url", sa.Text()),
        sa.Column("edited_url", sa.Text()),
        sa.Column("thumbnail_url", sa.Text()),
        sa.Column("description", sa.Text()),
        sa.Column("tags", sa.Text()),
        sa.Column("youtube_url", sa.Text()),
        sa.Column("spotify_url", sa.Text()),
        sa.Column("rss_url", sa.Text()),
        sa.Column("views_count", sa.Integer(), server_default="0"),
        sa.Column("published_at", sa.DateTime()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["script_id"], ["admin_content_scripts.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_content_pieces_user_status", "admin_content_pieces", ["user_id", "status"])
    op.create_index("idx_admin_content_pieces_type", "admin_content_pieces", ["type"])
    
    # ========================================================================
    # Lead Capture Tables
    # ========================================================================
    
    # admin_lead_captures table
    op.create_table(
        "admin_lead_captures",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=320)),
        sa.Column("phone", sa.String(length=50)),
        sa.Column("company", sa.String(length=255)),
        sa.Column("event_name", sa.String(length=255)),
        sa.Column("event_date", sa.Date()),
        sa.Column("interest_level", sa.String(length=50)),
        sa.Column("follow_up_type", sa.String(length=100)),
        sa.Column("notes", sa.Text()),
        sa.Column("voice_notes_url", sa.Text()),
        sa.Column("synced_to_ghl", sa.Boolean(), server_default="false"),
        sa.Column("ghl_contact_id", sa.String(length=100)),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_lead_captures_user_event", "admin_lead_captures", ["user_id", "event_date"])
    op.create_index("idx_admin_lead_captures_ghl", "admin_lead_captures", ["ghl_contact_id"])
    
    # ========================================================================
    # Sales Collateral Tables
    # ========================================================================
    
    # admin_collateral table
    op.create_table(
        "admin_collateral",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("file_url", sa.Text(), nullable=False),
        sa.Column("file_size", sa.Integer()),
        sa.Column("mime_type", sa.String(length=100)),
        sa.Column("tags", sa.Text()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_collateral_user_type", "admin_collateral", ["user_id", "type"])
    
    # admin_collateral_usage table
    op.create_table(
        "admin_collateral_usage",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("collateral_id", sa.Integer(), nullable=False),
        sa.Column("prospect_id", sa.Integer()),
        sa.Column("used_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("context", sa.String(length=255)),
        sa.ForeignKeyConstraint(["collateral_id"], ["admin_collateral.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["prospect_id"], ["admin_prospects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_admin_collateral_usage_collateral", "admin_collateral_usage", ["collateral_id"])
    op.create_index("idx_admin_collateral_usage_prospect", "admin_collateral_usage", ["prospect_id"])


def downgrade() -> None:
    # Drop tables in reverse order (respecting FK constraints)
    op.drop_index("idx_admin_collateral_usage_prospect", table_name="admin_collateral_usage")
    op.drop_index("idx_admin_collateral_usage_collateral", table_name="admin_collateral_usage")
    op.drop_table("admin_collateral_usage")
    
    op.drop_index("idx_admin_collateral_user_type", table_name="admin_collateral")
    op.drop_table("admin_collateral")
    
    op.drop_index("idx_admin_lead_captures_ghl", table_name="admin_lead_captures")
    op.drop_index("idx_admin_lead_captures_user_event", table_name="admin_lead_captures")
    op.drop_table("admin_lead_captures")
    
    op.drop_index("idx_admin_content_pieces_type", table_name="admin_content_pieces")
    op.drop_index("idx_admin_content_pieces_user_status", table_name="admin_content_pieces")
    op.drop_table("admin_content_pieces")
    
    op.drop_index("idx_admin_content_scripts_user_type", table_name="admin_content_scripts")
    op.drop_table("admin_content_scripts")
    
    op.drop_index("idx_admin_campaign_recipients_prospect", table_name="admin_campaign_recipients")
    op.drop_index("idx_admin_campaign_recipients_campaign", table_name="admin_campaign_recipients")
    op.drop_table("admin_campaign_recipients")
    
    op.drop_index("idx_admin_campaigns_user_status", table_name="admin_campaigns")
    op.drop_table("admin_campaigns")
    
    op.drop_index("idx_admin_deals_prospect", table_name="admin_deals")
    op.drop_index("idx_admin_deals_user_stage", table_name="admin_deals")
    op.drop_table("admin_deals")
    
    op.drop_index("idx_admin_activities_prospect", table_name="admin_activities")
    op.drop_constraint("fk_admin_activities_prospect_id", "admin_activities", type_="foreignkey")
    
    op.drop_index("idx_admin_prospects_ghl", table_name="admin_prospects")
    op.drop_index("idx_admin_prospects_email", table_name="admin_prospects")
    op.drop_index("idx_admin_prospects_user_status", table_name="admin_prospects")
    op.drop_table("admin_prospects")
    
    op.drop_index("idx_admin_meetings_user_type", table_name="admin_meetings")
    op.drop_table("admin_meetings")
    
    op.drop_index("idx_admin_nudges_user_read", table_name="admin_nudges")
    op.drop_table("admin_nudges")
    
    op.drop_index("idx_admin_focus_sessions_user_start", table_name="admin_focus_sessions")
    op.drop_table("admin_focus_sessions")
    
    op.drop_index("idx_admin_scores_user_date", table_name="admin_scores")
    op.drop_table("admin_scores")
    
    op.drop_index("idx_admin_activities_user_date", table_name="admin_activities")
    op.drop_table("admin_activities")
    
    op.drop_index("idx_admin_goals_user_week", table_name="admin_goals")
    op.drop_table("admin_goals")
    
    # Drop enum types
    sa.Enum(name="contentstatus").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="contenttype").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="campaignstatus").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="campaigntype").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="admindealstage").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="prospectstatus").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="meetingtype").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="nudgepriority").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="nudgetype").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="activitystatus").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="activitytype").drop(op.get_bind(), checkfirst=True)
