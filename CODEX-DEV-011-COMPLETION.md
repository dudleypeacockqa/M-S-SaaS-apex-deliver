# CODEX Implementation Guide: DEV-011 Multi-Method Valuation Suite

**Target**: Complete DEV-011 from 18% → 100%
**Methodology**: BMAD v6-alpha + Strict TDD (RED → GREEN → REFACTOR)
**Handoff to**: Claude Code (for final review, polish, deployment)
**Created**: October 27, 2025
**Context**: Full autonomous implementation guide

---

## 🎯 Mission Statement

Complete DEV-011 Multi-Method Valuation Suite following strict Test-Driven Development. You (CODEX) will implement Phases 2.3-6 (82% of remaining work), then hand off to Claude Code for final review, integration testing, and production deployment.

**Success Criteria**: ~270-290 tests passing (100% pass rate), ≥90% backend coverage, ≥85% frontend coverage, production deployment ready.

---

## 📊 Current Status (18% Complete)

### ✅ Completed by Claude Code

**Phase 1: Backend DCF Engine** (100% - Commit `47237e2`)
- 10 DCF calculation tests (all passing)
- 6 functions in `backend/app/services/valuation_service.py`:
  - `calculate_dcf_present_value()`
  - `calculate_terminal_value_gordon_growth()`
  - `calculate_terminal_value_exit_multiple()`
  - `calculate_enterprise_value_dcf()`
  - `generate_sensitivity_matrix()`
  - `_calculate_discount_factor()`

**Phase 2.1: Database Migration** (100% - Commit `03c463c`)
- Migration: `658051b7d4f9_add_valuation_tables_for_dev_011.py`
- 5 tables: valuations, valuation_scenarios, comparable_companies, precedent_transactions, valuation_export_logs

**Phase 2.2: Pydantic Schemas** (100% - Commit `03c463c`)
- File: `backend/app/schemas/valuation.py` (345 lines)
- 13 schemas: ValuationCreate/Update/Response, ScenarioCreate/Response, ComparableCompanyCreate/Update/Response, PrecedentTransactionCreate/Update/Response, MultiplesAnalysis, MultiplesAnalysisResponse

**Phase 2.3: Service Layer RED Tests** (50% - Commit `d78fe5c`)
- File: `backend/tests/test_valuation_crud.py` (17 tests)
- Status: RED phase complete (tests fail as expected)
- **YOUR TASK**: Implement GREEN phase (make tests pass)

### ⏳ Your Remaining Work (82%)

- **Phase 2.3 GREEN**: Service layer implementation (~2 hours)
- **Phase 2.4**: API endpoints with TDD (~1.5 hours)
- **Phase 3**: Scenario management & Monte Carlo (~3-4 hours)
- **Phase 4**: Frontend workspace (~5-6 hours)
- **Phase 5**: Exports (PDF/Excel) (~2-3 hours)
- **Phase 6**: Integration testing (~2-3 hours)

---

## 🚀 Phase 2.3 GREEN: Implement Service Functions

### Objective
Implement CRUD functions in `backend/app/services/valuation_service.py` to pass the 17 RED tests.

### Functions to Implement

Add these functions to the END of `valuation_service.py`:

```python
# ============================================================================
# CRUD Operations for Valuations (Phase 2.3 - GREEN)
# ============================================================================

async def create_valuation(
    db: AsyncSession,
    deal_id: str,
    organization_id: str,
    created_by: str,
    forecast_years: int,
    discount_rate: float,
    terminal_growth_rate: Optional[float],
    terminal_method: str,
    cash_flows: List[float],
    terminal_cash_flow: float,
    net_debt: float = 0.0,
    shares_outstanding: Optional[float] = None,
    terminal_ebitda_multiple: Optional[float] = None,
) -> ValuationModel:
    """Create DCF valuation with calculated enterprise/equity values."""
    # Calculate enterprise value
    if terminal_method == "gordon_growth":
        ev = calculate_enterprise_value_dcf(
            cash_flows, terminal_cash_flow, discount_rate, terminal_growth_rate
        )
    else:  # exit_multiple
        pv_cash_flows = calculate_dcf_present_value(cash_flows, discount_rate)
        terminal_value = calculate_terminal_value_exit_multiple(
            terminal_cash_flow, terminal_ebitda_multiple
        )
        pv_terminal = terminal_value / _calculate_discount_factor(
            discount_rate, len(cash_flows)
        )
        ev = pv_cash_flows + pv_terminal

    equity_value = float(ev) - net_debt
    share_price = equity_value / shares_outstanding if shares_outstanding else None

    valuation = ValuationModel(
        id=str(uuid.uuid4()),
        deal_id=deal_id,
        organization_id=organization_id,
        created_by=created_by,
        forecast_years=forecast_years,
        discount_rate=discount_rate,
        terminal_growth_rate=terminal_growth_rate,
        terminal_ebitda_multiple=terminal_ebitda_multiple,
        terminal_method=terminal_method,
        cash_flows=cash_flows,
        terminal_cash_flow=terminal_cash_flow,
        enterprise_value=float(ev),
        equity_value=equity_value,
        implied_share_price=share_price,
        net_debt=net_debt,
        shares_outstanding=shares_outstanding,
    )

    db.add(valuation)
    await db.commit()
    await db.refresh(valuation)
    return valuation


async def get_valuation(
    db: AsyncSession, valuation_id: str, organization_id: str
) -> Optional[ValuationModel]:
    """Get valuation with multi-tenant check."""
    result = await db.execute(
        select(ValuationModel).where(
            ValuationModel.id == valuation_id,
            ValuationModel.organization_id == organization_id,
        )
    )
    return result.scalar_one_or_none()


async def update_valuation(
    db: AsyncSession, valuation_id: str, organization_id: str, **updates
) -> ValuationModel:
    """Update valuation and recalculate values."""
    valuation = await get_valuation(db, valuation_id, organization_id)
    if not valuation:
        raise ValueError("Valuation not found")

    for key, value in updates.items():
        if value is not None and hasattr(valuation, key):
            setattr(valuation, key, value)

    # Recalculate enterprise value
    if valuation.terminal_method == "gordon_growth":
        ev = calculate_enterprise_value_dcf(
            valuation.cash_flows,
            valuation.terminal_cash_flow,
            valuation.discount_rate,
            valuation.terminal_growth_rate,
        )
    else:
        pv_cf = calculate_dcf_present_value(valuation.cash_flows, valuation.discount_rate)
        tv = calculate_terminal_value_exit_multiple(
            valuation.terminal_cash_flow, valuation.terminal_ebitda_multiple
        )
        pv_tv = tv / _calculate_discount_factor(valuation.discount_rate, len(valuation.cash_flows))
        ev = pv_cf + pv_tv

    valuation.enterprise_value = float(ev)
    valuation.equity_value = valuation.enterprise_value - valuation.net_debt

    if valuation.shares_outstanding:
        valuation.implied_share_price = valuation.equity_value / valuation.shares_outstanding

    await db.commit()
    await db.refresh(valuation)
    return valuation


async def delete_valuation(
    db: AsyncSession, valuation_id: str, organization_id: str
) -> bool:
    """Delete valuation (cascades to comparables/precedents)."""
    valuation = await get_valuation(db, valuation_id, organization_id)
    if not valuation:
        return False
    await db.delete(valuation)
    await db.commit()
    return True


async def add_comparable(
    db: AsyncSession, valuation_id: str, organization_id: str, company_name: str, **data
) -> ComparableCompany:
    """Add comparable company."""
    comp = ComparableCompany(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        company_name=company_name,
        **data,
    )
    db.add(comp)
    await db.commit()
    await db.refresh(comp)
    return comp


async def calculate_comparable_multiples(
    db: AsyncSession, valuation_id: str, organization_id: str
) -> Dict:
    """Calculate min/median/max multiples from comparables."""
    result = await db.execute(
        select(ComparableCompany).where(
            ComparableCompany.valuation_id == valuation_id,
            ComparableCompany.organization_id == organization_id,
            ComparableCompany.is_outlier == "false",
        )
    )
    comps = result.scalars().all()

    multiples = {}
    ev_ebitda = [c.ev_ebitda_multiple for c in comps if c.ev_ebitda_multiple]
    if ev_ebitda:
        ev_ebitda.sort()
        multiples["ev_ebitda"] = {
            "min": min(ev_ebitda),
            "max": max(ev_ebitda),
            "median": ev_ebitda[len(ev_ebitda) // 2],
            "mean": sum(ev_ebitda) / len(ev_ebitda),
        }
    return multiples


async def add_precedent_transaction(
    db: AsyncSession,
    valuation_id: str,
    organization_id: str,
    target_company: str,
    acquirer_company: str,
    **data,
) -> PrecedentTransaction:
    """Add precedent transaction."""
    txn = PrecedentTransaction(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        target_company=target_company,
        acquirer_company=acquirer_company,
        **data,
    )
    db.add(txn)
    await db.commit()
    await db.refresh(txn)
    return txn


async def calculate_precedent_multiples(
    db: AsyncSession, valuation_id: str, organization_id: str
) -> Dict:
    """Calculate min/median/max multiples from precedents."""
    result = await db.execute(
        select(PrecedentTransaction).where(
            PrecedentTransaction.valuation_id == valuation_id,
            PrecedentTransaction.organization_id == organization_id,
            PrecedentTransaction.is_stale == "false",
        )
    )
    txns = result.scalars().all()

    multiples = {}
    ev_ebitda = [t.ev_ebitda_multiple for t in txns if t.ev_ebitda_multiple]
    if ev_ebitda:
        ev_ebitda.sort()
        multiples["ev_ebitda"] = {
            "min": min(ev_ebitda),
            "max": max(ev_ebitda),
            "median": ev_ebitda[len(ev_ebitda) // 2],
            "mean": sum(ev_ebitda) / len(ev_ebitda),
        }
    return multiples
```

### Verification Steps

```bash
cd backend
pytest tests/test_valuation_crud.py -v

# Expected: 17/17 tests passing
# If any fail, debug and fix until all pass
```

### Commit After GREEN

```bash
git add backend/app/services/valuation_service.py
git commit -m "feat(valuation): Phase 2.3 GREEN - implement service layer (17 tests passing)"
git push origin main
```

---

## 🚀 Phase 2.4: API Endpoints with TDD (~1.5 hours)

### Step 1: Write RED Tests

Create `backend/tests/test_valuation_api.py`:

```python
"""TDD tests for valuation API endpoints (RED phase)."""

import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_valuation_endpoint(client: AsyncClient, auth_headers):
    """Test POST /api/deals/{deal_id}/valuation."""
    response = await client.post(
        f"/api/deals/{DEAL_ID}/valuation",
        json={
            "forecast_years": 5,
            "discount_rate": 0.12,
            "terminal_growth_rate": 0.03,
            "terminal_method": "gordon_growth",
            "cash_flows": [500000, 650000, 800000, 950000, 1100000],
            "terminal_cash_flow": 1200000,
            "net_debt": 2000000,
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert "enterprise_value" in data
    assert data["enterprise_value"] > 0

@pytest.mark.asyncio
async def test_get_valuation_endpoint(client: AsyncClient, auth_headers):
    """Test GET /api/deals/{deal_id}/valuation/{valuation_id}."""
    # Create valuation first
    create_response = await client.post(...)
    valuation_id = create_response.json()["id"]

    response = await client.get(
        f"/api/deals/{DEAL_ID}/valuation/{valuation_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["id"] == valuation_id

# Add 10-15 more tests for:
# - PUT update valuation
# - DELETE valuation
# - POST add comparable
# - GET list comparables
# - POST add precedent
# - GET list precedents
# - Multi-tenant security (403 for wrong org)
# - RBAC (403 for Starter tier)
```

Run tests (should fail):
```bash
pytest tests/test_valuation_api.py -v
```

### Step 2: Implement API Routes (GREEN)

Create `backend/app/api/routes/valuation.py`:

```python
"""API endpoints for DEV-011 valuation operations."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user
from app.models import User
from app.schemas.valuation import (
    ValuationCreate,
    ValuationResponse,
    ComparableCompanyCreate,
    ComparableCompanyResponse,
    PrecedentTransactionCreate,
    PrecedentTransactionResponse,
)
from app.services import valuation_service

router = APIRouter()


@router.post("/deals/{deal_id}/valuation", response_model=ValuationResponse, status_code=201)
async def create_valuation(
    deal_id: str,
    valuation: ValuationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new DCF valuation for a deal."""
    # Multi-tenant check: verify deal belongs to user's org
    # RBAC check: require Professional+ tier

    created = await valuation_service.create_valuation(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        **valuation.dict(),
    )
    return created


@router.get("/deals/{deal_id}/valuation/{valuation_id}", response_model=ValuationResponse)
async def get_valuation(
    deal_id: str,
    valuation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a valuation by ID."""
    val = await valuation_service.get_valuation(
        db, valuation_id, current_user.organization_id
    )
    if not val:
        raise HTTPException(status_code=404, detail="Valuation not found")
    return val


# Add remaining endpoints:
# PUT /deals/{deal_id}/valuation/{valuation_id}
# DELETE /deals/{deal_id}/valuation/{valuation_id}
# POST /deals/{deal_id}/valuation/{valuation_id}/comparables
# GET /deals/{deal_id}/valuation/{valuation_id}/comparables
# POST /deals/{deal_id}/valuation/{valuation_id}/precedents
# GET /deals/{deal_id}/valuation/{valuation_id}/precedents
```

Register router in `backend/app/api/main.py`:
```python
from app.api.routes import valuation

app.include_router(valuation.router, prefix="/api", tags=["valuation"])
```

### Step 3: Verify and Commit

```bash
pytest tests/test_valuation_api.py -v  # Should pass 10-15 tests
git add backend/app/api/routes/valuation.py backend/tests/test_valuation_api.py
git commit -m "feat(valuation): Phase 2.4 - API endpoints with TDD (10-15 tests passing)"
```

---

## 🚀 Phase 3: Scenario Management & Monte Carlo (~3-4 hours)

### Implementation Plan

1. **Add scenario functions to `valuation_service.py`**:
   - `create_scenario()` - Create Base/Upside/Downside scenarios
   - `calculate_scenario_ev()` - Recalculate with overrides
   - `compare_scenarios()` - Side-by-side comparison
   - `generate_tornado_data()` - Top 5 value drivers
   - `run_monte_carlo_simulation()` - Probabilistic analysis (NumPy)

2. **Install NumPy**: `pip install numpy` (add to requirements.txt)

3. **Write TDD tests** (`test_valuation_scenarios.py`):
   - Scenario creation with assumption overrides
   - EV calculation per scenario
   - Tornado chart data structure
   - Monte Carlo with seeded random (deterministic tests)

4. **API endpoints**:
   - POST `/deals/{deal_id}/valuation/{valuation_id}/scenarios`
   - GET `/deals/{deal_id}/valuation/{valuation_id}/scenarios`
   - GET `/deals/{deal_id}/valuation/{valuation_id}/tornado`
   - POST `/deals/{deal_id}/valuation/{valuation_id}/monte-carlo`

**Expected**: 12-15 new tests passing

---

## 🚀 Phase 4: Frontend Valuation Workspace (~5-6 hours)

### Component Structure

```
frontend/src/pages/deals/
├── ValuationSuite.tsx           # Main workspace with tabs
├── ValuationSuite.test.tsx      # Tests
├── components/
    ├── DCFInputForm.tsx         # Cash flows, discount rate
    ├── DCFResults.tsx           # EV, equity value display
    ├── SensitivityMatrix.tsx    # WACC/growth table
    ├── ComparablesTable.tsx     # Add/edit comparables
    ├── PrecedentTransactionsTable.tsx
    ├── ScenarioManager.tsx      # Create scenarios
    ├── TornadoChart.tsx         # Chart.js visualization
    └── MonteCarloResults.tsx    # Simulation summary
```

### Implementation Approach

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install chart.js react-chartjs-2
   ```

2. **For each component**:
   - Write RED tests first (`*.test.tsx`)
   - Implement component (GREEN)
   - Verify tests pass
   - Commit

3. **TailwindCSS patterns** (match existing components):
   - Use `bg-white rounded-lg shadow p-6` for cards
   - Use `text-2xl font-bold` for headings
   - Use `grid grid-cols-1 md:grid-cols-2 gap-4` for layouts

4. **React Query integration**:
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ['valuation', dealId],
     queryFn: () => fetchValuation(dealId),
   });
   ```

**Expected**: 20-30 new frontend tests passing

---

## 🚀 Phase 5: Reporting & Exports (~2-3 hours)

### Implementation

1. **Install dependencies**:
   ```bash
   cd backend
   pip install weasyprint pandas openpyxl
   ```

2. **Create export service** (`backend/app/services/valuation_export_service.py`):
   - `export_to_pdf()` - HTML template → PDF
   - `export_to_excel()` - Multi-sheet workbook (Pandas)
   - `generate_executive_summary()` - GPT-4 summary
   - `log_export()` - Create ValuationExportLog
   - `link_to_document_room()` - Create Document entry

3. **HTML template** (`backend/templates/valuation_report.html`):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <style>
           /* Professional PDF styling */
       </style>
   </head>
   <body>
       <div class="cover-page">
           <h1>Valuation Report</h1>
           <p>{{ deal_name }}</p>
       </div>
       <div class="dcf-section">
           <!-- DCF summary -->
       </div>
       <!-- Comparables, Precedents, Scenarios sections -->
   </body>
   </html>
   ```

4. **API endpoints**:
   - POST `/deals/{deal_id}/valuation/{valuation_id}/export/pdf`
   - POST `/deals/{deal_id}/valuation/{valuation_id}/export/excel`
   - GET `/deals/{deal_id}/valuation/{valuation_id}/exports` - List exports

5. **Frontend**: Export button, progress indicator, download link

**Expected**: 8-12 new tests passing

---

## 🚀 Phase 6: Integration Testing & Final Verification (~2-3 hours)

### Checklist

1. **Run all test suites**:
   ```bash
   # Backend
   cd backend
   pytest --cov=app --cov-report=term-missing
   # Target: ≥90% coverage, ~220-240 tests passing

   # Frontend
   cd frontend
   npm test
   # Target: ≥85% coverage, ~50-60 tests passing
   ```

2. **End-to-End smoke test**:
   - Create deal
   - Create valuation with DCF assumptions
   - Add 3 comparables
   - Add 2 precedent transactions
   - Calculate multiples
   - Create 3 scenarios (Base, Upside, Downside)
   - Run Monte Carlo simulation
   - Export to PDF
   - Export to Excel
   - Verify exports in document room

3. **Multi-tenant isolation test**:
   - Create 2 orgs, verify data isolation
   - Attempt cross-org access (should fail)

4. **RBAC test**:
   - Starter tier: verify 403 on valuation endpoints
   - Professional+ tier: verify full access

5. **Final commits**:
   ```bash
   git add .
   git commit -m "feat(valuation): Phase 6 - Complete DEV-011 integration testing"
   git push origin main
   ```

---

## 📋 Handoff to Claude Code

### What You (CODEX) Completed

- ✅ Phase 2.3-2.4: Service layer + API endpoints (~25-30 tests)
- ✅ Phase 3: Scenario management + Monte Carlo (~12-15 tests)
- ✅ Phase 4: Frontend valuation workspace (~20-30 tests)
- ✅ Phase 5: PDF/Excel exports (~8-12 tests)
- ✅ Phase 6: Integration testing (verified ~270-290 total tests passing)

**Total: ~65-87 new tests, all passing**

### What Claude Code Will Do

1. **Final Code Review**:
   - Review all CODEX implementations
   - Check for edge cases, error handling
   - Verify type safety and code quality
   - Refactor if needed (REFACTOR phase of TDD)

2. **Documentation**:
   - Update DEV-011 story to 100% complete
   - Add Sprint 5 completion summary to BMAD_PROGRESS_TRACKER.md
   - Update API documentation (FastAPI auto-docs)

3. **Production Deployment**:
   - Apply Alembic migration to production database
   - Deploy to Render (auto-deploy from main)
   - Verify health endpoints
   - Run smoke tests in production

4. **Final Verification**:
   - Confirm all tests passing
   - Verify coverage targets met
   - Check monitoring/error tracking
   - Mark DEV-011 as 100% complete

---

## 🛠️ Technical Reference

### Key Commands

```bash
# Backend testing
cd backend
pytest tests/test_valuation_service.py -v        # 10 DCF tests
pytest tests/test_valuation_crud.py -v           # 17 CRUD tests
pytest tests/test_valuation_api.py -v            # 10-15 API tests
pytest tests/test_valuation_scenarios.py -v      # 12-15 scenario tests
pytest tests/test_valuation_exports.py -v        # 8-12 export tests
pytest --cov=app                                 # Full suite with coverage

# Frontend testing
cd frontend
npm test -- --run src/pages/deals/ValuationSuite.test.tsx
npm test -- --coverage

# Database
cd backend
alembic upgrade head                             # Apply migrations
```

### Multi-Tenant Security Pattern

```python
# Always check organization_id
valuation = await db.execute(
    select(ValuationModel).where(
        ValuationModel.id == valuation_id,
        ValuationModel.organization_id == current_user.organization_id,  # CRITICAL
    )
)
```

### RBAC Pattern

```python
from app.core.rbac import require_min_role

@router.post(...)
@require_min_role("professional")  # Block Starter tier
async def create_valuation(...):
    pass
```

---

## 📊 Success Metrics

### Test Targets

- Backend: ~220-240 tests passing (94 existing + 130-146 new)
- Frontend: ~50-60 tests passing (33 existing + 17-27 new)
- **Total: ~270-300 tests** (100% pass rate)

### Coverage Targets

- Backend valuation modules: ≥90%
- Frontend valuation components: ≥85%

### Performance Targets

- DCF calculation: <150ms
- Monte Carlo (100 iterations): <1s
- PDF export: <3s
- Excel export: <2s

---

## 🚨 Common Issues & Solutions

### Issue: AsyncSession vs Session
**Solution**: Use `AsyncSession` throughout, `await` all DB operations

### Issue: Import errors
**Solution**: Ensure all models/schemas imported at top of file

### Issue: Test database
**Solution**: Use SQLite for tests (configured in `conftest.py`)

### Issue: Frontend tests timing out
**Solution**: Use `waitFor()` for async operations in tests

### Issue: Decimal vs Float
**Solution**: Financial calculations use Decimal, DB stores Float

---

## 📝 Final Notes

**Work Style**: Autonomous implementation, commit frequently, maintain 100% test pass rate at every step

**Quality**: Production-ready code, comprehensive error handling, type hints throughout

**Documentation**: Code comments where needed, docstrings for all functions

**Handoff**: When complete, create summary document for Claude Code review

**Time Estimate**: 18-20 hours total (Phases 2.3-6)

---

**Good luck, CODEX! You've got this. Follow TDD strictly, commit often, and deliver production-ready code.** 🚀

**When you finish, create a summary document and notify for Claude Code handoff.**
