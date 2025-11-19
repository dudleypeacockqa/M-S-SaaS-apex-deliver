# M&A Intelligence Platform Product Requirements Document (PRD)

**Author:** Dudley Peacock
**Date:** 2025-10-28
**Project Track:** enterprise-bmad-method (greenfield)
**BMAD Workflow Path:** .bmad/bmm/workflows/workflow-status/paths/enterprise-greenfield.yaml
**Target Scale:** Enterprise multi-tenant SaaS platform

---

## Goals and Background Context

### Goals

- Deliver a single workspace where M&A teams can run sourcing, diligence, negotiation, and closing without leaving the platform.
- Embed AI copilots that turn raw deal data into valuations, ratios, and narratives that accelerate decision quality.
- Guarantee enterprise-grade trust with multi-tenant isolation, granular RBAC, auditable data rooms, and compliance-ready records.
- Build predictable revenue through tiered subscriptions, metered usage insights, and self-service upgrades.
- Activate community-led growth loops via content hubs, events, and professional networking features tied to the core product.
- Integrate seamlessly with core back-office stacks (accounting, CRM, comms) so workflows stay synchronized and automated.

### Background Context

The current solution already includes a production-grade FastAPI stack (`backend/app`) with domain modules for deals, documents, tasks, valuations, subscriptions, and automation. Endpoints such as `backend/app/api/routes/subscriptions.py`, `backend/app/api/routes/deals.py`, and `backend/app/api/routes/documents.py` sit on top of SQLAlchemy models (`backend/app/models`) and service layers (`backend/app/services`) that are covered by pytest suites (e.g., `backend/tests/test_valuation_service.py`, `backend/tests/test_task_automation.py`). The Vite/React frontend (`frontend/src`) ships authenticated workspaces, billing flows, marketing funnels, and valuation UI backed by shared hooks (`frontend/src/hooks/useValuation.ts`) and integration tests.

Execution history and market validation are documented across `docs/bmad/technical_specifications.md`, sprint and session summaries, and DEV-011/DEV-012 artefacts, all of which confirm demand for an integrated M&A operating system with AI-assisted intelligence. ApexDeliver is targeting 1,000 paying accounts and GBP 2M ARR within 12 months to bankroll a systematic LBO acquisition flywheel while reinvesting in continuous product expansion.

The platform must preserve the established architecture: multi-tenant PostgreSQL with SQLAlchemy models, modular FastAPI services orchestrated via Celery tasks, a Stripe-first billing engine, and a Vite + Tailwind frontend. Compliance, auditability, and security remain non-negotiable—SOC2/GDPR readiness, role-based isolation, traceable data-room workflows, and observability guardrails underpin every release.

---

## Requirements

### Functional Requirements

This section organizes enterprise-grade capabilities into domains aligned with Epics E1–E10. Identity & Tenant Foundations (E1) underpin Deal Lifecycle & Intelligence (E2–E4), while Automation & Monetization (E5–E6) rely on shared approval services. AI Copilot, Integration, and Growth domains (E4–E9) build on those foundations, and Compliance, Partner Success, and Release Governance (E8–E10) establish the guardrails that keep hypergrowth and regulated deployments safe. Cross-cutting services—legal holds, entitlement gating, and AI failover—are highlighted where dependencies span multiple epics.

**Identity & Tenant Foundations**

FR001: Enforce multi-tenant isolation on every backend call using Clerk-issued org/user claims, defaulting to deny when claims are absent.
FR002: Support centralized identity via Clerk with session management, SSO expansion, and dynamic tier claim refreshes.
FR003: Provide self-serve organization onboarding, invitation workflows, and enterprise CSV/SCIM imports with audit logging.
FR004: Offer role management (Owner, Admin, Member, Read-only) plus custom permission sets to satisfy enterprise RBAC demands, with automated quarterly access reviews and drift detection.
FR005: Deliver a Master Admin Portal for platform staff to search, suspend, re-activate tenants, and view compliance status, surfacing access review reports and escalation workflows.

**Deal Lifecycle & Intelligence Workspace**

FR006: Allow configurable deal pipelines with reusable stage templates, per-stage SLAs, and branching path support.
FR007: Expose Kanban and list views with inline editing, bulk actions, and swim-lane filtering by owner, sector, or tier.
FR008: Link deals to organizations, contacts, valuations, documents, tasks, and notes with bidirectional navigation panels.
FR009: Provide portfolio dashboards (funnel, velocity, win-rate, forecast) filterable by timeframe, region, and team.
FR010: Enable per-deal data rooms with folder hierarchies, permission groups, watermarking, and download controls.
FR011: Maintain immutable access logs with viewer identity, timestamp, action, and device fingerprint for every sensitive asset.
FR012: Deliver structured Q&A workflows including question intake, triage, approval, publication, and audit history with entitlement checks and sensitivity labels before answers are released.
FR013: Auto-generate NDAs/access agreements and collect digital acceptance before data room permissions activate.
FR014: Ingest accounting data to compute 47+ ratios, KPI trends, and scenario analyses with alert thresholds.
FR015: Provide multi-method valuation models (DCF, Comparable Companies, Precedent Transactions) with configurable assumptions.
FR016: Store valuation snapshots, enable side-by-side comparisons, and attach decisions to deals for governance review.

**Automation & Monetization Engines**

FR017: Let teams design task templates, recurring checklists, and dependency chains mapped to pipeline transitions.
FR018: Trigger automations (notifications, doc requests, AI summaries) based on rule engines, stage changes, or data anomalies, with high-impact actions requiring dual-approval flows and full audit trails before execution.
FR019: Surface workload dashboards highlighting overdue, blocked, or quota-exceeding tasks with reassignment tools.
FR020: Enforce tier-based feature flags and quota limits synchronized between Stripe billing and Clerk identity claims, scaling entitlement processing with back-pressure queues, backlog monitoring, and manual override tooling during hypergrowth events.
FR021: Support seat-based billing, add-on purchases (events, studio), proration, refunds, and automated invoice issuance with autoscaling webhooks, reconciliation queues, and alerting on backlog thresholds.
FR022: Offer customer self-service portals for upgrading, downgrading, payment method management, and invoice exports.

**AI Copilot Services**

FR023: Orchestrate AI providers via a centralized service that manages prompt templates, provider selection, cost budgets, and regional fallback matrices for compliance-sensitive deployments.
FR024: Generate AI-assisted recommendations (deal matching, doc summarization, risk flags) with human-in-the-loop approval, entitlement-aware filtering, and automatic deactivation when provider availability or policy constraints trigger failover.
FR025: Persist AI outputs with source references, evaluation status, and feedback loops for continuous improvement, enforcing entitlement-aligned access, tracking provider provenance, and notifying owners when fallback providers activate.

**Integration & Platform Extensibility**

FR026: Provide bi-directional sync connectors for Xero, QuickBooks, Sage, NetSuite, GoHighLevel, Stripe, and SendGrid/SES.
FR027: Expose REST and GraphQL APIs with per-tenant keys, fine-grained scopes, sandbox tenants, webhook publishing, and idempotency key enforcement.
FR028: Monitor integrations via heartbeat checks, retry queues, incident alerts, and duplicate-action detection surfaced in admin dashboards.

**Growth & Community Ecosystem**

FR029: Deliver a content hub supporting articles, templates, lead magnets, and gated downloads tied to CRM scoring, instrumented with performance budgets to keep critical interactions under two seconds.
FR030: Operate a podcast/video production workflow covering script authoring, asset storage, editing checkpoints, and distribution.
FR031: Provide event management (tickets, agendas, attendee CRM sync, post-event surveys) with free and premium pricing.
FR032: Power a community space with moderated channels, role-based groups, rich messaging, engagement analytics, and regulated-content escalation workflows.

**Compliance, Audit & Data Governance**

FR033: Capture audit trails for all configuration changes, data exports, and admin overrides with retention configurable per tenant, region-specific data residency controls, auditor access portals, and tamper-evident logs.
FR034: Generate compliance packages on demand (GDPR DSAR bundle, SOC 2 evidence, security posture report) and legal-hold automation that freezes relevant data pathways with confirmation receipts and integrity checks.
FR035: Enforce configurable data retention/destruction schedules, legal holds, and case-specific preservation policies with automated legal hold activation, release workflows, and failure alerts.

**Customer Growth, Support & Partner Success**

FR036: Maintain a marketing site with localization, A/B testing, dynamic pricing calculators, testimonials, and CRM routing.
FR037: Provide structured lead capture forms with progressive profiling and automated assignment into sales motions.
FR038: Support SEO-optimized landing pages, schema markup, and analytics instrumentation for campaign attribution.
FR039: Provide tenant-level data classification catalogs, privacy dashboards, and automated Data Subject Request workflows tied to audit logging.
FR040: Generate finance-grade ARR/MRR, churn, expansion, and revenue recognition reports with export to CSV/API for accounting systems.
FR041: Offer partner/implementation sandboxes with anonymized sample data, templated configurations, migration utilities, reversible rollback plans, and partner QA exports, enforcing automated scrubbing verification, expiring access tokens, watermarking, and usage logging.
FR042: Deliver a support console with consented user impersonation, ticketing integrations (e.g., Zendesk/Jira), and safe session replay to accelerate incident resolution, with adaptive risk scoring, session watermarking, time-bound access, user notifications, and dual authorization for escalation.
FR043: Surface customer health scores and adoption alerts combining product telemetry, billing signals, and support history for the Customer Success team.

**Release & Operational Governance**

FR044: Provide release readiness workflows that bundle feature flags, change logs, rollout plans, and automated stakeholder notifications before production pushes, enforcing blocking compliance gates, override logging with weekly compliance review, and publishable auditor attestations.

### Non-Functional Requirements

NFR001 (Reliability): The platform shall meet a 99.95% uptime SLO with automated failover, 15-minute RPO backups, and quarterly disaster-recovery tests.
NFR002 (Performance): Core deal, valuation, and billing APIs shall maintain P95 latency below 200 ms; document downloads shall stream within 3 seconds for 500 MB files.
NFR003 (Security & Compliance): The platform shall implement SOC2 Type II controls, GDPR/UK Data Protection compliance, field-level encryption, and continuous vulnerability scanning.
NFR004 (Scalability): Infrastructure shall scale horizontally (FastAPI workers, Celery queues, CDN assets) to support 10x tenant growth without degrading SLAs.
NFR005 (Observability): Logs, traces, metrics, and AI usage counters shall feed centralized monitoring with automated anomaly alerts for auth, billing, and AI outliers.
NFR006 (Data Governance): All financial/document access events shall be immutable, retention policies configurable per tenant, and right-to-be-forgotten executed within 30 days.
NFR007 (Supportability): Continuous delivery pipelines shall enforce environment parity, feature flags, and blue/green release playbooks captured in runbooks.
NFR008 (Accessibility & UX): Web experiences shall meet WCAG 2.1 AA, provide keyboard-first navigation, localization support, and consistent design tokens across modules.
NFR009 (Resilience & Compliance for AI): AI services shall enforce rate limits, content filters, human approval gates for high-risk actions, and redact sensitive data before provider calls.
---

## User Journeys

1. **Solo Dealmaker Fast-Track Onboarding**
   - Signs up with Clerk, creates Apex Advisors org, and selects Professional tier with podcast add-on.
   - Configures template pipeline; automation proposes stage SLA defaults. Dealmaker chooses to accept for diligence stages but shortens negotiation SLA.
   - Imports 25 historical deals via CSV; mapping assistant flags two unmapped fields and suggests custom metadata. Dealmaker accepts suggestions and saves mapping for reuse.
   - Builds first secure data room; NDA template auto-inserts. Buyer invite triggers entitlement check since guest lacks valuation access—system prompts to grant read-only valuation visibility or escalate. Dealmaker opts for temporary access with auto-expiry and compliance warning, logging decision to audit trail.
   - Kicks off AI valuation. Model detects missing cash flow statement and pauses automation, offering email request or manual override; user sends automated doc request which logs to audit trail with fallback manual review queue if buyer declines.

2. **Growth Firm Cross-Border Diligence Loop**
   - Analyst receives task queue generated from due-diligence template; chooses to reassign legal tasks to external counsel workspace.
   - Deal room Q&A feed shows sensitive request; triage labels it "Restricted" requiring partner approval. Counsel audit trail verifies workspace access; AI redactor removes PII, analyst reviews highlights, and response publishes with watermark.
   - Weekly review uses portfolio dashboard; revenue forecast anomaly triggers automation that creates task for Finance, attaches AI narrative contrasting scenario outcomes, and notes manual override option for edge jurisdictions.
   - Meeting minutes captured in notes, converted into tasks via AI summarizer. Team exports compliance snapshot for board meeting.

3. **Enterprise Program Admin Governance Flow**
   - Program admin monitors Master Admin Portal: seat usage spike triggers alert; admin inspects back-pressure queue metrics, approves temporary burst capacity, and schedules security committee review of drift alerts weekly.
   - Quarterly access review kicks off automatically; admin reviews drift report showing one user with elevated permissions. Admin downgrades role and forces re-auth, with update logged to auditor portal.
   - Security incident simulation: support agent requests impersonation; dual-authorization prompt sent to admin, who approves limited 30-minute window with watermarking.
   - Admin completes release readiness checklist for upcoming feature flag rollout; override log empty so workflow unblocks deployment, with backlog thresholds escalating to compliance committee if exceeded.

4. **Implementation Partner Migration Playbook**
   - Partner activates sandbox with anonymized data; platform enforces expiring token policy and records watermark on export package.
   - Migration tool runs dry-run import; validation report shows 12 errors. Partner fixes mappings and reruns; success message includes rollback artifact.
   - Partner submits QA export; compliance watermark audit runs automatically. Client approves go-live; scheduled cutover orchestrates seat provisioning, integration secrets, and AI provider policy alignment with rollback plan staged if approval pauses.
   - Post-migration health dashboards compare adoption metrics; Customer Success receives alerts for under-engaged teams and schedules enablement session.

5. **Community Leader Growth Flywheel**
   - Community leader drafts premium event landing page using marketing site builder; SEO assistant recommends schema updates which leader accepts.
   - Launches event with tiered pricing; Starter customers see upgrade CTA, while Enterprise users receive complimentary access automatically applied via entitlements and dispute handling policy queued in billing workflow.
   - Podcast studio auto-captures session, generates transcript, and routes to content hub. Leader reviews AI summary, compliance queue signs off, messaging adjusts, then gated article publishes.
   - Post-event automation sends NPS survey, tallies responses, and feeds opportunities into CRM integration. Leader reviews community analytics, identifies highly engaged members, and triggers referral program automation.

---

## UX Design Principles

- **Clarity with guardrails**: Dashboards emphasize actionable KPIs and pair anomalies or failed automations with inline remediation guidance.
- **Continuity of context**: Breadcrumbs, cross-view highlights, and secure quick switchers keep users anchored to the same deal, data room, or valuation state—even when recovering from errors.
- **Trust & compliance signaling**: Visual states explain why protections are active (watermarks, legal hold, impersonation) and link to audit details without forcing context switches.
- **Assistive intelligence with reversibility**: AI suggestions surface rationale, diff previews, undo, and manual fallback paths whenever providers degrade or fail over.
- **Responsive & resilient parity**: Deliver consistent interactions across widescreen, tablet, and mobile, including offline-safe toasts and queued actions that recover gracefully after outages.
- **Accessibility & inclusive operations**: Enforce WCAG 2.1 AA, honor reduced-motion/high-contrast modes, and provide compliance presets for regulated reviewers.
- **Failure-aware recovery**: Design error states with contextual repair actions (retry upload, reopen approval flow, escalate to support) and feed telemetry into observability dashboards.

---

## User Interface Design Goals

- Build a cross-surface ApexDeliver design system that shares tokens with the marketing site, supports white-label variants, and exposes Storybook documentation for partners.
- Provide persona-aware dashboards with drag-and-drop widgets, saved scenarios, and one-click “board pack” exports bundling charts and commentary.
- Combine the dual-pane deal workspace with timeline overlays, AI insight ribbons, and quick actions so users can approve tasks while reviewing files.
- Adapt guided setup wizards into reusable checklists that track progress, required approvals, and handoffs into partner sandboxes.
- Modify data-dense tables with column presets, inline validations, compare mode, and keyboard-first bulk editing.
- Put dark mode, high-contrast mode, and print-to-PDF styling behind user preferences with previews so compliance teams can validate output.
- Eliminate context switching during recovery by embedding error banners, retry controls, and chat-with-support entry points directly in the view.
- Reverse map mobile and desktop layouts to keep critical controls within thumb reach on tablets while enabling multi-window command-center modes on large displays.

---

## Epic List

**Phase A – Platform Foundations**
1. **E1 – Identity & Trust Rails (~6 stories)**: Clerk auth, tenant provisioning, RBAC, audit logging, CI/CD baselines. Gating epic for all downstream work.
2. **E2 – Deal Pipeline Workspace (~8 stories)**: Configurable Kanban/list pipelines, deal detail hub, and pipeline analytics built on E1 services.
3. **E3 – Secure Data Rooms & Q&A (~8 stories)**: Permissions, watermarking, NDA acceptance, Q&A triage, and immutable access trails atop E1/E2 foundations.

**Phase B – Intelligence & Operations**
4. **E4 – Financial Intelligence Studio (~8 stories)**: Normalized ingestion, ratio engine, multi-method valuations, and narrative exports—depends on E2/E3 data contracts.
5. **E5 – Automation & Approval Engine (~7 stories)**: Templates, recurring checklists, dual-approval automations, and workload dashboards leveraging E4 data models.
6. **E6 – Monetization & Entitlement Scaling (~6 stories)**: Tier enforcement, seat management, Stripe billing flows, and revenue telemetry powering upgrade prompts.

**Phase C – AI, Integrations, Growth**
7. **E7 – AI Copilot & Oversight (~7 stories)**: Document drafting, deal matching, due-diligence copilots with provider fallback and logging (requires E4/E5/E6).
8. **E8 – Integration & Partner API Platform (~6 stories)**: OAuth connectors, webhook framework, public APIs, and developer portal enabling partner extensibility.
9. **E9 – Community & Growth Hub (~6 stories)**: Event ticketing, podcast studio, gated content, and community analytics—builds on E6 entitlements and E8 integrations.

**Phase D – Risk, Compliance, Expansion**
10. **E10 – Trust, Compliance & Observability (~8 stories)**: Security hardening, compliance automation, incident runbooks, and unified monitoring; runs in parallel but gates go-live for E7–E9.
11. **E11 – Post-Merger Integration Command Center (~7 stories)**: Productizes the PMI toolkit with strategy→execution workflows, dashboards, and automation handoffs (depends on E4/E5/E10).
12. **E12 – Real-World Modeling & Playbook Library (~6 stories)**: Curates Eric Andrews spreadsheets and real-life offer stacks into guided templates and scenario sandboxes (consumes E4 analytics, feeds E11).

> **Note:** Detailed epic breakdown with full story specifications is available in [epics.md](./epics.md)

---

## Out of Scope

- On-premise or single-tenant deployments; this release focuses on cloud multi-tenant delivery.
- Non-M&A vertical workflows (e.g., general CRM, HRIS) beyond reusable platform capabilities.
- Native mobile apps; responsive web only for this release cycle.
- Real-time voice transcription or live video conferencing—integrate existing vendors instead.
- Bespoke consulting or outsourced PMI execution; platform supplies tooling and playbooks, not services.
- External data warehouse integrations beyond scoped connectors; BI exports cover initial needs.
- Automated target sourcing web crawlers; focus remains execution, intelligence, and integration workflows.
- Legal document generation beyond templated NDAs; deep legal automation remains future integration.
