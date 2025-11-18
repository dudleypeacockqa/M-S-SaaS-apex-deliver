# M&A Intelligence Platform - Product Requirements Document

**Author:** Codex (Analyst)  
**Date:** 2025-11-18  
**Version:** 1.2 (adds v1.2 enhancement scope)

---

## Executive Summary

Apex Deliver’s Capliquify program is maturing the M&A Intelligence Platform into the default operating system for boutique banks, corporate development teams, and acquisition entrepreneurs. The product unifies pipeline orchestration, AI-powered valuations, compliance-grade data rooms, automation, and growth tooling inside a single workspace, so deal teams can run sourcing through close without context switching. FastAPI, PostgreSQL, Stripe, Clerk, and a React/Vite front end already exist; this PRD locks the next 6–9 months of work around scale, automation, and monetization while keeping auditing, security, and observability uncompromised.

### What Makes This Special

“Deal copilots” sit directly beside every pipeline, valuation, and diligence artifact. Users can drag a deal card, spin up multi-method valuations, auto-generate narratives, watermark documents, and trigger billing or marketing motions without leaving the same canvas. That magical “single cockpit” moment—when legal, finance, and growth see the same live truth—is the product’s signature.

---

## Project Classification

**Technical Type:** Multi-tenant SaaS (FastAPI + React) with REST APIs, background automation, and marketing funnel  
**Domain:** Financial services / mergers & acquisitions (regulated)  
**Complexity:** Enterprise-grade, compliance-heavy, high-integration system

The platform is a brownfield, dual-part monorepo (`backend/`, `frontend/`) governed by BMAD Enterprise Method. Backend routers cover auth, deals, valuation, subscription, documents, podcasts, and master-admin tooling; the frontend renders both marketing and authenticated workspaces. Infrastructure targets Render (Python web + static site) with PostgreSQL, Redis, Stripe, Clerk, SendGrid, and Cloudflare R2.

### Domain Context

M&A workloads demand audit trails (SOC2/GDPR), legal holds, permission tiers, and trusted record keeping. Financing partners expect deterministic calculations while regulators require immutable data-room logs, consent tracking, and secure identity controls. Accounting integrations must preserve GAAP alignment, and AI-assisted outputs need reviewer checkpoints plus redaction.

---

## Success Criteria

- 150 active organizations running end-to-end deals with ≥3 collaborating roles per tenant within 6 months.  
- Deal teams can generate multi-method valuations with narratives in <5 minutes and share audited reports with zero manual formatting.  
- Data-room viewers experience zero unauthorized access attempts and 100% of sensitive downloads are watermarked + logged.  
- Upgrade funnel converts ≥20% of Starter tenants to Pro/Enterprise via in-app billing nudges and master-admin interventions.  
- Platform uptime ≥99.5% with no critical incidents during diligence windows (tracked via Render + Datadog monitors).

### Business Metrics

- £2M ARR run rate (blend of recurring subscriptions, workflow add-ons, and marketing events) by Q4 FY2026.  
- 30% quarter-over-quarter growth in AI valuation minutes consumed (proxy for stickiness).  
- ≤24-hour SLA between marketing qualified lead and deal workspace activation.  
- Net retention ≥130% driven by document storage overages, automation packs, and seat expansion.

---

## Product Scope

### MVP - Minimum Viable Product

1. **Tenant & Identity Foundations:** Clerk org claims, SCIM/CSV imports, tier-aware entitlements, RBAC matrix (Owner/Admin/Member/Read-only + scoped permissions).  
2. **Deal Workspace:** Configurable pipelines with Kanban/List views, inline editing, stage templates, playbooks, and SLA timers.  
3. **Valuation & Financial Intelligence:** Multi-method valuations (DCF, comps, multiples), AI narratives, 47+ ratio library, exportable reports, variance tracking.  
4. **Document Rooms & Q&A:** Hierarchical folders, watermarking, immutable access logs, question triage, approval workflows, automated NDA gating.  
5. **Automation & Tasks:** Task templates, recurring automation (follow-ups, diligence checklists), integration with emails/notifications.  
6. **Billing & Master Admin:** Stripe-based checkout, seat management, usage telemetry, master-admin portal for tenant oversight and compliance snapshots.  
7. **Marketing Funnel & Content Hub:** Landing pages, pricing, case studies, blog, podcast, CTA instrumentation feeding CRM/webhooks.

### Growth Features (Post-MVP)

- **AI Copilots Everywhere:** Scenario planning, negotiation prep, legal clause summarization, automated investment memos.  
- **Integration Mesh:** Two-way sync with NetSuite, QuickBooks, Xero, HubSpot, Salesforce, GoHighLevel, and cloud storage (Drive/SharePoint).  
- **Advanced Analytics:** Portfolio forecasting, anomaly detection, cohort dashboards, benchmarking, and multi-entity funnel insights.  
- **Events & Community:** Ticketing, webinars, referral programs, premium content gating, and success marketing automations.  
- **Usage-Based Monetization:** Metered document room storage, AI compute bundles, task automation packs with alerts for upgrades.

### V1.2 Enhancement Objectives

The **v1.2 scope** (see `docs/bmad/V1.2-SCOPE.md`) concentrates on:

1. Clearing outstanding backend (11) and frontend (12) TODOs with emphasis on pagination, caching, and UX polish.  
2. Raising Lighthouse performance/accessibility metrics to ≥90 while tightening React/Vite bundles.  
3. Increasing automated test coverage to ≥90% across backend (`pytest --cov=backend/app`) and frontend (`npm run test -- --coverage`).  
4. Hardening cross-cutting systems—Clerk/Stripe integrations, Cloudflare R2 storage, Celery/Redis automation—and enhancing deployment guardrails in `render.yaml`/`prestart.sh`.  
5. Keeping BMAD workflow artifacts (stories, architecture, deployment reports) synced so multiple AI agents can execute consistently.

### Vision (Future)

- **Marketplace & Partner Pods:** Verified advisors, lenders, diligence providers, and integration partners offered inside data rooms.  
- **Full LBO Simulator:** Combine valuations, financing structures, scenario stress tests, and autop-run closing playbooks.  
- **Automated Compliance Engine:** Real-time legal hold enforcement, PII detection, retention policies, and auditor workbench.  
- **Globalization:** Multi-language UI, regional compliance packs, localized billing, and per-region data residency.  
- **Edge Copilots:** Mobile/tablet-native assistants for on-site diligence with offline sync and biometric approvals.

---

## Domain-Specific Requirements

- SOC2 Type II, GDPR, and UK FCA-aligned controls for identity, data retention, and logging.  
- Watermarking, immutable audit logs, and legal hold toggles for every sensitive document transaction.  
- PII redaction and reviewer checkpoints for AI-generated outputs; every narrative requires human sign-off for regulated deals.  
- Q&A workflows must support sensitivity labels, dual-approval on restricted answers, and exportable transcripts for diligence rooms.  
- Integration connectors (accounting/CRM) must pass compliance reviews, encrypt secrets, and respect least-privilege OAuth scopes.  
- Background tasks must honor jurisdictional data-routing rules (EU vs US storage, encryption in transit/at rest).

---

## Innovation & Novel Patterns

- **Deal Copilot Fabric:** Embedded AI advisors that watch deal signals (stage velocity, valuation deltas, task backlog) and recommend next best actions or automatically draft narratives, investor updates, and mitigation plans.  
- **Unified Revenue + Execution View:** Marketing funnel, billing, and execution metrics share a single data spine so PMs, finance, and sales see identical KPIs without exporting Excel.  
- **Document Holograms:** Watermarking + fingerprinting let staff preview who leaked a file, while smart NDAs and legal-hold automation keep diligence rooms safe.

### Validation Approach

- Start with opt-in pilot groups (10 flagship tenants) for copilot suggestions; collect qualitative feedback and success metrics (time saved).  
- Shadow existing manual workflows to ensure AI output accuracy; maintain rollback/fallback options.  
- Run red-team exercises on watermarking/legal hold to verify tamper resistance.  
- Tie marketing/billing data to pipeline metrics in staging to ensure unified view accuracy before GA.

---

## Multi-tenant SaaS Specific Requirements

1. **API & Endpoint Expectations:** RESTful `/api/*` routes for auth, deals, valuations, documents, tasks, billing, marketing, podcasts, master-admin; must return typed schemas matching `frontend/src/services/*`.  
2. **Authentication & Authorization:** Clerk JWT verification, master-admin impersonation gating, tier enforcement through `entitlement_service`, IP allow lists for sensitive routes.  
3. **Platform Support:** Web SPA (desktop-first) with responsive dashboards, marketing site, and high-contrast marketing assets; mobile web view should support quick deal/status updates.  
4. **Device Capabilities:** Browser-based uploads/downloads with resumable transfers, inline viewers for PDFs/audio/video, audio chunking for podcast studio.  
5. **Multi-Tenancy Architecture:** Each request scopes by org_id; data stays isolated through SQLAlchemy filters, S3 key prefixes, and Redis namespacing.  
6. **Permissions & Roles:** Owner/Admin/Member/Read-only baseline plus master-admin staff roles; future custom roles should map to permission matrix stored in DB with drift detection reports.

---

## User Experience Principles

- **Single Cockpit Clarity:** Keep deals, valuations, tasks, and billing within one glass pane; cross-links and breadcrumbs prevent context loss.  
- **Explainable AI:** Every automated narrative or recommendation surfaces source data, assumptions, and editable drafts.  
- **Compliance Signaling:** Display why controls (watermarks, holds, approvals) are active, and provide one-click access to audit logs.  
- **Actionable Metrics:** Dashboards favor anomaly callouts, SLA timers, and upgrade prompts over vanity counts.  
- **Low-Friction Onramps:** Starter tenants can adopt features progressively, with master-admin “assist” overlays offering guidance.

### Key Interactions

- Drag-and-drop pipeline columns with inline AI suggestions for next tasks.  
- Valuation workbench selection (DCF, comps, multiples) with live narrative preview and export to PDF/Data Room.  
- Q&A triage board assigning reviewers, labeling sensitivity, and publishing sanitized answers.  
- Billing/plan management within the workspace plus Stripe checkout for add-ons.  
- Master-admin console for impersonation, compliance reviews, and tenant health checks.

---

## Functional Requirements

1. **Identity & Entitlements**
   - Clerk org provisioning, SCIM imports, MFA enforcement, tier claim refresh.
   - Role management UI + API with quarterly access review automation.

2. **Deal Lifecycle**
   - Pipeline builder with reusable templates, SLA timers, automations.
   - Deal record linking to organizations, contacts, valuations, notes, tasks, and documents.

3. **Valuation & Intelligence**
   - Multi-method valuation engine, AI narratives, percentile benchmarking, export kits.
   - Financial ratio library, variance alerts, scenario planning, and audit logs.

4. **Documents & Data Rooms**
   - Folder hierarchies, watermarking, secure sharing, immutable access logs, question workflows.
   - Automated NDA gating + redaction pipeline before publishing sensitive files.

5. **Automation & Tasks**
   - Task templates, recurring sequences, Celery-driven reminders, API hooks for integrations.
   - Task timelines embedded in deals and master dashboards.

6. **Billing & Monetization**
   - Stripe subscription management, usage meters, upgrade nudges, seat/license management.
   - Master-admin “overwatch” to intervene, grant credits, or enforce downgrades.

7. **Marketing & Growth**
   - Landing pages, pricing, testimonials, multi-CTA experiments, analytics instrumentation.
   - Blog/podcast ingestion tooling, event campaigns, referral program automation.

8. **Integrations**
   - Accounting (NetSuite, QuickBooks, Xero, Sage) connectors with OAuth and sync jobs.
   - CRM/Marketing (HubSpot, GoHighLevel, Salesforce) webhooks and importers.

---

## Non-Functional Requirements

### Performance

- API p95 < 300 ms for read endpoints, < 800 ms for complex valuations with async offloading.  
- Valuation jobs should produce outputs in <5 minutes using Celery workers with progress updates.

### Security

- Zero-trust: every request validated via Clerk/JWT + entitlement checks.  
- Encryption in transit (TLS 1.2+) and at rest (PostgreSQL, R2, Redis).  
- Mandatory watermarking on exports, tamper-evident audit logs, SOC2/GDPR alignment.

### Scalability

- Horizon: 5k active users, 1k concurrent data-room viewers, multi-region readiness.  
- Horizontal scaling on Render with stateless API pods, background worker pool for valuations/automations.  
- Storage tiering for documents (R2 + CDN).

### Accessibility

- WCAG 2.1 AA for workspace and marketing funnels (focus states, keyboard shortcuts, high-contrast mode).  
- Provide accessible transcripts for podcasts and AI narratives with plain-language summaries.

### Integration

- Webhook retries with exponential backoff, signed payloads, and observability dashboards.  
- Secrets stored in Render env vars or Vault equivalents, rotated quarterly.  
- API versioning + schema docs (OpenAPI) for partners.

---

## Implementation Planning

### Epic Breakdown Required

Requirements must be decomposed into epics and bite-sized stories (200k context limit).

**Next Step:** Run `workflow epics-stories` to create the implementation breakdown.

---

## References

- Product Brief: docs/project-overview.md  
- Domain Brief: docs/bmad/prd.md  
- Research: docs/bmad/technical_specifications.md, docs/architecture.md, docs/development-guide.md

---

## Next Steps

1. **Epic & Story Breakdown** - Run: `workflow epics-stories`  
2. **UX Design** (if UI) - Run: `workflow ux-design`  
3. **Architecture** - Run: `workflow create-architecture`

---

_This PRD captures the essence of M&A Intelligence Platform - Keeping every deal decision, valuation, and compliance checkpoint inside one calm cockpit._  
_Created through collaborative discovery between Codex (Analyst) and AI facilitator._
