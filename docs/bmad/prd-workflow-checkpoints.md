# PRD Workflow Checkpoints

## Step 0 - project_config outputs (2025-10-28)
project_name = M&A Intelligence Platform
project_type = software
project_level = 4
field_type = greenfield
workflow_path = bmad/bmm/workflows/workflow-status/paths/greenfield-level-4.yaml
status_file_path = docs/bmad/bmm-workflow-status.md

## Step 0.5 - validate outputs (2025-10-28)
status_exists = true
current_phase = Phase 2 - Planning
current_workflow = prd
next_workflow = create-design
project_level = 4
project_type = software
field_type = greenfield
should_proceed = true
warning = 
suggestion = Resuming prd
status_file_path = docs/bmad/bmm-workflow-status.md

## Step 2 - goals output (2025-10-28)
- Deliver a unified deal lifecycle workspace covering pipeline management, secure data rooms, valuations, tasks, and analytics so M&A teams can execute end-to-end inside one platform.
- Embed AI-driven intelligence (financial ratios, multi-method valuations, deal matching, document generation) that produces differentiating insights and automation over manual workflows.
- Guarantee enterprise-grade security, compliance, and governance with multi-tenant isolation, RBAC, audit trails, watermarking, and GDPR/SOC2 readiness across all modules.
- Achieve aggressive revenue and adoption targets — 1,000 subscribers and £2M ARR within 12 months — to fund ApexDeliver’s systematic LBO strategy and product reinvestment.
- Build community-powered growth loops via content hubs, events, podcast studio, and professional network features that drive engagement and premium upsell paths.
- Integrate deeply with accounting, billing, marketing, and communications systems while automating workflow handoffs to eliminate manual data preparation and accelerate deal cycles.
- Provide a resilient, scalable platform with 99.95% uptime, sub-200ms APIs, comprehensive TDD coverage, and multi-region readiness to support enterprise scale customers.

## Step 2 - background_context output (2025-10-28)
The M&A Intelligence Platform launches into record-high SaaS M&A activity and a rapidly expanding vertical SaaS market, yet the segment serving solo dealmakers and mid-market firms remains underserved by enterprise tools that demand £10k+ annual spend. By fusing pipeline execution, financial intelligence, and secure collaboration into one ecosystem, the platform addresses the fragmentation, cost barriers, and lack of AI support that currently force teams to juggle spreadsheets, point solutions, and risky ad-hoc processes.

ApexDeliver is targeting a full production build that completes DEV-011 through DEV-018 while scaling marketing phases 2–10, using strict BMAD + TDD practices to hit 1,000 subscribers, £2M ARR, and 2,000+ automated tests. Those outcomes fund the founder’s systematic LBO strategy, expand multi-tenant security and compliance posture, and unlock community-driven growth loops spanning podcast, events, and professional networking.

## Step 3 - functional_requirements output (2025-10-28)
**Identity & Access Management**
- Must enforce multi-tenant isolation for every API call using Clerk-issued organization and user claims; sensitive resources default to deny if claims are missing.
- Must provide self-serve onboarding (create org, join via invite, enterprise CSV/SCIM import) with role assignment (Owner, Admin, Member, Read-only) and audit logs.
- Must expose a Master Admin Portal so platform staff can search, suspend, and reactivate any tenant while preserving compliance trails.

**Deal Lifecycle Operations**
- Must support configurable pipelines with stage templates, Kanban/List views, bulk updates, and per-stage SLAs.
- Must allow linking deals to organizations, contacts, documents, notes, tasks, and valuations with bidirectional navigation.
- Must surface portfolio-level dashboards (funnel, win-rate, velocity, forecast) filterable by tier, geography, and owner.

**Secure Document & Data Room**
- Must deliver per-deal data rooms with folder hierarchies, permission groups, watermarking, download controls, and immutable access logs.
- Must provide Q&A workflows (question intake, triage, answer publication, audit history) with role-based visibility.
- Must generate automatic NDAs and access agreements, collecting digital acceptance before granting access.

**Financial Intelligence & Valuation Suite**
- Must calculate 47+ financial ratios, scenario analyses, Monte Carlo simulations, and KPI trends from ingested accounting data.
- Must provide multi-method valuations (DCF, Comparable Companies, Precedent Transactions) with export to PDF/Excel and transparent assumptions.
- Must allow users to store valuation snapshots, compare revisions, and attach them to deals for decision reviews.

**Workflow Automation & Tasks**
- Must allow creation of task templates, recurring checklists, and dependency chains mapped to pipeline stage transitions.
- Must trigger automations (notifications, task generation, doc requests) based on rules, system events, or AI classifications.
- Must provide workload dashboards that highlight overdue, blocked, or quota-exceeding tasks across teams.

**Subscription & Billing**
- Must enforce tier-based feature flags (Starter, Professional, Premium, Enterprise) and quota limits sourced from Stripe + Clerk.
- Must support seat-based billing, add-on purchases (events, podcast studio), proration, refunds, and invoice delivery.
- Must expose customer self-service for upgrading, downgrading, and exporting historical invoices.

**AI & Analytics Services**
- Must orchestrate AI providers (OpenAI, Claude) via centralized service with fallbacks, cost tracking, and prompt templates.
- Must generate AI-assisted recommendations (deal match scoring, document summarization, risk flags) with human-in-the-loop review.
- Must record AI outputs + source data for compliance, allowing replays and fine-tuning feedback loops.

**Integrations & APIs**
- Must offer bi-directional sync with Xero, QuickBooks, Sage, NetSuite, GoHighLevel, Stripe, and SendGrid/SES.
- Must expose REST + GraphQL APIs with webhook publishing, rate limits, per-tenant keys, and sandbox environments.
- Must maintain integration health monitors (heartbeat, error queues, retry policies) surfaced in admin dashboards.

**Community, Content, and Events**
- Must deliver a content hub (articles, templates, lead magnets), podcast workflow (script, recording, publishing), and video hosting pipeline.
- Must provide event management (tickets, agendas, attendee CRM sync, post-event surveys) with both free and premium monetization paths.
- Must power a moderated community space with role-based groups, messaging, announcements, and analytics on engagement.

**Governance & Compliance Tooling**
- Must capture audit trails for all user actions, configuration changes, and data exports with long-term retention policies.
- Must generate compliance packages (GDPR Data Subject report, SOC 2 evidence, security posture) on demand.
- Must support configurable data retention/destruction schedules per tenant and automatic legal hold enforcement.

**Marketing & Acquisition Frontend**
- Must maintain a high-performance marketing site (vite/react) with localization, A/B testing, and gated content forms tied to the CRM.
- Must support dynamic pricing calculators, case studies, testimonials, and lead routing to sales automation sequences.
- Must deliver SEO-optimized landing pages with Lighthouse 90+ scores and structured schema markup.

## Step 3 - non_functional_requirements output (2025-10-28)
**Security & Privacy**
- Enforce zero-trust defaults: RBAC + ABAC, per-tenant encryption keys, secrets rotation, and signed webhook verification.
- Conduct quarterly penetration tests, continuous dependency scanning, and automated OWASP/SAST/DAST pipelines.
- Provide GDPR, SOC2, and PCI-DSS alignment including data residency controls, breach notification playbooks, and privacy impact assessments.

**Performance & Scalability**
- Backend API p95 latency <= 200ms for transactional endpoints (400ms for analytics) under 5x projected load.
- Frontend bundles <= 200KB critical path, initial load <= 3s on 3G; marketing site CLS <0.1, LCP <2.5s.
- Horizontal scaling strategy with autoscaling policies, database read replicas, and async job queuing sized for 10k concurrent users.

**Reliability & Availability**
- Target 99.95% uptime for core platform, 99.9% for marketing site; implement multi-region failover for critical services.
- Provide RPO <= 15 minutes and RTO <= 30 minutes with automated backups, point-in-time recovery, and chaos testing.
- Maintain graceful degradation paths (read-only mode, queued actions) during partial outages.

**Observability & Operations**
- Centralize structured logs, metrics, and traces with correlation IDs; alert on SLO breaches and anomalous tiers usage.
- Provide runbooks, incident response automation, and post-incident review templates stored in shared knowledge base.
- Instrument feature usage analytics for roadmap prioritization and adoption tracking.

**Quality Engineering**
- Maintain >= 90% backend coverage, >= 85% platform frontend, >= 90% marketing frontend using RED→GREEN→REFACTOR cadence.
- Block releases on failing tests, lint violations, or coverage regressions exceeding 2%.
- Require story-level acceptance tests (API, UI, E2E) before marking epics complete.

**User Experience**
- Ensure consistent design system (responsive, accessible WCAG 2.1 AA) across platform and marketing surfaces.
- Provide contextual guidance (tours, tooltips, inline validation) tailored to user role and tier.
- Localize core flows for English launch with architecture enabling rapid additional locales.

**Data Management**
- Guarantee immutable audit logs, version history for deals/docs/valuations, and soft-delete with retention windows.
- Support tenant-level data export/import, anonymization tooling, and on-demand legal discovery packages.
- Implement data quality monitoring (duplication, missing fields, sync drift) with remediation workflows.

**Compliance & Governance**
- Align with financial regulations (KYC/KYB for billing, AML screening) and record retention mandates.
- Provide consent tracking for communications, cookie management, and DSR handling automation.
- Maintain documented security policies, access reviews, and least-privilege enforcement across infrastructure.

**Deployment & Delivery**
- Use GitHub Actions CI with gated PR approvals, environment promotion workflows, and Render deployment automation.
- Require blue/green or canary releases for backend/frontends; support instant rollback and feature flag kill switches.
- Track configuration drift via IaC (Terraform/Render YAML) with weekly reconciliation audits.

## Step 3 - non_functional_requirements tabled (2025-10-28)
**Security & Privacy**
- Enforce zero-trust defaults: RBAC + ABAC, per-tenant encryption keys, secrets rotation, and signed webhook verification.
- Conduct quarterly penetration tests, continuous dependency scanning, and automated OWASP/SAST/DAST pipelines.
- Provide GDPR, SOC2, and PCI-DSS alignment including data residency controls, breach notification playbooks, and privacy impact assessments.

**Performance & Scalability**
- Backend API p95 latency <= 200ms for transactional endpoints (400ms for analytics) under 5x projected load.
- Frontend bundles <= 200KB critical path, initial load <= 3s on 3G; marketing site CLS <0.1, LCP <2.5s.
- Horizontal scaling strategy with autoscaling policies, database read replicas, and async job queuing sized for 10k concurrent users.

**Reliability & Availability**
- Target 99.95% uptime for core platform, 99.9% for marketing site; implement multi-region failover for critical services.
- Provide RPO <= 15 minutes and RTO <= 30 minutes with automated backups, point-in-time recovery, and chaos testing.
- Maintain graceful degradation paths (read-only mode, queued actions) during partial outages.

**Observability & Operations**
- Centralize structured logs, metrics, and traces with correlation IDs; alert on SLO breaches and anomalous tiers usage.
- Provide runbooks, incident response automation, and post-incident review templates stored in shared knowledge base.
- Instrument feature usage analytics for roadmap prioritization and adoption tracking.

**Quality Engineering**
- Maintain >= 90% backend coverage, >= 85% platform frontend, >= 90% marketing frontend using RED→GREEN→REFACTOR cadence.
- Block releases on failing tests, lint violations, or coverage regressions exceeding 2%.
- Require story-level acceptance tests (API, UI, E2E) before marking epics complete.

**User Experience**
- Ensure consistent design system (responsive, accessible WCAG 2.1 AA) across platform and marketing surfaces.
- Provide contextual guidance (tours, tooltips, inline validation) tailored to user role and tier.
- Localize core flows for English launch with architecture enabling rapid additional locales.

**Data Management**
- Guarantee immutable audit logs, version history for deals/docs/valuations, and soft-delete with retention windows.
- Support tenant-level data export/import, anonymization tooling, and on-demand legal discovery packages.
- Implement data quality monitoring (duplication, missing fields, sync drift) with remediation workflows.

**Compliance & Governance**
- Align with financial regulations (KYC/KYB for billing, AML screening) and record retention mandates.
- Provide consent tracking for communications, cookie management, and DSR handling automation.
- Maintain documented security policies, access reviews, and least-privilege enforcement across infrastructure.

**Deployment & Delivery**
- Use GitHub Actions CI with gated PR approvals, environment promotion workflows, and Render deployment automation.
- Require blue/green or canary releases for backend/frontends; support instant rollback and feature flag kill switches.
- Track configuration drift via IaC (Terraform/Render YAML) with weekly reconciliation audits.
## goals (2025-10-28)
- Deliver a single workspace where M&A teams can run sourcing, diligence, negotiation, and closing without leaving the platform.
- Embed AI copilots that turn raw deal data into valuations, ratios, and narratives that accelerate decision quality.
- Guarantee enterprise-grade trust with multi-tenant isolation, granular RBAC, auditable data rooms, and compliance-ready records.
- Build predictable revenue through tiered subscriptions, metered usage insights, and self-service upgrades.
- Activate community-led growth loops via content hubs, events, and professional networking features tied to the core product.
- Integrate seamlessly with core back-office stacks (accounting, CRM, comms) so workflows stay synchronized and automated.


## background_context (2025-10-28)
The current solution already includes a production-grade FastAPI stack (ackend/app) with domain modules for deals, documents, tasks, valuations, subscriptions, and automation. Endpoints such as ackend/app/api/routes/subscriptions.py, ackend/app/api/routes/deals.py, and ackend/app/api/routes/documents.py sit on top of SQLAlchemy models (ackend/app/models) and service layers (ackend/app/services) that are covered by pytest suites (e.g., ackend/tests/test_valuation_service.py, ackend/tests/test_task_automation.py). The Vite/React frontend (rontend/src) ships authenticated workspaces, billing flows, marketing funnels, and valuation UI backed by shared hooks (rontend/src/hooks/useValuation.ts) and integration tests.

Execution history and market validation are documented across docs/bmad/technical_specifications.md, sprint and session summaries, and DEV-011/DEV-012 artefacts, all of which confirm demand for an integrated M&A operating system with AI-assisted intelligence. ApexDeliver is targeting 1,000 paying accounts and GBP 2M ARR within 12 months to bankroll a systematic LBO acquisition flywheel while reinvesting in continuous product expansion.

The platform must preserve the established architecture: multi-tenant PostgreSQL with SQLAlchemy models, modular FastAPI services orchestrated via Celery tasks, a Stripe-first billing engine, and a Vite + Tailwind frontend. Compliance, auditability, and security remain non-negotiable—SOC2/GDPR readiness, role-based isolation, traceable data-room workflows, and observability guardrails underpin every release.


## functional_requirements (2025-10-28)
FR001 (Product, Architecture, Compliance): The platform shall enforce Clerk-authenticated, multi-factor user login and create organization-scoped sessions with per-request authorization checks.
FR002 (Product, Compliance): The system shall allow organization owners to invite, approve, or revoke members and assign Owner/Admin/Member/Read-only roles with audit trails.
FR003 (Product, Architecture): The platform shall expose configurable deal pipelines (Kanban and List views) supporting custom stages, fields, filters, and saved views per user.
FR004 (Product, Architecture): Each deal record shall link to organizations, contacts, documents, valuations, tasks, automations, and activity logs with bidirectional navigation.
FR005 (Product, Compliance): The system shall provide bulk operations on deals (stage changes, assignments, tagging) gated by role permissions and logged for auditing.
FR006 (Product, Revenue): The platform shall surface portfolio dashboards summarizing funnel metrics, win-rate trends, velocity, forecast, and segment filters.
FR007 (Product, Compliance, Support): Each deal shall include a secure data room with folder hierarchies, watermarking, download controls, NDA acceptance flows, and immutable access logs.
FR008 (Product, Support): The data room shall support Q&A workflows where buyers submit questions, deal teams triage/answer, and stakeholders receive notifications.
FR009 (Product, Architecture): The platform shall ingest accounting exports (Xero, QuickBooks, Sage, NetSuite) and normalize financial statements for analysis.
FR010 (Product, Architecture): The financial engine shall compute 47+ ratios, scenario analyses, Monte Carlo simulations, and narrative insights per valuation cycle.
FR011 (Product, Architecture): The valuation suite shall support DCF, Comparable Companies, and Precedent Transactions models with versioning and PDF/Excel exports.
FR012 (Product, Compliance): Users shall be able to snapshot valuations, compare revisions, annotate findings, and attach outputs to deals for governance reviews.
FR013 (Product, Architecture, Support): The task engine shall provide templates, recurring checklists, dependency rules, and workload dashboards across teams.
FR014 (Product, Architecture): Automation rules shall trigger on events (stage change, document upload, valuation thresholds) to assign tasks, send alerts, or request documents.
FR015 (Revenue, Compliance): The subscription module shall manage tier entitlements, seat quotas, add-ons, invoicing, proration, refunds, and self-service upgrades/downgrades via Stripe.
FR016 (Revenue, Support): Billing dashboards shall present usage metrics (deals, seats, storage, automation runs) against tier allowances with upsell prompts.
FR017 (Product, Compliance): AI services shall deliver document drafting, due-diligence summaries, insight narratives, and deal matching while logging prompts/responses for review.
FR018 (Product, Compliance, Architecture): AI workload routing shall support provider failover, cost ceilings, human-in-the-loop approvals, and bias feedback loops.
FR019 (Product, Revenue): The community module shall power content hubs, gated resources, podcast scheduling, event ticketing, and revenue sharing for Community Leaders.
FR020 (Product, Revenue): Event workflows shall handle registration, ticketing, automated confirmations, attendee management, and post-event content distribution.
FR021 (Architecture, Support): Integration services shall provide OAuth onboarding, webhook verification, retry queues, and mapping toolkits for CRM, marketing, and communications systems.
FR022 (Support, Compliance): The Master Admin Portal shall allow platform staff to monitor tenant health, manage subscriptions, suspend/reactivate orgs, and communicate incidents.
FR023 (Support): Support tooling shall enable in-app help center, ticket submission, SLA tracking, and customer success notes linked to organizations.
FR024 (Product, Revenue): The analytics layer shall expose API and scheduled exports for BI tooling, including KPI metrics, valuation statistics, and automation effectiveness.
FR025 (Product): Mobile-responsive layouts shall ensure critical workflows (deal review, document approval, task triage) operate on tablet and phone browsers.
FR026 (Product, Architecture, Revenue): The system shall expose public APIs and SDK documentation for partners to extend deals, valuations, and automation capabilities securely.


## non_functional_requirements (2025-10-28)
NFR001 (Reliability): The platform shall meet a 99.95% uptime SLO with automated failover, 15-minute RPO backups, and quarterly disaster-recovery tests.
NFR002 (Performance): Core deal, valuation, and billing APIs shall maintain P95 latency below 200 ms; document downloads shall stream within 3 seconds for 500 MB files.
NFR003 (Security & Compliance): The platform shall implement SOC2 Type II controls, GDPR/UK Data Protection compliance, field-level encryption, and continuous vulnerability scanning.
NFR004 (Scalability): Infrastructure shall scale horizontally (FastAPI workers, Celery queues, CDN assets) to support 10x tenant growth without degrading SLAs.
NFR005 (Observability): Logs, traces, metrics, and AI usage counters shall feed centralized monitoring with automated anomaly alerts for auth, billing, and AI outliers.
NFR006 (Data Governance): All financial/doc access events shall be immutable, retention policies configurable per tenant, and right-to-be-forgotten executed within 30 days.
NFR007 (Supportability): Continuous delivery pipelines shall enforce environment parity, feature flags, and blue/green release playbooks captured in runbooks.
NFR008 (Accessibility & UX): Web experiences shall meet WCAG 2.1 AA, provide keyboard-first navigation, localization support, and consistent design tokens across modules.
NFR009 (Resilience & Compliance for AI): AI services shall enforce rate limits, content filters, human approval gates for high-risk actions, and redact sensitive data before provider calls.


### functional_requirements dependency mapping (2025-10-28)
Added references to shared services (event bus, audit log, analytics store), prerequisite stories (DEV-012), and downstream consumers for FR001–FR026.


### Step 3 note (2025-10-28)
- Included dependency mapping insights between FR and platform services.
- Captured NFR009 to govern AI resilience and compliance.


## user_journeys (2025-10-28)
1. Solo Dealmaker Onboarding & Deal Execution ... (Product Management, Sales, Compliance, Support).
2. Growth Firm Collaboration Loop ... (Product Management, Compliance, Support, AI Operations).
3. Enterprise Admin Governance ... (Product Management, Compliance, Finance, Support).
4. Community Leader Engagement Flywheel ... (Product Management, Sales, Compliance, Support).


## ux_principles (2025-10-28)
- Visibility without overload: assumptions → truths → new approach.
- Continuity of task context: persistent deal sidebar with AI summaries.
- Trust as a UI element: inline audit badges, provenance next to AI outputs.
- Assistive intelligence with agency: rationale + accept/decline UI.
- Responsive parity for field teams: block releases that regress mobile parity.
- Accessibility embedded: tokens + automated audits baked into CI.

## ui_design_goals (2025-10-28)
- Unified design system across marketing and product surfaces.
- Configurable workspaces with persona presets.
- Split-focus productivity via dual-pane layouts.
- Guided setup flows for pipelines, automations, valuations, events.
- Data-dense clarity with personalization and conditional formatting.
- Presentation-ready exports tied to brand guidelines.


## epic_list (2025-10-28 update)
1. E1 – Identity & Tenant Foundations (≈6 stories)
2. E2 – Deal Pipeline Workspace (≈8 stories)
3. E3 – Secure Data Rooms (≈8 stories)
4. E4 – Financial Intelligence Studio (≈8 stories)
5. E5 – Task & Automation Engine (≈7 stories)
6. E6 – Monetization & Billing (≈6 stories)
7. E7 – AI Copilot Services (≈7 stories)
8. E8 – Community & Growth Hub (≈6 stories)
9. E9 – Integration & API Platform (≈6 stories)
10. E10 – Trust, Compliance & Observability (≈8 stories)
11. E11 – Post-Merger Integration Command Center (≈7 stories)
12. E12 – Real-World Modeling & Playbook Library (≈6 stories)


## out_of_scope (2025-10-28)
- On-premise/single-tenant deployments (cloud multi-tenant only).
- Non-M&A vertical workflows beyond reusable capabilities.
- Native mobile apps; responsive web only for this release.
- Real-time transcription/video (leverage third-party tools).
- Bespoke consulting/outsourced PMI services; platform supplies tooling/playbooks.
- External data warehouse integrations beyond scoped connectors.
- Automated target sourcing crawlers; focus on execution/intelligence/integration.
- Legal doc generation beyond templated NDAs.



## Step 3 - functional_requirements revised (2025-10-28)
Grouped FR001–FR044 by domain (Identity, Deal Lifecycle, Automation, AI, Integrations, Growth, Compliance, Partner Success, Release Governance) and clarified data residency plus performance instrumentation notes.

Context paragraph added before grouped functional requirements to map domains to Epics E1–E10 and emphasize cross-cutting services.

## Step 3 - functional_requirements context added (2025-10-28)
Inserted orientation paragraph linking FR domains to Epics E1–E10 and noting cross-cutting dependency services.
### epics.md – E1 (2025-10-28)
- Stories E1.1 through E1.6 covering identity, RBAC, admin portal, CI/CD, and observability foundations.

### epics.md – E2 (2025-10-28)
- Stories E2.1 through E2.7 covering pipeline templates, Kanban/list views, deal workspace, analytics, SLA alerts, and snapshots.


## Step 4 - user_journeys output (2025-10-28)
1. Solo Dealmaker Fast-Track Onboarding: onboarding, pipeline configuration decisions, data room access approval, AI valuation with document request fallback.
2. Growth Firm Cross-Border Diligence Loop: delegated tasks, sensitive Q&A handling with labeling, anomaly-driven analytics, AI meeting summarizer.
3. Enterprise Program Admin Governance Flow: entitlement surge handling, automated access review remediation, support impersonation approval, release readiness gate.
4. Implementation Partner Migration Playbook: sandbox activation with expiring tokens, iterative import validation, rollback artifacts, adoption telemetry.
5. Community Leader Growth Flywheel: event launch with tiered entitlements, podcast/content pipeline, post-event automation feeding CRM.
### epics.md – E3 (2025-10-28)
- Stories E3.1 through E3.8 covering structure, permissions, watermarking, NDA gating, Q&A, activity timeline, classification, and guest experience.

Updated user journey steps with compliance warnings, manual override fallbacks, counsel audit trails, security committee reviews, watermark audits, and dispute handling notes.
### epics.md – E4 (2025-10-28)
- Stories E4.1 through E4.8: ingestion, ratios, DCF, comps, narratives, sensitivity, integration triggers, exports.

Updated UX design principles with failure-mode oriented guardrails, compliance signaling, responsive resilience, and recovery actions.
### epics.md – E5 (2025-10-28)
- Stories E5.1 through E5.7: templates, recurring checklists, rule builder, Celery execution, notifications, workload analytics, compliance reporting.

Enhanced UI design goals via SCAMPER: cross-surface design system, persona dashboards, AI timeline panes, approvals-aware wizards, advanced tables, adaptive theming, embedded recovery, and device-resilient layouts.
### epics.md – E6 (2025-10-28)
- Stories E6.1 through E6.6 for entitlements, Stripe sync, usage telemetry, billing dashboards, invoicing/tax, and admin overrides.

### epics.md – E7 (2025-10-28)
- Stories E7.1 through E7.7 for AI orchestration, drafting, deal matching, Q&A assistant, risk summarizer, approval console, and audit reports.

Epic list reorganized into phases A–D with explicit dependencies and story counts, adding context for PMI and modeling libraries aligned to foundational epics.
### epics.md – E8 (2025-10-28)
- Stories E8.1 through E8.6: content hub, events, podcast studio, community spaces, engagement analytics, lifecycle upsells.

### epics.md – E9 (2025-10-28)
- Stories E9.1 through E9.6: OAuth connector framework, webhook management, public APIs, marketplace UI, integration monitoring, developer portal.

### epics.md – E10 (2025-10-28)
- Stories E10.1 through E10.8 covering security hardening, compliance automation, retention/legal hold, incident response, observability dashboard, status page, AI governance reporting, compliance package generator.

### epics.md – E11 (2025-10-28)
- Stories E11.1 through E11.7 translating PMI toolkit into strategy intake, workstreams, Day 1/30/100 playbooks, KPI tracking, comms hub, risk tracker, war room dashboard.

### epics.md – E12 (2025-10-28)
- Stories E12.1 through E12.6 turning modeling spreadsheets and real-life offer stacks into catalog, wizard, sandbox, case-study knowledge, AI commentary, and upkeep workflows.

Epics.md generated with phased epic breakdown (E1–E12) and story suites aligned to functional requirements. File: docs/bmad/epics.md.

Step -1: brainstorming skipped (2025-10-28)
