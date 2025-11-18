"""Tests for PMI service layer."""

import pytest
from datetime import datetime, timezone, timedelta
from decimal import Decimal

from app.models.pmi import (
    PMIProject,
    PMIProjectStatus,
    PMIWorkstreamType,
    PMIWorkstreamStatus,
    PMISynergyCategory,
    PMISynergyStatus,
    PMIRiskSeverity,
    PMIRiskStatus,
    PMIDayOneChecklistStatus,
    PMIDayOneCategory,
)
from app.schemas.pmi import (
    PMIProjectCreate,
    PMIWorkstreamCreate,
    PMISynergyCreate,
    PMIRiskCreate,
    PMIDayOneChecklistCreate,
)
from app.services import pmi_service


@pytest.fixture
def sample_deal(db_session, test_user, test_organization):
    """Create a sample deal for PMI testing."""
    from app.models.deal import Deal, DealStage

    deal = Deal(
        id="test-deal-123",
        name="Test Acquisition",
        target_company="Target Corp",
        organization_id=test_organization.id,
        owner_id=str(test_user.id),
        stage=DealStage.won,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)
    return deal


@pytest.fixture
def sample_pmi_project(db_session, test_user, sample_deal):
    """Create a sample PMI project."""
    project = PMIProject(
        id="test-pmi-project-123",
        name="Test PMI Project",
        deal_id=sample_deal.id,
        organization_id=test_user.organization_id,
        status=PMIProjectStatus.active,
        day_one_date=datetime.now(timezone.utc),
        created_by=str(test_user.id),
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    return project


def test_create_pmi_project(db_session, test_user, sample_deal):
    """Test creating a PMI project."""
    project_data = PMIProjectCreate(
        name="New PMI Project",
        deal_id=sample_deal.id,
        status=PMIProjectStatus.planning,
        day_one_date=datetime.now(timezone.utc),
    )

    project = pmi_service.create_pmi_project(project_data, test_user, db_session)

    assert project is not None
    assert project.name == "New PMI Project"
    assert project.deal_id == sample_deal.id
    assert project.organization_id == test_user.organization_id
    assert project.status == PMIProjectStatus.planning


def test_get_pmi_project_by_id(db_session, test_user, sample_pmi_project):
    """Test retrieving a PMI project by ID."""
    project = pmi_service.get_pmi_project_by_id(
        sample_pmi_project.id, test_user.organization_id, db_session
    )

    assert project is not None
    assert project.id == sample_pmi_project.id
    assert project.name == sample_pmi_project.name


def test_list_pmi_projects(db_session, test_user, sample_pmi_project):
    """Test listing PMI projects."""
    projects, total = pmi_service.list_pmi_projects(
        test_user.organization_id, db_session, page=1, per_page=10
    )

    assert total >= 1
    assert len(projects) >= 1
    assert any(p.id == sample_pmi_project.id for p in projects)


def test_create_workstream(db_session, test_user, sample_pmi_project):
    """Test creating a workstream."""
    workstream_data = PMIWorkstreamCreate(
        project_id=sample_pmi_project.id,
        name="IT Integration",
        workstream_type=PMIWorkstreamType.it,
        status=PMIWorkstreamStatus.not_started,
    )

    workstream = pmi_service.create_workstream(workstream_data, test_user, db_session)

    assert workstream is not None
    assert workstream.name == "IT Integration"
    assert workstream.workstream_type == PMIWorkstreamType.it
    assert workstream.project_id == sample_pmi_project.id


def test_create_synergy(db_session, test_user, sample_pmi_project):
    """Test creating a synergy."""
    synergy_data = PMISynergyCreate(
        project_id=sample_pmi_project.id,
        name="Cost Reduction",
        category=PMISynergyCategory.cost_synergy,
        planned_value=Decimal("1000000.00"),
        currency="GBP",
        status=PMISynergyStatus.planned,
    )

    synergy = pmi_service.create_synergy(synergy_data, test_user, db_session)

    assert synergy is not None
    assert synergy.name == "Cost Reduction"
    assert synergy.category == PMISynergyCategory.cost_synergy
    assert synergy.planned_value == Decimal("1000000.00")


def test_calculate_synergy_realization_rate(db_session, test_user, sample_pmi_project):
    """Test calculating synergy realization rate."""
    # Create multiple synergies
    synergy1 = PMISynergyCreate(
        project_id=sample_pmi_project.id,
        name="Synergy 1",
        category=PMISynergyCategory.cost_synergy,
        planned_value=Decimal("500000.00"),
        realized_value=Decimal("400000.00"),
        currency="GBP",
        status=PMISynergyStatus.realized,
    )
    pmi_service.create_synergy(synergy1, test_user, db_session)

    synergy2 = PMISynergyCreate(
        project_id=sample_pmi_project.id,
        name="Synergy 2",
        category=PMISynergyCategory.cost_synergy,
        planned_value=Decimal("500000.00"),
        currency="GBP",
        status=PMISynergyStatus.planned,
    )
    pmi_service.create_synergy(synergy2, test_user, db_session)

    srr = pmi_service.calculate_synergy_realization_rate(
        sample_pmi_project.id, test_user.organization_id, db_session
    )

    # Should be 40% (400k realized / 1M planned)
    assert srr == Decimal("40.00")


def test_create_risk(db_session, test_user, sample_pmi_project):
    """Test creating a risk."""
    risk_data = PMIRiskCreate(
        project_id=sample_pmi_project.id,
        title="IT System Integration Risk",
        description="Risk of system downtime during integration",
        severity=PMIRiskSeverity.high,
        status=PMIRiskStatus.open,
        mitigation_plan="Implement phased rollout",
    )

    risk = pmi_service.create_risk(risk_data, test_user, db_session)

    assert risk is not None
    assert risk.title == "IT System Integration Risk"
    assert risk.severity == PMIRiskSeverity.high
    assert risk.status == PMIRiskStatus.open


def test_create_day_one_checklist_item(db_session, test_user, sample_pmi_project):
    """Test creating a Day 1 checklist item."""
    checklist_data = PMIDayOneChecklistCreate(
        project_id=sample_pmi_project.id,
        category=PMIDayOneCategory.it,
        item="Email access configured",
        status=PMIDayOneChecklistStatus.not_started,
    )

    item = pmi_service.create_day_one_checklist_item(checklist_data, test_user, db_session)

    assert item is not None
    assert item.item == "Email access configured"
    assert item.category == PMIDayOneCategory.it
    assert item.status == PMIDayOneChecklistStatus.not_started


def test_get_pmi_dashboard(db_session, test_user, sample_pmi_project):
    """Test getting PMI dashboard data."""
    # Create some test data
    workstream_data = PMIWorkstreamCreate(
        project_id=sample_pmi_project.id,
        name="IT Integration",
        workstream_type=PMIWorkstreamType.it,
    )
    pmi_service.create_workstream(workstream_data, test_user, db_session)

    synergy_data = PMISynergyCreate(
        project_id=sample_pmi_project.id,
        name="Test Synergy",
        category=PMISynergyCategory.cost_synergy,
        planned_value=Decimal("100000.00"),
    )
    pmi_service.create_synergy(synergy_data, test_user, db_session)

    dashboard = pmi_service.get_pmi_dashboard(
        sample_pmi_project.id, test_user.organization_id, db_session
    )

    assert dashboard is not None
    assert dashboard.project.id == sample_pmi_project.id
    assert dashboard.total_workstreams >= 1
    assert dashboard.total_synergies >= 1


def test_generate_100_day_plan(db_session, test_user, sample_pmi_project):
    """Test generating 100-day plan template."""
    pmi_service.generate_100_day_plan(
        sample_pmi_project.id, test_user.organization_id, db_session
    )

    # Check that workstreams were created
    workstreams = pmi_service.list_workstreams(
        sample_pmi_project.id, test_user.organization_id, db_session
    )
    assert len(workstreams) > 0

    # Check that Day 1 checklist items were created
    checklist_items = pmi_service.list_day_one_checklist(
        sample_pmi_project.id, test_user.organization_id, db_session
    )
    assert len(checklist_items) > 0

