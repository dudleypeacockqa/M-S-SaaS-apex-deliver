# DEV-022: Backend Financial Planning & Analytics Completion

**STATUS:** ⏳ PLANNED  
**Story ID:** DEV-022  
**Epic:** F-006 Financial Intelligence Engine  
**Priority:** High  
**Sprint Target:** V1.2 Implementation Wave – Backend  
**Created:** 2025-11-18

---

## 📋 Story Description
As a **Principal Analyst**, I want the financial planning & analytics (FPA) endpoints to create demand forecasts, scenarios, and reports so that **deal teams receive actionable models directly inside the platform**.

### Acceptance Criteria
1. `POST /api/fpa/demand-forecasts` persists forecast definitions (name, horizons, assumptions) and returns stored entity.  
2. `POST /api/fpa/scenarios` accepts linked deals/forecasts and stores scenario deltas with validation on allowed metrics.  
3. `POST /api/fpa/reports` generates a summarized payload (growth, EBITDA, cash flow) by composing forecasts + scenarios and writes an audit entry.  
4. All endpoints enforce organization scoping (`organization_id` from Clerk) and entitlement checks for Pro+ tiers.  
5. Comprehensive tests (unit + API) cover happy paths, validation errors, and unauthorized access.

---

## 🔗 Implementation References
- `backend/app/api/routes/fpa.py` – contains TODO markers at lines ~78, ~140, ~306.  
- `backend/app/schemas/fpa.py` (create if missing) – define Pydantic models for requests/responses.  
- `backend/app/services/fpa_service.py` (new) – encapsulate demand forecast, scenario, report logic.  
- `backend/app/models/` – add `fpa_forecast`, `fpa_scenario`, `fpa_report` tables via Alembic migration.

---

## 🧪 TDD Plan
1. **Red:** Extend `backend/tests/test_fpa_routes.py` (new) with failing tests covering each endpoint (201 success, validation failure, 403).  
2. **Green:** Implement models, schemas, services, and route handlers. Persist to DB using SQLAlchemy 2.0 patterns, ensuring multi-tenant filters.  
3. **Refactor:** Extract shared calculations into helper functions (e.g., CAGR, EBITDA delta). Add docstrings and ensure lint clean.

### Test Cases
- `test_create_demand_forecast_success`  
- `test_create_demand_forecast_requires_entitlement`  
- `test_create_scenario_validates_metrics`  
- `test_create_report_combines_forecast_and_scenario`  
- `test_report_creation_logs_audit_entry`

---

## 📦 Deliverables
- Alembic migration for new FPA tables.  
- Updated FastAPI routes + services.  
- Tests (pytest) with ≥95% coverage for new modules.  
- Documentation snippet in `docs/architecture.md` → Technology Stack / Data Architecture.

---

## 🚀 Dependencies
- Requires existing Clerk auth + entitlement checks (`app.services.entitlement_service`).  
- Coordinates with DEV-023/DEV-024 for shared audit/logging utilities.  
- No frontend dependency for v1.2 (API-first delivery).

---

_Owner: Backend Engineer (Codex). Keep BMAD workflow status updated upon completion._

