# M&A Intelligence Platform - Implementation Plan
# DEV-016 Podcast Studio Subscription Add-On

**Created**: 2025-10-28
**Status**: In Progress
**Methodology**: BMAD v6-alpha + TDD
**Target Completion**: 2025-11-16 (worst case) / 2025-11-10 (best case)
**Current Phase**: Phase 2 - API Entitlements & Quotas

---

## Executive Summary

Transform DEV-016 Podcast Studio from a master-admin-only feature into a **subscription-gated add-on** that tenants can access based on their Clerk subscription tier. This creates a new revenue stream by selling podcast capabilities as a premium service to M&A professionals who want to build thought leadership through content creation.

### Business Value

- **New Revenue**: Upsell podcast features to existing subscribers
- **Market Differentiation**: StreamYard-quality features integrated into M&A workflow
- **Competitive Moat**: YouTube integration, AI transcription, live streaming
- **Target Market Alignment**: M&A professionals building personal brands
- **Estimated Revenue Impact**: £200K+ ARR (30% of Professional+ subscribers @ average £1,200/mo)

### Technical Approach

- **Subscription Authority**: Clerk organization metadata (`subscription_tier` field)
- **Multi-Layer Enforcement**: API middleware, service layer validation, frontend gates
- **Quota Management**: Real-time usage tracking with database constraints
- **Graceful Degradation**: Deny-by-default when Clerk API unavailable
- **Testing**: 100% coverage on tier validation, comprehensive 403 tests

## Immediate Roadmap (2025-10-28)

- Baseline stabilization: confirm backend/frontend suites pass and capture results in BMAD tracker (completed 2025-10-28).
- Backend API enforcement: implement episode creation + usage quota endpoints (completed 2025-10-28).
- Story readiness: finalize usage tracking schema, quota enforcement logic, API contract, and frontend gating patterns; author RED tests before implementation.
- Development execution: follow TDD steps in Phases 2–3 to deliver tier middleware, entitlement/quota services, and gated UI sequentially.
- Quality gates: extend backend/frontend coverage for new features, document QA gate outcomes, and maintain 100% passing status after each cycle.
- Deployment readiness: sync Render environment variables, redeploy services, run smoke checks (`uvicorn`, `npm run preview`), and update production checklists with evidence.


---

## Next BMAD Cycle (Execution Order)

1. **SM Cycle**: refresh story shard + acceptance notes, confirm scope with PO checklist, and prepare RED tests for Clerk tier fetch + entitlement edge cases.
2. **Dev Cycle**:
   - RED: add failing frontend tests for quota banner + upgrade CTA; extend backend RED for transcription + publishing flows.
   - GREEN: implement remaining services (transcription, YouTube) and frontend gating/components under TDD.
   - REFACTOR: consolidate duplication, ensure logging, and update docs/tests.
3. **QA Cycle**: run QA agent `*review` on DEV-016 story, produce gate YAML, and backfill additional regression tests if gaps detected.
4. **Deployment Cycle**: execute Render env sync, redeploy backend/frontend, run smoke tests (health endpoints + marketing flows), capture evidence in PRODUCTION-DEPLOYMENT-CHECKLIST.md and PRODUCTION-READY-SUMMARY.md.
5. **Sign-off & PR**: prepare Conventional Commit history, update STATUS report, and open PR with fresh test logs + deployment verification.

---

## Subscription Tier Matrix

| Tier | Monthly Price | Podcast Access | Episodes/Month | Audio | Video | Transcription | YouTube | Live Streaming |
|------|---------------|----------------|----------------|-------|-------|---------------|---------|----------------|
| **Starter** | £279 | ❌ | - | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Professional** | £598 | ✅ | 10 | ✅ | ❌ | ✅ Basic | ❌ | ❌ |
| **Premium** | £1,598 | ✅ | Unlimited | ✅ | ✅ | ✅ AI-Enhanced | ✅ Auto-Publish | ❌ |
| **Enterprise** | £2,997 | ✅ | Unlimited | ✅ | ✅ | ✅ Multi-Language | ✅ Auto-Publish | ✅ StreamYard-Quality |

---

## Phase 1: Documentation & Architecture (Days 1-2)

### Status: 🟢 IN PROGRESS

### Objectives

- ✅ Update project documentation with subscription architecture
- ✅ Define subscription tiers and feature matrix
- 🟡 Create detailed implementation plan (this document)
- ⏳ Create DEV-016-REVISED story with acceptance criteria
- ⏳ Design database schema for usage tracking

### Deliverables

1. **CODEX-COMPLETE-PROJECT-GUIDE.md**: Updated with subscription gating section
2. **BMAD_PROGRESS_TRACKER.md**: Updated with DEV-016 scope change
3. **plan.plan.md**: This detailed implementation plan
4. **docs/bmad/stories/DEV-016-podcast-studio-subscription.md**: Complete story document
5. **Database Schema Design**: Usage tracking, quota enforcement tables

### Tasks

- [x] Update CODEX-COMPLETE-PROJECT-GUIDE.md
- [x] Update BMAD_PROGRESS_TRACKER.md
- [x] Create plan.plan.md
- [x] Validate backend + frontend automated test baselines (2025-10-28)
- [x] Create DEV-016 story document
- [x] Design usage tracking schema (see story technical spec)
- [x] Design quota enforcement logic (quota service flow documented)
- [x] Document API contract changes (current vs planned endpoints captured)
- [x] Document frontend feature gate patterns

### Exit Criteria

- ✅ All project documentation updated with scope change
- ✅ Subscription tier matrix documented and approved
- ✅ DEV-016 story ready for implementation (latest update logged 2025-10-28)
- ✅ Database schema designed and reviewed (podcast_usage + existing episode models)
- ✅ API contracts defined with 403/429 handling
- ✅ Frontend feature gate patterns documented

---

## Phase 2: Clerk Integration & Tier Middleware (Days 3-5)

### Status: 🟡 IN PROGRESS

### Objectives

- Implement Clerk subscription tier fetching
- Build feature entitlement service
- Create API middleware for tier validation
- Add caching layer for performance
- Implement graceful degradation

### Deliverables

1. **backend/app/core/subscription.py**: Clerk integration module
2. **backend/app/services/entitlement_service.py**: Feature access logic
3. **backend/app/api/deps.py**: `require_feature()` dependency
4. **backend/app/services/quota_service.py**: Quota tracking and enforcement
5. **backend/tests/test_subscription.py**: Tier checking tests (100% coverage)
6. **backend/tests/test_entitlement.py**: Feature access tests
7. **backend/app/api/routes/podcasts.py**: `/podcasts/usage` quota summary endpoint
8. **backend/tests/test_podcast_api.py**: Usage endpoint coverage (pro/premium/starter)

### TDD Workflow

#### Step 1: Tier Fetching (RED → GREEN → REFACTOR)

```python
# RED: Write failing test
async def test_get_organization_tier_from_clerk():
    tier = await get_organization_tier("org_123")
    assert tier == "professional"

# GREEN: Implement minimal code
async def get_organization_tier(organization_id: str) -> str:
    clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)
    org = await clerk.organizations.get(organization_id)
    return org.public_metadata.get("subscription_tier", "starter")

# REFACTOR: Add caching, error handling
```

#### Step 2: Feature Entitlement (RED → GREEN → REFACTOR)

```python
# RED: Write failing test
async def test_check_feature_access_professional_has_audio():
    has_access = await check_feature_access("org_prof", "podcast_audio")
    assert has_access is True

async def test_check_feature_access_starter_no_audio():
    has_access = await check_feature_access("org_starter", "podcast_audio")
    assert has_access is False

# GREEN: Implement entitlement logic
FEATURE_ENTITLEMENTS = {
    "podcast_audio": ["professional", "premium", "enterprise"],
    "podcast_video": ["premium", "enterprise"],
    "youtube_integration": ["premium", "enterprise"],
    "live_streaming": ["enterprise"],
}

async def check_feature_access(org_id: str, feature: str) -> bool:
    tier = await get_organization_tier(org_id)
    return tier in FEATURE_ENTITLEMENTS.get(feature, [])

# REFACTOR: Add caching decorator, logging
```

#### Step 3: API Middleware (RED → GREEN → REFACTOR)

```python
# RED: Write failing test
async def test_require_feature_blocks_insufficient_tier(client, starter_user):
    response = await client.post(
        "/api/podcast/episodes",
        headers=starter_user.auth_headers,
        json={"title": "Test"}
    )
    assert response.status_code == 403
    assert "subscription upgrade" in response.json()["detail"]

# GREEN: Implement middleware
def require_feature(feature: str):
    async def check(current_user: User = Depends(get_current_user)):
        has_access = await check_feature_access(
            current_user.organization_id, feature
        )
        if not has_access:
            raise HTTPException(403, detail=f"Feature '{feature}' requires upgrade")
        return current_user
    return check

# REFACTOR: Standardize error format, add logging
```

### Tasks

- [ ] Write tests for Clerk subscription tier checking
- [ ] Implement Clerk integration module
- [ ] Write tests for feature entitlement service
- [ ] Implement entitlement service with tier mapping
- [ ] Write tests for API middleware
- [ ] Implement `require_feature()` dependency
- [ ] Write tests for quota service
- [ ] Implement quota tracking and enforcement
- [x] Add `/podcasts/usage` quota summary endpoint (2025-10-28)
- [x] Backfill API tests for quota summary (professional, premium unlimited, starter 403)
- [ ] Add Redis caching for tier data
- [ ] Implement circuit breaker for Clerk API
- [ ] Add comprehensive logging
- [ ] Document tier checking flow

### Exit Criteria

- ✅ 100% test coverage on tier validation logic
- ✅ All tier checking tests passing
- ✅ Caching layer functional (cache hit rate >80%)
- ✅ Graceful degradation tested (deny-by-default)
- ✅ Performance <100ms for tier checks, <10ms cached
- ✅ API middleware ready for use in endpoints

---

## Phase 3: Podcast Service Layer (Days 6-9)

### Status: ⏳ PENDING

### Objectives

- Implement podcast episode CRUD with tier validation
- Add Whisper transcription service (Professional+)
- Build YouTube integration service (Premium+)
- Implement live streaming service (Enterprise)
- Add background jobs with tier-aware limits
- Enforce quota limits (10 episodes/month for Professional)

### Deliverables

1. **backend/app/services/podcast_service.py**: Core podcast operations
2. **backend/app/services/transcription_service.py**: Whisper integration
3. **backend/app/services/youtube_service.py**: YouTube Data API integration
4. **backend/app/services/streaming_service.py**: Live streaming logic
5. **backend/app/tasks/podcast_tasks.py**: Celery background tasks
6. **backend/tests/test_podcast_service.py**: Service layer tests (100% coverage)
7. **backend/tests/test_transcription_service.py**: Transcription tests
8. **backend/tests/test_youtube_service.py**: YouTube integration tests

### TDD Workflow

#### Step 1: Episode Creation with Tier Validation

```python
# RED: Write failing test
async def test_create_episode_professional_tier():
    episode = await podcast_service.create_episode(
        episode_data, professional_user
    )
    assert episode.title == "Test Episode"

async def test_create_episode_starter_tier_raises():
    with pytest.raises(InsufficientTierError):
        await podcast_service.create_episode(episode_data, starter_user)

# GREEN: Implement service
async def create_episode(data: EpisodeCreate, user: User) -> Episode:
    # Check tier
    if not await check_feature_access(user.org_id, "podcast_audio"):
        raise InsufficientTierError("Professional tier required")

    # Check quota
    if not await check_monthly_quota(user.org_id, "episodes"):
        raise QuotaExceededError("Monthly episode limit reached")

    # Create episode
    episode = Episode(**data.dict(), organization_id=user.org_id)
    db.add(episode)
    await db.commit()
    return episode

# REFACTOR: Extract validation, add logging
```

#### Step 2: Transcription Service (Professional+)

```python
# RED: Write failing test
async def test_transcribe_audio_professional_tier():
    transcript = await transcription_service.transcribe(
        audio_url, professional_user
    )
    assert "Hello world" in transcript.text

async def test_transcribe_starter_tier_raises():
    with pytest.raises(InsufficientTierError):
        await transcription_service.transcribe(audio_url, starter_user)

# GREEN: Implement Whisper integration
async def transcribe(audio_url: str, user: User) -> Transcript:
    if not await check_feature_access(user.org_id, "podcast_audio"):
        raise InsufficientTierError("Professional+ tier required")

    # Download audio
    audio_bytes = await download_file(audio_url)

    # Call Whisper API
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    result = await client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_bytes
    )

    return Transcript(text=result.text)

# REFACTOR: Add retry logic, error handling
```

#### Step 3: YouTube Integration (Premium+)

```python
# RED: Write failing test
async def test_upload_to_youtube_premium_tier():
    video_id = await youtube_service.upload_video(
        video_data, premium_user
    )
    assert video_id.startswith("YT_")

async def test_upload_professional_tier_raises():
    with pytest.raises(InsufficientTierError):
        await youtube_service.upload_video(video_data, professional_user)

# GREEN: Implement YouTube Data API
async def upload_video(data: VideoUpload, user: User) -> str:
    if not await check_feature_access(user.org_id, "youtube_integration"):
        raise InsufficientTierError("Premium+ tier required")

    # Initialize YouTube API
    youtube = build('youtube', 'v3', credentials=get_youtube_creds(user))

    # Upload video
    request = youtube.videos().insert(
        part="snippet,status",
        body={
            "snippet": {
                "title": data.title,
                "description": data.description,
            },
            "status": {"privacyStatus": "public"}
        },
        media_body=MediaFileUpload(data.file_path)
    )

    response = request.execute()
    return response["id"]

# REFACTOR: Queue uploads, add progress tracking
```

### Tasks

- [ ] Write tests for podcast CRUD with tier validation
- [ ] Implement podcast service with tier gates
- [ ] Write tests for quota enforcement
- [ ] Implement quota checking and tracking
- [ ] Write tests for Whisper transcription
- [ ] Implement transcription service (Professional+)
- [ ] Write tests for YouTube integration
- [ ] Implement YouTube upload service (Premium+)
- [ ] Write tests for live streaming
- [ ] Implement streaming service (Enterprise)
- [ ] Create Celery tasks for async operations
- [ ] Add background job monitoring
- [ ] Document service layer API

### Exit Criteria

- ✅ 100% test coverage on service layer
- ✅ All service tests passing
- ✅ Quota enforcement working correctly
- ✅ Whisper transcription functional (Professional+)
- ✅ YouTube integration functional (Premium+)
- ✅ Live streaming ready (Enterprise)
- ✅ Background jobs processing correctly
- ✅ No tier bypass vulnerabilities

---

## Phase 4: API Endpoints with Gating (Days 10-12)

### Status: ⏳ PENDING

### Objectives

- Implement podcast API routes with tier checks
- Add 403 responses for insufficient tiers
- Create usage quota endpoints
- Build upgrade recommendation endpoints
- Add comprehensive API tests

### Deliverables

1. **backend/app/api/v1/endpoints/podcast.py**: Podcast API routes
2. **backend/app/api/v1/endpoints/transcription.py**: Transcription endpoints
3. **backend/app/api/v1/endpoints/youtube.py**: YouTube integration endpoints
4. **backend/app/api/v1/endpoints/streaming.py**: Live streaming endpoints
5. **backend/tests/test_podcast_api.py**: API integration tests (100% coverage)
6. **backend/app/schemas/podcast.py**: Request/response schemas

### API Routes

```python
# Episode Management
POST   /api/podcast/episodes          # Create episode (Professional+)
GET    /api/podcast/episodes          # List episodes
GET    /api/podcast/episodes/{id}     # Get episode details
PUT    /api/podcast/episodes/{id}     # Update episode
DELETE /api/podcast/episodes/{id}     # Delete episode

# Transcription
POST   /api/podcast/transcribe        # Start transcription (Professional+)
GET    /api/podcast/transcriptions    # List transcriptions

# YouTube Integration
POST   /api/podcast/youtube/upload    # Upload to YouTube (Premium+)
GET    /api/podcast/youtube/videos    # List YouTube videos
DELETE /api/podcast/youtube/{id}      # Delete YouTube video

# Live Streaming
POST   /api/podcast/streaming/start   # Start live stream (Enterprise)
POST   /api/podcast/streaming/stop    # Stop live stream
GET    /api/podcast/streaming/status  # Get stream status

# Usage & Quota
GET    /api/podcast/usage             # Get current usage
GET    /api/podcast/quota             # Get quota limits
```

### TDD Workflow

```python
# RED: Write failing test
async def test_create_episode_professional_returns_201(client, professional_user):
    response = await client.post(
        "/api/podcast/episodes",
        headers=professional_user.auth_headers,
        json={"title": "Test Episode", "audio_url": "https://..."}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Episode"

async def test_create_episode_starter_returns_403(client, starter_user):
    response = await client.post(
        "/api/podcast/episodes",
        headers=starter_user.auth_headers,
        json={"title": "Test Episode"}
    )
    assert response.status_code == 403
    assert "subscription upgrade" in response.json()["detail"]
    assert response.json()["required_tier"] == "professional"

# GREEN: Implement endpoint
@router.post("/episodes", status_code=201)
async def create_episode(
    episode: EpisodeCreate,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: AsyncSession = Depends(get_db)
):
    """Create podcast episode (Professional+ only)."""
    return await podcast_service.create_episode(episode, current_user, db)

# REFACTOR: Standardize error responses, add OpenAPI docs
```

### Tasks

- [ ] Write API tests for episode CRUD (all tiers)
- [ ] Implement episode endpoints with tier checks
- [ ] Write API tests for transcription (Professional+)
- [ ] Implement transcription endpoints
- [ ] Write API tests for YouTube (Premium+)
- [ ] Implement YouTube endpoints
- [ ] Write API tests for streaming (Enterprise)
- [ ] Implement streaming endpoints
- [ ] Write API tests for usage/quota
- [ ] Implement usage/quota endpoints
- [ ] Add comprehensive 403 tests for all tiers
- [ ] Document API in OpenAPI schema
- [ ] Create Postman collection

### Exit Criteria

- ✅ 100% test coverage on API layer
- ✅ All API tests passing
- ✅ 403 responses for insufficient tiers
- ✅ Proper error messages with upgrade guidance
- ✅ OpenAPI documentation complete
- ✅ Postman collection for manual testing
- ✅ No tier bypass vulnerabilities

---

## Phase 5: Frontend Feature Flags (Days 13-15)

### Status: ⏳ PENDING

### Objectives

- Implement feature access hooks
- Build podcast studio UI with tier gates
- Create upgrade prompts and CTAs
- Add usage quota displays
- Implement conditional rendering

### Deliverables

1. **frontend/src/hooks/useFeatureAccess.ts**: Feature access hook
2. **frontend/src/hooks/usePodcastQuota.ts**: Quota tracking hook
3. **frontend/src/components/podcast/PodcastStudio.tsx**: Main studio component
4. **frontend/src/components/podcast/UpgradePrompt.tsx**: Upgrade CTA component
5. **frontend/src/components/podcast/QuotaDisplay.tsx**: Usage display
6. **frontend/src/pages/podcast/**: Podcast pages
7. **frontend/src/components/podcast/*.test.tsx**: Component tests (100% coverage)

### TDD Workflow

```typescript
// RED: Write failing test
describe('PodcastStudio', () => {
  it('shows upgrade prompt for starter tier', () => {
    const { getByText } = render(<PodcastStudio />, {
      user: { tier: 'starter' }
    });

    expect(getByText(/upgrade to professional/i)).toBeInTheDocument();
    expect(getByText(/unlock podcast features/i)).toBeInTheDocument();
  });

  it('shows studio for professional tier', () => {
    const { getByText } = render(<PodcastStudio />, {
      user: { tier: 'professional' }
    });

    expect(getByText(/create episode/i)).toBeInTheDocument();
  });

  it('shows quota warning when approaching limit', () => {
    const { getByText } = render(<PodcastStudio />, {
      user: { tier: 'professional' },
      usage: { episodes: 9, limit: 10 }
    });

    expect(getByText(/1 episode remaining/i)).toBeInTheDocument();
  });
});

// GREEN: Implement component
export const PodcastStudio = () => {
  const { hasAccess, tier } = useFeatureAccess('podcast_audio');
  const { usage, limit } = usePodcastQuota();

  if (!hasAccess) {
    return (
      <UpgradePrompt
        feature="Podcast Studio"
        requiredTier="Professional"
        benefits={[
          "Create audio podcasts",
          "AI transcription",
          "10 episodes per month"
        ]}
      />
    );
  }

  return (
    <div>
      <QuotaDisplay usage={usage} limit={limit} tier={tier} />
      <PodcastWorkspace />
    </div>
  );
};

// REFACTOR: Extract components, improve UX
```

### Tasks

- [ ] Write tests for useFeatureAccess hook
- [ ] Implement feature access hook
- [ ] Write tests for quota display
- [ ] Implement quota tracking and display
- [ ] Write tests for upgrade prompts
- [ ] Implement upgrade CTAs
- [ ] Write tests for podcast studio
- [ ] Implement podcast studio UI
- [ ] Write tests for tier-specific features
- [ ] Implement conditional feature rendering
- [ ] Add loading and error states
- [ ] Document component API

### Exit Criteria

- ✅ 100% test coverage on frontend components
- ✅ All component tests passing
- ✅ Feature gates working correctly
- ✅ Upgrade prompts converting >5% (A/B tested)
- ✅ Quota displays accurate and real-time
- ✅ Excellent UX for locked features
- ✅ Responsive design (mobile + desktop)

---

## Phase 6: Integration & Deployment (Days 16-19)

### Status: ⏳ PENDING

### Objectives

- Run end-to-end tests across all tiers
- Create database migrations
- Deploy to Render with feature flags
- Monitor metrics and performance
- Conduct security audit

### Deliverables

1. **backend/alembic/versions/*_podcast_subscription_gating.py**: Migration
2. **backend/tests/test_e2e_podcast.py**: End-to-end tests
3. **Deployment verification**: Production smoke tests
4. **Security audit report**: Penetration test results
5. **Monitoring dashboards**: Usage metrics, errors, performance

### Tasks

- [ ] Create database migrations
- [ ] Write end-to-end tier tests
- [ ] Run E2E tests (all tiers)
- [ ] Security audit (tier bypass testing)
- [ ] Deploy to staging
- [ ] Smoke test staging
- [ ] Deploy to production
- [ ] Verify production health
- [ ] Set up monitoring alerts
- [ ] Document rollback procedure

### Exit Criteria

- ✅ All E2E tests passing
- ✅ Zero tier bypass vulnerabilities found
- ✅ Production deployment successful
- ✅ Health checks passing
- ✅ Monitoring and alerts configured
- ✅ Rollback plan documented and tested

---

## Testing Strategy

### Unit Tests (Backend)

- **Tier Checking**: 20+ tests covering all tiers and features
- **Entitlement Service**: 15+ tests for access logic
- **Quota Enforcement**: 10+ tests for quota limits
- **Podcast Service**: 30+ tests for CRUD operations
- **Transcription**: 10+ tests for Whisper integration
- **YouTube**: 10+ tests for upload/management
- **Streaming**: 10+ tests for live streaming

**Target**: 100+ backend unit tests, ≥90% coverage

### Integration Tests (API)

- **Episode Endpoints**: 25+ tests (all tiers, 403 responses)
- **Transcription Endpoints**: 10+ tests (tier validation)
- **YouTube Endpoints**: 10+ tests (Premium+ only)
- **Streaming Endpoints**: 10+ tests (Enterprise only)
- **Usage Endpoints**: 5+ tests (quota tracking)

**Target**: 60+ API integration tests, ≥90% coverage

### Component Tests (Frontend)

- **useFeatureAccess**: 10+ tests (tier checking)
- **usePodcastQuota**: 5+ tests (quota display)
- **PodcastStudio**: 15+ tests (conditional rendering)
- **UpgradePrompt**: 10+ tests (CTA display)
- **QuotaDisplay**: 5+ tests (usage visualization)

**Target**: 45+ component tests, ≥85% coverage

### End-to-End Tests

- **Starter Journey**: Attempt podcast creation → See upgrade prompt
- **Professional Journey**: Create 10 episodes → Hit quota → See upgrade
- **Premium Journey**: Create unlimited episodes → YouTube publish
- **Enterprise Journey**: Full feature access → Live streaming
- **Tier Upgrade**: Upgrade from Starter → Professional → Unlock features

**Target**: 5+ E2E scenarios, 100% critical path coverage

---

## Risk Management

### Critical Risks

| Risk | Impact | Probability | Mitigation | Status |
|------|--------|------------|------------|--------|
| Subscription bypass vulnerabilities | 🔴 Critical | Medium | Multi-layer enforcement, 403 tests, security audit | ⏳ Planned |
| Clerk API failures | 🟠 High | Low | Caching, circuit breakers, deny-by-default | ⏳ Planned |
| Quota enforcement gaps | 🟡 Medium | Medium | Real-time tracking, DB constraints, race prevention | ⏳ Planned |
| YouTube API rate limits | 🟡 Medium | Medium | Queue uploads, retry with backoff, monitor quotas | ⏳ Planned |
| Live streaming complexity | 🟡 Medium | High | Phase last, leverage libraries, extensive testing | ⏳ Planned |
| Poor upgrade conversion | 🟡 Medium | Medium | A/B test CTAs, clear value props, frictionless upgrade | ⏳ Planned |

---

## Success Metrics

### Technical Metrics

- **Test Coverage**: ≥90% backend, ≥85% frontend
- **Security**: Zero tier bypass vulnerabilities (penetration tested)
- **Performance**: Tier checks <100ms, cached <10ms
- **Reliability**: 99.9% uptime for tier validation service
- **Error Rate**: <0.1% failed tier checks

### Business Metrics

- **Feature Activation**: ≥30% of Professional+ subscribers use podcast features
- **Upgrade Conversion**: ≥5% of Starter users upgrade after seeing podcast
- **Revenue Impact**: £200K+ ARR from podcast upsells
- **Customer Satisfaction**: NPS ≥50 from podcast users
- **Time to Value**: <30 minutes from tier upgrade to first episode created

### User Experience Metrics

- **Upgrade CTA Click-Through**: ≥15% of feature lock encounters
- **Quota Warning Effectiveness**: ≥20% upgrade before hitting limit
- **Error Recovery**: <5% support tickets related to tier confusion
- **Mobile Usability**: ≥90% mobile user satisfaction
- **Accessibility**: WCAG 2.1 AA compliance

---

## Dependencies

### External Services

- **Clerk**: Subscription tier storage and retrieval
- **OpenAI Whisper**: Audio transcription (Professional+)
- **YouTube Data API**: Video upload and management (Premium+)
- **Stripe**: Payment processing (existing)
- **Redis**: Caching layer for tier data
- **Celery**: Background job processing

### Internal Dependencies

- **DEV-009 (Billing)**: Requires tier metadata sync with Clerk
- **Authentication**: Clerk JWT validation already in place
- **Database**: PostgreSQL with multi-tenant architecture
- **Frontend**: React Query for API calls

---

## Timeline Summary

| Phase | Duration | Start Date | End Date | Status |
|-------|----------|-----------|----------|--------|
| Phase 1: Documentation | 2 days | 2025-10-28 | 2025-10-30 | 🟢 In Progress |
| Phase 2: Clerk Integration | 3 days | 2025-10-30 | 2025-11-02 | ⏳ Pending |
| Phase 3: Service Layer | 4 days | 2025-11-02 | 2025-11-06 | ⏳ Pending |
| Phase 4: API Endpoints | 3 days | 2025-11-06 | 2025-11-09 | ⏳ Pending |
| Phase 5: Frontend | 3 days | 2025-11-09 | 2025-11-12 | ⏳ Pending |
| Phase 6: Deployment | 4 days | 2025-11-12 | 2025-11-16 | ⏳ Pending |
| **TOTAL** | **19 days** | **2025-10-28** | **2025-11-16** | **35% Complete** |

**Best Case**: 13 days (2025-11-10)
**Worst Case**: 19 days (2025-11-16)
**Most Likely**: 16 days (2025-11-13)

---

## Next Steps (Immediate)

1. ✅ Create plan.plan.md (this document)
2. ⏳ Create DEV-016-podcast-studio-subscription.md story
3. ⏳ Design usage tracking database schema
4. ⏳ Begin Phase 2: Clerk integration TDD

---

## References

- **CODEX-COMPLETE-PROJECT-GUIDE.md**: Subscription architecture section
- **BMAD_PROGRESS_TRACKER.md**: DEV-016 scope change details
- **docs/bmad/prd.md**: Original product requirements
- **CLAUDE.md**: Development guidelines and conventions
- **Clerk Docs**: https://clerk.com/docs/organizations/metadata
- **OpenAI Whisper Docs**: https://platform.openai.com/docs/api-reference/audio
- **YouTube Data API Docs**: https://developers.google.com/youtube/v3

---

**Status**: 🟢 Phase 1 in progress - Documentation 80% complete
**Next**: Create DEV-016 story document and begin Clerk integration

### Phase 2.2: Podcast API Entitlement Enforcement (In Progress)
- [x] RED: Expand `tests/test_podcast_api.py` with quota (429) and video tier cases (includes `/podcasts/usage` summary assertions) – completed 2025-10-28
- [ ] GREEN: Implement `quota_service.check_episode_quota` / `increment_episode_count` and ensure FastAPI router responds with 403/201
- [ ] GREEN: Verify response headers (`X-Required-Tier`, `X-Feature-Locked`, `X-Upgrade-URL`)
- [ ] GREEN: Implement `/podcasts/usage` quota summary endpoint to satisfy new RED tests
- [ ] REFACTOR: Standardize feature identifiers and log entries

### Phase 2.3: Frontend Gating Prep
- [ ] Document React gating plan (feature prompts, upgrade CTAs)
- [ ] RED: Introduce Jest/Vitest specs for new gating components
- [ ] GREEN/REFACTOR to align with entitlement service
