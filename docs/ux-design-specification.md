# M&A Intelligence Platform – UX Design Specification

**Date:** 2025-11-10  
**Author:** Codex (UX facilitation for BMAD create-design workflow)  
**Source Inputs:** `docs/PRD.md`, `docs/project-overview.md`, `docs/architecture.md`, `docs/development-guide.md`, `frontend/src/components/**`, `frontend/src/pages/**`

---

## 1. Experience Overview

- **Vision:** Deliver a “single cockpit” where deal teams orchestrate sourcing through close alongside AI copilots, keeping legal, finance, and growth stakeholders in lockstep.
- **Core Actions:** Manage pipelines (drag/drop), generate valuations + narratives, administer data rooms/Q&A, trigger automations/tasks, monitor billing + tenant health, and drive marketing funnels without leaving the workspace.
- **Desired Feeling:** Calm control and trusted intelligence—users should feel confident that every decision is auditable, data-backed, and immediately actionable.
- **Primary Platforms:** Desktop-first responsive web (React/Vite) with mobile-optimized summaries for executives. Marketing site shares the same component system to maintain trust across acquisition and product surfaces.

---

## 2. Personas & Jobs-to-be-Done

| Persona | Goals | UX Notes |
| --- | --- | --- |
| **Deal Principal** (Partner / CorpDev lead) | Track portfolio health, approve valuations, unblock diligence | Needs high-signal dashboards, anomaly callouts, “explain the why” insights. |
| **Deal Associate / Analyst** | Maintain pipelines, build valuations, manage Q&A, keep documents current | Requires frictionless data entry, AI assist for drafts, keyboard-first workflows. |
| **Operations / Compliance** | Enforce legal holds, audit document access, manage permissions | Needs audit logs in 1–2 clicks, contextual warnings, bulk permission actions. |
| **Master Admin Staff** | Monitor tenants, intervene on billing/compliance, impersonate when necessary | Needs global search, health signals, guardrails when impersonating. |
| **Marketing / Growth Lead** | Publish content, nurture leads, capture analytics | Shares marketing components but needs clear CTAs tying back to workspace upgrades. |

---

## 3. Experience Pillars

1. **Unified Insight:** KPI surfaces pair quantitative charts with AI narratives explaining variance (“Deal Copilot Commentary”).  
2. **Auditable Confidence:** Every sensitive action (download, impersonation, AI publish) shows reason codes and links to logs.  
3. **Guided Velocity:** Inline assistants suggest next actions, pre-fill templates, and highlight SLA risks.  
4. **Upgradeable Moments:** Marketing and workspace UI reuse CTA primitives to nudge tier upgrades exactly where friction appears (storage, AI minutes, seats).  
5. **Calm Visual System:** Neutral slate background with indigo gradients for focus states; warnings use amber with textual rationale.

---

## 4. Key Journeys & Screen Blueprints

### 4.1 Deal Workspace (Authenticated)
1. **Overview Dashboard:**  
   - KPI tiles (pipeline velocity, win-rate, valuation variance) + narration drawer.  
   - “Attention Queue” displaying overdue tasks, expiring NDAs, AI suggestions.  
   - Quick filters for sector/stage; pinned insights per persona.
2. **Pipeline Board (`frontend/src/pages/deals/DealPipeline.tsx`):**  
   - Column headers show SLA badge + stage automation icon.  
   - Cards reveal micro-actions (assign, add note, run valuation) on hover.  
   - Drag/drop triggers AI summary toast (“Next best action recorded”).  
3. **Deal Detail:**  
   - Tabbed layout (Summary, Valuations, Documents, Tasks, Q&A).  
   - Right rail: Copilot suggestions, risk indicators, upgrade prompts if limits reached.

### 4.2 Valuation Workbench
- Multi-method selector (DCF, comps, multiples) with progress tracker.  
- Split-pane: inputs left, preview/narrative right.  
- “Narrative trust strip” shows data lineage + reviewer sign-off requirement.  
- Export menu supports PDF, direct-to-data-room, and shareable link (watermark enforced).

### 4.3 Data Room & Q&A
- File tree with sensitivity badges + watermark toggle.  
- Q&A board uses triage columns (New, Draft, Approved, Published) mirroring Kanban interactions.  
- Answer composer integrates AI redaction hints; publishing requires dual confirmation if tagged “Restricted”.

### 4.4 Automation & Tasks
- Template gallery w/ filters (diligence, finance, marketing).  
- Task timeline surfaces per deal and global view; progress chips show blockers.  
- Automation builder uses “if/then” cards with inline test harness.

### 4.5 Billing & Upgrades
- Usage heatmap (seats, storage, AI minutes) with thresholds.  
- Inline CTA component reused on workspace surfaces (Deal detail > Documents > “Add storage”).  
- Stripe checkout modal inherits brand tokens; confirm screen loops to Master Admin view for recordkeeping.

### 4.6 Master Admin Console
- Global search w/ keyboard shortcut.  
- Tenant detail shows compliance checklist, access review clock, impersonation guardrail card.  
- Activity tracker timeline merges product + billing events.

### 4.7 Marketing Funnel
- Landing hero with social proof + ROI calculator (existing component).  
- Pricing cards align tiers with workspace limits; upgrade button deep-links to `/dashboard/billing`.  
- Event/Podcast pages reuse CTA + trust badges; blog detail page highlights “Start trial” at mid + end segments.

---

## 5. Information Architecture & Navigation

- **Primary Shell (`RootLayout`):** Left nav anchored for workspace (Dashboard, Deals, Data Room, Valuations, Tasks, Master Admin). Marketing routes maintain top nav (`MarketingNav`).  
- **Global Search:** Cmd/Ctrl+K overlay for quick navigation, tenant switch, and slash commands.  
- **Status System:** Banners reserved for compliance alerts; inline toasts for low-risk AI actions.  
- **Context Switching:** Right-rail context panel handles AI suggestions, upgrade nudges, and logs to avoid modals.

---

## 6. Component & Pattern Updates

| Component | Update |
| --- | --- |
| `src/components/ui/Button.tsx` | Add “Command” variant for Copilot actions (icon + gradient border). |
| `src/components/deals/DealCard` | Inject SLA badge + hover micro-actions. |
| `src/components/valuation/ValuationSummary` | Add narrative trust strip + reviewer status pill. |
| `src/components/documents/DataRoomTree` | Introduce sensitivity badges, watermark toggle, and legal-hold indicator. |
| `src/components/tasks/TaskTimeline` | Support automation badge + inline test result. |
| `src/components/master-admin/*` | Add impersonation guardrail modal, health score chips. |
| `src/components/marketing/*` | Ensure CTA + trust badge variants match workspace palette for continuity. |

Design tokens: see `docs/ux-color-themes.html` for palette (Indigo 600 primary, Slate neutrals, Emerald success, Amber warnings, Rose critical). Typography sticks with Inter; add numeric tabular variant for finance tables.

---

## 7. Accessibility & Responsiveness

- Target WCAG 2.1 AA: 4.5:1 color contrast on buttons/text, focus outlines using `focus:ring-offset-2`.  
- Provide keyboard shortcuts for pipeline actions, valuation steps, search, and impersonation approval.  
- Ensure charts provide textual summaries (AI narrative) and ARIA descriptions.  
- Responsive behavior:  
  - Mobile: collapse left nav into bottom sheet, show pipeline lists with swipe gestures.  
  - Tablet: maintain dual-pane for deals/valuations.  
  - Desktop: prefer ≥1280px canvas; support 1440px analytics view with additional cards.

---

## 8. Dependencies & Open Questions

1. **Design System Refresh:** Need Tailwind token updates + Storybook (or equivalent) snapshots for new states.  
2. **Copilot Interaction Guidelines:** Align with AI compliance (redaction, reviewer approvals).  
3. **Performance Budgets:** Charts + AI panels must lazy load to keep dashboard p95 < 300 ms.  
4. **Marketing/Workspace Bridge:** Confirm analytics IDs so CTA conversions can be attributed end-to-end.  
5. **Mobile Priorities:** Define minimal mobile flows (deal updates, executive readouts) for Phase 1 vs later.

---

## 9. Next Steps

1. Produce high-fidelity mockups for: Dashboard, Deal pipeline, Valuation workbench, Data room/Q&A, Billing dashboard, Master Admin console, Landing hero refresh.  
2. Update component library with new variants + tokens (buttons, cards, badges, CTA bars).  
3. Pair with architecture workflow to confirm data/permission implications (audit logs, watermark toggles, impersonation guardrails).  
4. Hand off annotated mockups and interaction specs to engineering with inline references to `docs/PRD.md` requirements IDs.  
5. Validate prototypes with 3 pilot tenants focusing on pipeline + valuation flows; gather qualitative emotion feedback (“calm control”).

---

_Document produced via BMAD `create-design` facilitation to guide UX, PM, and engineering alignment._
