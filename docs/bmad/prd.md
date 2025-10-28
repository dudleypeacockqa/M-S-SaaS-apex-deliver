# M&A Intelligence Platform Product Requirements Document (PRD)

**Author:** Dudley Peacock
**Date:** 2025-10-28
**Project Level:** 4
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

FR001: Enforce multi-tenant isolation on every backend call using Clerk-issued org/user claims, defaulting to deny when claims are absent.
FR002: Support centralized identity via Clerk with session management, SSO expansion, and dynamic tier claim refreshes.
FR003: Provide self-serve organization onboarding, invitation workflows, and enterprise CSV/SCIM imports with audit logging.
FR004: Offer role management (Owner, Admin, Member, Read-only) plus custom permission sets to satisfy enterprise RBAC demands.
FR005: Deliver a Master Admin Portal for platform staff to search, suspend, re-activate tenants, and view compliance status.
FR006: Allow configurable deal pipelines with reusable stage templates, per-stage SLAs, and branching path support.
FR007: Expose Kanban and list views with inline editing, bulk actions, and swim-lane filtering by owner, sector, or tier.
FR008: Link deals to organizations, contacts, valuations, documents, tasks, and notes with bidirectional navigation panels.
FR009: Provide portfolio dashboards (funnel, velocity, win-rate, forecast) filterable by timeframe, region, and team.
FR010: Enable per-deal data rooms with folder hierarchies, permission groups, watermarking, and download controls.
FR011: Maintain immutable access logs with viewer identity, timestamp, action, and device fingerprint for every sensitive asset.
FR012: Deliver structured Q&A workflows including question intake, triage, approval, publication, and audit history.
FR013: Auto-generate NDAs/access agreements and collect digital acceptance before data room permissions activate.
FR014: Ingest accounting data to compute 47+ ratios, KPI trends, and scenario analyses with alert thresholds.
FR015: Provide multi-method valuation models (DCF, Comparable Companies, Precedent Transactions) with configurable assumptions.
FR016: Store valuation snapshots, enable side-by-side comparisons, and attach decisions to deals for governance review.
FR017: Let teams design task templates, recurring checklists, and dependency chains mapped to pipeline transitions.
FR018: Trigger automations (notifications, doc requests, AI summaries) based on rule engines, stage changes, or data anomalies, with high-impact actions requiring dual-approval flows and full audit trails before execution.
FR019: Surface workload dashboards highlighting overdue, blocked, or quota-exceeding tasks with reassignment tools.
FR020: Enforce tier-based feature flags and quota limits synchronized between Stripe billing and Clerk identity claims.
FR021: Support seat-based billing, add-on purchases (events, studio), proration, refunds, and automated invoice issuance.
FR022: Offer customer self-service portals for upgrading, downgrading, payment method management, and invoice exports.
FR023: Orchestrate AI providers via a centralized service that manages prompt templates, provider selection, and cost budgets.
FR024: Generate AI-assisted recommendations (deal matching, doc summarization, risk flags) with human-in-the-loop approval and entitlement-aware filtering that redacts sensitive attributes per persona tier.
FR025: Persist AI outputs with source references, evaluation status, and feedback loops for continuous improvement, enforcing access controls that mirror feature entitlements.
FR026: Provide bi-directional sync connectors for Xero, QuickBooks, Sage, NetSuite, GoHighLevel, Stripe, and SendGrid/SES.
FR027: Expose REST and GraphQL APIs with per-tenant keys, fine-grained scopes, sandbox tenants, and webhook publishing.
FR028: Monitor integrations via heartbeat checks, retry queues, and incident alerts visible in admin dashboards.
FR029: Deliver a content hub supporting articles, templates, lead magnets, and gated downloads tied to CRM scoring.
FR030: Operate a podcast/video production workflow covering script authoring, asset storage, editing checkpoints, and distribution.
FR031: Provide event management (tickets, agendas, attendee CRM sync, post-event surveys) with free and premium pricing.
FR032: Power a community space with moderated channels, role-based groups, rich messaging, and engagement analytics.
FR033: Capture audit trails for all configuration changes, data exports, and admin overrides with retention configurable per tenant.
FR034: Generate compliance packages on demand (GDPR DSAR bundle, SOC 2 evidence, security posture report).
FR035: Enforce configurable data retention/destruction schedules, legal holds, and case-specific preservation policies.
FR036: Maintain a marketing site with localization, A/B testing, dynamic pricing calculators, testimonials, and CRM routing.
FR037: Provide structured lead capture forms with progressive profiling and automated assignment into sales motions.
FR038: Support SEO-optimized landing pages, schema markup, and analytics instrumentation for campaign attribution.
FR039: Provide tenant-level data classification catalogs, privacy dashboards, and automated Data Subject Request workflows tied to audit logging.
FR040: Generate finance-grade ARR/MRR, churn, expansion, and revenue recognition reports with export to CSV/API for accounting systems.
FR041: Offer partner/implementation sandboxes with anonymized sample data, templated configurations, and migration utilities for phased cutovers, enforcing automated data scrubbing verification and usage logging.
FR042: Deliver a support console with consented user impersonation, ticketing integrations (e.g., Zendesk/Jira), and safe session replay to accelerate incident resolution, with time-bound sessions, user notifications, and dual authorization for escalated access.
FR043: Surface customer health scores and adoption alerts combining product telemetry, billing signals, and support history for the Customer Success team.
FR044: Provide release readiness workflows that bundle feature flags, change logs, rollout plans, and automated stakeholder notifications before production pushes, enforcing blocking gates for compliance checklists and logging any overrides.

### Non-Functional Requirements

- **Reliability & Availability**: 99.95% uptime SLO, multi-region failover plan, automated backups (15-minute RPO) with quarterly recovery drills.
- **Performance**: Sub-200ms P95 API latency for core deal operations, data-room downloads streaming within 3 seconds, and web vitals LCP <2.5s on enterprise datasets.
- **Security & Compliance**: SOC2 Type II roadmap, GDPR/UK Data Protection alignment, field-level encryption for sensitive records, and continuous vulnerability scanning.
- **Scalability**: Horizontal scaling for FastAPI workers, async task processing via Celery/Redis, CDN-backed asset delivery, and tenant-aware sharding strategy as ARR grows.
- **Observability**: Centralized logging with structured events, OpenTelemetry tracing, AI usage dashboards, and automated anomaly alerts for billing or log-in spikes.
- **Data Governance**: Immutable audit trails for financial transactions and document access, configurable retention policies, and right-to-be-forgotten workflows.
- **Supportability**: Feature flags for progressive rollout, environment parity enforced via CI pipelines, and blue/green deployment playbooks captured in release docs.
- **Accessibility & UX**: WCAG 2.1 AA compliance, keyboard-first navigation for key workflows, localization readiness, and consistent design tokens across web properties.

---

## User Journeys

1. **Solo Dealmaker Onboarding & Deal Execution**
   - Signs up, creates an organization, invites a collaborator, and configures a lean pipeline.
   - Imports historical deals via CSV, spins up a secure data room, and shares documents with buyers.
   - Runs AI-assisted financial analysis, generates a valuation memo, and sends automated updates to stakeholders.

2. **Growth Firm Collaboration Loop**
   - Analyst logs into shared workspace, reviews task queue generated from due diligence checklist.
   - Team members co-author deal notes, respond to Q&A requests in the data room, and track blockers via dashboards.
   - Weekly review meeting leverages pipeline analytics and valuation snapshots exported to PDF.

3. **Enterprise Admin Governance**
   - Platform admin monitors subscription usage, seat allocations, and compliance warnings from the Master Admin Portal.
   - Initiates bulk role updates, audits access logs, and enforces watermarking policies ahead of a high-profile transaction.
   - Coordinates with finance to reconcile invoices and pushes webhook events into downstream ERP systems.

4. **Community Leader Engagement Flywheel**
   - Host creates a premium event, markets it via landing page modules, and sells tickets tied to Stripe subscriptions.
   - Captures recordings in the podcast studio, publishes gated content, and nurtures leads into higher subscription tiers.

---

## UX Design Principles

- **Clarity over clutter**: Focus dashboards on actionable metrics, progressively disclose advanced analytics.
- **Continuity of context**: Preserve deal context across pipeline, data room, and valuation views with shared sidebars.
- **Trust signaling**: Surface security states, audit badges, and compliance checkpoints at every sensitive interaction.
- **Assistive intelligence**: Blend AI suggestions with transparent rationale and easy user overrides.
- **Responsive parity**: Ensure tablet + widescreen parity for deal teams working in conference rooms or on the go.
- **Accessibility by default**: High-contrast palettes, scalable typography, and screen-reader friendly labeling across modules.

---

## User Interface Design Goals

- Establish a cohesive ApexDeliver design system (color tokens, typography, iconography) reusable across marketing and app surfaces.
- Provide configurable dashboards with drag-and-drop widgets and saved views per persona.
- Use dual-pane layouts for deal detail views so teams can manage tasks while reviewing documents.
- Deliver guided setup wizards for pipelines, valuations, and automation rules to reduce time-to-value.
- Optimize data-dense tables with column personalization, quick filters, and inline bulk actions.
- Support dark mode and print-friendly exports for board materials and client-ready reports.

---

## Epic List\r\n\r\n1. **E1 – Identity & Tenant Foundations (≈6 stories)**: Clerk-backed auth, tenant provisioning, RBAC, audit logging, CI/CD rails, and deployment automation that underpin every other epic.
2. **E2 – Deal Pipeline Workspace (≈8 stories)**: Configurable Kanban/list pipelines, deal detail hub, and analytics tiles so teams can execute core deal flow end to end.
3. **E3 – Secure Data Rooms (≈8 stories)**: Deal-scoped data rooms with permissions, watermarking, NDA acceptance, Q&A workflows, and immutable access trails for due diligence.
4. **E4 – Financial Intelligence Studio (≈8 stories)**: Normalized financial ingestion, ratio engine, multi-method valuations, narrative insights, and exports powered by modeling services.
5. **E5 – Task & Automation Engine (≈7 stories)**: Templates, recurring checklists, Celery-backed automations, workload dashboards, and alerting to operationalize delivery playbooks.
6. **E6 – Monetization & Billing (≈6 stories)**: Tier entitlements, seat management, Stripe billing flows, usage telemetry, and revenue dashboards for ARR governance.
7. **E7 – AI Copilot Services (≈7 stories)**: Document drafting, deal matching, due-diligence copilots, routing controls, and AI oversight ledger built atop earlier data layers.
8. **E8 – Community & Growth Hub (≈6 stories)**: Event ticketing, podcast studio, gated content, and community analytics to drive engagement-led growth loops.
9. **E9 – Integration & API Platform (≈6 stories)**: OAuth connectors, webhook framework, public APIs, and developer portal extending platform reach into external stacks.
10. **E10 – Trust, Compliance & Observability (≈8 stories)**: Security hardening, compliance automation, incident response playbooks, and unified monitoring across AI and billing signals.
11. **E11 – Post-Merger Integration Command Center (≈7 stories)**: Productize the "VI. Post Merger Integration" toolkit with strategy -> detailed plan workflows, execution dashboards, and PMI task orchestration mapped to deal handoffs.
12. **E12 – Real-World Modeling & Playbook Library (≈6 stories)**: Curate the Eric Andrews financial spreadsheets and real-life offer stacks into guided templates, scenario sandboxes, and case-study knowledge base surfaced throughout valuations and PMI epics.\r\n> **Note:** Detailed epic breakdown with full story specifications is available in [epics.md](./epics.md)

---

## Out of Scope

- Building bespoke on-premise deployments or single-tenant forks (cloud multi-tenant only for this release cycle).
- Supporting non-M&A vertical workflows (e.g., general CRM, HRIS) beyond reusable platform capabilities.
- Developing native mobile apps; responsive web is required, mobile wrappers can follow later roadmap.
- Real-time voice transcription or live video conferencing—integrate with existing vendors instead.
- Manual consulting services; the focus remains on SaaS delivery, with partners handling bespoke advisory work.




















