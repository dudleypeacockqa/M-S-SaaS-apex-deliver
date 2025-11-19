"""
Integration tests for PMI module - End-to-end workflows
Testing PMI-Deal-Task integration and complete workflows
"""

from __future__ import annotations

import pytest
from datetime import datetime, timezone, timedelta
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session

from app.services import pmi_service
from app.models.deal import Deal, DealStage
from app.models.task import DealTask
from app.models.pmi import (
    PMIProject,
    PMIWorkstream,
    PMIMilestone,
    PMIProjectStatus,
    PMIWorkstreamStatus,
    PMIWorkstreamType,
)
from app.schemas.pmi import (
    PMIProjectCreate,
    PMIWorkstreamCreate,
    PMIMilestoneCreate,
)


class TestPMIDealTaskWorkflow:
    """Test PMI-Deal-Task integration workflow."""

    def test_create_milestone_generates_task(
        self,
        db_session,
        create_user,
        create_organization,
        create_deal,
    ):
        """Test that creating a milestone generates a task."""
        org = create_organization(name="Test Org", subscription_tier="professional")
        user = create_user(organization_id=org.id, role="solo")
        deal = create_deal(
            organization_id=org.id,
            owner_id=user.id,
            stage=DealStage.won
        )
        
        # Create PMI project
        project_data = PMIProjectCreate(
            name="Test PMI Project",
            deal_id=deal.id,
        )
        project = pmi_service.create_pmi_project(project_data, user, db_session)
        
        # Create workstream
        workstream_data = PMIWorkstreamCreate(
            project_id=project.id,
            name="IT Integration",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
        )
        workstream = pmi_service.create_workstream(workstream_data, user, db_session)
        
        # Create milestone
        milestone_data = PMIMilestoneCreate(
            workstream_id=workstream.id,
            name="Complete System Integration",
            target_date=datetime.now(timezone.utc) + timedelta(days=30),
            status="not_started",
        )
        milestone = pmi_service.create_milestone(milestone_data, user, db_session)
        
        with patch('app.services.pmi_service.task_service') as mock_task_service:
            mock_task = Mock()
            mock_task.id = "task-123"
            mock_task.title = "Complete System Integration - IT Integration"
            mock_task.deal_id = deal.id
            mock_task.status = "todo"
            mock_task_service.create_task.return_value = mock_task
            
            tasks = pmi_service.create_tasks_from_milestone(
                milestone.id,
                org.id,
                user.id,
                db_session
            )
            
            assert len(tasks) == 1
            mock_task_service.create_task.assert_called_once()
            call_kwargs = mock_task_service.create_task.call_args[1]
            assert call_kwargs['deal_id'] == deal.id
            assert call_kwargs['organization_id'] == org.id

    def test_workstream_progress_updates_from_tasks(
        self,
        db_session,
        create_user,
        create_organization,
        create_deal,
    ):
        """Test that workstream progress updates when tasks are completed."""
        org = create_organization(name="Test Org", subscription_tier="professional")
        user = create_user(organization_id=org.id, role="solo")
        deal = create_deal(
            organization_id=org.id,
            owner_id=user.id,
            stage=DealStage.won
        )
        
        # Create PMI project and workstream
        project_data = PMIProjectCreate(name="Test Project", deal_id=deal.id)
        project = pmi_service.create_pmi_project(project_data, user, db_session)
        
        workstream_data = PMIWorkstreamCreate(
            project_id=project.id,
            name="IT Integration",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
        )
        workstream = pmi_service.create_workstream(workstream_data, user, db_session)
        
        # Mock tasks for the workstream
        with patch('app.services.pmi_service.task_service.list_tasks') as mock_list_tasks:
            # Create mock tasks
            task1 = Mock()
            task1.stage_gate = "PMI: it"
            task1.status = "completed"
            
            task2 = Mock()
            task2.stage_gate = "PMI: it"
            task2.status = "todo"
            
            mock_list_tasks.return_value = ([task1, task2], 2)
            
            # Update workstream progress
            pmi_service.update_workstream_progress_from_tasks(
                workstream.id,
                org.id,
                db_session
            )
            
            # Verify workstream was updated
            updated_workstream = pmi_service.get_workstream_by_id(
                workstream.id,
                org.id,
                db_session
            )
            
            assert updated_workstream.progress_percentage > 0
            assert updated_workstream.status == PMIWorkstreamStatus.in_progress


class TestAutoCreatePMIProject:
    """Test auto-creation of PMI projects."""

    def test_auto_create_when_deal_won(
        self,
        db_session,
        create_user,
        create_organization,
        create_deal,
    ):
        """Test that PMI project is auto-created when deal moves to won."""
        org = create_organization(name="Test Org", subscription_tier="professional")
        user = create_user(organization_id=org.id, role="solo")
        deal = create_deal(
            organization_id=org.id,
            owner_id=user.id,
            stage=DealStage.won
        )
        
        project = pmi_service.auto_create_pmi_project_for_deal(
            deal.id,
            org.id,
            user.id,
            db_session
        )
        
        assert project is not None
        assert project.deal_id == deal.id
        assert project.organization_id == org.id
        assert "PMI:" in project.name
        assert project.status == PMIProjectStatus.planning
        
        # Verify 100-day plan was generated
        workstreams = pmi_service.list_workstreams(
            project.id,
            org.id,
            db_session
        )
        assert len(workstreams) > 0

    def test_auto_create_does_not_duplicate(
        self,
        db_session,
        create_user,
        create_organization,
        create_deal,
    ):
        """Test that auto-create doesn't create duplicate projects."""
        org = create_organization(name="Test Org", subscription_tier="professional")
        user = create_user(organization_id=org.id, role="solo")
        deal = create_deal(
            organization_id=org.id,
            owner_id=user.id,
            stage=DealStage.won
        )
        
        # Create project manually first
        project_data = PMIProjectCreate(name="Existing Project", deal_id=deal.id)
        pmi_service.create_pmi_project(project_data, user, db_session)
        
        # Try to auto-create
        project = pmi_service.auto_create_pmi_project_for_deal(
            deal.id,
            org.id,
            user.id,
            db_session
        )
        
        assert project is None  # Should return None if already exists

    def test_auto_create_only_for_won_deals(
        self,
        db_session,
        create_user,
        create_organization,
        create_deal,
    ):
        """Test that auto-create only works for won deals."""
        org = create_organization(name="Test Org", subscription_tier="professional")
        user = create_user(organization_id=org.id, role="solo")
        deal = create_deal(
            organization_id=org.id,
            owner_id=user.id,
            stage=DealStage.evaluation  # Not won
        )
        
        project = pmi_service.auto_create_pmi_project_for_deal(
            deal.id,
            org.id,
            user.id,
            db_session
        )
        
        assert project is None  # Should return None if deal not won


class TestPMIDashboardAggregation:
    """Test PMI dashboard data aggregation."""

    def test_dashboard_aggregates_all_entities(
        self,
        db_session,
        create_user,
        create_organization,
        create_deal,
    ):
        """Test that dashboard aggregates data from all PMI entities."""
        org = create_organization(name="Test Org", subscription_tier="professional")
        user = create_user(organization_id=org.id, role="solo")
        deal = create_deal(
            organization_id=org.id,
            owner_id=user.id,
            stage=DealStage.won
        )
        
        # Create PMI project
        project_data = PMIProjectCreate(name="Test Project", deal_id=deal.id)
        project = pmi_service.create_pmi_project(project_data, user, db_session)
        
        # Create workstream
        workstream_data = PMIWorkstreamCreate(
            project_id=project.id,
            name="IT Integration",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
        )
        pmi_service.create_workstream(workstream_data, user, db_session)
        
        # Create synergy
        from app.schemas.pmi import PMISynergyCreate
        from app.models.pmi import PMISynergyCategory
        synergy_data = PMISynergyCreate(
            project_id=project.id,
            name="Cost Synergy",
            category=PMISynergyCategory.cost_synergy,
            planned_value=100000.00,
            currency="GBP",
        )
        pmi_service.create_synergy(synergy_data, user, db_session)
        
        # Create risk
        from app.schemas.pmi import PMIRiskCreate
        from app.models.pmi import PMIRiskSeverity, PMIRiskStatus
        risk_data = PMIRiskCreate(
            project_id=project.id,
            title="Integration Risk",
            description="Test risk",
            severity=PMIRiskSeverity.high,
            status=PMIRiskStatus.open,
        )
        pmi_service.create_risk(risk_data, user, db_session)
        
        # Get dashboard
        dashboard = pmi_service.get_pmi_dashboard(
            project.id,
            org.id,
            db_session
        )
        
        assert dashboard is not None
        assert dashboard.project_id == project.id
        assert len(dashboard.workstreams_summary) == 1
        assert len(dashboard.top_risks) == 1
        assert dashboard.synergy_realization_rate is not None


class Test100DayPlanGeneration:
    """Test 100-day plan generation workflow."""

    def test_generate_100_day_plan_creates_workstreams_and_checklist(
        self,
        db_session,
        create_user,
        create_organization,
        create_deal,
    ):
        """Test that 100-day plan generation creates workstreams and checklist."""
        org = create_organization(name="Test Org", subscription_tier="professional")
        user = create_user(organization_id=org.id, role="solo")
        deal = create_deal(
            organization_id=org.id,
            owner_id=user.id,
            stage=DealStage.won
        )
        
        # Create PMI project
        project_data = PMIProjectCreate(name="Test Project", deal_id=deal.id)
        project = pmi_service.create_pmi_project(project_data, user, db_session)
        
        # Generate 100-day plan
        pmi_service.generate_100_day_plan(
            project.id,
            org.id,
            db_session
        )
        
        # Verify workstreams were created
        workstreams = pmi_service.list_workstreams(
            project.id,
            org.id,
            db_session
        )
        assert len(workstreams) >= 7  # Should have at least 7 standard workstreams
        
        # Verify Day 1 checklist items were created
        checklist_items = pmi_service.list_day_one_checklist(
            project.id,
            org.id,
            db_session
        )
        assert len(checklist_items) > 0
        
        # Verify workstreams have correct phases
        stabilization_workstreams = [
            ws for ws in workstreams
            if ws.phase and ws.phase.value == "stabilization"
        ]
        assert len(stabilization_workstreams) > 0

