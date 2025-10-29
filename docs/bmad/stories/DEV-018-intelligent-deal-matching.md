# DEV-018: Intelligent Deal Matching Engine

**Story ID**: DEV-018
**Sprint**: Sprint 6 (100% Completion Phase)
**Priority**: ⭐⭐⭐⭐⭐ (Core Differentiator - F-008)
**Estimated Effort**: 20-28 hours (TDD end-to-end)
**Methodology**: BMAD v6-alpha + Test-Driven Development (strict RED → GREEN → REFACTOR)
**Status**: 🟡 PHASE 1 COMPLETE (2025-10-29 09:45 UTC)

**Phase 1 Complete**: Database Models & Schema
- ✅ DealMatchCriteria model (3 tests passing)
- ✅ DealMatch model (3 tests passing)
- ✅ DealMatchAction model (2 tests passing)
- ✅ Alembic migration created and verified
- ✅ Multi-tenant isolation enforced
- ✅ Test fixtures created (match_org, match_user, match_deal)
- **Total: 8/8 model tests GREEN**

**Remaining Phases**:
- Phase 2: Matching Algorithm Service (pending)
- Phase 3: REST API Endpoints (blocked by linter - import path conflicts)
- Phase 4: Frontend Components (pending)

**Known Issues**:
- API routes file has incorrect import paths (app.core.* instead of app.api.dependencies.*)
- Linter actively reverts import fixes
- Router registration disabled in __init__.py

---

## 📖 User Stories & Business Context

### Primary User Stories

1. **As a** sell-side M&A advisor **I want to** automatically match my mandate with qualified buyers **so that** I can accelerate deal execution and maximize value
2. **As a** buy-side investor **I want to** discover relevant acquisition targets matching my criteria **so that** I can build a robust deal pipeline
3. **As a** platform admin **I want** AI-powered matching algorithms **so that** the platform delivers measurable value beyond workflow management

### Business Context

**Strategic Importance**: Deal matching transforms the platform from a workflow tool into an intelligent marketplace. This feature directly impacts:
- **Revenue Growth**: Enables transaction fees (2-3% of deal value)
- **Network Effects**: More users = better matches = more users
- **Competitive Moat**: AI-powered matching vs manual spreadsheets
- **Market Position**: Positions platform as "Match.com for M&A deals"

**Revenue Model**:
- **Match Fees**: £500-2,000 per successful introduction
- **Premium Matching**: Professional+ tier feature (£598/mo minimum)
- **Success Fees**: Optional 1-2% of transaction value

**Target Users**:
- Corporate development teams sourcing acquisitions
- Investment banks with buy-side mandates
- Private equity firms seeking bolt-ons
- Solo advisors representing sellers

---

## ✅ Acceptance Criteria

### AC-18.1: Matching Criteria Engine
- System captures deal criteria (industry, size, geography, stage, structure)
- Users can define "ideal profile" with weighted preferences
- Fuzzy matching handles variations (e.g., "SaaS" matches "Software-as-a-Service")
- Negative filters exclude unwanted attributes (e.g., "no distressed assets")
- Criteria saved as reusable templates

### AC-18.2: AI-Powered Similarity Scoring
- OpenAI embeddings generate semantic vectors for deal descriptions
- Cosine similarity calculates match scores (0-100%)
- Multi-factor scoring: industry fit (40%), size (30%), geography (20%), other (10%)
- Confidence thresholds: High (>80%), Medium (60-80%), Low (40-60%)
- Explainability: Shows which criteria drove the match

### AC-18.3: Match Dashboard & Discovery
- Tabular view of matches sorted by score
- Filters: confidence level, industry, deal size, geography, date added
- Search by company name, keywords, deal characteristics
- Card view with deal summary, match score, key highlights
- "Why this match?" explanation panel

### AC-18.4: Notifications & Workflows
- Email alerts for new high-confidence matches (>80%)
- In-app notification center with match count badges
- "Request Introduction" workflow (sends message to counterparty)
- "Pass" action removes match from feed (with optional reason)
- "Save for Later" bookmark functionality

### AC-18.5: Privacy & Permissions
- Blind matching: Company names revealed only after mutual interest
- Tiered disclosure: Summary → Details → Contact info (progressive reveal)
- Deal owners control visibility (public, network-only, private)
- NDA enforcement before full disclosure
- Audit log of who viewed deal details

### AC-18.6: Analytics & Reporting
- Match quality metrics (acceptance rate, introduction rate)
- User engagement dashboards (views, saves, passes)
- A/B testing framework for algorithm tuning
- Export matches to CSV/PDF for offline analysis

### AC-18.7: RBAC & Tier Enforcement
- Matching available to Professional tier and above
- Starter tier sees upgrade CTA when accessing match features
- Match limits by tier: Professional (10/month), Premium (unlimited)
- API quota enforcement prevents abuse

### AC-18.8: Operational Excellence
- ≥90% backend test coverage for matching modules
- ≥85% frontend test coverage for match components
- Sub-2s response time for match queries (100 deals)
- Batch processing for embedding generation (async Celery tasks)
- Comprehensive error handling and logging

---

## 🧠 Technical Specifications

### Backend Architecture

**Models** (`app/models/deal_match.py`):
```python
class DealMatchCriteria(Base):
    """User-defined matching criteria"""
    __tablename__ = "deal_match_criteria"

    id: UUID
    user_id: UUID
    organization_id: UUID
    name: str  # "Tech Acquisitions Q4 2025"
    deal_type: str  # "buy_side" or "sell_side"
    industries: List[str]  # JSON array
    min_deal_size: Decimal
    max_deal_size: Decimal
    geographies: List[str]  # ["UK", "EU", "US"]
    structures: List[str]  # ["asset_purchase", "stock_purchase", "merger"]
    negative_filters: Dict  # {"distressed": true}
    weights: Dict  # {"industry": 0.4, "size": 0.3, ...}
    created_at: DateTime
    updated_at: DateTime


class DealMatch(Base):
    """A potential match between two deals"""
    __tablename__ = "deal_matches"

    id: UUID
    deal_id: UUID  # Source deal
    matched_deal_id: UUID  # Target deal
    match_score: Float  # 0-100
    confidence: str  # "high", "medium", "low"
    explanation: Dict  # JSON explaining score components
    status: str  # "pending", "accepted", "declined", "introduced"
    viewed_at: DateTime | None
    responded_at: DateTime | None
    created_at: DateTime


class DealMatchAction(Base):
    """User actions on matches (for analytics)"""
    __tablename__ = "deal_match_actions"

    id: UUID
    match_id: UUID
    user_id: UUID
    action: str  # "view", "save", "pass", "request_intro"
    metadata: Dict  # Additional context
    created_at: DateTime
```

**Services** (`app/services/deal_matching_service.py`):
```python
def calculate_match_score(
    deal: Deal,
    criteria: DealMatchCriteria,
    candidate_deals: List[Deal]
) -> List[MatchResult]:
    """
    Core matching algorithm combining rule-based and AI scoring.

    Steps:
    1. Filter candidates by hard constraints (size, geography)
    2. Generate embeddings for deal descriptions (OpenAI)
    3. Calculate cosine similarity
    4. Apply weighted scoring formula
    5. Rank by total score
    """
    pass


async def generate_deal_embedding(deal: Deal) -> List[float]:
    """Generate 1536-dim embedding using OpenAI text-embedding-ada-002"""
    text = f"{deal.name} {deal.description} {deal.industry} {deal.target_company}"
    response = await openai_client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding


def explain_match(
    deal: Deal,
    matched_deal: Deal,
    score_components: Dict
) -> Dict:
    """
    Generate human-readable explanation of why deals matched.

    Returns:
    {
        "industry_match": {"score": 0.95, "reason": "Both in SaaS"},
        "size_match": {"score": 0.80, "reason": "Within 20% of target size"},
        ...
    }
    """
    pass
```

**API Routes** (`app/api/routes/deal_matching.py`):
```
POST   /api/match-criteria              # Create matching criteria
GET    /api/match-criteria              # List user's criteria
PATCH  /api/match-criteria/{id}         # Update criteria
DELETE /api/match-criteria/{id}         # Delete criteria

POST   /api/deals/{deal_id}/find-matches     # Trigger matching
GET    /api/deals/{deal_id}/matches          # List matches for deal
GET    /api/matches/{match_id}               # Get match details
POST   /api/matches/{match_id}/actions       # Record action (view/save/pass)
POST   /api/matches/{match_id}/request-intro # Request introduction
```

### Frontend Architecture

**Pages**:
- `DealMatchingDashboard.tsx`: Main matching interface
- `MatchCriteriaBuilder.tsx`: Criteria creation form
- `MatchCard.tsx`: Individual match display
- `MatchDetailModal.tsx`: Full match details with explanation

**Components**:
- `MatchScoreBadge.tsx`: Visual score indicator (0-100)
- `MatchExplanation.tsx`: "Why this match?" panel
- `MatchFilters.tsx`: Filter sidebar (confidence, industry, etc.)
- `IntroductionRequestForm.tsx`: Request intro workflow

**Hooks**:
- `useMatchCriteria()`: Manage user criteria
- `useDealMatches(dealId)`: Fetch matches for deal
- `useMatchActions()`: Track user actions (view/save/pass)

### Data Flow

```
User creates criteria
  → Backend validates & saves
  → Async Celery task generates embeddings for all deals
  → Matching algorithm calculates scores
  → Matches stored in DB
  → Frontend fetches via API
  → User views matches
  → Actions logged for analytics
```

---

## 🧪 TDD Implementation Plan

### Phase 1: Backend Models & Migrations (4-6 hours)

**RED:**
```python
# tests/test_deal_matching_models.py
def test_deal_match_criteria_creation():
    criteria = DealMatchCriteria(
        user_id="user-1",
        name="Tech Acquisitions",
        deal_type="buy_side",
        industries=["saas", "fintech"],
        min_deal_size=1000000,
        max_deal_size=10000000
    )
    assert criteria.name == "Tech Acquisitions"
```

**GREEN:**
- Create models in `app/models/deal_match.py`
- Alembic migration: `alembic revision --autogenerate -m "add deal matching tables"`
- Run `alembic upgrade head`

**REFACTOR:**
- Add indexes on frequently queried fields
- Add relationships to Deal model

### Phase 2: Matching Algorithm (8-10 hours)

**RED:**
```python
# tests/test_deal_matching_service.py
def test_calculate_match_score_returns_sorted_matches():
    deal = create_test_deal(industry="saas", deal_size=5000000)
    criteria = create_test_criteria(industries=["saas"], min_size=1000000)
    candidates = [
        create_test_deal(industry="saas", deal_size=4500000),  # Should score high
        create_test_deal(industry="fintech", deal_size=5000000),  # Lower
    ]

    matches = calculate_match_score(deal, criteria, candidates)

    assert len(matches) == 2
    assert matches[0].score > matches[1].score
    assert matches[0].confidence == "high"
```

**GREEN:**
- Implement `calculate_match_score()` in `deal_matching_service.py`
- Rule-based scoring first (no AI)
- Add OpenAI embedding generation (stubbed for tests)
- Cosine similarity calculation

**REFACTOR:**
- Extract scoring components into separate functions
- Cache embeddings to avoid recomputation
- Add deterministic seeding for tests

### Phase 3: API Endpoints (4-6 hours)

**RED:**
```python
# tests/test_deal_matching_api.py
@pytest.mark.asyncio
async def test_create_match_criteria(client, auth_headers):
    response = await client.post(
        "/api/match-criteria",
        json={
            "name": "Tech Deals Q4",
            "deal_type": "buy_side",
            "industries": ["saas"],
            "min_deal_size": 1000000
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Tech Deals Q4"
```

**GREEN:**
- Implement CRUD endpoints in `app/api/routes/deal_matching.py`
- Add Pydantic schemas for requests/responses
- RBAC enforcement (Professional+ tier)

**REFACTOR:**
- Consolidate validation logic
- Add OpenAPI documentation

### Phase 4: Frontend Components (6-8 hours)

**RED:**
```typescript
// DealMatchingDashboard.test.tsx
it('displays match cards sorted by score', async () => {
  const mockMatches = [
    { id: '1', score: 95, confidence: 'high' },
    { id: '2', score: 75, confidence: 'medium' },
  ]
  vi.mocked(listMatches).mockResolvedValue(mockMatches)

  render(<DealMatchingDashboard dealId="deal-123" />)

  await waitFor(() => {
    const cards = screen.getAllByTestId('match-card')
    expect(cards).toHaveLength(2)
    expect(within(cards[0]).getByText('95%')).toBeInTheDocument()
  })
})
```

**GREEN:**
- Build `DealMatchingDashboard.tsx`
- Implement `MatchCard.tsx` with score badge
- Add `MatchFilters.tsx` sidebar
- React Query integration

**REFACTOR:**
- Extract reusable components
- Optimize re-renders
- Add skeleton loaders

### Phase 5: Integration & E2E Testing (2-4 hours)

- Full workflow test: Create criteria → Find matches → Request intro
- Performance testing: 100 deals matched in <2s
- Edge cases: No matches, all low confidence, API errors

---

## 📁 Deliverables Checklist

### Backend
- [x] Story created (DEV-018-intelligent-deal-matching.md)
- [ ] Models: DealMatchCriteria, DealMatch, DealMatchAction
- [ ] Alembic migration for match tables
- [ ] Services: deal_matching_service.py (scoring algorithm)
- [ ] API routes: /api/match-criteria, /api/matches
- [ ] Tests: ≥90% coverage

### Frontend
- [ ] DealMatchingDashboard.tsx
- [ ] MatchCriteriaBuilder.tsx
- [ ] API client: match_criteria.ts
- [ ] Tests: ≥85% coverage

### Operations
- [ ] Celery task for batch embedding generation
- [ ] Render deployment verified
- [ ] BMAD tracker updated
- [ ] Completion summary created

---

## 📊 Metrics & Success Criteria

- **Coverage**: ≥90% backend, ≥85% frontend
- **Performance**: Match calculation <2s for 100 deals
- **Accuracy**: ≥70% of matches rated "relevant" by users (manual testing)
- **UX**: Match dashboard renders in <500ms

---

## 🚨 Risks & Mitigation

- **OpenAI API costs** → Cache embeddings aggressively, use batch API
- **Algorithm complexity** → Start with rule-based, add AI incrementally
- **Data privacy** → Implement blind matching with progressive disclosure
- **Low match quality** → Collect user feedback, iterate on weights

---

## 🔄 Dependencies & Sequencing

- Requires Deal model (DEV-007) ✅
- Requires RBAC (DEV-005) ✅
- Requires OpenAI integration setup
- Enables future revenue streams (transaction fees)

---

## 🗂 Documentation & Reporting Obligations

- Update BMAD_PROGRESS_TRACKER.md at each TDD cycle
- Create DEV-018-COMPLETION-SUMMARY.md upon finish
- Document matching algorithm in technical docs
- Add user guide for match criteria builder

---

## 📌 Current Status Snapshot

**Status**: 🔴 RED (Story creation complete, ready for Phase 1)
**Next Action**: Begin Phase 1 - Backend Models & Migrations (TDD RED tests)
**Estimated Completion**: 20-28 hours from start

---

**End of DEV-018 Story**
