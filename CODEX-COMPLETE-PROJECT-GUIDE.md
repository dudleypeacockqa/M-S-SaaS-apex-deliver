# CODEX Complete Project Implementation Guide
# M&A Intelligence Platform: 35% → 100% Completion

**Target**: Complete entire M&A Intelligence Platform to production-ready 100%
**Methodology**: BMAD v6-alpha + Strict TDD (RED → GREEN → REFACTOR)
**Handoff from**: Claude Code (35% complete)
**Handoff to**: Claude Code (final review, polish, deployment)
**Created**: October 27, 2025
**Context**: Full autonomous implementation guide for complete project

---

## 🎯 Mission Statement

You (CODEX) will autonomously implement the remaining **65%** of the M&A Intelligence Platform, following strict Test-Driven Development and BMAD v6-alpha methodology. This includes completing:

- **Phase 1 Remaining**: DEV-011 Multi-Method Valuation Suite (82% remaining)
- **Phase 2 Complete**: 4 major features (Task Management, Deal Matching, Document Generation, Content Hub)
- **Phase 3 Complete**: 3 ecosystem features (Podcast Studio, Event Management, Community Platform)

**Success Criteria**:
- ~2,000-2,500 total tests passing (100% pass rate)
- ≥90% backend coverage, ≥85% frontend coverage
- All features production-deployed to Render
- Complete BMAD documentation
- Ready for £279-£2,997/month paying customers

---

## 📊 Current Status (35% Complete)

### ✅ Completed by Claude Code (Sprint 1-4)

**Sprint 1: Foundation** (100% ✅)
- DEV-001: Project initialization
- DEV-002: Frontend authentication (Clerk)
- DEV-003: Protected routing
- DEV-004: Backend Clerk sync
- DEV-005: RBAC implementation
- DEV-006: Master Admin Portal

**Sprint 2: Core Features** (100% ✅)
- DEV-007: Deal Flow & Pipeline Management (Kanban, CRUD)
- DEV-008: Secure Document & Data Room (file upload, permissions, versioning)

**Sprint 3: Monetization** (100% ✅)
- DEV-009: Subscription & Billing (Stripe, 4 tiers, webhooks)
- MARK-001: Marketing Website (landing page, features, pricing, legal pages)

**Sprint 4: AI Intelligence** (100% ✅)
- DEV-010: Financial Intelligence Engine (47 ratios, AI narratives, Deal Readiness Score)

**Sprint 5: Valuation (Partial)** (18% ✅)
- DEV-011: Multi-Method Valuation Suite - Phase 1-2.3 only
  - DCF calculation engine (10 tests passing)
  - Database migration (5 tables)
  - Pydantic schemas (13 schemas)
  - Service layer RED tests (17 tests)

**Test Status**:
- Backend: 84 passing + 17 RED
- Frontend: 33 passing
- **Total: 117 passing + 17 RED**

---

## 📋 Your Implementation Roadmap (65% Remaining)

### PHASE 1 COMPLETION: DEV-011 Multi-Method Valuation Suite (82% remaining)

**Estimated**: 18-20 hours
**Priority**: HIGH (completes Phase 1 revenue features)

#### Phase 2.3 GREEN: Service Layer Implementation (~2 hours)
**File**: `backend/app/services/valuation_service.py`

Implement 8 CRUD functions to make 17 RED tests pass:

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.valuation import ValuationModel, ComparableCompany, PrecedentTransaction
from app.schemas.valuation import ValuationCreate, ValuationUpdate, ComparableCompanyCreate
import uuid
from datetime import datetime
from decimal import Decimal

async def create_valuation(
    db: AsyncSession,
    deal_id: str,
    organization_id: str,
    created_by: str,
    valuation_data: ValuationCreate
) -> ValuationModel:
    """Create a new DCF valuation with automatic enterprise value calculation."""

    # Calculate enterprise value using existing DCF functions
    enterprise_value = calculate_enterprise_value_dcf(
        cash_flows=valuation_data.cash_flows,
        terminal_cash_flow=valuation_data.terminal_cash_flow,
        discount_rate=valuation_data.discount_rate,
        terminal_growth_rate=valuation_data.terminal_growth_rate
    )

    # Calculate equity value
    equity_value = float(enterprise_value) - valuation_data.net_debt

    # Calculate implied share price if shares provided
    implied_share_price = None
    if valuation_data.shares_outstanding:
        implied_share_price = equity_value / valuation_data.shares_outstanding

    # Create valuation record
    valuation = ValuationModel(
        id=str(uuid.uuid4()),
        deal_id=deal_id,
        organization_id=organization_id,
        created_by=created_by,
        forecast_years=valuation_data.forecast_years,
        discount_rate=valuation_data.discount_rate,
        terminal_growth_rate=valuation_data.terminal_growth_rate,
        terminal_ebitda_multiple=valuation_data.terminal_ebitda_multiple,
        terminal_method=valuation_data.terminal_method,
        cash_flows=valuation_data.cash_flows,
        terminal_cash_flow=valuation_data.terminal_cash_flow,
        enterprise_value=float(enterprise_value),
        equity_value=equity_value,
        implied_share_price=implied_share_price,
        net_debt=valuation_data.net_debt,
        shares_outstanding=valuation_data.shares_outstanding,
        created_at=datetime.utcnow()
    )

    db.add(valuation)
    await db.commit()
    await db.refresh(valuation)

    return valuation


async def get_valuation(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str
) -> ValuationModel | None:
    """Retrieve valuation by ID with multi-tenant security."""
    result = await db.execute(
        select(ValuationModel).where(
            ValuationModel.id == valuation_id,
            ValuationModel.organization_id == organization_id
        )
    )
    return result.scalar_one_or_none()


async def update_valuation(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str,
    valuation_data: ValuationUpdate
) -> ValuationModel | None:
    """Update valuation and recalculate enterprise value."""
    valuation = await get_valuation(db, valuation_id, organization_id)

    if not valuation:
        return None

    # Update fields
    update_dict = valuation_data.dict(exclude_unset=True)

    # Recalculate enterprise value if cash flows or rates changed
    if any(k in update_dict for k in ['cash_flows', 'discount_rate', 'terminal_growth_rate', 'terminal_cash_flow']):
        cash_flows = update_dict.get('cash_flows', valuation.cash_flows)
        discount_rate = update_dict.get('discount_rate', valuation.discount_rate)
        terminal_cash_flow = update_dict.get('terminal_cash_flow', valuation.terminal_cash_flow)
        terminal_growth_rate = update_dict.get('terminal_growth_rate', valuation.terminal_growth_rate)

        enterprise_value = calculate_enterprise_value_dcf(
            cash_flows=cash_flows,
            terminal_cash_flow=terminal_cash_flow,
            discount_rate=discount_rate,
            terminal_growth_rate=terminal_growth_rate
        )
        update_dict['enterprise_value'] = float(enterprise_value)
        update_dict['equity_value'] = float(enterprise_value) - update_dict.get('net_debt', valuation.net_debt)

    for key, value in update_dict.items():
        setattr(valuation, key, value)

    valuation.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(valuation)

    return valuation


async def delete_valuation(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str
) -> bool:
    """Delete valuation with multi-tenant security."""
    valuation = await get_valuation(db, valuation_id, organization_id)

    if not valuation:
        return False

    await db.delete(valuation)
    await db.commit()
    return True


async def add_comparable(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str,
    comparable_data: ComparableCompanyCreate
) -> ComparableCompany:
    """Add a comparable company to a valuation."""
    # Verify valuation exists and user has access
    valuation = await get_valuation(db, valuation_id, organization_id)
    if not valuation:
        raise ValueError("Valuation not found")

    comparable = ComparableCompany(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        **comparable_data.dict()
    )

    db.add(comparable)
    await db.commit()
    await db.refresh(comparable)

    return comparable


async def calculate_comparable_multiples(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str
) -> dict:
    """Calculate median/mean multiples from comparable companies."""
    result = await db.execute(
        select(ComparableCompany).where(
            ComparableCompany.valuation_id == valuation_id,
            ComparableCompany.organization_id == organization_id
        )
    )
    comparables = result.scalars().all()

    if not comparables:
        return {"error": "No comparables found"}

    # Calculate medians and means
    ev_revenue_multiples = [c.ev_revenue_multiple for c in comparables if c.ev_revenue_multiple]
    ev_ebitda_multiples = [c.ev_ebitda_multiple for c in comparables if c.ev_ebitda_multiple]
    pe_multiples = [c.pe_multiple for c in comparables if c.pe_multiple]

    def median(lst):
        if not lst:
            return None
        sorted_lst = sorted(lst)
        n = len(sorted_lst)
        if n % 2 == 0:
            return (sorted_lst[n//2-1] + sorted_lst[n//2]) / 2
        return sorted_lst[n//2]

    def mean(lst):
        return sum(lst) / len(lst) if lst else None

    return {
        "count": len(comparables),
        "ev_revenue_multiple": {
            "median": median(ev_revenue_multiples),
            "mean": mean(ev_revenue_multiples)
        },
        "ev_ebitda_multiple": {
            "median": median(ev_ebitda_multiples),
            "mean": mean(ev_ebitda_multiples)
        },
        "pe_multiple": {
            "median": median(pe_multiples),
            "mean": mean(pe_multiples)
        }
    }


async def add_precedent_transaction(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str,
    transaction_data: dict
) -> PrecedentTransaction:
    """Add a precedent M&A transaction to a valuation."""
    valuation = await get_valuation(db, valuation_id, organization_id)
    if not valuation:
        raise ValueError("Valuation not found")

    transaction = PrecedentTransaction(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        **transaction_data
    )

    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)

    return transaction


async def calculate_precedent_multiples(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str
) -> dict:
    """Calculate median/mean multiples from precedent transactions."""
    result = await db.execute(
        select(PrecedentTransaction).where(
            PrecedentTransaction.valuation_id == valuation_id,
            PrecedentTransaction.organization_id == organization_id
        )
    )
    transactions = result.scalars().all()

    if not transactions:
        return {"error": "No precedent transactions found"}

    ev_revenue_multiples = [t.ev_revenue_multiple for t in transactions if t.ev_revenue_multiple]
    ev_ebitda_multiples = [t.ev_ebitda_multiple for t in transactions if t.ev_ebitda_multiple]

    def median(lst):
        if not lst:
            return None
        sorted_lst = sorted(lst)
        n = len(sorted_lst)
        if n % 2 == 0:
            return (sorted_lst[n//2-1] + sorted_lst[n//2]) / 2
        return sorted_lst[n//2]

    def mean(lst):
        return sum(lst) / len(lst) if lst else None

    return {
        "count": len(transactions),
        "ev_revenue_multiple": {
            "median": median(ev_revenue_multiples),
            "mean": mean(ev_revenue_multiples)
        },
        "ev_ebitda_multiple": {
            "median": median(ev_ebitda_multiples),
            "mean": mean(ev_ebitda_multiples)
        }
    }
```

**TDD Workflow**:
1. Run `pytest backend/tests/test_valuation_crud.py -v` → Should see 17 failures
2. Implement functions above
3. Run tests again → Should see 17 passes
4. Refactor for code quality
5. Commit: `feat(valuation): Phase 2.3 GREEN - implement service layer (17 tests passing)`

#### Phase 2.4: API Endpoints (~1.5 hours)
**File**: `backend/app/api/v1/endpoints/valuations.py` (NEW FILE)

**TDD First - Write Tests**:
```python
# backend/tests/test_valuation_endpoints.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_valuation_endpoint(client: AsyncClient, auth_headers, test_deal):
    """Test POST /api/deals/{deal_id}/valuations endpoint."""
    response = await client.post(
        f"/api/deals/{test_deal.id}/valuations",
        json={
            "forecast_years": 5,
            "discount_rate": 0.12,
            "terminal_growth_rate": 0.03,
            "terminal_method": "gordon_growth",
            "cash_flows": [500000, 650000, 800000, 950000, 1100000],
            "terminal_cash_flow": 1200000,
            "net_debt": 500000,
            "shares_outstanding": 1000000
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["enterprise_value"] > 10000000
    assert data["equity_value"] == data["enterprise_value"] - 500000

@pytest.mark.asyncio
async def test_get_valuation_endpoint(client: AsyncClient, auth_headers, test_valuation):
    """Test GET /api/valuations/{valuation_id} endpoint."""
    response = await client.get(
        f"/api/valuations/{test_valuation.id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["id"] == test_valuation.id

@pytest.mark.asyncio
async def test_update_valuation_endpoint(client: AsyncClient, auth_headers, test_valuation):
    """Test PUT /api/valuations/{valuation_id} endpoint."""
    response = await client.put(
        f"/api/valuations/{test_valuation.id}",
        json={"discount_rate": 0.15},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["discount_rate"] == 0.15

@pytest.mark.asyncio
async def test_delete_valuation_endpoint(client: AsyncClient, auth_headers, test_valuation):
    """Test DELETE /api/valuations/{valuation_id} endpoint."""
    response = await client.delete(
        f"/api/valuations/{test_valuation.id}",
        headers=auth_headers
    )
    assert response.status_code == 204

@pytest.mark.asyncio
async def test_add_comparable_endpoint(client: AsyncClient, auth_headers, test_valuation):
    """Test POST /api/valuations/{valuation_id}/comparables endpoint."""
    response = await client.post(
        f"/api/valuations/{test_valuation.id}/comparables",
        json={
            "company_name": "Acme Corp",
            "ticker": "ACME",
            "revenue": 50000000,
            "ebitda": 10000000,
            "enterprise_value": 120000000,
            "ev_revenue_multiple": 2.4,
            "ev_ebitda_multiple": 12.0,
            "pe_multiple": 15.0
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["company_name"] == "Acme Corp"

@pytest.mark.asyncio
async def test_calculate_comparable_multiples_endpoint(client: AsyncClient, auth_headers, test_valuation_with_comparables):
    """Test GET /api/valuations/{valuation_id}/comparables/analysis endpoint."""
    response = await client.get(
        f"/api/valuations/{test_valuation_with_comparables.id}/comparables/analysis",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "ev_ebitda_multiple" in data
    assert "median" in data["ev_ebitda_multiple"]

# Add 8 more tests for precedent transactions, scenarios, etc.
# Total: ~15 endpoint tests
```

**Then Implement Endpoints**:
```python
# backend/app/api/v1/endpoints/valuations.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.deps import get_db, get_current_user
from app.services import valuation_service
from app.schemas.valuation import ValuationCreate, ValuationResponse, ValuationUpdate
from app.models.user import User

router = APIRouter()

@router.post("/deals/{deal_id}/valuations", response_model=ValuationResponse, status_code=status.HTTP_201_CREATED)
async def create_valuation(
    deal_id: str,
    valuation: ValuationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new DCF valuation for a deal."""
    # Multi-tenant security: verify user has access to deal
    # (implement deal ownership check here)

    result = await valuation_service.create_valuation(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        valuation_data=valuation
    )
    return result

@router.get("/valuations/{valuation_id}", response_model=ValuationResponse)
async def get_valuation(
    valuation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a valuation by ID."""
    valuation = await valuation_service.get_valuation(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id
    )

    if not valuation:
        raise HTTPException(status_code=404, detail="Valuation not found")

    return valuation

@router.put("/valuations/{valuation_id}", response_model=ValuationResponse)
async def update_valuation(
    valuation_id: str,
    valuation_data: ValuationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a valuation."""
    result = await valuation_service.update_valuation(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
        valuation_data=valuation_data
    )

    if not result:
        raise HTTPException(status_code=404, detail="Valuation not found")

    return result

@router.delete("/valuations/{valuation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_valuation(
    valuation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a valuation."""
    success = await valuation_service.delete_valuation(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id
    )

    if not success:
        raise HTTPException(status_code=404, detail="Valuation not found")

@router.post("/valuations/{valuation_id}/comparables", response_model=ComparableCompanyResponse, status_code=status.HTTP_201_CREATED)
async def add_comparable(
    valuation_id: str,
    comparable: ComparableCompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a comparable company to a valuation."""
    result = await valuation_service.add_comparable(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
        comparable_data=comparable
    )
    return result

@router.get("/valuations/{valuation_id}/comparables/analysis", response_model=MultiplesAnalysisResponse)
async def get_comparable_analysis(
    valuation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate median/mean multiples from comparables."""
    result = await valuation_service.calculate_comparable_multiples(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id
    )
    return result

# Add 3 more endpoints for precedent transactions
# Total: 8 endpoints
```

**Register Router**:
```python
# backend/app/api/v1/api.py
from app.api.v1.endpoints import valuations

api_router.include_router(valuations.router, prefix="/api/v1", tags=["valuations"])
```

**TDD Workflow**:
1. Write 15 endpoint tests (RED)
2. Implement 8 endpoints (GREEN)
3. Run `pytest backend/tests/test_valuation_endpoints.py -v` → 15 passing
4. Commit: `feat(valuation): Phase 2.4 - API endpoints with multi-tenant security (15 tests)`

#### Phase 3: Scenario Management & Monte Carlo (~3-4 hours)

**Features**:
- Create Base/Upside/Downside scenarios
- Monte Carlo simulation with 10,000 iterations
- Tornado chart sensitivity data
- Scenario comparison tables

**New Dependencies**:
```bash
# backend/requirements.txt
numpy>=1.24.0
scipy>=1.10.0
```

**TDD Tests** (~12-15 tests):
```python
# backend/tests/test_valuation_scenarios.py
@pytest.mark.asyncio
async def test_create_scenario(db_session, test_valuation):
    """Test creating a valuation scenario."""
    scenario = await valuation_service.create_scenario(
        db=db_session,
        valuation_id=test_valuation.id,
        organization_id=test_valuation.organization_id,
        scenario_data={
            "name": "Upside Case",
            "scenario_type": "upside",
            "assumptions": {
                "revenue_growth": 0.25,
                "margin_expansion": 0.02
            }
        }
    )
    assert scenario.scenario_type == "upside"
    assert scenario.enterprise_value > test_valuation.enterprise_value

@pytest.mark.asyncio
async def test_monte_carlo_simulation(db_session, test_valuation):
    """Test Monte Carlo valuation simulation."""
    result = await valuation_service.run_monte_carlo(
        db=db_session,
        valuation_id=test_valuation.id,
        organization_id=test_valuation.organization_id,
        iterations=1000,
        parameters={
            "discount_rate": {"mean": 0.12, "std": 0.02},
            "terminal_growth_rate": {"mean": 0.03, "std": 0.01}
        }
    )
    assert "p10" in result
    assert "p50" in result
    assert "p90" in result
    assert result["p90"] > result["p50"] > result["p10"]

@pytest.mark.asyncio
async def test_tornado_chart_data(db_session, test_valuation):
    """Test generating tornado chart sensitivity data."""
    result = await valuation_service.generate_tornado_chart(
        db=db_session,
        valuation_id=test_valuation.id,
        organization_id=test_valuation.organization_id
    )
    assert len(result["variables"]) >= 3
    assert "discount_rate" in [v["name"] for v in result["variables"]]
```

**Implementation**:
```python
# backend/app/services/valuation_service.py (add these functions)
import numpy as np
from scipy import stats

async def create_scenario(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str,
    scenario_data: dict
) -> ValuationScenario:
    """Create a valuation scenario (base, upside, downside)."""
    # Get base valuation
    valuation = await get_valuation(db, valuation_id, organization_id)

    # Apply scenario assumptions
    adjusted_cash_flows = [
        cf * (1 + scenario_data["assumptions"].get("revenue_growth", 0))
        for cf in valuation.cash_flows
    ]

    # Recalculate with scenario assumptions
    ev = calculate_enterprise_value_dcf(
        cash_flows=adjusted_cash_flows,
        terminal_cash_flow=valuation.terminal_cash_flow * 1.1,
        discount_rate=valuation.discount_rate,
        terminal_growth_rate=valuation.terminal_growth_rate
    )

    scenario = ValuationScenario(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        name=scenario_data["name"],
        scenario_type=scenario_data["scenario_type"],
        assumptions=scenario_data["assumptions"],
        enterprise_value=float(ev),
        equity_value=float(ev) - valuation.net_debt
    )

    db.add(scenario)
    await db.commit()
    await db.refresh(scenario)
    return scenario


async def run_monte_carlo(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str,
    iterations: int,
    parameters: dict
) -> dict:
    """Run Monte Carlo simulation for valuation range."""
    valuation = await get_valuation(db, valuation_id, organization_id)

    results = []

    for _ in range(iterations):
        # Sample from distributions
        discount_rate = np.random.normal(
            parameters["discount_rate"]["mean"],
            parameters["discount_rate"]["std"]
        )
        terminal_growth = np.random.normal(
            parameters["terminal_growth_rate"]["mean"],
            parameters["terminal_growth_rate"]["std"]
        )

        # Calculate EV with sampled parameters
        ev = calculate_enterprise_value_dcf(
            cash_flows=valuation.cash_flows,
            terminal_cash_flow=valuation.terminal_cash_flow,
            discount_rate=max(0.01, discount_rate),  # Floor at 1%
            terminal_growth_rate=min(0.10, max(-0.05, terminal_growth))  # Bounds
        )
        results.append(float(ev))

    # Calculate percentiles
    return {
        "iterations": iterations,
        "mean": float(np.mean(results)),
        "std": float(np.std(results)),
        "p10": float(np.percentile(results, 10)),
        "p25": float(np.percentile(results, 25)),
        "p50": float(np.percentile(results, 50)),
        "p75": float(np.percentile(results, 75)),
        "p90": float(np.percentile(results, 90)),
        "min": float(np.min(results)),
        "max": float(np.max(results))
    }


async def generate_tornado_chart(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str
) -> dict:
    """Generate tornado chart data for sensitivity analysis."""
    valuation = await get_valuation(db, valuation_id, organization_id)
    base_ev = valuation.enterprise_value

    variables = []

    # Test discount rate sensitivity
    ev_low_dr = calculate_enterprise_value_dcf(
        valuation.cash_flows, valuation.terminal_cash_flow,
        valuation.discount_rate - 0.02, valuation.terminal_growth_rate
    )
    ev_high_dr = calculate_enterprise_value_dcf(
        valuation.cash_flows, valuation.terminal_cash_flow,
        valuation.discount_rate + 0.02, valuation.terminal_growth_rate
    )

    variables.append({
        "name": "discount_rate",
        "base_value": valuation.discount_rate,
        "low_value": valuation.discount_rate - 0.02,
        "high_value": valuation.discount_rate + 0.02,
        "ev_at_low": float(ev_low_dr),
        "ev_at_high": float(ev_high_dr),
        "impact_range": abs(float(ev_high_dr) - float(ev_low_dr))
    })

    # Test terminal growth sensitivity
    ev_low_tg = calculate_enterprise_value_dcf(
        valuation.cash_flows, valuation.terminal_cash_flow,
        valuation.discount_rate, valuation.terminal_growth_rate - 0.01
    )
    ev_high_tg = calculate_enterprise_value_dcf(
        valuation.cash_flows, valuation.terminal_cash_flow,
        valuation.discount_rate, valuation.terminal_growth_rate + 0.01
    )

    variables.append({
        "name": "terminal_growth_rate",
        "base_value": valuation.terminal_growth_rate,
        "low_value": valuation.terminal_growth_rate - 0.01,
        "high_value": valuation.terminal_growth_rate + 0.01,
        "ev_at_low": float(ev_low_tg),
        "ev_at_high": float(ev_high_tg),
        "impact_range": abs(float(ev_high_tg) - float(ev_low_tg))
    })

    # Sort by impact (largest first - tornado shape)
    variables.sort(key=lambda x: x["impact_range"], reverse=True)

    return {
        "base_enterprise_value": base_ev,
        "variables": variables
    }
```

**Commit**: `feat(valuation): Phase 3 - scenario management and Monte Carlo (12 tests)`

#### Phase 4: Frontend Valuation Workspace (~5-6 hours)

**8 React Components** to implement with TDD:

1. **ValuationSuite.tsx** - Main workspace layout
2. **DCFValuationForm.tsx** - DCF input form with validation
3. **ValuationResultsCard.tsx** - Display EV, equity value, share price
4. **SensitivityMatrix.tsx** - Interactive sensitivity table
5. **ScenarioComparison.tsx** - Base/Upside/Downside comparison table
6. **ComparablesTable.tsx** - Comparable companies grid
7. **PrecedentTransactionsTable.tsx** - Historical M&A transactions grid
8. **MonteCarloChart.tsx** - Distribution chart with percentiles

**Frontend Tests** (~20-30 tests):
```typescript
// frontend/src/pages/deals/ValuationSuite.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ValuationSuite } from './ValuationSuite';

describe('ValuationSuite', () => {
  it('should render DCF valuation form', () => {
    render(<ValuationSuite dealId="test-deal-123" />);
    expect(screen.getByText('DCF Valuation')).toBeInTheDocument();
    expect(screen.getByLabelText('Discount Rate (%)')).toBeInTheDocument();
  });

  it('should submit DCF valuation and display results', async () => {
    const user = userEvent.setup();
    render(<ValuationSuite dealId="test-deal-123" />);

    await user.type(screen.getByLabelText('Discount Rate (%)'), '12');
    await user.type(screen.getByLabelText('Terminal Growth Rate (%)'), '3');
    await user.click(screen.getByText('Calculate Valuation'));

    await waitFor(() => {
      expect(screen.getByText(/Enterprise Value:/)).toBeInTheDocument();
      expect(screen.getByText(/£10,500,000/)).toBeInTheDocument();
    });
  });

  it('should display sensitivity matrix', async () => {
    render(<ValuationSuite dealId="test-deal-123" />);
    await userEvent.click(screen.getByText('Sensitivity Analysis'));

    await waitFor(() => {
      expect(screen.getByText('WACC →')).toBeInTheDocument();
      expect(screen.getByText('Growth ↓')).toBeInTheDocument();
    });
  });

  it('should create and display scenarios', async () => {
    render(<ValuationSuite dealId="test-deal-123" />);
    await userEvent.click(screen.getByText('Add Scenario'));
    await userEvent.selectOptions(screen.getByLabelText('Scenario Type'), 'upside');
    await userEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getByText('Upside Case')).toBeInTheDocument();
    });
  });

  // Add 16 more component tests
});
```

**Example Component**:
```typescript
// frontend/src/pages/deals/DCFValuationForm.tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface DCFValuationFormProps {
  dealId: string;
  onSuccess?: (valuation: any) => void;
}

export const DCFValuationForm: React.FC<DCFValuationFormProps> = ({ dealId, onSuccess }) => {
  const [formData, setFormData] = useState({
    forecast_years: 5,
    discount_rate: 0.12,
    terminal_growth_rate: 0.03,
    terminal_method: 'gordon_growth',
    cash_flows: [0, 0, 0, 0, 0],
    terminal_cash_flow: 0,
    net_debt: 0,
    shares_outstanding: 0
  });

  const queryClient = useQueryClient();

  const createValuationMutation = useMutation({
    mutationFn: (data: any) =>
      apiClient.post(`/api/v1/deals/${dealId}/valuations`, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['valuations', dealId]);
      if (onSuccess) onSuccess(response.data);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createValuationMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.discount_rate * 100}
            onChange={(e) => setFormData({
              ...formData,
              discount_rate: parseFloat(e.target.value) / 100
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Terminal Growth Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.terminal_growth_rate * 100}
            onChange={(e) => setFormData({
              ...formData,
              terminal_growth_rate: parseFloat(e.target.value) / 100
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Add cash flow inputs for each year */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Projected Free Cash Flows
        </label>
        {formData.cash_flows.map((cf, index) => (
          <input
            key={index}
            type="number"
            placeholder={`Year ${index + 1}`}
            value={cf}
            onChange={(e) => {
              const newCashFlows = [...formData.cash_flows];
              newCashFlows[index] = parseFloat(e.target.value);
              setFormData({ ...formData, cash_flows: newCashFlows });
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={createValuationMutation.isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        {createValuationMutation.isPending ? 'Calculating...' : 'Calculate Valuation'}
      </button>

      {createValuationMutation.isError && (
        <div className="text-red-600">Error creating valuation</div>
      )}
    </form>
  );
};
```

**Commit**: `feat(valuation): Phase 4 - frontend valuation workspace (8 components, 20 tests)`

#### Phase 5: PDF/Excel Exports (~2-3 hours)

**New Dependencies**:
```bash
# backend/requirements.txt
weasyprint>=60.0
pandas>=2.0.0
openpyxl>=3.1.0
```

**TDD Tests** (~8-12 tests):
```python
# backend/tests/test_valuation_exports.py
@pytest.mark.asyncio
async def test_generate_pdf_report(db_session, test_valuation):
    """Test PDF export generation."""
    pdf_bytes = await valuation_service.generate_pdf_report(
        db=db_session,
        valuation_id=test_valuation.id,
        organization_id=test_valuation.organization_id
    )
    assert len(pdf_bytes) > 1000
    assert pdf_bytes[:4] == b'%PDF'

@pytest.mark.asyncio
async def test_generate_excel_export(db_session, test_valuation):
    """Test Excel export generation."""
    excel_bytes = await valuation_service.generate_excel_export(
        db=db_session,
        valuation_id=test_valuation.id,
        organization_id=test_valuation.organization_id
    )
    assert len(excel_bytes) > 500
```

**Implementation**:
```python
# backend/app/services/valuation_service.py
from weasyprint import HTML
import pandas as pd
from io import BytesIO

async def generate_pdf_report(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str
) -> bytes:
    """Generate professional PDF valuation report."""
    valuation = await get_valuation(db, valuation_id, organization_id)

    # Get AI executive summary (GPT-4)
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    summary_prompt = f"""
    Generate a 2-3 paragraph executive summary for this DCF valuation:

    Enterprise Value: £{valuation.enterprise_value:,.0f}
    Equity Value: £{valuation.equity_value:,.0f}
    Discount Rate: {valuation.discount_rate*100:.1f}%
    Terminal Growth: {valuation.terminal_growth_rate*100:.1f}%

    Provide professional investment analysis.
    """

    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": summary_prompt}],
        max_tokens=300
    )
    executive_summary = response.choices[0].message.content

    # Generate HTML report
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            h1 {{ color: #1e40af; }}
            table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 12px; text-align: right; }}
            th {{ background-color: #1e40af; color: white; }}
        </style>
    </head>
    <body>
        <h1>DCF Valuation Report</h1>
        <h2>Executive Summary</h2>
        <p>{executive_summary}</p>

        <h2>Valuation Results</h2>
        <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Enterprise Value</td><td>£{valuation.enterprise_value:,.0f}</td></tr>
            <tr><td>Equity Value</td><td>£{valuation.equity_value:,.0f}</td></tr>
            <tr><td>Implied Share Price</td><td>£{valuation.implied_share_price:.2f}</td></tr>
        </table>

        <h2>Assumptions</h2>
        <table>
            <tr><th>Parameter</th><th>Value</th></tr>
            <tr><td>Discount Rate (WACC)</td><td>{valuation.discount_rate*100:.1f}%</td></tr>
            <tr><td>Terminal Growth Rate</td><td>{valuation.terminal_growth_rate*100:.1f}%</td></tr>
            <tr><td>Forecast Period</td><td>{valuation.forecast_years} years</td></tr>
        </table>
    </body>
    </html>
    """

    # Convert to PDF
    pdf = HTML(string=html_content).write_pdf()

    # Log export
    log_export(db, valuation_id, "pdf", len(pdf))

    return pdf


async def generate_excel_export(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str
) -> bytes:
    """Generate Excel workbook with valuation model."""
    valuation = await get_valuation(db, valuation_id, organization_id)

    # Create Excel workbook with pandas
    output = BytesIO()

    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        # Cash flows sheet
        df_cf = pd.DataFrame({
            'Year': list(range(1, len(valuation.cash_flows) + 1)),
            'Free Cash Flow': valuation.cash_flows
        })
        df_cf.to_excel(writer, sheet_name='Cash Flows', index=False)

        # Summary sheet
        df_summary = pd.DataFrame({
            'Metric': ['Enterprise Value', 'Equity Value', 'Implied Share Price', 'Discount Rate', 'Terminal Growth'],
            'Value': [
                valuation.enterprise_value,
                valuation.equity_value,
                valuation.implied_share_price,
                valuation.discount_rate,
                valuation.terminal_growth_rate
            ]
        })
        df_summary.to_excel(writer, sheet_name='Summary', index=False)

    excel_bytes = output.getvalue()
    log_export(db, valuation_id, "excel", len(excel_bytes))

    return excel_bytes
```

**API Endpoints**:
```python
@router.get("/valuations/{valuation_id}/export/pdf")
async def export_pdf(valuation_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Export valuation as PDF."""
    pdf_bytes = await valuation_service.generate_pdf_report(db, valuation_id, current_user.organization_id)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=valuation_{valuation_id}.pdf"})

@router.get("/valuations/{valuation_id}/export/excel")
async def export_excel(valuation_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Export valuation as Excel."""
    excel_bytes = await valuation_service.generate_excel_export(db, valuation_id, current_user.organization_id)
    return Response(content=excel_bytes, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": f"attachment; filename=valuation_{valuation_id}.xlsx"})
```

**Commit**: `feat(valuation): Phase 5 - PDF/Excel exports with GPT-4 summaries (10 tests)`

#### Phase 6: Integration Testing (~2-3 hours)

**Full test suite run**:
```bash
# Backend
cd backend
pytest --cov=app --cov-report=term-missing

# Expected: ~140-150 tests passing, ≥90% coverage

# Frontend
cd frontend
npm test -- --coverage

# Expected: ~53-63 tests passing, ≥85% coverage
```

**Commit**: `test(valuation): Phase 6 - integration testing and coverage verification`

**Final DEV-011 Commit**:
```bash
git add .
git commit -m "feat(DEV-011): complete Multi-Method Valuation Suite (100%)

- DCF valuation with sensitivity analysis
- Scenario management (Base/Upside/Downside)
- Monte Carlo simulation (10K iterations)
- Comparable companies analysis
- Precedent transactions analysis
- Professional PDF/Excel exports
- 8 frontend components with TailwindCSS
- Full test coverage: 150 backend + 63 frontend tests

Closes DEV-011"
git push origin main
```

**Update BMAD Tracker**:
```markdown
# docs/bmad/BMAD_PROGRESS_TRACKER.md

**Sprint 5 Status**: ✅ 100% COMPLETE - DEV-011 Valuation Suite ✅ (Backend 150/150 • Frontend 63/63 • Total 213 tests passing)
```

---

### PHASE 2: ADVANCED INTELLIGENCE (Months 4-6) - 4 Features

#### DEV-012: Task Management & Workflow Automation (~20-25 hours)

**Priority**: MEDIUM
**Features**:
- Task CRUD with assignment
- Checklist templates (due diligence, integration)
- Workflow automation (stage-based triggers)
- Email notifications
- Gantt chart view

**Database Models** (3 tables):
```python
# backend/app/models/task.py
class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"))
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="pending")  # pending, in_progress, completed
    priority = Column(String(20), default="medium")  # low, medium, high
    assigned_to = Column(String(36), ForeignKey("users.id"))
    due_date = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True))

class ChecklistTemplate(Base):
    __tablename__ = "checklist_templates"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(50))  # due_diligence, integration, legal, etc.
    tasks = Column(JSON, nullable=False)  # Array of task definitions
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    is_global = Column(Boolean, default=False)  # Platform-wide vs org-specific
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WorkflowAutomation(Base):
    __tablename__ = "workflow_automations"

    id = Column(String(36), primary_key=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    name = Column(String(255), nullable=False)
    trigger_type = Column(String(50))  # stage_change, task_completed, etc.
    trigger_conditions = Column(JSON)  # {"stage": "due_diligence"}
    actions = Column(JSON)  # [{"type": "create_tasks", "template_id": "..."}]
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

**Service Layer Implementation**:
```python
# backend/app/services/task_service.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.task import Task, ChecklistTemplate, WorkflowAutomation
from app.schemas.task import TaskCreate, TaskUpdate
import uuid
from datetime import datetime

async def create_task(
    db: AsyncSession,
    deal_id: str,
    organization_id: str,
    task_data: TaskCreate,
    created_by: str
) -> Task:
    """Create a new task."""
    task = Task(
        id=str(uuid.uuid4()),
        deal_id=deal_id,
        organization_id=organization_id,
        title=task_data.title,
        description=task_data.description,
        status="pending",
        priority=task_data.priority,
        assigned_to=task_data.assigned_to,
        due_date=task_data.due_date,
        created_by=created_by,
        created_at=datetime.utcnow()
    )

    db.add(task)
    await db.commit()
    await db.refresh(task)

    # Send email notification if assigned
    if task.assigned_to:
        await send_task_assignment_email(db, task)

    return task


async def get_deal_tasks(
    db: AsyncSession,
    deal_id: str,
    organization_id: str
) -> list[Task]:
    """Get all tasks for a deal."""
    result = await db.execute(
        select(Task).where(
            Task.deal_id == deal_id,
            Task.organization_id == organization_id
        ).order_by(Task.due_date, Task.priority)
    )
    return result.scalars().all()


async def update_task(
    db: AsyncSession,
    task_id: str,
    organization_id: str,
    task_data: TaskUpdate
) -> Task:
    """Update task with status tracking."""
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.organization_id == organization_id
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        return None

    # Track completion
    if task_data.status == "completed" and task.status != "completed":
        task.completed_at = datetime.utcnow()

    # Update fields
    for key, value in task_data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(task)

    # Trigger workflow automations on status change
    await trigger_task_automations(db, task)

    return task


async def apply_checklist_template(
    db: AsyncSession,
    deal_id: str,
    template_id: str,
    organization_id: str,
    created_by: str
) -> list[Task]:
    """Apply checklist template to create multiple tasks."""
    result = await db.execute(
        select(ChecklistTemplate).where(
            ChecklistTemplate.id == template_id
        )
    )
    template = result.scalar_one_or_none()

    if not template:
        raise ValueError("Template not found")

    tasks = []
    for task_def in template.tasks:
        task = Task(
            id=str(uuid.uuid4()),
            deal_id=deal_id,
            organization_id=organization_id,
            title=task_def["title"],
            description=task_def.get("description", ""),
            priority=task_def.get("priority", "medium"),
            status="pending",
            created_by=created_by,
            created_at=datetime.utcnow()
        )
        db.add(task)
        tasks.append(task)

    await db.commit()
    return tasks


async def trigger_workflow_automations(
    db: AsyncSession,
    deal_id: str,
    trigger_type: str,
    trigger_data: dict
) -> None:
    """Execute workflow automations based on triggers."""
    result = await db.execute(
        select(WorkflowAutomation).where(
            WorkflowAutomation.is_active == True
        )
    )
    automations = result.scalars().all()

    for automation in automations:
        if automation.trigger_type == trigger_type:
            # Check conditions
            if matches_conditions(automation.trigger_conditions, trigger_data):
                await execute_automation_actions(db, automation, deal_id)


async def execute_automation_actions(
    db: AsyncSession,
    automation: WorkflowAutomation,
    deal_id: str
) -> None:
    """Execute automation actions."""
    for action in automation.actions:
        if action["type"] == "create_tasks":
            await apply_checklist_template(
                db, deal_id, action["template_id"],
                automation.organization_id, "system"
            )
        elif action["type"] == "send_notification":
            await send_notification(action["recipient"], action["message"])


async def send_task_assignment_email(db: AsyncSession, task: Task):
    """Send email notification for task assignment."""
    # Get assignee email
    result = await db.execute(
        select(User).where(User.id == task.assigned_to)
    )
    assignee = result.scalar_one_or_none()

    if assignee:
        # Use background task for email sending
        from app.tasks import send_email
        send_email.delay(
            to=assignee.email,
            subject=f"New Task Assigned: {task.title}",
            body=f"You have been assigned a task:\n\n{task.title}\n\nDue: {task.due_date}"
        )
```

**Pydantic Schemas**:
```python
# backend/app/schemas/task.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: str = Field(default="medium")
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id: str
    deal_id: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    assigned_to: Optional[str]
    due_date: Optional[datetime]
    completed_at: Optional[datetime]
    created_by: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
```

**API Endpoints**:
```python
# backend/app/api/v1/endpoints/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.deps import get_db, get_current_user
from app.services import task_service
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter()

@router.post("/deals/{deal_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    deal_id: str,
    task: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new task for a deal."""
    result = await task_service.create_task(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        task_data=task,
        created_by=current_user.id
    )
    return result

@router.get("/deals/{deal_id}/tasks", response_model=list[TaskResponse])
async def get_deal_tasks(
    deal_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all tasks for a deal."""
    tasks = await task_service.get_deal_tasks(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id
    )
    return tasks

@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a task."""
    result = await task_service.update_task(
        db=db,
        task_id=task_id,
        organization_id=current_user.organization_id,
        task_data=task_data
    )

    if not result:
        raise HTTPException(status_code=404, detail="Task not found")

    return result

@router.post("/deals/{deal_id}/tasks/apply-template", response_model=list[TaskResponse])
async def apply_template(
    deal_id: str,
    template_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Apply checklist template to create multiple tasks."""
    tasks = await task_service.apply_checklist_template(
        db=db,
        deal_id=deal_id,
        template_id=template_id,
        organization_id=current_user.organization_id,
        created_by=current_user.id
    )
    return tasks

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a task."""
    await task_service.delete_task(
        db=db,
        task_id=task_id,
        organization_id=current_user.organization_id
    )
```

**TDD Tests**:
```python
# backend/tests/test_task_service.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_task(db_session, test_deal, test_user):
    """Test creating a task."""
    task = await task_service.create_task(
        db=db_session,
        deal_id=test_deal.id,
        organization_id=test_user.organization_id,
        task_data=TaskCreate(
            title="Review financials",
            description="Complete financial due diligence",
            priority="high",
            assigned_to=test_user.id
        ),
        created_by=test_user.id
    )

    assert task.title == "Review financials"
    assert task.status == "pending"
    assert task.priority == "high"

@pytest.mark.asyncio
async def test_apply_checklist_template(db_session, test_deal, test_template):
    """Test applying checklist template creates multiple tasks."""
    tasks = await task_service.apply_checklist_template(
        db=db_session,
        deal_id=test_deal.id,
        template_id=test_template.id,
        organization_id=test_deal.organization_id,
        created_by="system"
    )

    assert len(tasks) == len(test_template.tasks)
    assert all(t.deal_id == test_deal.id for t in tasks)

@pytest.mark.asyncio
async def test_task_status_completion_tracking(db_session, test_task):
    """Test that completing a task sets completed_at timestamp."""
    assert test_task.completed_at is None

    updated = await task_service.update_task(
        db=db_session,
        task_id=test_task.id,
        organization_id=test_task.organization_id,
        task_data=TaskUpdate(status="completed")
    )

    assert updated.status == "completed"
    assert updated.completed_at is not None

# Add 35+ more tests for API endpoints, workflows, notifications, etc.
```

**Frontend Components**:
```typescript
// frontend/src/pages/deals/TaskList.tsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  due_date: string;
}

export const TaskList: React.FC<{ dealId: string }> = ({ dealId }) => {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', dealId],
    queryFn: () => apiClient.get(`/api/v1/deals/${dealId}/tasks`).then(r => r.data)
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: { taskId: string; updates: Partial<Task> }) =>
      apiClient.put(`/api/v1/tasks/${data.taskId}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', dealId]);
    }
  });

  if (isLoading) return <div>Loading tasks...</div>;

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress') || [];
  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <TaskForm dealId={dealId} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Pending ({pendingTasks.length})</h3>
          {pendingTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={(updates) => updateTaskMutation.mutate({ taskId: task.id, updates })}
            />
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">In Progress ({inProgressTasks.length})</h3>
          {inProgressTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={(updates) => updateTaskMutation.mutate({ taskId: task.id, updates })}
            />
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Completed ({completedTasks.length})</h3>
          {completedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={(updates) => updateTaskMutation.mutate({ taskId: task.id, updates })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

```typescript
// frontend/src/pages/deals/TaskCard.tsx
import React from 'react';

interface TaskCardProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{task.title}</h4>
        <span className={`px-2 py-1 text-xs rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      {task.due_date && (
        <p className="text-xs text-gray-500 mb-2">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onUpdate({ status: 'in_progress' })}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Start
        </button>
        <button
          onClick={() => onUpdate({ status: 'completed' })}
          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Complete
        </button>
      </div>
    </div>
  );
};
```

**Frontend Tests**:
```typescript
// frontend/src/pages/deals/TaskList.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  it('should render tasks organized by status', async () => {
    render(<TaskList dealId="deal-123" />);

    await waitFor(() => {
      expect(screen.getByText('Pending (3)')).toBeInTheDocument();
      expect(screen.getByText('In Progress (2)')).toBeInTheDocument();
      expect(screen.getByText('Completed (5)')).toBeInTheDocument();
    });
  });

  it('should update task status when clicking buttons', async () => {
    const user = userEvent.setup();
    render(<TaskList dealId="deal-123" />);

    await user.click(screen.getByText('Start'));

    await waitFor(() => {
      expect(screen.getByText('In Progress (3)')).toBeInTheDocument();
    });
  });

  // Add 15+ more component tests
});
```

**Commit**:
```bash
git commit -m "feat(DEV-012): complete Task Management & Workflow Automation

- Task CRUD with assignment and due dates
- 12 pre-built checklist templates
- Workflow automation engine with stage triggers
- Email notifications via background tasks
- Gantt chart visualization
- Full test coverage: 40 backend + 18 frontend tests

Closes DEV-012"
```

---

#### DEV-013: Intelligent Deal Matching (~25-30 hours)

**Priority**: MEDIUM
**Features**:
- Sell-side mandate profiles
- Buy-side search criteria
- AI-powered matching algorithm (Anthropic Claude 3)
- Confidence scoring
- Match explanations
- Networking connections

**Database Models** (3 tables):
```python
# backend/app/models/deal_matching.py
class SellSideMandate(Base):
    __tablename__ = "sell_side_mandates"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id"))
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    company_name = Column(String(255), nullable=False)
    industry = Column(String(100))
    sub_industry = Column(String(100))
    revenue = Column(Float)
    ebitda = Column(Float)
    asking_price = Column(Float)
    geography = Column(String(100))
    growth_rate = Column(Float)
    description = Column(Text)
    key_strengths = Column(JSON)  # Array of strings
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BuySideProfile(Base):
    __tablename__ = "buy_side_profiles"

    id = Column(String(36), primary_key=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    buyer_name = Column(String(255), nullable=False)
    target_industries = Column(JSON)  # Array of industries
    min_revenue = Column(Float)
    max_revenue = Column(Float)
    target_geographies = Column(JSON)
    acquisition_criteria = Column(Text)
    strategic_focus = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DealMatch(Base):
    __tablename__ = "deal_matches"

    id = Column(String(36), primary_key=True)
    sell_side_id = Column(String(36), ForeignKey("sell_side_mandates.id"))
    buy_side_id = Column(String(36), ForeignKey("buy_side_profiles.id"))
    confidence_score = Column(Float, nullable=False)  # 0.0 to 1.0
    match_rationale = Column(Text)  # AI-generated explanation
    compatibility_factors = Column(JSON)  # Detailed scoring
    status = Column(String(20), default="suggested")  # suggested, contacted, declined, progressing
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

**AI Matching Algorithm**:
```python
# backend/app/services/deal_matching_service.py
from anthropic import AsyncAnthropic
import json

async def generate_deal_matches(
    db: AsyncSession,
    sell_side_id: str,
    organization_id: str
) -> list[DealMatch]:
    """Use Claude 3 to find and score potential matches."""

    # Get sell-side mandate
    sell_side = await get_sell_side_mandate(db, sell_side_id, organization_id)

    # Get all active buy-side profiles
    buy_side_profiles = await get_active_buy_side_profiles(db)

    # Use Claude 3 for intelligent matching
    client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

    prompt = f"""
    Analyze this sell-side company and match it with potential buyers. Return matches as JSON array.

    Sell-Side Company:
    - Industry: {sell_side.industry}
    - Revenue: £{sell_side.revenue:,.0f}
    - EBITDA: £{sell_side.ebitda:,.0f}
    - Geography: {sell_side.geography}
    - Growth Rate: {sell_side.growth_rate*100:.1f}%
    - Strengths: {', '.join(sell_side.key_strengths)}

    Potential Buyers:
    {json.dumps([{
        "id": b.id,
        "name": b.buyer_name,
        "industries": b.target_industries,
        "revenue_range": [b.min_revenue, b.max_revenue],
        "geographies": b.target_geographies,
        "criteria": b.acquisition_criteria
    } for b in buy_side_profiles], indent=2)}

    For each potential match, provide:
    1. confidence_score (0.0-1.0)
    2. match_rationale (2-3 sentences)
    3. compatibility_factors (industry_fit, size_fit, geography_fit, strategic_fit)

    Return JSON: [{{"buyer_id": "...", "confidence_score": 0.85, "match_rationale": "...", "compatibility_factors": {{...}}}}]
    """

    response = await client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=3000,
        messages=[{"role": "user", "content": prompt}]
    )

    matches_data = json.loads(response.content[0].text)

    # Create match records
    matches = []
    for match_data in matches_data:
        if match_data["confidence_score"] >= 0.6:  # Only save high-confidence matches
            match = DealMatch(
                id=str(uuid.uuid4()),
                sell_side_id=sell_side_id,
                buy_side_id=match_data["buyer_id"],
                confidence_score=match_data["confidence_score"],
                match_rationale=match_data["match_rationale"],
                compatibility_factors=match_data["compatibility_factors"],
                status="suggested"
            )
            db.add(match)
            matches.append(match)

    await db.commit()
    return matches
```

**TDD Tests** (~35-45 tests):
- Mandate CRUD
- Buy-side profile CRUD
- AI matching algorithm
- Confidence scoring
- Match status transitions
- API endpoints

**Frontend Components** (~7 components):
- SellSideMandateForm.tsx
- BuySideProfileForm.tsx
- DealMatchesDashboard.tsx
- MatchCard.tsx
- ConfidenceScoreBadge.tsx
- MatchRationaleDisplay.tsx
- MatchNetworkGraph.tsx (use react-force-graph)

**Commit**: `feat(DEV-013): Intelligent Deal Matching with Claude 3 (45 tests)`

---

#### DEV-014: Automated Document Generation (~25-30 hours)

**Priority**: MEDIUM
**Features**:
- Document template library (NDAs, LOIs, Term Sheets, SPAs)
- Multi-jurisdiction support (UK, US, EU)
- AI customization (GPT-4)
- Contract review and risk identification
- Version control and redlining
- Collaborative editing

**Database Models** (3 tables):
```python
# backend/app/models/document_generation.py
class DocumentTemplate(Base):
    __tablename__ = "document_templates"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    category = Column(String(50))  # nda, loi, term_sheet, spa, etc.
    jurisdiction = Column(String(10))  # UK, US, EU
    template_content = Column(Text, nullable=False)  # HTML with placeholders
    required_fields = Column(JSON)  # Field definitions
    is_global = Column(Boolean, default=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneratedDocument(Base):
    __tablename__ = "generated_documents"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id"))
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    template_id = Column(String(36), ForeignKey("document_templates.id"))
    document_name = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    field_values = Column(JSON)  # Filled-in values
    version = Column(Integer, default=1)
    status = Column(String(20), default="draft")  # draft, under_review, finalized
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DocumentReview(Base):
    __tablename__ = "document_reviews"

    id = Column(String(36), primary_key=True)
    document_id = Column(String(36), ForeignKey("generated_documents.id"))
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    ai_analysis = Column(Text)  # GPT-4 risk analysis
    identified_risks = Column(JSON)  # Array of risk objects
    suggested_revisions = Column(JSON)
    reviewed_at = Column(DateTime(timezone=True), server_default=func.now())
```

**AI Document Customization**:
```python
# backend/app/services/document_generation_service.py
from openai import AsyncOpenAI

async def generate_custom_document(
    db: AsyncSession,
    template_id: str,
    deal_id: str,
    field_values: dict,
    organization_id: str
) -> GeneratedDocument:
    """Generate customized legal document using GPT-4."""

    template = await get_template(db, template_id)
    deal = await get_deal(db, deal_id, organization_id)

    # Use GPT-4 to customize template
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    prompt = f"""
    Customize this {template.category} template for the following deal:

    Deal: {deal.name}
    Industry: {deal.industry}
    Deal Size: £{deal.deal_size:,.0f}
    Jurisdiction: {template.jurisdiction}

    Template with placeholders:
    {template.template_content}

    Field Values:
    {json.dumps(field_values, indent=2)}

    Instructions:
    1. Fill in all placeholders with provided values
    2. Suggest appropriate clauses for this industry/deal size
    3. Ensure legal compliance for {template.jurisdiction}
    4. Use professional legal language

    Return the completed document in HTML format.
    """

    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4000
    )

    customized_content = response.choices[0].message.content

    # Create document record
    document = GeneratedDocument(
        id=str(uuid.uuid4()),
        deal_id=deal_id,
        organization_id=organization_id,
        template_id=template_id,
        document_name=f"{template.name} - {deal.name}",
        content=customized_content,
        field_values=field_values,
        version=1,
        status="draft",
        created_by=field_values.get("created_by")
    )

    db.add(document)
    await db.commit()

    return document


async def review_document_for_risks(
    db: AsyncSession,
    document_id: str,
    organization_id: str
) -> DocumentReview:
    """Use GPT-4 to analyze document and identify risks."""

    document = await get_document(db, document_id, organization_id)

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    prompt = f"""
    Review this {document.document_name} for potential legal risks and issues:

    {document.content}

    Provide:
    1. Overall risk assessment (low/medium/high)
    2. List of specific risks or non-standard terms
    3. Suggested revisions or negotiation points
    4. Missing clauses or provisions

    Return as JSON: {{
        "risk_level": "medium",
        "identified_risks": [
            {{"risk": "...", "severity": "high", "location": "Section 3.2"}},
            ...
        ],
        "suggested_revisions": [...],
        "ai_analysis": "Overall summary..."
    }}
    """

    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000
    )

    review_data = json.loads(response.choices[0].message.content)

    review = DocumentReview(
        id=str(uuid.uuid4()),
        document_id=document_id,
        organization_id=organization_id,
        ai_analysis=review_data["ai_analysis"],
        identified_risks=review_data["identified_risks"],
        suggested_revisions=review_data["suggested_revisions"]
    )

    db.add(review)
    await db.commit()

    return review
```

**TDD Tests** (~40-50 tests):
- Template CRUD
- Document generation
- AI customization
- Risk analysis
- Version control
- Redlining
- API endpoints

**Frontend Components** (~8 components):
- DocumentTemplateLibrary.tsx
- DocumentGenerationWizard.tsx
- DocumentEditor.tsx (use react-quill)
- DocumentVersionHistory.tsx
- RiskAnalysisPanel.tsx
- RedlineComparisonView.tsx
- DocumentSignatureWorkflow.tsx
- TemplateBuilder.tsx (admin)

**Commit**: `feat(DEV-014): Automated Document Generation with GPT-4 (50 tests)`

---

#### DEV-015: Content Creation & Lead Generation Hub (~20-25 hours)

**Priority**: MEDIUM
**Features**:
- Content creation studio (email/SMS)
- GoHighLevel integration
- Lead capture forms
- Lead scoring and nurturing
- Content performance analytics
- A/B testing

**Database Models** (4 tables):
```python
# backend/app/models/content_marketing.py
class ContentPiece(Base):
    __tablename__ = "content_pieces"

    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False)
    content_type = Column(String(20))  # email, sms, blog
    content_body = Column(Text, nullable=False)
    author_id = Column(String(36), ForeignKey("users.id"))
    status = Column(String(20), default="draft")  # draft, scheduled, published
    scheduled_for = Column(DateTime(timezone=True))
    published_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Lead(Base):
    __tablename__ = "leads"

    id = Column(String(36), primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    company = Column(String(255))
    phone = Column(String(50))
    source = Column(String(100))  # landing_page, content_download, etc.
    lead_score = Column(Integer, default=0)
    status = Column(String(20), default="new")  # new, nurturing, qualified, converted
    ghl_contact_id = Column(String(100))  # GoHighLevel ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ContentEngagement(Base):
    __tablename__ = "content_engagement"

    id = Column(String(36), primary_key=True)
    content_id = Column(String(36), ForeignKey("content_pieces.id"))
    lead_id = Column(String(36), ForeignKey("leads.id"))
    engagement_type = Column(String(20))  # opened, clicked, replied
    engaged_at = Column(DateTime(timezone=True), server_default=func.now())

class LeadNurturingCampaign(Base):
    __tablename__ = "lead_nurturing_campaigns"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    sequence_steps = Column(JSON)  # Array of email/SMS sequences
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

**GoHighLevel Integration**:
```python
# backend/app/integrations/gohighlevel.py
import httpx

class GoHighLevelClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://rest.gohighlevel.com/v1"

    async def create_contact(self, lead_data: dict) -> dict:
        """Create contact in GoHighLevel."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/contacts",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "email": lead_data["email"],
                    "firstName": lead_data["first_name"],
                    "lastName": lead_data["last_name"],
                    "phone": lead_data.get("phone"),
                    "tags": ["apex-deliver-lead"]
                }
            )
            return response.json()

    async def add_to_campaign(self, contact_id: str, campaign_id: str):
        """Add contact to nurturing campaign."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/campaigns/{campaign_id}/contacts",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"contactId": contact_id}
            )
            return response.json()
```

**TDD Tests** (~30-35 tests):
- Content CRUD
- Lead capture
- Lead scoring
- GoHighLevel sync
- Campaign management
- Analytics
- API endpoints

**Frontend Components** (~7 components):
- ContentStudio.tsx
- ContentEditor.tsx (rich text with markdown)
- LeadsDashboard.tsx
- LeadProfileCard.tsx
- LeadScoringDisplay.tsx
- CampaignBuilder.tsx
- ContentAnalytics.tsx (charts with recharts)

**Commit**: `feat(DEV-015): Content Creation & Lead Generation Hub (35 tests)`

---

### PHASE 3: ECOSYSTEM & NETWORK EFFECTS (Months 7-12) - 3 Features

#### DEV-016: Podcast & Video Production Studio (~30-35 hours)

**Priority**: LOWER
**Features**:
- Audio recording interface
- Basic editing (trim, fade, noise reduction)
- Whisper transcription integration
- RSS feed generation
- YouTube video upload
- Show notes and timestamps

**Database Models** (3 tables):
```python
# backend/app/models/podcast.py
class PodcastEpisode(Base):
    __tablename__ = "podcast_episodes"

    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    episode_number = Column(Integer)
    season_number = Column(Integer, default=1)
    audio_file_url = Column(String(500))  # S3/CloudFlare R2 URL
    video_file_url = Column(String(500))
    duration_seconds = Column(Integer)
    transcript = Column(Text)  # Whisper-generated
    show_notes = Column(Text)
    status = Column(String(20), default="draft")  # draft, processing, published
    published_at = Column(DateTime(timezone=True))
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PodcastTranscript(Base):
    __tablename__ = "podcast_transcripts"

    id = Column(String(36), primary_key=True)
    episode_id = Column(String(36), ForeignKey("podcast_episodes.id"))
    transcript_text = Column(Text, nullable=False)
    timestamps = Column(JSON)  # Array of {time, text}
    language = Column(String(10), default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PodcastAnalytics(Base):
    __tablename__ = "podcast_analytics"

    id = Column(String(36), primary_key=True)
    episode_id = Column(String(36), ForeignKey("podcast_episodes.id"))
    listens = Column(Integer, default=0)
    downloads = Column(Integer, default=0)
    average_listen_duration = Column(Integer)  # seconds
    platform = Column(String(50))  # spotify, apple, youtube, etc.
    date = Column(Date, nullable=False)
```

**Whisper Integration**:
```python
# backend/app/services/podcast_service.py
from openai import AsyncOpenAI

async def transcribe_episode(
    db: AsyncSession,
    episode_id: str,
    audio_file_path: str
) -> PodcastTranscript:
    """Transcribe podcast episode using Whisper."""

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    with open(audio_file_path, "rb") as audio_file:
        transcript = await client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json",
            timestamp_granularities=["segment"]
        )

    # Store transcript
    transcript_record = PodcastTranscript(
        id=str(uuid.uuid4()),
        episode_id=episode_id,
        transcript_text=transcript.text,
        timestamps=[{
            "time": segment.start,
            "text": segment.text
        } for segment in transcript.segments]
    )

    db.add(transcript_record)
    await db.commit()

    return transcript_record
```

**TDD Tests** (~35-45 tests)
**Frontend Components** (~9 components)
**Commit**: `feat(DEV-016): Podcast & Video Production Studio (45 tests)`

---

#### DEV-017: Event Management Hub (~30-35 hours)

**Priority**: LOWER
**Features**:
- Event creation (forums, summits, masterclasses)
- Ticket sales with Stripe
- Registration management
- Virtual event streaming integration (Zoom/StreamYard)
- In-person check-in and badging
- Event analytics

**Database Models** (5 tables):
```python
# backend/app/models/events.py
class Event(Base):
    __tablename__ = "events"

    id = Column(String(36), primary_key=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    event_type = Column(String(20))  # forum, summit, masterclass, webinar
    format = Column(String(20))  # virtual, in_person, hybrid
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True))
    location = Column(String(255))
    max_attendees = Column(Integer)
    status = Column(String(20), default="draft")  # draft, published, cancelled, completed
    cover_image_url = Column(String(500))
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EventTicket(Base):
    __tablename__ = "event_tickets"

    id = Column(String(36), primary_key=True)
    event_id = Column(String(36), ForeignKey("events.id"))
    tier_name = Column(String(100), nullable=False)  # Early Bird, Standard, VIP
    price = Column(Float, nullable=False)
    quantity_available = Column(Integer)
    quantity_sold = Column(Integer, default=0)
    benefits = Column(JSON)  # Array of included benefits
    sale_start_date = Column(DateTime(timezone=True))
    sale_end_date = Column(DateTime(timezone=True))

class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(String(36), primary_key=True)
    event_id = Column(String(36), ForeignKey("events.id"))
    ticket_id = Column(String(36), ForeignKey("event_tickets.id"))
    attendee_name = Column(String(255), nullable=False)
    attendee_email = Column(String(255), nullable=False)
    attendee_phone = Column(String(50))
    organization_name = Column(String(255))
    stripe_payment_intent_id = Column(String(100))
    amount_paid = Column(Float)
    status = Column(String(20), default="pending")  # pending, confirmed, cancelled, attended
    checked_in_at = Column(DateTime(timezone=True))
    registered_at = Column(DateTime(timezone=True), server_default=func.now())
```

**TDD Tests** (~40-50 tests)
**Frontend Components** (~10 components)
**Commit**: `feat(DEV-017): Event Management Hub with Stripe tickets (50 tests)`

---

#### DEV-018: Professional Community Platform (~35-40 hours)

**Priority**: LOWER
**Features**:
- User profiles and connections
- Discussion forums
- Special interest groups
- Direct messaging
- Content sharing
- Community moderation tools

**Database Models** (6 tables):
```python
# backend/app/models/community.py
class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True)
    bio = Column(Text)
    headline = Column(String(255))
    avatar_url = Column(String(500))
    linkedin_url = Column(String(500))
    twitter_handle = Column(String(100))
    expertise_areas = Column(JSON)  # Array of strings
    is_public = Column(Boolean, default=True)

class UserConnection(Base):
    __tablename__ = "user_connections"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    connected_user_id = Column(String(36), ForeignKey("users.id"))
    status = Column(String(20), default="pending")  # pending, accepted, declined
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DiscussionForum(Base):
    __tablename__ = "discussion_forums"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(50))
    is_private = Column(Boolean, default=False)
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ForumPost(Base):
    __tablename__ = "forum_posts"

    id = Column(String(36), primary_key=True)
    forum_id = Column(String(36), ForeignKey("discussion_forums.id"))
    author_id = Column(String(36), ForeignKey("users.id"))
    title = Column(String(255))
    content = Column(Text, nullable=False)
    is_pinned = Column(Boolean, default=False)
    upvotes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DirectMessage(Base):
    __tablename__ = "direct_messages"

    id = Column(String(36), primary_key=True)
    sender_id = Column(String(36), ForeignKey("users.id"))
    recipient_id = Column(String(36), ForeignKey("users.id"))
    message_text = Column(Text, nullable=False)
    read_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

**TDD Tests** (~45-55 tests)
**Frontend Components** (~12 components)
**Commit**: `feat(DEV-018): Professional Community Platform (55 tests)`

---

## 🎯 Implementation Order & Dependencies

**Recommended sequence for maximum efficiency**:

1. **DEV-011** (18-20h) - Complete Phase 1, enables revenue
2. **DEV-012** (20-25h) - Task management supports all other features
3. **DEV-013** (25-30h) - Deal matching drives engagement
4. **DEV-014** (25-30h) - Document generation high-value feature
5. **DEV-015** (20-25h) - Content/leads drives top-of-funnel
6. **DEV-016** (30-35h) - Podcast studio content marketing
7. **DEV-017** (30-35h) - Event management revenue stream
8. **DEV-018** (35-40h) - Community platform network effects

**Total Estimated Time**: 200-250 hours (~6-8 weeks at 40h/week)

---

## 📈 Testing Strategy

### Test Coverage Goals
- **Backend**: ≥90% code coverage
- **Frontend**: ≥85% code coverage
- **Total Tests Expected**: ~2,000-2,500 tests

### Test Pyramid
```
      /\        E2E Tests (50-75)
     /  \       Integration Tests (200-300)
    /    \      Unit Tests (1,750-2,125)
   /______\
```

### Running Tests
```bash
# Backend - Run all tests
cd backend
pytest -v

# Backend - Run with coverage
pytest --cov=app --cov-report=html

# Frontend - Run all tests
cd frontend
npm test

# Frontend - Run with coverage
npm test -- --coverage

# E2E Tests (Playwright)
cd frontend
npm run test:e2e
```

---

## 🚀 Deployment Strategy

### Alembic Migrations
```bash
# Create migration for each feature
cd backend
alembic revision --autogenerate -m "Add {feature} tables"
alembic upgrade head

# Verify migration
alembic current
alembic history
```

### Render Deployment
```bash
# Backend will auto-deploy on push to main
# Ensure environment variables are set in Render dashboard

# Frontend will auto-deploy on push to main
# Build command: npm run build
# Publish directory: dist
```

### Environment Variables Checklist
```bash
# Backend (.env)
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
STRIPE_SECRET_KEY=sk_...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOHIGHLEVEL_API_KEY=...
REDIS_URL=redis://...

# Frontend (.env)
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_API_URL=https://ma-saas-backend.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

---

## 📝 Documentation Requirements

### After Each Feature Completion:

1. **Update Story File**:
```markdown
# docs/bmad/stories/DEV-{number}-{feature-name}.md

**Status**: ✅ 100% COMPLETE
**Completed**: {date}
**Tests**: {backend_tests} backend + {frontend_tests} frontend = {total} total
**Coverage**: Backend {coverage}% • Frontend {coverage}%
```

2. **Update BMAD Tracker**:
```markdown
# docs/bmad/BMAD_PROGRESS_TRACKER.md

**Sprint {N} Status**: ✅ 100% COMPLETE - DEV-{number} {Feature Name} ✅
(Backend {tests} • Frontend {tests} • Total {tests} tests passing)
```

3. **Commit Message Format**:
```bash
git commit -m "feat(DEV-{number}): complete {Feature Name}

- Feature 1 description
- Feature 2 description
- Full test coverage: {backend} backend + {frontend} frontend tests

Closes DEV-{number}"
```

---

## ✅ Success Criteria for 100% Completion

### Technical Criteria
- ✅ All 13 features implemented (DEV-011 through DEV-018)
- ✅ 2,000-2,500 tests passing (100% pass rate)
- ✅ Backend coverage ≥90%
- ✅ Frontend coverage ≥85%
- ✅ All Alembic migrations applied
- ✅ Backend deployed to Render (healthy status)
- ✅ Frontend deployed to Render (accessible)
- ✅ All environment variables configured
- ✅ No critical bugs or security issues

### Functional Criteria
- ✅ All Phase 1 features production-ready
- ✅ All Phase 2 features production-ready
- ✅ All Phase 3 features production-ready
- ✅ All subscription tiers functional
- ✅ Stripe payments working (test + live mode)
- ✅ All AI integrations operational (GPT-4, Claude 3, Whisper)
- ✅ All third-party integrations working (Xero, QuickBooks, GoHighLevel)

### Documentation Criteria
- ✅ All story files updated to 100%
- ✅ BMAD tracker fully updated
- ✅ All commits follow conventional commits
- ✅ API documentation complete (FastAPI auto-docs)
- ✅ README.md updated with new features

### Business Criteria
- ✅ Platform ready for paying customers
- ✅ All 4 subscription tiers configurable
- ✅ Billing and invoicing operational
- ✅ Admin portal functional for platform management
- ✅ Marketing website live with accurate feature descriptions

---

## 🤝 Handoff to Claude Code (Post-CODEX)

### When You're Done:

1. **Final Commit**:
```bash
git add .
git commit -m "feat(COMPLETE): M&A Intelligence Platform 100% implementation

CODEX autonomous implementation complete:
- Phase 1: DEV-011 Multi-Method Valuation Suite ✅
- Phase 2: DEV-012 (Tasks), DEV-013 (Matching), DEV-014 (Docs), DEV-015 (Content) ✅
- Phase 3: DEV-016 (Podcast), DEV-017 (Events), DEV-018 (Community) ✅

Test Results:
- Backend: {backend_tests}/{backend_tests} passing ({coverage}% coverage)
- Frontend: {frontend_tests}/{frontend_tests} passing ({coverage}% coverage)
- Total: {total_tests}/{total_tests} passing (100% pass rate)

All features production-deployed to Render.
Platform ready for £279-£2,997/month paying customers.

HANDOFF: Ready for Claude Code final review and polish."

git push origin main
```

2. **Create Handoff Summary**:
```markdown
# CODEX-COMPLETION-SUMMARY.md

## Implementation Complete

**Duration**: {X} hours over {Y} days
**Features Delivered**: 13 (DEV-011 through DEV-018)
**Tests Written**: {total_tests}
**Code Coverage**: Backend {backend_coverage}% • Frontend {frontend_coverage}%
**Deployment Status**: ✅ Production-ready on Render

## What Claude Code Should Review:

1. **Code Quality**: Refactoring opportunities, dead code removal
2. **Security**: Final security audit, penetration testing prep
3. **Performance**: Load testing, optimization opportunities
4. **UX Polish**: Frontend responsiveness, accessibility (WCAG 2.1)
5. **Documentation**: User guides, API docs completeness
6. **Error Handling**: Edge cases, user-friendly error messages
7. **Monitoring**: Sentry alerts, Datadog dashboards

## Known Issues / Limitations:

{List any known issues, technical debt, or limitations}

## Recommendations:

{Suggested improvements, future enhancements, or optimizations}
```

3. **Update BMAD Tracker**:
```markdown
**Project Phase**: 🎉 100% COMPLETE - Ready for Launch
**Total Tests**: {total_tests}/{total_tests} passing (100% pass rate)
**Deployment Status**: ✅ Backend & Frontend production-ready
**Next Steps**: Claude Code final review → Launch preparation
```

---

## 💡 Tips for Success

### TDD Discipline
- **Always write tests first** (RED phase)
- **Run tests frequently** - after every function
- **Keep tests green** - never commit failing tests
- **Refactor with confidence** - tests protect you

### Code Quality
- **Type hints everywhere** (Python) and **TypeScript types** (frontend)
- **Comprehensive docstrings** - explain why, not just what
- **DRY principle** - extract reusable functions
- **SOLID principles** - especially single responsibility

### Git Workflow
- **Commit frequently** - small, logical commits
- **Meaningful messages** - follow conventional commits
- **Push regularly** - don't let branches diverge
- **Feature branches** optional but recommended for large features

### Performance
- **Database indexes** - on foreign keys and frequently queried fields
- **Async everywhere** - backend I/O operations
- **React Query caching** - minimize API calls
- **Lazy loading** - code splitting for large components

### Security
- **Multi-tenant enforcement** - organization_id on all queries
- **Input validation** - Pydantic schemas everywhere
- **SQL injection prevention** - use SQLAlchemy ORM, no raw SQL
- **XSS prevention** - React's automatic escaping, sanitize HTML

---

## 📚 Reference Documentation

### Internal Docs
- **PRD**: `docs/bmad/prd.md` - Full product requirements
- **Architecture**: `docs/bmad/architecture.md` - System design
- **CLAUDE.md**: Project conventions and patterns
- **Story Files**: `docs/bmad/stories/DEV-*.md` - Feature specifications

### External APIs
- **OpenAI**: https://platform.openai.com/docs
- **Anthropic**: https://docs.anthropic.com
- **Stripe**: https://stripe.com/docs/api
- **Clerk**: https://clerk.com/docs
- **GoHighLevel**: https://highlevel.stoplight.io/docs/integrations

### Libraries
- **FastAPI**: https://fastapi.tiangolo.com
- **SQLAlchemy**: https://docs.sqlalchemy.org/en/20/
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Good luck with the implementation! You've got this. 🚀**

**Remember**: Time and scope are not constraints. The goal is 100% completion with production-quality code. Take the time to do it right.

**When you're done**: Update this file with your completion summary, commit everything, and hand off to Claude Code for final review.

---

**End of CODEX Complete Project Implementation Guide**
