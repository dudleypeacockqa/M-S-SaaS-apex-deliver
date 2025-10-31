# APEXDELIVER / CAPLIQUIFY — PROJECT STATUS (PINNED)

**Last updated:** 2025-10-31T19:59:18Z  
**Owner:** Dudley (CEO) • Focus: PMI Finance Ops Stabilisation (Option B)  
**Primary product to SELL:** CapLiquify FP&A/WC for Intacct/Odoo/CSV  
**ApexDeliver:** positioned as PMI/M&A operator kit (module inside the same platform)

---

## Traffic lights
- **Story unity (ApexDeliver ⇢ CapLiquify):** 🟧 needs copy merge on marketing site
- **Demo path (CSV → 13‑week → WC moves → PDF lender pack):** 🟨 stubs exist, needs seed data + scripts
- **Tenancy & security doc (schema‑per‑tenant, Frankfurt primary):** 🟧 decision logged but not codified
- **Observability (health endpoints, alerts, backups):** 🟧 minimal, add checklist + scripts
- **Sales kit in repo (ROI XLSX, lender‑pack shell, meeting agenda):** 🟩 added under `/docs/sales-kit/`
- **Seed datasets (Intacct‑like, Odoo‑like):** 🟧 scrubbed samples required
- **CI/CD + smoke tests:** 🟧 add GitHub Actions + smoke job
- **Render health:** 🟨 manual checks only; wire automated health in CI

---

## North‑star outcomes
- **Demo‑credible in 7 days** (live walkthrough from CSV → lender pack)  
- **Pilot‑ready in 21 days** (2 paying tenants, per‑tenant backup/restore verified, daily jobs green)

---

## Environments
- **Primary region:** EU (Frankfurt) • **DR:** USA (data may cross border during DR tests/activation)  
- **Bank ingest rule:** *No third‑party aggregator at MVP* — ERP‑synced bank + CSV fallback

---

## Hardening sprint (7 days)
**D1–2** Freeze demo scripts + seed datasets  
**D2** Tenancy decision doc (schema‑per‑tenant) + backup/restore runbook  
**D3** Ops checklist uplift (health endpoints, alerts, backup IDs)  
**D4** Marketing site hero: sell CapLiquify; ApexDeliver as PMI module  
**D5** One‑click demo (`scripts/dev-up.sh`)  
**D6–7** Sales kit into repo; run live smoke

See `/docs/runbooks/HARDENING_7D.md`.

---

## Feature matrix (demo path)
- CSV/ERP ingest → **13‑week direct cash** → **WC drivers (DSO/DPO/DIO)** → **Weekly moves list** → **PDF lender pack** (covenants + lineage) → **Alerts**  
Status per step: 🟨 🟨 🟨 🟨 🟨 🟧

---

## Security & compliance (mid‑market buyer expectations)
- TLS 1.3 in transit • DB + field‑level encryption (PII/financials) • Clerk MFA/SSO  
- Schema‑per‑tenant • **Daily backups (30‑day)** • **7‑year audit logs** • **RTO 4h / RPO 1h**  
Refs: `/docs/procurement/SECURITY_ONE_PAGER.md`, `/docs/tenancy/DECISION.md`

---

## Observability SLAs (min)
- `/healthz` 200 OK in <150ms (p95) • error rate <1% • backups pass daily • smoke green post‑deploy

---

## Open risks
1) Brand sprawl (ApexDeliver vs CapLiquify) hurts conversion – **fix D4**  
2) Seed data gaps slow demos – **fix D1–2**  
3) Tenancy not codified – **fix D2**

---

## Decision log (last 7 days)
- Bank ingest: ERP bank + CSV only at MVP ✅
- Region: EU‑Frankfurt primary, USA DR ✅
- PMI wedge: Option **B** (Finance Ops Stabilisation) ✅

---

## Definition of Ready (DoR)
- User story has acceptance tests (TDD), demo path note, success metric, and rollback noted.

## Definition of Done (DoD)
- Tests pass (unit/integration/E2E) • Docs updated • Healthcheck OK • Demo script reproducible • Linked issue closed
