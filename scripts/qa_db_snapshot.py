#!/usr/bin/env python3
"""
QA Database Snapshot Management Script

This script helps manage test data for QA:
- Create comprehensive test data
- Create snapshots of database state
- Restore snapshots
- Clean up test data
- Load sample data from files

Usage:
    python qa_db_snapshot.py --action create --profile comprehensive
    python qa_db_snapshot.py --action snapshot --name "qa-baseline-2025-11-17"
    python qa_db_snapshot.py --action restore --name "qa-baseline-2025-11-17"
    python qa_db_snapshot.py --action cleanup
    python qa_db_snapshot.py --action load --file test-data/activities-sample.json --type activities
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any
import random
import uuid

# Add backend to path for imports
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

try:
    from app.core.config import settings
    from app.core.database import get_db, init_engine
    from app.models.master_admin import (
        Activity,
        ActivityType,
        Prospect,
        Deal,
        DealStage,
        Campaign,
        CampaignRecipient,
        ContentScript,
        ContentPiece,
        Lead,
        LeadSource,
        LeadStatus,
        SalesCollateral,
    )
    from sqlalchemy.orm import Session
    BACKEND_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import backend modules: {e}")
    print("This script requires backend dependencies. Run from project root.")
    BACKEND_AVAILABLE = False


class QADataManager:
    """Manages QA test data creation, snapshots, and cleanup."""

    def __init__(self, session: Session, org_id: str):
        self.session = session
        self.org_id = org_id
        self.created_ids = {
            "activities": [],
            "prospects": [],
            "deals": [],
            "campaigns": [],
            "content_scripts": [],
            "content_pieces": [],
            "leads": [],
            "collateral": [],
        }

    def create_comprehensive_data(self):
        """Create comprehensive test data for all Master Admin features."""
        print("Creating comprehensive test data...")

        # Create activities
        print("  Creating activities...")
        self._create_activities(count=15)

        # Create prospects and deals
        print("  Creating prospects...")
        self._create_prospects(count=10)
        print("  Creating deals...")
        self._create_deals(count=6)

        # Create campaigns
        print("  Creating campaigns...")
        self._create_campaigns(count=3)

        # Create content
        print("  Creating content scripts...")
        self._create_content_scripts(count=8)
        print("  Creating content pieces...")
        self._create_content_pieces(count=12)

        # Create leads
        print("  Creating leads...")
        self._create_leads(count=20)

        self.session.commit()
        print(f"\nTest data created successfully!")
        self._print_summary()

    def _create_activities(self, count: int = 15):
        """Create sample activities."""
        activity_types = list(ActivityType)
        activity_templates = [
            {
                "title": "Recorded podcast episode",
                "description": "45-minute interview with industry expert on M&A trends",
                "points": 5,
            },
            {
                "title": "Published LinkedIn article",
                "description": "Shared insights on deal sourcing strategies",
                "points": 3,
            },
            {
                "title": "Sent cold outreach emails",
                "description": "Contacted 20 prospects in healthcare sector",
                "points": 4,
            },
            {
                "title": "Attended networking event",
                "description": "M&A industry conference with 200+ attendees",
                "points": 3,
            },
            {
                "title": "Published Twitter thread",
                "description": "10-tweet thread on valuation methods",
                "points": 2,
            },
            {
                "title": "Conducted prospect call",
                "description": "Discovery call with potential acquisition target",
                "points": 4,
            },
            {
                "title": "Created content for blog",
                "description": "2000-word article on M&A due diligence",
                "points": 5,
            },
            {
                "title": "Updated CRM records",
                "description": "Updated 50 prospect records with latest information",
                "points": 2,
            },
        ]

        for i in range(count):
            template = random.choice(activity_templates)
            days_ago = random.randint(0, 30)
            activity_date = (datetime.utcnow() - timedelta(days=days_ago)).date()

            activity = Activity(
                organization_id=self.org_id,
                activity_type=random.choice(activity_types),
                title=f"{template['title']} ({i+1})",
                description=template['description'],
                date=activity_date,
                points=template['points'],
                metadata={"generated": True, "test_data": True},
            )
            self.session.add(activity)
            self.session.flush()
            self.created_ids["activities"].append(str(activity.id))

    def _create_prospects(self, count: int = 10):
        """Create sample prospects."""
        industries = ["SaaS", "Healthcare", "Manufacturing", "Finance", "Retail", "Technology"]
        company_templates = [
            ("TechVenture", "john.smith", "San Francisco, CA", 5000000, 50),
            ("ManufacturePro", "sarah.johnson", "Chicago, IL", 15000000, 150),
            ("HealthTech Solutions", "michael.brown", "Boston, MA", 8000000, 75),
            ("RetailMax", "emily.davis", "New York, NY", 20000000, 200),
            ("FinanceHub", "david.wilson", "London, UK", 12000000, 100),
            ("CloudSystems", "lisa.anderson", "Seattle, WA", 7000000, 60),
            ("DataAnalytics Corp", "james.martinez", "Austin, TX", 6000000, 45),
            ("AI Innovations", "jennifer.taylor", "San Jose, CA", 9000000, 80),
        ]

        statuses = ["sourcing", "contacted", "qualified", "negotiation"]

        for i in range(count):
            template = random.choice(company_templates)
            company_name, contact_last, location, revenue, employees = template

            prospect = Prospect(
                organization_id=self.org_id,
                company_name=f"{company_name} Inc. {i+1}",
                industry=random.choice(industries),
                contact_name=f"Contact {contact_last.title()}",
                contact_email=f"{contact_last}{i}@{company_name.lower()}.com",
                contact_phone=f"+1-555-{random.randint(1000, 9999)}",
                status=random.choice(statuses),
                revenue=revenue + random.randint(-1000000, 1000000),
                employees=employees + random.randint(-10, 20),
                location=location,
                notes=f"Generated test prospect. Industry: {random.choice(industries)}.",
            )
            self.session.add(prospect)
            self.session.flush()
            self.created_ids["prospects"].append(str(prospect.id))

    def _create_deals(self, count: int = 6):
        """Create sample deals linked to prospects."""
        if not self.created_ids["prospects"]:
            print("    No prospects available for deal creation")
            return

        deal_stages = list(DealStage)
        deal_types = ["acquisition", "merger", "investment", "partnership"]

        for i in range(min(count, len(self.created_ids["prospects"]))):
            prospect_id = self.created_ids["prospects"][i]
            days_until_close = random.randint(30, 180)
            close_date = (datetime.utcnow() + timedelta(days=days_until_close)).date()

            deal = Deal(
                organization_id=self.org_id,
                prospect_id=uuid.UUID(prospect_id),
                deal_name=f"Deal {i+1} - Acquisition",
                deal_stage=random.choice(deal_stages),
                deal_value=random.randint(5000000, 50000000),
                probability=random.randint(30, 90),
                expected_close_date=close_date,
                deal_type=random.choice(deal_types),
                notes=f"Test deal created for QA. Stage: {random.choice(deal_stages).value}",
            )
            self.session.add(deal)
            self.session.flush()
            self.created_ids["deals"].append(str(deal.id))

    def _create_campaigns(self, count: int = 3):
        """Create sample campaigns with recipients."""
        campaign_templates = [
            {
                "name": "Q4 2025 SaaS Outreach",
                "description": "Targeted outreach to SaaS companies for M&A opportunities",
                "type": "email",
                "status": "active",
            },
            {
                "name": "Healthcare Sector Campaign",
                "description": "Focus on healthcare technology acquisitions",
                "type": "linkedin",
                "status": "active",
            },
            {
                "name": "Manufacturing Leads Campaign",
                "description": "Sourcing manufacturing companies for investment",
                "type": "email",
                "status": "completed",
            },
        ]

        for i, template in enumerate(campaign_templates[:count]):
            days_ago = random.randint(10, 90)
            start_date = (datetime.utcnow() - timedelta(days=days_ago)).date()
            end_date = (start_date + timedelta(days=90))

            campaign = Campaign(
                organization_id=self.org_id,
                name=template["name"],
                description=template["description"],
                campaign_type=template["type"],
                status=template["status"],
                start_date=start_date,
                end_date=end_date,
                goal=f"{random.randint(30, 100)} qualified prospects",
                budget=random.randint(3000, 10000),
                metadata={"generated": True},
            )
            self.session.add(campaign)
            self.session.flush()
            self.created_ids["campaigns"].append(str(campaign.id))

            # Add recipients to campaign
            recipient_count = random.randint(10, 25)
            for j in range(recipient_count):
                recipient = CampaignRecipient(
                    campaign_id=campaign.id,
                    email=f"recipient{j}@example-{i}.com",
                    first_name=f"Test{j}",
                    last_name=f"Recipient{i}",
                    company=f"TestCompany{j}",
                    status=random.choice(["sent", "opened", "clicked", "replied", "bounced"]),
                    sent_date=start_date + timedelta(days=random.randint(0, 30)) if template["status"] != "draft" else None,
                    opened=random.choice([True, False]),
                    clicked=random.choice([True, False]),
                    replied=random.choice([True, False, False, False]),  # Lower reply probability
                )
                self.session.add(recipient)

    def _create_content_scripts(self, count: int = 8):
        """Create sample content scripts."""
        script_types = ["podcast_intro", "podcast_outro", "email_sequence", "video_script"]

        for i in range(count):
            script = ContentScript(
                organization_id=self.org_id,
                title=f"Content Script {i+1}",
                content_type="script",
                script_type=random.choice(script_types),
                content=f"This is sample content for script {i+1}. Lorem ipsum dolor sit amet...",
                duration_estimate=random.randint(30, 180),
                metadata={"generated": True, "version": 1},
            )
            self.session.add(script)
            self.session.flush()
            self.created_ids["content_scripts"].append(str(script.id))

    def _create_content_pieces(self, count: int = 12):
        """Create sample content pieces."""
        platforms = ["LinkedIn", "Twitter", "Blog", "YouTube", "Newsletter"]
        statuses = ["draft", "published", "scheduled"]

        for i in range(count):
            days_ago = random.randint(0, 60)
            published_date = (datetime.utcnow() - timedelta(days=days_ago)).date() if random.choice([True, False]) else None

            piece = ContentPiece(
                organization_id=self.org_id,
                title=f"Content Piece {i+1}",
                content_type="article",
                platform=random.choice(platforms),
                content=f"Sample content piece {i+1}. This would contain the full content...",
                status=random.choice(statuses),
                published_date=published_date,
                engagement={
                    "views": random.randint(100, 5000),
                    "likes": random.randint(10, 500),
                    "comments": random.randint(0, 50),
                    "shares": random.randint(0, 100),
                } if published_date else None,
            )
            self.session.add(piece)
            self.session.flush()
            self.created_ids["content_pieces"].append(str(piece.id))

    def _create_leads(self, count: int = 20):
        """Create sample leads."""
        sources = list(LeadSource)
        statuses = list(LeadStatus)
        industries = ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail"]
        company_sizes = ["1-10", "10-50", "50-100", "100-500", "500+"]
        timelines = ["immediate", "1-3 months", "3-6 months", "6-12 months"]

        for i in range(count):
            days_ago = random.randint(0, 30)
            submitted_at = datetime.utcnow() - timedelta(days=days_ago)

            lead = Lead(
                organization_id=self.org_id,
                first_name=f"Lead{i}",
                last_name=f"Test{i}",
                email=f"lead{i}@testcompany{i}.com",
                company=f"TestCompany{i} Inc.",
                phone=f"+1-555-{random.randint(1000, 9999)}",
                source=random.choice(sources),
                status=random.choice(statuses),
                interest_level=random.choice(["high", "medium", "low"]),
                notes=f"Test lead {i+1} created for QA testing",
                custom_fields={
                    "company_size": random.choice(company_sizes),
                    "industry": random.choice(industries),
                    "timeline": random.choice(timelines),
                },
                submitted_at=submitted_at,
            )
            self.session.add(lead)
            self.session.flush()
            self.created_ids["leads"].append(str(lead.id))

    def _print_summary(self):
        """Print summary of created test data."""
        print("\n" + "="*60)
        print("Test Data Summary")
        print("="*60)
        for category, ids in self.created_ids.items():
            print(f"  {category.replace('_', ' ').title()}: {len(ids)} created")
        print("="*60)

    def cleanup(self):
        """Clean up all created test data."""
        print("Cleaning up test data...")

        # Delete in reverse order of dependencies
        categories = [
            ("deals", Deal),
            ("prospects", Prospect),
            ("campaigns", Campaign),  # Will cascade to recipients
            ("content_scripts", ContentScript),
            ("content_pieces", ContentPiece),
            ("leads", Lead),
            ("activities", Activity),
        ]

        for category_name, model_class in categories:
            if self.created_ids.get(category_name):
                count = len(self.created_ids[category_name])
                print(f"  Deleting {count} {category_name}...")
                for id_str in self.created_ids[category_name]:
                    obj = self.session.query(model_class).filter_by(id=uuid.UUID(id_str)).first()
                    if obj:
                        self.session.delete(obj)

        self.session.commit()
        print("Cleanup complete!")


def main():
    """Main entry point for QA database snapshot script."""
    parser = argparse.ArgumentParser(description="Manage QA test data snapshots")
    parser.add_argument(
        "--action",
        required=True,
        choices=["create", "snapshot", "restore", "cleanup", "load"],
        help="Action to perform"
    )
    parser.add_argument("--profile", choices=["comprehensive", "performance", "multi-user"], help="Data creation profile")
    parser.add_argument("--name", help="Snapshot name")
    parser.add_argument("--file", help="File path for load action")
    parser.add_argument("--type", help="Data type for load action")
    parser.add_argument("--org-id", help="Organization ID (defaults to test org)")

    args = parser.parse_args()

    if not BACKEND_AVAILABLE:
        print("Error: Backend modules not available. Cannot proceed.")
        sys.exit(1)

    # Initialize database
    init_engine()

    # Get organization ID (use test org or provided)
    org_id = args.org_id or str(uuid.uuid4())  # In real use, would query actual test org

    # Get database session
    db_session = next(get_db())

    try:
        manager = QADataManager(db_session, org_id)

        if args.action == "create":
            if args.profile == "comprehensive":
                manager.create_comprehensive_data()
            elif args.profile == "performance":
                print("Performance profile not yet implemented")
            elif args.profile == "multi-user":
                print("Multi-user profile not yet implemented")
            else:
                print("Please specify --profile (comprehensive, performance, or multi-user)")

        elif args.action == "snapshot":
            if not args.name:
                print("Please provide --name for snapshot")
                sys.exit(1)
            print(f"Snapshot feature not yet implemented: {args.name}")

        elif args.action == "restore":
            if not args.name:
                print("Please provide --name for restore")
                sys.exit(1)
            print(f"Restore feature not yet implemented: {args.name}")

        elif args.action == "cleanup":
            manager.cleanup()

        elif args.action == "load":
            if not args.file or not args.type:
                print("Please provide both --file and --type for load action")
                sys.exit(1)
            print(f"Load feature not yet implemented: {args.file} ({args.type})")

    except Exception as e:
        print(f"Error: {e}")
        db_session.rollback()
        raise
    finally:
        db_session.close()


if __name__ == "__main__":
    main()
