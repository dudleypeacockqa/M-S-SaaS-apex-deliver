# Valuation Suite Workflow (DEV-011)

**Last Updated**: 2025-10-28 22:45 UTC  
**Owner**: Codex (BMAD orchestrator)

## Overview

Valuation Suite now supports full creation-to-analysis flow under Phase B of the completion plan. This document captures the end-to-end behaviour, inputs/outputs, and cross-tier gating requirements to guide QA, product, and deployment work.

### Functional Scope
- Create discounted cash flow valuations with inline form.
- Visualise enterprise/equity values, implied share price.
- Run Monte Carlo simulations over existing valuations.
- Add comparable companies and precedent transactions.
- Display scenario analytics summary (count, medians, ranges).
- Responsive analytics grid (single column on mobile, five columns on desktop).
- Enforce subscription gating (403) for tiers below Growth.

### Spreadsheet Parity KPIs
- `valuation_service.calculate_go_to_market_kpis()` now mirrors the CAC, LTV, payback, and magic-number formulas inside Eric Andrews’ `Customer_Acquisition_Cost_.xlsx` and `SaaS_Financial_Model_Video_Download.xlsx`.
- API consumers can call the new helper (or expose it via UI hooks) to produce Customer Acquisition Cost, Lifetime Value, LTV:CAC ratios, CAC payback months, sales efficiency, and net-new ARR in a single payload, ensuring SaaS operators see the exact KPIs they track in their modelling sheets.

## User Journey

1. **Workspace Entry**
   - Route: `/deals/:dealId/valuations/:valuationId`
   - Validates `dealId`/`valuationId`; if missing, shows route error.
   - Growth-tier or higher users access full workspace; lower-tier users see upgrade prompt.

2. **Creating a Valuation**
   - Inline form (Summary tab) collects:
     - Discount rate (%), Terminal cash flow (£), Forecast years, Terminal growth rate (% optional), Net debt (£ optional).
   - Derived values: generates progressive cash flow array and sends via `createValuation` API.
   - Success triggers toast-style message and invalidates valuation list query.
   - Validation covers numeric inputs and positive forecast years.

3. **Viewing Analytics**
   - Summary tile grid shows enterprise/equity values & implied share price for selected valuation.
   - Scenario analytics summary queries `/scenarios/summary` for current valuation (if available) and renders count/medians/ranges; shows spinner whilst loading.
   - Empty state encourages scenario creation.

4. **Comparables & Precedents**
   - Comparables: Tab displays existing records and allows adding company name + multiples. Edge cases (invalid numbers) surface inline validation.
   - Precedents: Similar add form capturing target/acquirer, EV/EBITDA, announcement date; immediate API call ensures consistent usage tracking.

5. **Scenarios & Exports**
   - Scenarios tab lists scenarios with assumptions detail toggle and supports JSON-based create flow.
   - Exports tab queues PDF/Excel exports and displays pending status.

6. **Upgrade Flow**
   - When backend returns 403, UI displays required tier messaging and pricing CTA (links to `/pricing` by default, uses `upgrade_cta_url` if provided).

## API Touchpoints

| Endpoint | Purpose | Notes |
| --- | --- | --- |
| `GET /deals/{dealId}/valuations` | Load valuations for workspace | Invalidate after creation. |
| `POST /deals/{dealId}/valuations` | Create valuation | Accepts derived cash flow array. |
| `GET /deals/{dealId}/valuations/{valuationId}/scenarios/summary` | Scenario analytics | Optional call; guarded if no scenarios. |
| `POST /deals/{dealId}/valuations/{valuationId}/comparables` | Add comparable | Form uses company name + multiples + notes. |
| `POST /deals/{dealId}/valuations/{valuationId}/transactions` | Add precedent transaction | Captures EV/EBITDA, announcement date. |
| `POST /deals/{dealId}/valuations/{valuationId}/scenarios` | Create scenario overrides | Supports JSON assumptions input. |
| `POST /deals/{dealId}/valuations/{valuationId}/exports` | Queue export | Validates export type/format. |

## TDD Status

- **Vitest**: `npx vitest run ValuationSuite` – 9 tests passing (RED→GREEN cycles completed for creation, comparables, precedents, analytics, exports).
- **Pytest**: `python -m pytest backend/tests/test_valuation_api.py -q` – 10 tests passing (backing API stable).

## Outstanding Work (Phase B Backlog)
- Mobile layout adjustments for analytics summary tiles (median/range collapse).
- Enrich upgrade messaging with tier-specific benefits.
- Add UI for editing/deleting valuations and managing scenario sets.
- Connect to actual Monte Carlo results once backend exposes persistent results (currently stub/return from service).

## References
- `frontend/src/pages/deals/valuation/ValuationSuite.tsx`
- `frontend/src/pages/deals/valuation/ValuationSuite.test.tsx`
- `docs/bmad/COMPLETION_MASTER_PLAN.md`
- `docs/bmad/BMAD_PROGRESS_TRACKER.md` (Phase B entries)

