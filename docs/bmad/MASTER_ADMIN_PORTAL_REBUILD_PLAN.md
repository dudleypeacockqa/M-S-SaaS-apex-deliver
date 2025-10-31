# Master Admin Portal - Rebuild Implementation Plan
## Aligned with Repository Architecture & Strict TDD

**Date:** October 31, 2025  
**Methodology:** BMAD v6-alpha with Strict TDD  
**Timeline:** 7 weeks (Nov 1 - Dec 15, 2025)  
**Quality Target:** Zero mistakes through test-first development

---

## Executive Summary

The Master Admin Portal will be rebuilt from scratch to align with the existing M&A Intelligence Platform architecture. The initial Node.js/tRPC implementation will be replaced with Python/FastAPI to maintain consistency with the repository's technology stack and development philosophy.

**Key Changes:**
- **Backend:** Rebuild with Python 3.11 + FastAPI (not Node.js + tRPC)
- **Database:** Use PostgreSQL with SQLAlchemy (not MySQL + Drizzle)
- **Auth:** Integrate with Clerk (not Manus OAuth)
- **Testing:** Strict TDD with Pytest (write tests FIRST)
- **Deployment:** Render via render.yaml (not Manus platform)

---

## Architecture Alignment

### Technology Stack (Existing Repository)

**Backend:**
- Python 3.11+ with FastAPI
- SQLAlchemy 2.0 ORM
- Pydantic v2 validation
- Alembic migrations
- PostgreSQL 15+ database
- Clerk authentication

**Frontend:**
- React 18+ with TypeScript
- Vite build tool
- Tailwind CSS
- React Query (TanStack Query)
- React Router v6
- Clerk React SDK

**Testing:**
- **Backend:** Pytest + httpx
- **Frontend:** Vitest + React Testing Library
- **E2E:** Playwright

**Deployment:**
- Render (web services + static site)
- GitHub Actions CI/CD
- render.yaml configuration

### Master Admin Portal Integration

**Backend Structure:**
```
backend/app/
├── api/
│   ├── v1/
│   │   ├── endpoints/
│   │   │   ├── master_admin/          # NEW
│   │   │   │   ├── __init__.py
│   │   │   │   ├── activity_tracker.py
│   │   │   │   ├── prospects.py
│   │   │   │   ├── pipeline.py
│   │   │   │   ├── campaigns.py
│   │   │   │   ├── content.py
│   │   │   │   ├── lead_capture.py
│   │   │   │   └── collateral.py
├── models/
│   ├── master_admin.py                # NEW - SQLAlchemy models
├── schemas/
│   ├── master_admin.py                # NEW - Pydantic schemas
├── services/
│   ├── master_admin/                  # NEW - Business logic
│   │   ├── __init__.py
│   │   ├── activity_service.py
│   │   ├── prospect_service.py
│   │   ├── campaign_service.py
│   │   ├── content_service.py
│   │   └── integrations/
│   │       ├── sendgrid.py
│   │       ├── twilio.py
│   │       ├── gohighlevel.py
│   │       └── youtube.py
└── tests/
    ├── master_admin/                  # NEW - Test suites
        ├── test_activity_tracker.py
        ├── test_prospects.py
        ├── test_campaigns.py
        └── test_integrations.py
```

**Frontend Structure:**
```
frontend/src/
├── pages/
│   ├── MasterAdmin/                   # NEW
│   │   ├── Dashboard.tsx
│   │   ├── ActivityTracker.tsx
│   │   ├── Prospects.tsx
│   │   ├── Pipeline.tsx
│   │   ├── Campaigns.tsx
│   │   ├── Content.tsx
│   │   ├── LeadCapture.tsx
│   │   └── Analytics.tsx
├── components/
│   ├── MasterAdmin/                   # NEW
│   │   ├── Layout.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── ProspectList.tsx
│   │   ├── DealKanban.tsx
│   │   └── CampaignBuilder.tsx
├── services/
│   ├── masterAdminApi.ts              # NEW - API client
└── __tests__/
    ├── MasterAdmin/                   # NEW - Component tests
```

**Database Schema (PostgreSQL):**
```sql
-- Activity Tracker
CREATE TABLE admin_goals (...);
CREATE TABLE admin_activities (...);
CREATE TABLE admin_scores (...);
CREATE TABLE admin_focus_sessions (...);

-- Prospects & Pipeline
CREATE TABLE admin_prospects (...);
CREATE TABLE admin_deals (...);
CREATE TABLE admin_prospect_activities (...);

-- Campaigns
CREATE TABLE admin_campaigns (...);
CREATE TABLE admin_campaign_recipients (...);

-- Content Studio
CREATE TABLE admin_content_pieces (...);
CREATE TABLE admin_content_scripts (...);

-- Lead Capture
CREATE TABLE admin_lead_captures (...);

-- Collateral
CREATE TABLE admin_collateral (...);
CREATE TABLE admin_collateral_usage (...);
```

---

## Strict TDD Workflow

### Red-Green-Refactor Cycle

**1. RED ❌ - Write Failing Test First**
```python
# tests/master_admin/test_activity_tracker.py
def test_create_activity():
    """Test creating a new activity."""
    # Arrange
    activity_data = {
        "type": "discovery",
        "status": "done",
        "date": "2025-10-31"
    }
    
    # Act
    response = client.post("/api/v1/master-admin/activities", json=activity_data)
    
    # Assert
    assert response.status_code == 201
    assert response.json()["type"] == "discovery"
    assert response.json()["status"] == "done"
```

**2. GREEN ✅ - Write Minimal Code to Pass**
```python
# app/api/v1/endpoints/master_admin/activity_tracker.py
@router.post("/activities", status_code=201)
async def create_activity(
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new activity."""
    db_activity = Activity(**activity.dict(), user_id=current_user.id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity
```

**3. REFACTOR ♻️ - Improve Code Quality**
```python
# app/services/master_admin/activity_service.py
class ActivityService:
    """Business logic for activity management."""
    
    def create_activity(
        self,
        db: Session,
        user_id: int,
        activity_data: ActivityCreate
    ) -> Activity:
        """Create a new activity with validation."""
        # Validate activity type
        if activity_data.type not in VALID_ACTIVITY_TYPES:
            raise ValueError(f"Invalid activity type: {activity_data.type}")
        
        # Create activity
        db_activity = Activity(
            **activity_data.dict(),
            user_id=user_id,
            created_at=datetime.utcnow()
        )
        db.add(db_activity)
        db.commit()
        db.refresh(db_activity)
        
        # Update daily score
        self._update_daily_score(db, user_id, activity_data.date)
        
        return db_activity
```

### TDD Principles

1. **Never write production code without a failing test**
2. **Write only enough test code to fail**
3. **Write only enough production code to pass the test**
4. **Refactor only after tests pass**
5. **Run all tests frequently**

### Test Coverage Requirements

- **Unit Tests:** 90% coverage minimum
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user journeys
- **Performance Tests:** Load testing for campaigns

---

## 7-Week Implementation Plan

### Week 1: Foundation & Activity Tracker (Nov 1-6)

**Story:** MAP-REBUILD-001 - Backend Foundation

**TDD Tasks:**
1. Write tests for database models
2. Implement SQLAlchemy models for all tables
3. Write Alembic migrations
4. Write tests for Activity Tracker API
5. Implement Activity Tracker endpoints
6. Write tests for daily scoring logic
7. Implement scoring service

**Deliverables:**
- ✅ 16 PostgreSQL tables created
- ✅ All Alembic migrations passing
- ✅ Activity Tracker API (100% test coverage)
- ✅ Daily scoring logic (100% test coverage)

**Story:** MAP-REBUILD-002 - Activity Tracker UI

**TDD Tasks:**
1. Write component tests for ActivityTracker
2. Implement Daily Command Center UI
3. Write tests for keyboard shortcuts
4. Implement keyboard shortcut hook
5. Write tests for focus session timer
6. Implement focus session component

**Deliverables:**
- ✅ Activity Tracker UI (90% test coverage)
- ✅ Keyboard shortcuts (D, E, V, C)
- ✅ Focus session timer
- ✅ Weekly targets display

---

### Week 2: Prospect & Pipeline Management (Nov 7-13)

**Story:** MAP-REBUILD-003 - Prospect Management Backend

**TDD Tasks:**
1. Write tests for Prospect model
2. Implement Prospect SQLAlchemy model
3. Write tests for Prospect CRUD API
4. Implement Prospect endpoints
5. Write tests for lead scoring algorithm
6. Implement lead scoring service

**Deliverables:**
- ✅ Prospect API (100% test coverage)
- ✅ Lead scoring algorithm (100% test coverage)
- ✅ Search and filter functionality

**Story:** MAP-REBUILD-004 - Pipeline Management Backend

**TDD Tasks:**
1. Write tests for Deal model
2. Implement Deal SQLAlchemy model
3. Write tests for Pipeline API
4. Implement Pipeline endpoints
5. Write tests for pipeline analytics
6. Implement analytics service

**Deliverables:**
- ✅ Pipeline API (100% test coverage)
- ✅ Deal stage management
- ✅ Pipeline value calculations

**Story:** MAP-REBUILD-005 - Prospect & Pipeline UI

**TDD Tasks:**
1. Write tests for ProspectList component
2. Implement Prospect list view
3. Write tests for DealKanban component
4. Implement Kanban board with drag & drop
5. Write tests for pipeline analytics
6. Implement analytics dashboard

**Deliverables:**
- ✅ Prospect management UI (90% test coverage)
- ✅ Pipeline Kanban board (90% test coverage)
- ✅ Analytics dashboard

---

### Week 3: Campaign Management (Nov 14-20)

**Story:** MAP-REBUILD-006 - SendGrid Integration

**TDD Tasks:**
1. Write tests for SendGrid service
2. Implement SendGrid API wrapper
3. Write tests for email campaign API
4. Implement email campaign endpoints
5. Write tests for template rendering
6. Implement template service

**Deliverables:**
- ✅ SendGrid integration (100% test coverage)
- ✅ Email campaign API (100% test coverage)
- ✅ Template system

**Story:** MAP-REBUILD-007 - Twilio Integration

**TDD Tasks:**
1. Add Twilio credentials to .env
2. Write tests for Twilio service
3. Implement Twilio API wrapper
4. Write tests for SMS campaign API
5. Implement SMS campaign endpoints

**Deliverables:**
- ✅ Twilio integration (100% test coverage)
- ✅ SMS campaign API (100% test coverage)

**Story:** MAP-REBUILD-008 - Campaign Management UI

**TDD Tasks:**
1. Write tests for CampaignBuilder component
2. Implement campaign builder UI
3. Write tests for campaign analytics
4. Implement analytics display

**Deliverables:**
- ✅ Campaign builder UI (90% test coverage)
- ✅ Campaign analytics (90% test coverage)

---

### Week 4: Lead Capture & GoHighLevel (Nov 21-27)

**Story:** MAP-REBUILD-009 - Lead Capture Backend

**TDD Tasks:**
1. Write tests for LeadCapture model
2. Implement LeadCapture SQLAlchemy model
3. Write tests for Lead Capture API
4. Implement Lead Capture endpoints
5. Write tests for voice note processing
6. Implement voice note service

**Deliverables:**
- ✅ Lead Capture API (100% test coverage)
- ✅ Voice note processing (100% test coverage)

**Story:** MAP-REBUILD-010 - GoHighLevel Integration

**TDD Tasks:**
1. Write tests for GoHighLevel service
2. Implement GoHighLevel API wrapper
3. Write tests for contact sync
4. Implement sync service
5. Write tests for automated follow-ups
6. Implement follow-up automation

**Deliverables:**
- ✅ GoHighLevel integration (100% test coverage)
- ✅ Contact sync (100% test coverage)
- ✅ Automated follow-ups

**Story:** MAP-REBUILD-011 - Lead Capture PWA

**TDD Tasks:**
1. Write tests for LeadCapture component
2. Implement mobile-first UI
3. Write tests for offline functionality
4. Implement service worker
5. Write tests for voice recording
6. Implement voice recorder component

**Deliverables:**
- ✅ Lead Capture PWA (90% test coverage)
- ✅ Offline-first functionality
- ✅ Voice recording

---

### Week 5: Content Studio (Nov 28 - Dec 4)

**Story:** MAP-REBUILD-012 - Content Management Backend

**TDD Tasks:**
1. Write tests for Content model
2. Implement Content SQLAlchemy model
3. Write tests for Content API
4. Implement Content endpoints
5. Write tests for AI script generation
6. Implement script generation service

**Deliverables:**
- ✅ Content API (100% test coverage)
- ✅ AI script generation (100% test coverage)

**Story:** MAP-REBUILD-013 - YouTube Integration

**TDD Tasks:**
1. Add YouTube credentials to .env
2. Write tests for YouTube service
3. Implement YouTube API wrapper
4. Write tests for video publishing
5. Implement publishing service

**Deliverables:**
- ✅ YouTube integration (100% test coverage)
- ✅ Video publishing (100% test coverage)

**Story:** MAP-REBUILD-014 - Content Studio UI

**TDD Tasks:**
1. Write tests for ContentStudio component
2. Implement content workflow UI
3. Write tests for script editor
4. Implement script editor component

**Deliverables:**
- ✅ Content Studio UI (90% test coverage)
- ✅ Script editor

---

### Week 6: Collateral & Analytics (Dec 5-11)

**Story:** MAP-REBUILD-015 - Sales Collateral Backend

**TDD Tasks:**
1. Write tests for Collateral model
2. Implement Collateral SQLAlchemy model
3. Write tests for Collateral API
4. Implement Collateral endpoints
5. Write tests for template system
6. Implement template service

**Deliverables:**
- ✅ Collateral API (100% test coverage)
- ✅ Template system (100% test coverage)

**Story:** MAP-REBUILD-016 - Analytics Dashboard Backend

**TDD Tasks:**
1. Write tests for analytics calculations
2. Implement analytics service
3. Write tests for reporting API
4. Implement reporting endpoints

**Deliverables:**
- ✅ Analytics API (100% test coverage)
- ✅ Reporting service (100% test coverage)

**Story:** MAP-REBUILD-017 - Collateral & Analytics UI

**TDD Tasks:**
1. Write tests for CollateralLibrary component
2. Implement collateral library UI
3. Write tests for AnalyticsDashboard component
4. Implement analytics dashboard

**Deliverables:**
- ✅ Collateral library UI (90% test coverage)
- ✅ Analytics dashboard (90% test coverage)

---

### Week 7: Testing, Deployment & Documentation (Dec 12-15)

**Story:** MAP-REBUILD-018 - Integration Testing

**TDD Tasks:**
1. Write integration tests for all workflows
2. Write E2E tests for critical paths
3. Write load tests for campaigns
4. Fix any failing tests

**Deliverables:**
- ✅ Integration tests (100% coverage)
- ✅ E2E tests for critical paths
- ✅ Load tests passing

**Story:** MAP-REBUILD-019 - Render Deployment

**TDD Tasks:**
1. Update render.yaml configuration
2. Configure environment variables
3. Run database migrations on Render
4. Deploy to production
5. Verify health checks

**Deliverables:**
- ✅ Render deployment successful
- ✅ Health checks passing
- ✅ Monitoring configured

**Story:** MAP-REBUILD-020 - Documentation & Handover

**TDD Tasks:**
1. Update README with Master Admin Portal
2. Create user guide
3. Document API endpoints
4. Create video walkthrough

**Deliverables:**
- ✅ Complete documentation
- ✅ User guide
- ✅ API documentation
- ✅ Video walkthrough

---

## Test Coverage Requirements

### Backend (Pytest)

**Unit Tests:**
- Models: 100% coverage
- Services: 100% coverage
- API endpoints: 100% coverage
- Integrations: 100% coverage (mocked)

**Integration Tests:**
- Database operations: 100% coverage
- External API calls: 100% coverage (mocked)
- End-to-end workflows: 100% coverage

**Performance Tests:**
- Load testing for campaigns
- Stress testing for lead capture
- Concurrency testing for pipeline

### Frontend (Vitest + React Testing Library)

**Component Tests:**
- All components: 90% coverage minimum
- User interactions: 100% coverage
- State management: 100% coverage

**Integration Tests:**
- API client: 100% coverage
- Authentication flows: 100% coverage
- Routing: 100% coverage

**E2E Tests (Playwright):**
- Critical user journeys: 100% coverage
- Cross-browser testing
- Mobile testing

---

## Environment Variables

### New Variables to Add

```bash
# ============================================================================
# MASTER ADMIN PORTAL - SMS CAMPAIGNS
# ============================================================================
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ============================================================================
# MASTER ADMIN PORTAL - CONTENT STUDIO
# ============================================================================
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/integrations/youtube/callback

# ============================================================================
# MASTER ADMIN PORTAL - ADOBE PREMIERE PRO (OPTIONAL)
# ============================================================================
ADOBE_CLIENT_ID=your_adobe_client_id
ADOBE_CLIENT_SECRET=your_adobe_client_secret
```

---

## Render Deployment Configuration

### Update render.yaml

```yaml
services:
  # Backend API Service (existing - will include Master Admin Portal)
  - type: web
    name: ma-saas-backend
    env: python
    region: oregon
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "bash ./prestart.sh && cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      # ... existing vars ...
      # Master Admin Portal - NEW
      - key: TWILIO_ACCOUNT_SID
        sync: false
      - key: TWILIO_AUTH_TOKEN
        sync: false
      - key: TWILIO_PHONE_NUMBER
        sync: false
      - key: YOUTUBE_CLIENT_ID
        sync: false
      - key: YOUTUBE_CLIENT_SECRET
        sync: false
```

---

## Success Metrics

### Development Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Backend Test Coverage | 100% | Pytest coverage report |
| Frontend Test Coverage | 90% | Vitest coverage report |
| E2E Test Coverage | 100% critical paths | Playwright test results |
| TypeScript Errors | 0 | tsc --noEmit |
| Python Type Errors | 0 | mypy backend/ |
| Linting Errors | 0 | flake8, eslint |

### Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | <200ms | Load testing |
| Frontend Load Time | <2s | Lighthouse |
| Database Query Time | <50ms | Query profiling |
| Test Execution Time | <5min | CI/CD pipeline |

---

## Risk Mitigation

### High-Risk Areas

**1. Technology Stack Migration**
- **Risk:** Rebuilding from Node.js/tRPC to Python/FastAPI may introduce bugs
- **Mitigation:** Strict TDD ensures all functionality is tested before implementation
- **Status:** ✅ Mitigated by test-first approach

**2. External API Integrations**
- **Risk:** SendGrid, Twilio, GoHighLevel, YouTube APIs may fail or rate limit
- **Mitigation:** Mock all external APIs in tests, implement retry logic and circuit breakers
- **Status:** ✅ Mitigated by mocking and error handling

**3. Database Schema Changes**
- **Risk:** Alembic migrations may fail or corrupt data
- **Mitigation:** Test migrations in staging, implement rollback procedures
- **Status:** ✅ Mitigated by migration testing

**4. Deployment Complexity**
- **Risk:** Render deployment may fail due to configuration issues
- **Mitigation:** Test deployment in staging environment first
- **Status:** ⏳ Will be tested in Week 7

---

## Next Steps

**Immediate Actions (Today):**

1. ✅ Create this implementation plan
2. ✅ Commit plan to GitHub repository
3. ⏳ Add Twilio and YouTube credentials to .env
4. ⏳ Create MAP-REBUILD-001 story document
5. ⏳ Begin Week 1: Write first failing test

**Week 1 Kickoff (Tomorrow):**

1. Write failing test for Activity model
2. Implement Activity SQLAlchemy model
3. Write Alembic migration
4. Run migration and verify
5. Continue TDD cycle for all Activity Tracker features

---

## Conclusion

This plan ensures the Master Admin Portal is rebuilt with:
- ✅ Complete alignment with repository architecture
- ✅ Strict TDD methodology (no code without tests)
- ✅ 100% backend test coverage
- ✅ 90% frontend test coverage
- ✅ Zero mistakes through test-first development
- ✅ Production-ready deployment to Render

**Timeline:** 7 weeks (Nov 1 - Dec 15, 2025)  
**Quality:** Enterprise-grade with comprehensive testing  
**Deployment:** Render via GitHub Actions CI/CD

---

**Document Version:** 1.0  
**Author:** Manus AI  
**Date:** October 31, 2025  
**Methodology:** BMAD v6-alpha with Strict TDD
