# BMAD-Method Execution Plan: Master Admin Portal
## 100% Completion Roadmap

**Last Updated:** 2025-11-10 21:20 UTC  
**Status:** Phase 4 - Implementation loops in progress (W0-W5 execution)  
**Methodology:** BMAD (Build, Measure, Analyze, Deploy) + TDD (Test-Driven Development)

---

## Executive Summary

This document outlines the systematic approach to achieving 100% completion of the Master Admin Portal using BMAD-method and TDD principles. The project encompasses three major systems:

1. **Personal Activity Tracker** - Daily command center with scoring, streaks, and focus sessions
2. **GTM Sales & Marketing Engine** - Prospects, pipeline, campaigns, content creation
3. **Sales Collateral Library** - GTM materials, templates, and usage tracking

---

## 2025-11-10 Refresh - ApexDeliver Platform & Marketing

**Objective:** Drive DEV-008, DEV-016, DEV-018, MARK-002, and deployment hardening to 100% completion using BMAD v6 + strict TDD while maintaining governance evidence.

### 2025-11-12 Execution Refresh – BMAD + TDD Alignment

| Loop | Build (RED→GREEN target) | Measure (TDD anchor) | Analyze (evidence) | Deploy (exit) |
|------|--------------------------|----------------------|--------------------|---------------|
| **W0 – Governance & Harness Reset** | Remove stray DOS path fixtures, land `backend/tests/test_path_safety.py`, document pytest guardrails, refresh workflow-init metadata | `python -m pytest backend/tests/test_path_safety.py backend/tests/test_blog.py --maxfail=1 --cov=backend/app` | Update `docs/bmad/bmm-workflow-status.md`, `BMAD_PROGRESS_TRACKER.md`, and `BMAD_TDD_EXECUTION_CHECKLIST.md` with risk + mitigation notes | Commit `chore(governance): harden pytest discovery + refresh trackers`, prep PR section with evidence |
| **W1 – Backend Migration & Deploy Recovery** | Finish Alembic parity + entitlement regressions, verify billing/subscription suites, capture DB transcript | `pytest backend/tests/test_billing_endpoints.py backend/tests/test_subscription_error_paths.py --cov-report=term-missing` + `alembic upgrade head` | Append results to `docs/DEPLOYMENT_HEALTH.md`, `backend-test-baseline-2025-11-12.txt` | Push Conventional Commit `fix(backend): align billing migrations + redeploy` and rerun `scripts/verify_deployment.py production` |
| **W2 – DEV-008 Document Room Completion** | Extend PermissionModal / UploadPanel RED specs for quota + owner lock, implement share/move/delete modals, wire MSW mocks | `cd frontend && npx vitest run src/components/documents/PermissionModal.test.tsx src/components/documents/UploadPanel.test.tsx --reporter=verbose` | Update `docs/bmad/stories/DEV-008-secure-document-data-room.md` with screenshots + coverage | Merge DEV-008 branch, rerun `npm --prefix frontend run test -- documents`, capture Lighthouse delta |
| **W3 – DEV-016 Podcast Studio Video/Transcription** | Add FastAPI services, storage adapters, React upload modal; follow TDD via backend + frontend paired specs | Backend: `pytest backend/tests/test_podcast_api.py -k video`; Frontend: `npx vitest run src/components/podcast/VideoUploadModal.test.tsx` | Refresh PRD + `docs/marketing/PODCAST-STUDIO-STATUS.md`, log quotas + feature flags | Deploy backend + frontend, attach smoke + UI demo to `DEPLOYMENT-SESSION-SUMMARY.md` |
| **W4 – DEV-018 Deal Matching Intelligence** | Implement scoring analytics, criteria builder refinement, optimistic actions | `npx vitest run src/pages/deals/MatchingWorkspace.test.tsx` + targeted backend contract tests | Update `docs/bmad/stories/DEV-018-deal-matching.md`, share telemetry plan | Commit `feat(dev-018): intelligence workspace complete`, rerun integration smoke |
| **W5 – MARK-002/OPS Finalization** | Close SEO/Lighthouse gaps, structured data QA, publish remaining content/case studies | `npm --prefix frontend run test && npm --prefix frontend run build && npm --prefix frontend run preview -- --smoke` + Lighthouse CI | Update `docs/marketing/MARKETING-COMPLETION-STATUS-2025-11-11.md`, attach screenshots/video | Trigger Render deploys (`trigger_render_deploy.py`), update `latest-deploy*.json`, run `scripts/run_smoke_tests.sh production` |

### 2025-11-24 Update – FinanceFlo Marketing Merge Loop (W5)

To complete the "main website + software site" unification request we have split W5 into auditable Build→Measure→Analyze→Deploy strands:

| Loop | Build | Measure | Analyze | Deploy |
|------|-------|---------|---------|--------|
| **W5A – Brand Foundation** | Refresh MarketingLayout + nav + footer (complete) and continue cascading FinanceFlo ERP/AI positioning through About, Team, Solutions, and Pricing hero copy. | `npx vitest run src/pages/marketing/EnhancedLandingPage.test.tsx src/pages/marketing/AboutPage.test.tsx src/pages/marketing/solutions/SolutionCFO.test.tsx` | Update this plan, `BMAD_PROGRESS_TRACKER.md`, and `MARKETING_WEBSITE_STATUS.md` with coverage + copy deltas. | Commit `feat(marketing): align FinanceFlo brand story` and prep Render preview instructions. |
| **W5B – Content & SEO Evidence** | Finish canonical/OG/structured data sweep + blog backlog increments (Images + 50 posts). | `npm --prefix frontend run test -- src/pages/marketing/__tests__/seo-metadata-consistency.test.tsx` + Lighthouse. | Attach Lighthouse + axe reports to `docs/marketing/MARKETING-COMPLETION-STATUS-2025-11-11.md`. | Update `latest-frontend-deploys.json`, rerun smoke + screenshot harness. |
| **W5C – Deployment & Ops** | Lock bm deployment scripts + Render health verification (backend + frontend). | `python verify_deployment.py --target render` (or manual health curl) + smoke scripts. | Update `deployment-health-*.json`, `DEPLOYMENT_STATUS.md`. | Trigger Render redeploys + capture logs, ensuring both services run the FinanceFlo experience. |

**Immediate Focus (W5A.1):** Apply the FinanceFlo ERP + AI messaging to About/Team/Solutions pages with TDD before moving to SEO + deploy validation. This is the loop we are executing now.

This refresh keeps every loop inside BMAD’s Build → Measure → Analyze → Deploy cadence and anchors implementation to explicit TDD guardrails so the project can reach the documented 100% completion target with auditable evidence.

### Workstream Matrix

| Workstream | Scope | Primary TDD Entry Point | Definition of Done |
|------------|-------|-------------------------|--------------------|
| W0 | Governance + workflow-init | `npx bmad-method workflow-init`, tracker updates | `docs/bmad/bmm-workflow-status.md` + `BMAD_PROGRESS_TRACKER.md` synced, backlog prioritized |
| W1 | Migration + deploy recovery | `pytest tests/test_billing_endpoints.py tests/test_subscription_error_paths.py --cov ...` + `alembic upgrade head` | Postgres upgrade transcript captured, Render deploy checklist updated |
| W2 | DEV-008 Document Room UI | `npm --prefix frontend run test -- src/components/documents/*.test.tsx` | Folder tree, permissions, uploads fully covered with Vitest + Story docs updated |
| W3 | DEV-016 Podcast Studio (video + transcription) | `pytest backend/tests/test_podcast_api.py -k video` + `npm --prefix frontend run test -- VideoUploadModal.test.tsx` | Video upload + transcription services deployed with >=90% backend / >=85% frontend coverage |
| W4 | DEV-018 Deal Matching intelligence | `npm --prefix frontend run test -- src/pages/deals/MatchingWorkspace.test.tsx` | Criteria builder + analytics actions pass Vitest and backend contract tests |
| W5 | MARK-002 website + ops | `npm --prefix frontend run test -- --runInBand` + Lighthouse + `scripts/verify_deployment.py production` | Marketing site phases 3-10 complete, Render health = 100% with evidence |

### Loop Breakdown

#### W0 - Governance + Environment Prep (Analyst/PM)
- Run `npx bmad-method workflow-init` to register the next dev story and confirm Phase 4 implementation loop context.
- Update `docs/bmad/bmm-workflow-status.md`, `docs/bmad/BMAD_PROGRESS_TRACKER.md`, and `docs/100-PERCENT-COMPLETION-PLAN.md` with refreshed statuses.
- Produce risk + dependency snapshot (Postgres availability, Render API access) before dev work.

#### W1 - Migration + Deploy Recovery (DevOps/Backend)
- RED: execute billing/subscription smoke suite to reproduce failures under current env, log output.
- GREEN: patch Alembic revisions if needed, rerun tests, then run `alembic upgrade head` against Postgres (Docker/staging) capturing transcript.
- REFACTOR: document changes, prep Conventional Commit + PR update, refresh `DEPLOYMENT_HEALTH.md` and deploy JSON logs.
- Exit criteria: single-head verified on Postgres, commit ready for push, deployment checklist updated.

#### W2 - DEV-008 Secure Document Room (Frontend)
- RED: extend Vitest specs for folder tree navigation, permission modal states, upload lifecycle, bulk actions.
- GREEN: implement components + hooks, wire APIs with MSW mocks, ensure success/error toasts tracked.
- REFACTOR: share design tokens, ensure accessibility + analytics instrumentation, update story docs.
- Exit criteria: >=85% coverage for document components, UX parity with PRD, smoke demo captured.

#### W3 - DEV-016 Podcast Studio Video + Transcription (Full-stack)
- RED: add backend tests for tier gating, video upload, transcription job states; add frontend modal + progress specs.
- GREEN: build FastAPI endpoints + services, plug in storage + transcription adapters, finalize React modal + dashboards.
- REFACTOR: consolidate quota logic, add telemetry + admin audit logs, refresh documentation.
- Exit criteria: backend coverage >=90% for podcast module, frontend video workflow fully tested, Render backend redeployed successfully.

#### W4 - DEV-018 Deal Matching Intelligence (Frontend + Backend integration)
- RED: update `MatchingWorkspace.test.tsx` for criteria builder, analytics, save/pass/request-intro flows; add backend contract tests if new endpoints needed.
- GREEN: implement modals/workspace updates, wire React Query caches, ensure optimistic updates + toasts.
- REFACTOR: extract shared form config, document analytics definitions, update PRD + release notes.
- Exit criteria: match workspace feature complete with passing suites and telemetry hooks.

#### W5 - MARK-002 Marketing Website + Ops/Deployment
- RED: rerun Vitest + Lighthouse to capture current failures; document metrics in docs/marketing.
- GREEN: finish phases 3-10 (SEO, assets, gating, CTAs), fix tests, rerun Lighthouse to meet >=90.
- REFACTOR: compress assets, align Render preview, capture screenshots/video proof.
- Exit criteria: marketing tests >=90% pass, Lighthouse 90+/category, Render frontend redeployed with new assets.

#### Final Release & Handover
- Run full-platform backend + frontend suites, lint/build, manual smoke on Render (`uvicorn`, `npm run preview`).
- Update `PRODUCTION_DEPLOYMENT_CHECKLIST.md`, `DEPLOYMENT-SESSION-SUMMARY.md`, release notes, and PR description with final evidence.
- Secure sign-off by delivering coverage reports, deploy logs, and BMAD tracker entries showing all stories closed.

---

## Current Status Assessment

### ✅ Completed (35% of total scope)

**Backend Infrastructure:**
- 16 database tables created and migrated
- Complete tRPC API layer with 50+ endpoints
- Master admin authentication and role-based access
- Type-safe schemas with Zod validation

**Frontend Foundation:**
- Master Admin Layout with responsive sidebar
- Admin Dashboard home page
- Activity Tracker UI (80% complete):
  - Daily score display
  - Streak counter
  - Focus session timer
  - Weekly targets with progress bars
  - Quick activity logging with keyboard shortcuts
  - Activity timeline

**Placeholder Pages:**
- Prospects, Pipeline, Campaigns, Content, Lead Capture, Analytics

### ⏳ In Progress (0% of total scope)

None currently

### 🔴 Not Started (65% of total scope)

**Activity Tracker Enhancements:**
- Score visualization (7-day rolling chart)
- AI Advisor for next-best actions
- Weekly PDF export
- Real-time notifications for streaks/goals

**Prospect & Pipeline Management:**
- Prospect CRUD operations UI
- Lead scoring and stage management
- Activity timeline and notes
- Deal Kanban board
- Pipeline value tracking
- Win rate analytics

**Campaign Management:**
- SendGrid email integration
- Twilio SMS integration
- Campaign builder UI
- Audience segmentation
- Template library
- Campaign analytics

**Lead Capture WebApp:**
- Mobile-first PWA interface
- Voice notes recording
- GoHighLevel integration
- Automated follow-up workflows
- Offline-first capabilities

**Content Studio:**
- Script generation with AI
- Recording workflow
- Adobe Premiere Pro integration (UXP plugin)
- B-roll and asset management
- YouTube/Spotify publishing
- SEO optimization tools

**Sales Collateral Library:**
- Document upload and management
- Template system
- Usage tracking
- Search and filtering

**Analytics Dashboard:**
- Revenue tracking
- Conversion metrics
- Activity heatmaps
- GTM performance KPIs

**Testing & Quality:**
- Unit tests for all API endpoints
- Integration tests for workflows
- E2E tests for critical paths
- Performance benchmarks

**Deployment:**
- GitHub repository sync
- Render deployment configuration
- Health check endpoints
- Monitoring and alerting

---

## BMAD-Method Execution Strategy

### Phase 1: BUILD (Weeks 1-4)

**Objective:** Implement all core features with TDD approach

#### Week 1: Prospect & Pipeline Management
**TDD Approach:**
1. Write tests for prospect CRUD operations
2. Implement prospect list view with filters
3. Write tests for deal management
4. Implement Kanban board for pipeline
5. Write tests for activity timeline
6. Implement notes and attachments

**Deliverables:**
- [ ] Prospect list view with search/filter
- [ ] Prospect detail page with edit form
- [ ] Deal Kanban board (drag & drop)
- [ ] Activity timeline component
- [ ] Lead scoring calculator
- [ ] Stage transition workflows

**Tests Required:**
- [ ] Unit tests for prospect API endpoints
- [ ] Integration tests for deal creation
- [ ] E2E test for prospect-to-deal conversion

#### Week 2: Campaign Management & Integrations
**TDD Approach:**
1. Write tests for SendGrid integration
2. Implement email campaign builder
3. Write tests for Twilio integration
4. Implement SMS campaign builder
5. Write tests for campaign scheduling
6. Implement analytics tracking

**Deliverables:**
- [ ] SendGrid API integration service
- [ ] Twilio API integration service
- [ ] Campaign builder UI (email/SMS)
- [ ] Template library
- [ ] Audience segmentation tool
- [ ] Campaign analytics dashboard

**Tests Required:**
- [ ] Unit tests for SendGrid/Twilio services
- [ ] Integration tests for campaign sending
- [ ] Mock tests for external API calls

#### Week 3: Lead Capture WebApp
**TDD Approach:**
1. Write tests for lead capture form
2. Implement mobile PWA interface
3. Write tests for voice recording
4. Implement audio upload to S3
5. Write tests for GoHighLevel sync
6. Implement automated follow-ups

**Deliverables:**
- [ ] Mobile-first lead capture form
- [ ] Voice notes recording (Web Audio API)
- [ ] GoHighLevel API integration
- [ ] Offline-first PWA with service worker
- [ ] Automated follow-up email/SMS
- [ ] Event-based lead organization

**Tests Required:**
- [ ] Unit tests for form validation
- [ ] Integration tests for GHL sync
- [ ] E2E test for complete lead capture flow

#### Week 4: Content Studio
**TDD Approach:**
1. Write tests for script generation
2. Implement AI script writer
3. Write tests for content workflow
4. Implement recording status tracking
5. Write tests for YouTube API
6. Implement publishing automation

**Deliverables:**
- [ ] AI-powered script generator
- [ ] Content workflow tracker
- [ ] Adobe Premiere Pro UXP plugin (basic)
- [ ] YouTube API integration
- [ ] Spotify/RSS publishing
- [ ] SEO optimization tools

**Tests Required:**
- [ ] Unit tests for script generation
- [ ] Integration tests for YouTube API
- [ ] Mock tests for Premiere Pro plugin

### Phase 2: MEASURE (Week 5)

**Objective:** Implement comprehensive metrics and monitoring

#### Metrics to Track:
1. **User Engagement:**
   - Daily active users
   - Feature usage frequency
   - Session duration
   - Keyboard shortcut adoption

2. **Business KPIs:**
   - Activities logged per day
   - Streak retention rate
   - Prospects added per week
   - Deals created per month
   - Campaign open/click rates
   - Content published per week

3. **Technical Metrics:**
   - API response times
   - Error rates
   - Database query performance
   - Frontend bundle size
   - Lighthouse scores

**Deliverables:**
- [ ] Analytics dashboard with key metrics
- [ ] Performance monitoring (Sentry/LogRocket)
- [ ] Database query optimization
- [ ] API endpoint monitoring
- [ ] User behavior tracking (PostHog/Mixpanel)

**Tests Required:**
- [ ] Performance tests for critical paths
- [ ] Load tests for API endpoints
- [ ] Benchmark tests for database queries

### Phase 3: ANALYZE (Week 6)

**Objective:** Analyze data, identify bottlenecks, and optimize

#### Analysis Focus Areas:
1. **Performance Bottlenecks:**
   - Slow API endpoints
   - Large bundle sizes
   - Inefficient database queries
   - Memory leaks

2. **User Experience Issues:**
   - Confusing UI flows
   - Missing features
   - Accessibility problems
   - Mobile responsiveness

3. **Code Quality:**
   - Test coverage gaps
   - Code duplication
   - Type safety issues
   - Security vulnerabilities

**Deliverables:**
- [ ] Performance optimization report
- [ ] UX improvement recommendations
- [ ] Code refactoring plan
- [ ] Security audit report

**Tests Required:**
- [ ] Accessibility tests (WCAG 2.1 AA)
- [ ] Security tests (OWASP Top 10)
- [ ] Browser compatibility tests

### Phase 4: DEPLOY (Week 7)

**Objective:** Production deployment with zero downtime

#### Deployment Checklist:
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] API keys secured
- [ ] SSL certificates configured
- [ ] CDN configured for assets
- [ ] Health check endpoints
- [ ] Monitoring and alerting
- [ ] Backup and recovery plan
- [ ] Rollback procedure documented

**Deliverables:**
- [ ] Production deployment to Render
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing in CI
- [ ] Deployment documentation
- [ ] Incident response playbook

**Tests Required:**
- [ ] Smoke tests post-deployment
- [ ] Integration tests in staging
- [ ] Load tests in production-like environment

---

## Test-Driven Development (TDD) Guidelines

### Testing Pyramid

```
         /\
        /E2E\         <- 10% (Critical user journeys)
       /------\
      /  INT   \      <- 30% (API integration tests)
     /----------\
    /   UNIT     \    <- 60% (Pure functions, utilities)
   /--------------\
```

### Test Coverage Targets

- **Unit Tests:** 80% coverage minimum
- **Integration Tests:** All API endpoints
- **E2E Tests:** 5-10 critical user flows

### Testing Tools

- **Unit Tests:** Vitest
- **Integration Tests:** Vitest + Supertest
- **E2E Tests:** Playwright
- **API Mocking:** MSW (Mock Service Worker)
- **Test Database:** SQLite in-memory

### TDD Workflow

1. **Red:** Write a failing test
2. **Green:** Write minimal code to pass
3. **Refactor:** Improve code quality
4. **Repeat:** Next feature

---

## Risk Management

### High-Risk Areas

1. **External API Integrations:**
   - **Risk:** SendGrid, Twilio, GoHighLevel, YouTube APIs may fail
   - **Mitigation:** Implement retry logic, circuit breakers, fallback mechanisms
   - **Testing:** Mock all external APIs in tests

2. **Adobe Premiere Pro Integration:**
   - **Risk:** UXP plugin development is complex
   - **Mitigation:** Start with basic functionality, iterate based on feedback
   - **Testing:** Manual testing required (no automated tests possible)

3. **Real-time Features:**
   - **Risk:** WebSocket connections may be unstable
   - **Mitigation:** Implement reconnection logic, offline support
   - **Testing:** Test reconnection scenarios

4. **Data Migration:**
   - **Risk:** Database schema changes may break existing data
   - **Mitigation:** Test migrations in staging, implement rollback procedures
   - **Testing:** Test migrations with production-like data

### Mitigation Strategies

- **API Rate Limits:** Implement caching, request queuing
- **Data Loss:** Implement auto-save, optimistic updates with rollback
- **Security:** Input validation, SQL injection prevention, XSS protection
- **Performance:** Code splitting, lazy loading, image optimization

---

## Success Criteria

### Definition of Done (DoD)

A feature is considered "done" when:

1. ✅ All acceptance criteria met
2. ✅ Unit tests written and passing (80%+ coverage)
3. ✅ Integration tests written and passing
4. ✅ E2E tests written and passing (if applicable)
5. ✅ Code reviewed and approved
6. ✅ Documentation updated
7. ✅ Deployed to staging and tested
8. ✅ Performance benchmarks met
9. ✅ Accessibility requirements met (WCAG 2.1 AA)
10. ✅ Security vulnerabilities addressed

### Acceptance Criteria

**Activity Tracker:**
- [ ] User can log activities with keyboard shortcuts
- [ ] Daily score updates in real-time
- [ ] Streak counter increments correctly
- [ ] Focus session timer works for 50 minutes
- [ ] Weekly targets display accurate progress
- [ ] 7-day score chart renders correctly
- [ ] AI Advisor provides actionable recommendations
- [ ] Weekly PDF export generates successfully

**Prospect Management:**
- [ ] User can create, read, update, delete prospects
- [ ] Lead scoring calculates automatically
- [ ] Stage transitions trigger notifications
- [ ] Activity timeline displays chronologically
- [ ] Search and filter work correctly
- [ ] Bulk operations complete successfully

**Pipeline Management:**
- [ ] Kanban board displays all deals
- [ ] Drag & drop updates deal stages
- [ ] Deal value aggregates correctly
- [ ] Win rate calculates accurately
- [ ] Pipeline forecast predicts revenue

**Campaign Management:**
- [ ] SendGrid sends emails successfully
- [ ] Twilio sends SMS successfully
- [ ] Campaign builder creates valid templates
- [ ] Audience segmentation filters correctly
- [ ] Campaign analytics track opens/clicks

**Lead Capture:**
- [ ] Form captures lead data correctly
- [ ] Voice notes record and upload
- [ ] GoHighLevel sync creates contacts
- [ ] Automated follow-ups send on time
- [ ] Offline mode queues submissions

**Content Studio:**
- [ ] Script generator creates quality scripts
- [ ] Content workflow tracks status
- [ ] YouTube API publishes videos
- [ ] SEO tools optimize descriptions
- [ ] Analytics track video performance

---

## Progress Tracking

### Weekly Milestones

| Week | Phase | Deliverables | Status |
|------|-------|--------------|--------|
| 1 | Build | Prospect & Pipeline UI | 🔴 Not Started |
| 2 | Build | Campaign Management | 🔴 Not Started |
| 3 | Build | Lead Capture WebApp | 🔴 Not Started |
| 4 | Build | Content Studio | 🔴 Not Started |
| 5 | Measure | Analytics & Monitoring | 🔴 Not Started |
| 6 | Analyze | Optimization & Fixes | 🔴 Not Started |
| 7 | Deploy | Production Deployment | 🔴 Not Started |

### Daily Standup Questions

1. What did I complete yesterday?
2. What will I work on today?
3. Are there any blockers?
4. Are tests passing?
5. Is the deployment healthy?

---

## Next Immediate Actions

### Phase 1 - Week 1 - Day 1 (TODAY)

**Morning (4 hours):**
1. ✅ Review project documentation
2. ✅ Create BMAD-method execution plan
3. ⏳ Set up testing infrastructure (Vitest)
4. ⏳ Write first test for prospect creation
5. ⏳ Implement prospect list view UI

**Afternoon (4 hours):**
6. ⏳ Write tests for prospect filtering
7. ⏳ Implement search and filter UI
8. ⏳ Write tests for prospect detail page
9. ⏳ Implement prospect edit form
10. ⏳ Commit and push to GitHub

**Evening (2 hours):**
11. ⏳ Review test coverage
12. ⏳ Update BMAD-method document
13. ⏳ Plan tomorrow's work

---

## Document History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-31 | 1.0 | Initial BMAD-method plan created | Manus AI |

---

## References

- [BMAD-Method Documentation](https://bmad-method.com)
- [Test-Driven Development Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Testing Trophy](https://kentcdodds.com/blog/write-tests)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
