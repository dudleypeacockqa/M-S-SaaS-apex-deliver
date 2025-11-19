# Backend API Audit — November 19, 2025

## 1. Scope & Methodology
- Reviewed every FastAPI router under `backend/app/api/routes/`.
- Verified authentication/authorization hooks, pagination, error handling, and completeness for each domain.
- Noted TODOs, unimplemented endpoints, and duplicated/stale artifacts (e.g., `.future` / `.stub` files).
- Cross-referenced supporting services (`app/services/**`) where necessary to validate data flow.

## 2. High-Level Findings
| Area | Status | Notes / Risks |
| --- | --- | --- |
| **Authentication & Dependencies** | ✅ `get_current_user`, `require_min_role`, and `require_feature` consistently reused. | RBAC enforced on privileged surfaces (tasks, automations, master-admin). |
| **Deals & Pipeline** | ✅ CRUD + stage updates implemented with org isolation. | Pagination and sorting already available. |
| **Deal Matching (DEV-018)** | ✅ Criteria CRUD + async matching service present. | Need caching/limits for repeated `/find-matches` hits. |
| **FP&A (DEV-010)** | ⚠️ What-if, demand forecast, report endpoints implemented but imports/export stubs remain. |
| **Documents & Generation (DEV-008)** | ✅ Comprehensive endpoints covering upload, templating, AI questions. | File streaming endpoints missing consistent rate limiting headers. |
| **Tasks & Automations** | ✅ Multi-surface endpoints (tasks, templates, automation logs). | `/automation/rules/{rule_id}/run` depends on Celery, lacks explicit feature flag. |
| **Events, Podcasts, Community** | ✅ CRUD endpoints exist with webhook integrations. | Payment reconciliation is isolated to `event_payments.py`; audit completed. |
| **Subscriptions & Billing** | ✅ Stripe portal + plan switching routes implemented w/ `require_min_role`. | Need structured error payloads for Stripe webhook failures. |
| **Webhooks** | ✅ Clerk + Voice webhooks documented. | Missing signature verification tests. |

## 3. Detailed Observations

### 3.1 Deals & Pipeline
The deals router enforces org-level access control, exposes pagination, and returns typed responses.

```20:121:backend/app/api/routes/deals.py
@router.post("", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
def create_deal(...)
    created_deal = deal_service.create_deal(deal, current_user, db)

@router.get("", response_model=DealListResponse)
def list_deals(...)
    deals, total = deal_service.list_deals(...)
    return {"items": deals, "total": total, "page": page, "per_page": per_page}
```

**Recommendation:** No blocking gaps; consider rate-limiting `list_deals` for organizations with >10k rows.

### 3.2 Intelligent Deal Matching

```37:190:backend/app/api/routes/deal_matching.py
@router.post("/match-criteria", ...)
def create_match_criteria(...)
    criteria = DealMatchCriteria(...)
    db.add(criteria)

@router.post("/deals/{deal_id}/find-matches", ...)
async def find_matches_for_deal(...)
    matching_service = DealMatchingService()
    matches = await matching_service.find_matches(...)
    db.add(DealMatch(...))  # persists top 10 matches
```

- ✅ Criteria + matches persisted with org scoping.
- ⚠️ No throttling on `/find-matches`; heavy usage could spawn long-running embedding jobs. Add async queue + `require_feature("ai_matching")`.

### 3.3 FP&A Module

```53:341:backend/app/api/routes/fpa.py
@router.get("/demand-forecast", ...)
async def get_demand_forecasts(...)
    return fpa_service.get_demand_forecasts(db, org_id)

@router.post("/demand-forecast", response_model=DemandForecast, status_code=201)
async def create_demand_forecast(...)
    return fpa_service.create_demand_forecast(...)

@router.post("/what-if/calculate", ...)
async def calculate_scenario_impact(...)
    # baseline + multiplier logic inline

@router.post("/import", response_model=ImportResponse)
async def import_data(...)
    return {"success": True, "message": f"Data import for {import_type} is not yet implemented"}
```

- ✅ CRUD for demand forecasts and scenarios now in place.
- ⚠️ `import_data` remains a stub; `generate_report` delegates to service but lacks validation of `report_type`.
- ⚠️ Inline calculation logic should move to `fpa_service` for testing.

### 3.4 Documents & Generation
`document_generation.py` (923 lines) handles template rendering, AI enrichment, and delivery. Spot-check confirms consistent error handling and streaming responses.

- ✅ `@router.post("/documents/render")` enforces auth + payload validation.
- ⚠️ Large file downloads should attach `Content-Security-Policy` headers.

### 3.5 Task Management & Automations

```23:294:backend/app/api/routes/tasks.py
router = APIRouter(prefix="/api/deals/{deal_id}", tags=["tasks"])

@router.post("/tasks", ...)
def create_task_endpoint(...)
    task = task_service.create_task(...)

@router.post("/automation/rules", ...)
def create_automation_rule(...)
    template = task_template_service.get_template(...)
    if template is None: raise HTTPException(404)
```

- ✅ All CRUD endpoints guard with `require_min_role(UserRole.growth)`.
- ⚠️ Automation rule execution triggers Celery but does not expose status polling endpoint beyond logs; consider SSE/websocket for progress.

### 3.6 Events & Payments
- `events.py` provides status/type filters and uses `delete_event` mutation with confirmation prompts in the client.
- `event_payments.py` reconciles Stripe intents but returns generic 500 on provider failure; wrap third-party errors in domain-specific codes.

### 3.7 Subscriptions & Billing
- `subscriptions.py` includes portal links, plan upgrades, and webhooks. Observed mismatch between plan IDs and config constants; ensure `.env` alignment.

### 3.8 Podcasts & Voice
- Podcast routes manage quotas, YouTube connections, and transcripts. With `FeatureGate` on the frontend, backend should also double-check entitlements per request.
- Voice router integrates Twilio-style callbacks; audit for signature validation (not currently enforced).

### 3.9 PMI & Pipeline Templates
- PMI router surfaces project CRUD aligned with `usePMIProjects` hook.
- Pipeline templates APIs support admin-managed stage definitions; ensure updated validations match new sidebar grouping.

### 3.10 Webhooks
- `webhooks/clerk.py` and `webhooks/voice.py` exist, but only Clerk webhook currently verifies signature. Add verification to voice handlers.

## 4. Action Items
1. **Finalize FP&A Imports & Reports**
   - Implement real file ingestion pathways (XLSX/CSV) and structured success/error payloads.
2. **Abstract Scenario Calculations**
   - Move inline business math from `fpa.py` into `fpa_service` with targeted pytest coverage.
3. **Throttle AI/Matching Calls**
   - Add per-org rate limiting + async job queue to `/find-matches`.
4. **Harmonize Response Shapes**
   - Some routes return dicts while others use Pydantic responses (e.g., `/deals` vs `/automation/rules/{rule_id}/run`). Standardize for DX.
5. **Security Enhancements**
   - Apply signature validation to all inbound webhooks and add CSP/Download headers to document streaming endpoints.
6. **Documentation & Tests**
   - Generate OpenAPI snapshots after finishing stubs, and backfill unit tests for new FP&A create endpoints.

## 5. Next Steps
- Convert the above action items into tracked tickets (BMAD shard IDs) and attach this audit.
- Coordinate with frontend to wire the new FP&A endpoints (demand forecasts, scenarios) once imports/reports are implemented.
- Schedule follow-up audit after completing action items to maintain the “100% completion” claim.


