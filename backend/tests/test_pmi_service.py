"""
Tests for PMI (Post-Merger Integration) Service - 100% Coverage
Following TDD methodology (RED → GREEN → REFACTOR)
"""

from __future__ import annotations

import pytest
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session

from app.services import pmi_service
from app.models.pmi import (
    PMIProject,
    PMIWorkstream,
    PMIMilestone,
    PMISynergy,
    PMIMetric,
    PMIRisk,
    PMIDayOneChecklist,
    PMIProjectStatus,
    PMIWorkstreamStatus,
    PMIWorkstreamType,
    PMIPhase,
    PMISynergyCategory,
    PMISynergyStatus,
    PMIMetricType,
    PMIRiskSeverity,
    PMIRiskStatus,
    PMIDayOneChecklistStatus,
    PMIDayOneCategory,
)
from app.models.deal import Deal, DealStage
from app.models.user import User
from app.models.organization import Organization
from app.schemas.pmi import (
    PMIProjectCreate,
    PMIProjectUpdate,
    PMIWorkstreamCreate,
    PMIWorkstreamUpdate,
    PMIMilestoneCreate,
    PMIMilestoneUpdate,
    PMISynergyCreate,
    PMISynergyUpdate,
    PMIMetricCreate,
    PMIRiskCreate,
    PMIRiskUpdate,
    PMIDayOneChecklistCreate,
    PMIDayOneChecklistUpdate,
)


@pytest.fixture
def sample_org(db_session, create_organization):
    """Create a test organization."""
    return create_organization(name="Test Org", subscription_tier="professional")


@pytest.fixture
def sample_user(db_session, create_user, sample_org):
    """Create a test user."""
    return create_user(
        organization_id=sample_org.id,
        role="solo",
        email="test@example.com"
    )


@pytest.fixture
def sample_deal(db_session, sample_org, sample_user):
    """Create a test deal."""
    deal = Deal(
        id="deal-123",
        organization_id=sample_org.id,
        name="Test Deal",
        target_company="Target Corp",
        owner_id=sample_user.id,
        stage=DealStage.won,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)
    return deal


@pytest.fixture
def sample_pmi_project(db_session, sample_org, sample_user, sample_deal):
    """Create a test PMI project."""
    project = PMIProject(
        id="pmi-project-123",
        organization_id=sample_org.id,
        deal_id=sample_deal.id,
        name="Test PMI Project",
        status=PMIProjectStatus.planning,
        close_date=datetime.now(timezone.utc),
        day_one_date=datetime.now(timezone.utc) + timedelta(days=1),
        target_completion_date=datetime.now(timezone.utc) + timedelta(days=100),
        description="Test PMI project description",
        created_by=sample_user.id,
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    return project


class TestPMIProjectCRUD:
    """Test PMI Project CRUD operations."""

    def test_create_pmi_project(self, db_session, sample_user, sample_deal):
        """Test creating a PMI project."""
        project_data = PMIProjectCreate(
            name="New PMI Project",
            deal_id=sample_deal.id,
            status=PMIProjectStatus.planning,
            description="Test project",
        )
        
        project = pmi_service.create_pmi_project(project_data, sample_user, db_session)
        
        assert project.id is not None
        assert project.name == "New PMI Project"
        assert project.organization_id == sample_user.organization_id
        assert project.deal_id == sample_deal.id
        assert project.status == PMIProjectStatus.planning
        assert project.created_by == sample_user.id

    def test_get_pmi_project_by_id(self, db_session, sample_pmi_project, sample_org):
        """Test retrieving a PMI project by ID."""
        project = pmi_service.get_pmi_project_by_id(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        assert project is not None
        assert project.id == sample_pmi_project.id
        assert project.name == "Test PMI Project"

    def test_get_pmi_project_not_found(self, db_session, sample_org):
        """Test retrieving non-existent PMI project."""
        project = pmi_service.get_pmi_project_by_id(
            "non-existent-id",
            sample_org.id,
            db_session
        )
        
        assert project is None

    def test_get_pmi_project_cross_org_access(self, db_session, sample_pmi_project, create_organization):
        """Test that projects are isolated by organization."""
        other_org = create_organization(name="Other Org", subscription_tier="professional")
        
        project = pmi_service.get_pmi_project_by_id(
            sample_pmi_project.id,
            other_org.id,
            db_session
        )
        
        assert project is None

    def test_list_pmi_projects(self, db_session, sample_org, sample_user, sample_deal):
        """Test listing PMI projects with pagination."""
        # Create multiple projects
        for i in range(5):
            project_data = PMIProjectCreate(
                name=f"Project {i}",
                deal_id=sample_deal.id,
            )
            pmi_service.create_pmi_project(project_data, sample_user, db_session)
        
        projects, total = pmi_service.list_pmi_projects(
            organization_id=sample_org.id,
            db=db_session,
            page=1,
            per_page=3,
        )
        
        assert len(projects) == 3
        assert total == 5

    def test_list_pmi_projects_filter_by_status(self, db_session, sample_org, sample_user, sample_deal):
        """Test filtering PMI projects by status."""
        # Create projects with different statuses
        for status in [PMIProjectStatus.planning, PMIProjectStatus.active]:
            project_data = PMIProjectCreate(
                name=f"Project {status.value}",
                deal_id=sample_deal.id,
                status=status,
            )
            pmi_service.create_pmi_project(project_data, sample_user, db_session)
        
        projects, total = pmi_service.list_pmi_projects(
            organization_id=sample_org.id,
            db=db_session,
            status=PMIProjectStatus.active,
        )
        
        assert all(p.status == PMIProjectStatus.active for p in projects)
        assert total == 1

    def test_list_pmi_projects_filter_by_deal(self, db_session, sample_org, sample_user, sample_deal, create_deal):
        """Test filtering PMI projects by deal ID."""
        other_deal = create_deal(organization_id=sample_org.id, owner_id=sample_user.id)
        
        # Create projects for different deals
        project1_data = PMIProjectCreate(name="Project 1", deal_id=sample_deal.id)
        project2_data = PMIProjectCreate(name="Project 2", deal_id=other_deal.id)
        
        pmi_service.create_pmi_project(project1_data, sample_user, db_session)
        pmi_service.create_pmi_project(project2_data, sample_user, db_session)
        
        projects, total = pmi_service.list_pmi_projects(
            organization_id=sample_org.id,
            db=db_session,
            deal_id=sample_deal.id,
        )
        
        assert all(p.deal_id == sample_deal.id for p in projects)
        assert total == 1

    def test_update_pmi_project(self, db_session, sample_pmi_project, sample_org):
        """Test updating a PMI project."""
        update_data = PMIProjectUpdate(
            name="Updated Project Name",
            status=PMIProjectStatus.active,
        )
        
        updated = pmi_service.update_pmi_project(
            sample_pmi_project.id,
            update_data,
            sample_org.id,
            db_session
        )
        
        assert updated is not None
        assert updated.name == "Updated Project Name"
        assert updated.status == PMIProjectStatus.active

    def test_update_pmi_project_not_found(self, db_session, sample_org):
        """Test updating non-existent PMI project."""
        update_data = PMIProjectUpdate(name="Updated Name")
        
        updated = pmi_service.update_pmi_project(
            "non-existent-id",
            update_data,
            sample_org.id,
            db_session
        )
        
        assert updated is None


class TestPMIWorkstream:
    """Test PMI Workstream operations."""

    def test_create_workstream(self, db_session, sample_pmi_project, sample_user):
        """Test creating a workstream."""
        workstream_data = PMIWorkstreamCreate(
            project_id=sample_pmi_project.id,
            name="IT Integration",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
            phase=PMIPhase.stabilization,
        )
        
        workstream = pmi_service.create_workstream(workstream_data, sample_user, db_session)
        
        assert workstream.id is not None
        assert workstream.name == "IT Integration"
        assert workstream.workstream_type == PMIWorkstreamType.it
        assert workstream.status == PMIWorkstreamStatus.not_started
        assert workstream.progress_percentage == Decimal("0.00")

    def test_list_workstreams(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test listing workstreams for a project."""
        # Create multiple workstreams
        for ws_type in [PMIWorkstreamType.it, PMIWorkstreamType.hr]:
            workstream_data = PMIWorkstreamCreate(
                project_id=sample_pmi_project.id,
                name=f"{ws_type.value} Workstream",
                workstream_type=ws_type,
                priority="high",
            )
            pmi_service.create_workstream(workstream_data, sample_user, db_session)
        
        workstreams = pmi_service.list_workstreams(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        assert len(workstreams) == 2

    def test_update_workstream(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test updating a workstream."""
        workstream_data = PMIWorkstreamCreate(
            project_id=sample_pmi_project.id,
            name="Test Workstream",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
        )
        workstream = pmi_service.create_workstream(workstream_data, sample_user, db_session)
        
        update_data = PMIWorkstreamUpdate(
            status=PMIWorkstreamStatus.in_progress,
            progress_percentage=Decimal("50.00"),
        )
        
        updated = pmi_service.update_workstream(
            workstream.id,
            update_data,
            sample_org.id,
            db_session
        )
        
        assert updated is not None
        assert updated.status == PMIWorkstreamStatus.in_progress
        assert updated.progress_percentage == Decimal("50.00")


class TestPMIMilestone:
    """Test PMI Milestone operations."""

    def test_create_milestone(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test creating a milestone."""
        # Create workstream first
        workstream_data = PMIWorkstreamCreate(
            project_id=sample_pmi_project.id,
            name="Test Workstream",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
        )
        workstream = pmi_service.create_workstream(workstream_data, sample_user, db_session)
        
        milestone_data = PMIMilestoneCreate(
            workstream_id=workstream.id,
            name="Complete System Integration",
            description="Integrate all systems",
            target_date=datetime.now(timezone.utc) + timedelta(days=30),
            status="not_started",
        )
        
        milestone = pmi_service.create_milestone(milestone_data, sample_user, db_session)
        
        assert milestone.id is not None
        assert milestone.name == "Complete System Integration"
        assert milestone.workstream_id == workstream.id

    def test_update_milestone(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test updating a milestone."""
        # Create workstream and milestone
        workstream_data = PMIWorkstreamCreate(
            project_id=sample_pmi_project.id,
            name="Test Workstream",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
        )
        workstream = pmi_service.create_workstream(workstream_data, sample_user, db_session)
        
        milestone_data = PMIMilestoneCreate(
            workstream_id=workstream.id,
            name="Test Milestone",
            status="not_started",
        )
        milestone = pmi_service.create_milestone(milestone_data, sample_user, db_session)
        
        update_data = PMIMilestoneUpdate(
            status="completed",
            actual_date=datetime.now(timezone.utc),
        )
        
        updated = pmi_service.update_milestone(
            milestone.id,
            update_data,
            sample_org.id,
            db_session
        )
        
        assert updated is not None
        assert updated.status == "completed"
        assert updated.actual_date is not None


class TestPMISynergy:
    """Test PMI Synergy operations."""

    def test_create_synergy(self, db_session, sample_pmi_project, sample_user):
        """Test creating a synergy."""
        synergy_data = PMISynergyCreate(
            project_id=sample_pmi_project.id,
            name="Cost Synergy - IT Consolidation",
            category=PMISynergyCategory.cost_synergy,
            planned_value=Decimal("500000.00"),
            currency="GBP",
            status=PMISynergyStatus.planned,
        )
        
        synergy = pmi_service.create_synergy(synergy_data, sample_user, db_session)
        
        assert synergy.id is not None
        assert synergy.name == "Cost Synergy - IT Consolidation"
        assert synergy.planned_value == Decimal("500000.00")
        assert synergy.category == PMISynergyCategory.cost_synergy

    def test_calculate_synergy_realization_rate(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test calculating synergy realization rate."""
        # Create synergies with different realization statuses
        synergy1_data = PMISynergyCreate(
            project_id=sample_pmi_project.id,
            name="Synergy 1",
            category=PMISynergyCategory.cost_synergy,
            planned_value=Decimal("100000.00"),
            realized_value=Decimal("80000.00"),
            currency="GBP",
            status=PMISynergyStatus.realized,
        )
        synergy2_data = PMISynergyCreate(
            project_id=sample_pmi_project.id,
            name="Synergy 2",
            category=PMISynergyCategory.cost_synergy,
            planned_value=Decimal("200000.00"),
            realized_value=Decimal("150000.00"),
            currency="GBP",
            status=PMISynergyStatus.realized,
        )
        
        pmi_service.create_synergy(synergy1_data, sample_user, db_session)
        pmi_service.create_synergy(synergy2_data, sample_user, db_session)
        
        srr = pmi_service.calculate_synergy_realization_rate(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        # Expected: (80000 + 150000) / (100000 + 200000) = 230000 / 300000 = 0.7667
        expected = Decimal("0.77")  # Rounded to 2 decimal places
        assert abs(srr - expected) < Decimal("0.01")

    def test_list_synergies(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test listing synergies for a project."""
        # Create multiple synergies
        for category in [PMISynergyCategory.cost_synergy, PMISynergyCategory.revenue_synergy]:
            synergy_data = PMISynergyCreate(
                project_id=sample_pmi_project.id,
                name=f"{category.value} Synergy",
                category=category,
                planned_value=Decimal("100000.00"),
                currency="GBP",
            )
            pmi_service.create_synergy(synergy_data, sample_user, db_session)
        
        synergies = pmi_service.list_synergies(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        assert len(synergies) == 2


class TestPMIRisk:
    """Test PMI Risk operations."""

    def test_create_risk(self, db_session, sample_pmi_project, sample_user):
        """Test creating a risk."""
        risk_data = PMIRiskCreate(
            project_id=sample_pmi_project.id,
            title="Integration Delay Risk",
            description="Risk of delays in system integration",
            severity=PMIRiskSeverity.high,
            status=PMIRiskStatus.open,
            mitigation_plan="Add additional resources",
        )
        
        risk = pmi_service.create_risk(risk_data, sample_user, db_session)
        
        assert risk.id is not None
        assert risk.title == "Integration Delay Risk"
        assert risk.severity == PMIRiskSeverity.high
        assert risk.status == PMIRiskStatus.open

    def test_list_risks(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test listing risks for a project."""
        # Create risks with different severities
        for severity in [PMIRiskSeverity.low, PMIRiskSeverity.high]:
            risk_data = PMIRiskCreate(
                project_id=sample_pmi_project.id,
                title=f"{severity.value} Risk",
                description="Test risk",
                severity=severity,
                status=PMIRiskStatus.open,
            )
            pmi_service.create_risk(risk_data, sample_user, db_session)
        
        risks = pmi_service.list_risks(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        assert len(risks) == 2

    def test_list_risks_filter_by_severity(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test filtering risks by severity."""
        # Create risks with different severities
        for severity in [PMIRiskSeverity.low, PMIRiskSeverity.high]:
            risk_data = PMIRiskCreate(
                project_id=sample_pmi_project.id,
                title=f"{severity.value} Risk",
                description="Test risk",
                severity=severity,
                status=PMIRiskStatus.open,
            )
            pmi_service.create_risk(risk_data, sample_user, db_session)
        
        risks = pmi_service.list_risks(
            sample_pmi_project.id,
            sample_org.id,
            db_session,
            severity=PMIRiskSeverity.high,
        )
        
        assert all(r.severity == PMIRiskSeverity.high for r in risks)
        assert len(risks) == 1

    def test_update_risk(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test updating a risk."""
        risk_data = PMIRiskCreate(
            project_id=sample_pmi_project.id,
            title="Test Risk",
            description="Test description",
            severity=PMIRiskSeverity.medium,
            status=PMIRiskStatus.open,
        )
        risk = pmi_service.create_risk(risk_data, sample_user, db_session)
        
        update_data = PMIRiskUpdate(
            status=PMIRiskStatus.mitigated,
            mitigation_plan="Updated mitigation plan",
        )
        
        updated = pmi_service.update_risk(
            risk.id,
            update_data,
            sample_org.id,
            db_session
        )
        
        assert updated is not None
        assert updated.status == PMIRiskStatus.mitigated
        assert updated.mitigation_plan == "Updated mitigation plan"


class TestPMIDayOneChecklist:
    """Test PMI Day One Checklist operations."""

    def test_create_day_one_checklist_item(self, db_session, sample_pmi_project, sample_user):
        """Test creating a Day 1 checklist item."""
        checklist_data = PMIDayOneChecklistCreate(
            project_id=sample_pmi_project.id,
            category=PMIDayOneCategory.it,
            item="Email access configured",
            description="All employees have email access",
            status=PMIDayOneChecklistStatus.not_started,
        )
        
        item = pmi_service.create_day_one_checklist_item(checklist_data, sample_user, db_session)
        
        assert item.id is not None
        assert item.item == "Email access configured"
        assert item.category == PMIDayOneCategory.it
        assert item.status == PMIDayOneChecklistStatus.not_started

    def test_list_day_one_checklist(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test listing Day 1 checklist items."""
        # Create items in different categories
        for category in [PMIDayOneCategory.it, PMIDayOneCategory.hr]:
            checklist_data = PMIDayOneChecklistCreate(
                project_id=sample_pmi_project.id,
                category=category,
                item=f"{category.value} Item",
                status=PMIDayOneChecklistStatus.not_started,
            )
            pmi_service.create_day_one_checklist_item(checklist_data, sample_user, db_session)
        
        items = pmi_service.list_day_one_checklist(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        assert len(items) == 2

    def test_list_day_one_checklist_filter_by_category(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test filtering Day 1 checklist by category."""
        # Create items in different categories
        for category in [PMIDayOneCategory.it, PMIDayOneCategory.hr]:
            checklist_data = PMIDayOneChecklistCreate(
                project_id=sample_pmi_project.id,
                category=category,
                item=f"{category.value} Item",
                status=PMIDayOneChecklistStatus.not_started,
            )
            pmi_service.create_day_one_checklist_item(checklist_data, sample_user, db_session)
        
        items = pmi_service.list_day_one_checklist(
            sample_pmi_project.id,
            sample_org.id,
            db_session,
            category=PMIDayOneCategory.it.value,
        )
        
        assert all(item.category == PMIDayOneCategory.it for item in items)
        assert len(items) == 1

    def test_update_day_one_checklist_item(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test updating a Day 1 checklist item."""
        checklist_data = PMIDayOneChecklistCreate(
            project_id=sample_pmi_project.id,
            category=PMIDayOneCategory.it,
            item="Test Item",
            status=PMIDayOneChecklistStatus.not_started,
        )
        item = pmi_service.create_day_one_checklist_item(checklist_data, sample_user, db_session)
        
        update_data = PMIDayOneChecklistUpdate(
            status=PMIDayOneChecklistStatus.complete,
            completed_at=datetime.now(timezone.utc),
        )
        
        updated = pmi_service.update_day_one_checklist_item(
            item.id,
            update_data,
            sample_org.id,
            db_session
        )
        
        assert updated is not None
        assert updated.status == PMIDayOneChecklistStatus.complete
        assert updated.completed_at is not None


class TestPMIDashboard:
    """Test PMI Dashboard aggregation."""

    def test_get_pmi_dashboard(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test getting PMI dashboard metrics."""
        # Create workstreams, synergies, and risks
        workstream_data = PMIWorkstreamCreate(
            project_id=sample_pmi_project.id,
            name="Test Workstream",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
        )
        pmi_service.create_workstream(workstream_data, sample_user, db_session)
        
        synergy_data = PMISynergyCreate(
            project_id=sample_pmi_project.id,
            name="Test Synergy",
            category=PMISynergyCategory.cost_synergy,
            planned_value=Decimal("100000.00"),
            currency="GBP",
        )
        pmi_service.create_synergy(synergy_data, sample_user, db_session)
        
        risk_data = PMIRiskCreate(
            project_id=sample_pmi_project.id,
            title="Test Risk",
            description="Test",
            severity=PMIRiskSeverity.high,
            status=PMIRiskStatus.open,
        )
        pmi_service.create_risk(risk_data, sample_user, db_session)
        
        dashboard = pmi_service.get_pmi_dashboard(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        assert dashboard is not None
        assert dashboard.project_id == sample_pmi_project.id
        assert len(dashboard.workstreams_summary) == 1
        assert len(dashboard.top_risks) == 1

    def test_get_pmi_dashboard_not_found(self, db_session, sample_org):
        """Test getting dashboard for non-existent project."""
        with pytest.raises(ValueError, match="PMI project.*not found"):
            pmi_service.get_pmi_dashboard(
                "non-existent-id",
                sample_org.id,
                db_session
            )


class TestPMI100DayPlan:
    """Test 100-day plan generation."""

    def test_generate_100_day_plan(self, db_session, sample_pmi_project, sample_org):
        """Test generating a 100-day plan."""
        pmi_service.generate_100_day_plan(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        # Verify workstreams were created
        workstreams = pmi_service.list_workstreams(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        assert len(workstreams) > 0
        
        # Verify Day 1 checklist items were created
        checklist_items = pmi_service.list_day_one_checklist(
            sample_pmi_project.id,
            sample_org.id,
            db_session
        )
        
        assert len(checklist_items) > 0

    def test_generate_100_day_plan_not_found(self, db_session, sample_org):
        """Test generating plan for non-existent project."""
        with pytest.raises(ValueError, match="PMI project.*not found"):
            pmi_service.generate_100_day_plan(
                "non-existent-id",
                sample_org.id,
                db_session
            )


class TestPMITaskIntegration:
    """Test PMI-Task integration functions."""

    def test_create_tasks_from_milestone(self, db_session, sample_pmi_project, sample_user, sample_org):
        """Test creating tasks from a milestone."""
        # Create workstream and milestone
        workstream_data = PMIWorkstreamCreate(
            project_id=sample_pmi_project.id,
            name="Test Workstream",
            workstream_type=PMIWorkstreamType.it,
            priority="high",
        )
        workstream = pmi_service.create_workstream(workstream_data, sample_user, db_session)
        
        milestone_data = PMIMilestoneCreate(
            workstream_id=workstream.id,
            name="Test Milestone",
            target_date=datetime.now(timezone.utc) + timedelta(days=30),
            status="not_started",
        )
        milestone = pmi_service.create_milestone(milestone_data, sample_user, db_session)
        
        with patch('app.services.pmi_service.task_service') as mock_task_service:
            mock_task = Mock()
            mock_task.id = "task-123"
            mock_task_service.create_task.return_value = mock_task
            
            tasks = pmi_service.create_tasks_from_milestone(
                milestone.id,
                sample_org.id,
                sample_user.id,
                db_session
            )
            
            assert len(tasks) == 1
            mock_task_service.create_task.assert_called_once()

    def test_auto_create_pmi_project_for_deal(self, db_session, sample_deal, sample_user, sample_org):
        """Test auto-creating PMI project when deal moves to won."""
        project = pmi_service.auto_create_pmi_project_for_deal(
            sample_deal.id,
            sample_org.id,
            sample_user.id,
            db_session
        )
        
        assert project is not None
        assert project.deal_id == sample_deal.id
        assert project.organization_id == sample_org.id
        assert "PMI:" in project.name

    def test_auto_create_pmi_project_already_exists(self, db_session, sample_deal, sample_user, sample_org):
        """Test that auto-create doesn't duplicate existing project."""
        # Create project manually first
        project_data = PMIProjectCreate(
            name="Existing PMI Project",
            deal_id=sample_deal.id,
        )
        pmi_service.create_pmi_project(project_data, sample_user, db_session)
        
        # Try to auto-create again
        project = pmi_service.auto_create_pmi_project_for_deal(
            sample_deal.id,
            sample_org.id,
            sample_user.id,
            db_session
        )
        
        assert project is None  # Should return None if already exists

    def test_auto_create_pmi_project_deal_not_won(self, db_session, sample_org, sample_user, create_deal):
        """Test that auto-create only works for won deals."""
        deal = create_deal(
            organization_id=sample_org.id,
            owner_id=sample_user.id,
            stage=DealStage.evaluation  # Not won
        )
        
        project = pmi_service.auto_create_pmi_project_for_deal(
            deal.id,
            sample_org.id,
            sample_user.id,
            db_session
        )
        
        assert project is None  # Should return None if deal not won
