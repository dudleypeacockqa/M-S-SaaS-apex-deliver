# Backend Coverage Enhancement Test Plan
# Target: 84% → 90%+ Coverage

**Created**: 2025-11-17
**Status**: 🔄 IN PROGRESS
**Methodology**: Test-Driven Development (TDD) - RED → GREEN → REFACTOR

---

## Executive Summary

**Current Coverage**: 84% (12,068 statements, 1,930 missing)
**Target Coverage**: 90%+ (estimated ~12,800 statements, <1,280 missing)
**Gap to Close**: 6% (approximately 650 statements to cover)
**Estimated New Tests**: 120-160 tests
**Estimated Duration**: 20-30 hours

---

## Coverage Analysis

### Current Test Statistics

```
Total Statements: 12,068
Covered: 10,138 (84%)
Missing: 1,930 (16%)

Tests Collected: 1,342
Tests Passing: 1,260 (99.6%)
Tests Skipped: 77 (OAuth integrations)
Tests Failing: 5 (non-critical)
```

### Major Coverage Gaps

Based on pytest coverage report analysis, the following areas have <80% coverage:

1. **OAuth Integration Services** (~0% coverage, 77 tests skipped)
   - `app/services/sage_service.py`
   - `app/services/quickbooks_service.py`
   - `app/services/netsuite_service.py`

2. **Document AI Services** (~60-70% coverage)
   - `app/services/document_ai_service.py`
   - `app/services/document_generation_service.py`
   - Edge cases and error handling

3. **Valuation Export Services** (~65% coverage)
   - `app/services/valuation_export_service.py`
   - PDF/Excel/PowerPoint export logic
   - WeasyPrint integration

4. **Error Handling & Edge Cases** (varies 50-80%)
   - `app/core/exceptions.py`
   - Database connection failures
   - External API error scenarios
   - Security validation edge cases

---

## Test Plan by Area

### Area 1: OAuth Integration Tests
**Target**: +50-70 tests, +3-5% coverage
**Duration**: 6-8 hours
**Priority**: P1 (High Value)

#### 1.1 Sage Integration Tests (+15-20 tests)

**Test File**: `backend/tests/integration/test_sage_oauth.py`

**TDD Cycle 1: Authorization Flow**
```python
# RED (Write failing test)
async def test_sage_oauth_authorization_url_generation():
    """Test Sage OAuth authorization URL is correctly generated"""
    # Test will fail - no implementation yet
    pass

# GREEN (Implement minimal code)
# Add mock OAuth URL generation in sage_service.py

# REFACTOR (Clean up)
# Extract URL generation to reusable method
```

**Test Scenarios**:
1. ✅ Authorization URL generation with correct scopes
2. ✅ State parameter generation and validation
3. ✅ Callback handling with authorization code
4. ✅ Token exchange (code → access token)
5. ✅ Token refresh mechanism
6. ✅ Invalid authorization code handling
7. ✅ Expired token detection
8. ✅ Token refresh failure handling
9. ✅ Concurrent token refresh (race condition)
10. ✅ OAuth revocation handling
11. ✅ Financial data fetching after auth
12. ✅ API rate limiting handling
13. ✅ Connection timeout handling
14. ✅ Invalid credentials error
15. ✅ Multi-tenant OAuth (organization isolation)

**Mock Strategy**:
- Mock Sage OAuth endpoints (`/oauth/authorize`, `/oauth/token`)
- Mock Sage API responses (financial data)
- Use httpx.MockTransport for async testing

#### 1.2 QuickBooks Integration Tests (+15-20 tests)

**Test File**: `backend/tests/integration/test_quickbooks_oauth.py`

**Test Scenarios** (similar to Sage):
1. OAuth authorization flow
2. Token management (refresh, expiration)
3. API data fetching
4. Error handling
5. Webhook handling (QuickBooks-specific)
6. Rate limiting
7. Multi-company support

#### 1.3 NetSuite Integration Tests (+15-20 tests)

**Test File**: `backend/tests/integration/test_netsuite_oauth.py`

**Test Scenarios**:
1. REST API OAuth flow
2. Token-based authentication
3. Data extraction
4. Custom record handling (NetSuite-specific)
5. SuiteTalk API integration
6. Error scenarios

#### 1.4 Common OAuth Pattern Tests (+5-10 tests)

**Test File**: `backend/tests/services/test_oauth_common.py`

**Test Scenarios**:
1. OAuth token storage (encrypted)
2. Token retrieval by organization
3. Token deletion on disconnect
4. OAuth error standardization
5. Retry logic with exponential backoff

**Dependencies**:
```bash
# Install boto3 for S3 token storage tests
pip install boto3

# Add to requirements-test.txt
boto3>=1.28.0
```

---

### Area 2: Document AI Edge Case Tests
**Target**: +30-40 tests, +2-3% coverage
**Duration**: 4-6 hours
**Priority**: P1 (High Value)

#### 2.1 Template Edge Cases (+10-12 tests)

**Test File**: `backend/tests/services/test_document_template_edge_cases.py`

**TDD Approach**:
```python
# RED
async def test_empty_template_validation():
    """Empty templates should raise ValidationError"""
    with pytest.raises(ValidationError):
        await document_service.validate_template("")

# GREEN
# Add validation in document_generation_service.py
if not template.content or not template.content.strip():
    raise ValidationError("Template content cannot be empty")

# REFACTOR
# Extract to reusable validator
```

**Test Scenarios**:
1. Empty template content
2. Template with malformed variables (`{{missing_closing}`)
3. Template with undefined variables
4. Circular template references
5. Template with special characters (Unicode)
6. Template with SQL injection attempts
7. Template with XSS attempts
8. Template size limits (>1MB)
9. Template with binary content
10. Template version conflicts
11. Template concurrent updates
12. Template deletion while in use

#### 2.2 AI Generation Edge Cases (+10-12 tests)

**Test File**: `backend/tests/services/test_document_ai_edge_cases.py`

**Test Scenarios**:
1. OpenAI API rate limit (429 error)
2. OpenAI API timeout
3. Malformed AI response (invalid JSON)
4. Empty AI suggestions
5. AI response with special characters
6. AI response exceeding token limits
7. Concurrent AI requests (quota management)
8. AI request with invalid prompts
9. AI service unavailable (503 error)
10. AI authentication failure
11. AI content filtering triggers
12. AI fallback logic

**Mock Strategy**:
```python
@pytest.fixture
def mock_openai_rate_limit():
    """Mock OpenAI rate limit error"""
    with patch("openai.ChatCompletion.acreate") as mock:
        mock.side_effect = RateLimitError("Rate limit exceeded")
        yield mock
```

#### 2.3 Export Queue Edge Cases (+10-12 tests)

**Test File**: `backend/tests/services/test_export_queue_edge_cases.py`

**Test Scenarios**:
1. Concurrent export processing (10+ simultaneous)
2. Failed export cleanup
3. Queue overflow (>100 pending exports)
4. Export timeout handling
5. Large document export (>100 pages)
6. Export retry logic
7. Export priority queue
8. Export cancellation
9. Export pause/resume
10. Export status polling race conditions
11. Export notification failures
12. Export quota enforcement

---

### Area 3: Valuation Export Tests
**Target**: +15-20 tests, +1-2% coverage
**Duration**: 2-3 hours
**Priority**: P2 (Medium Value)

#### 3.1 PDF Export Tests (+5-7 tests)

**Test File**: `backend/tests/services/test_valuation_pdf_export.py`

**TDD Approach** (Fix existing WeasyPrint failures):
```python
# RED (Currently failing)
async def test_dcf_valuation_pdf_export():
    """Test DCF valuation exports to PDF with charts"""
    # Currently fails due to WeasyPrint dependency

# GREEN (Fix implementation)
# Option 1: Install WeasyPrint
# Option 2: Add fallback to reportlab
# Option 3: Mock PDF generation

# REFACTOR
# Extract PDF generation to pluggable interface
```

**Test Scenarios**:
1. Basic PDF export (no charts)
2. PDF with embedded charts
3. PDF with custom branding
4. Multi-page PDF layout
5. PDF with tables
6. PDF generation failure handling
7. PDF size optimization

**WeasyPrint Alternative**:
- Use reportlab as fallback
- Or use HTML → PDF service (wkhtmltopdf)
- Or mock PDF generation for tests

#### 3.2 Excel Export Tests (+5-7 tests)

**Test File**: `backend/tests/services/test_valuation_excel_export.py`

**Test Scenarios**:
1. Basic Excel export
2. Excel with formulas
3. Multi-worksheet export
4. Excel with data validation
5. Large dataset export (>10,000 rows)
6. Excel formatting (colors, fonts)
7. Excel generation error handling

#### 3.3 PowerPoint Export Tests (+5-6 tests)

**Test File**: `backend/tests/services/test_valuation_ppt_export.py`

**Test Scenarios**:
1. Basic PowerPoint export
2. PowerPoint with charts
3. Custom PowerPoint templates
4. PowerPoint with data tables
5. PowerPoint theme application
6. PowerPoint generation error handling

---

### Area 4: Error Handling & Edge Cases
**Target**: +25-30 tests, +1-2% coverage
**Duration**: 3-4 hours
**Priority**: P1 (High Value)

#### 4.1 Database Failure Tests (+8-10 tests)

**Test File**: `backend/tests/core/test_database_failures.py`

**Test Scenarios**:
1. Connection timeout
2. Transaction rollback on error
3. Deadlock detection and retry
4. Connection pool exhaustion
5. Database unavailable (502 error)
6. Slow query timeout
7. Foreign key violation handling
8. Unique constraint violation handling
9. Database migration failure
10. Connection leak detection

**Mock Strategy**:
```python
@pytest.fixture
def mock_db_timeout():
    """Mock database connection timeout"""
    with patch("sqlalchemy.create_engine") as mock:
        mock.side_effect = OperationalError("Connection timeout")
        yield mock
```

#### 4.2 External API Failure Tests (+8-10 tests)

**Test File**: `backend/tests/core/test_external_api_failures.py`

**Test Scenarios**:
1. Xero API timeout
2. OpenAI API failure
3. Anthropic Claude API error
4. Stripe API timeout
5. Clerk API error
6. SendGrid email failure
7. S3 upload failure
8. Redis connection failure
9. Celery task queue failure
10. Webhook delivery failure

#### 4.3 Security Edge Cases (+9-10 tests)

**Test File**: `backend/tests/core/test_security_edge_cases.py`

**Test Scenarios**:
1. SQL injection attempt via deal name
2. XSS attempt via document content
3. Invalid JWT token (malformed)
4. Expired JWT token
5. JWT token with invalid signature
6. CSRF token validation
7. Rate limiting enforcement
8. Authorization bypass attempt
9. Path traversal attempt
10. File upload malicious content

---

## Implementation Strategy

### Phase 1: OAuth Integration Tests (Days 1-2, 6-8 hours)

**Day 1**:
- [ ] Set up OAuth mock fixtures
- [ ] Implement Sage OAuth tests (15 tests)
- [ ] Implement QuickBooks OAuth tests (15 tests)
- [ ] Verify tests pass, commit

**Day 2**:
- [ ] Implement NetSuite OAuth tests (15 tests)
- [ ] Implement common OAuth pattern tests (10 tests)
- [ ] Install boto3 dependency
- [ ] Verify all OAuth tests pass
- [ ] Measure coverage improvement (+3-5%)

### Phase 2: Document AI Edge Cases (Day 2-3, 4-6 hours)

**Day 2 (continued)**:
- [ ] Template edge case tests (12 tests)
- [ ] AI generation edge case tests (12 tests)

**Day 3**:
- [ ] Export queue edge case tests (12 tests)
- [ ] Verify all document AI tests pass
- [ ] Measure coverage improvement (+2-3%)

### Phase 3: Valuation Export Tests (Day 3, 2-3 hours)

**Day 3 (continued)**:
- [ ] Fix WeasyPrint PDF tests or implement alternative
- [ ] Excel export tests (7 tests)
- [ ] PowerPoint export tests (6 tests)
- [ ] Verify all export tests pass
- [ ] Measure coverage improvement (+1-2%)

### Phase 4: Error Handling & Edge Cases (Day 3-4, 3-4 hours)

**Day 3-4**:
- [ ] Database failure tests (10 tests)
- [ ] External API failure tests (10 tests)
- [ ] Security edge case tests (10 tests)
- [ ] Verify all error handling tests pass
- [ ] Measure coverage improvement (+1-2%)

---

## TDD Discipline Checklist

For **every single test**:

1. **RED Phase**:
   - [ ] Write failing test first
   - [ ] Run test and verify it fails
   - [ ] Document expected behavior

2. **GREEN Phase**:
   - [ ] Write minimal code to pass test
   - [ ] Run test and verify it passes
   - [ ] No refactoring yet

3. **REFACTOR Phase**:
   - [ ] Clean up code
   - [ ] Extract reusable components
   - [ ] Run test again to ensure still passing
   - [ ] Commit changes

4. **Commit**:
   - [ ] Descriptive commit message
   - [ ] Include test count in message
   - [ ] Reference coverage improvement

---

## Success Criteria

### Minimum Acceptable Outcome
- ✅ Backend coverage: 87%+ (from 84%)
- ✅ New tests added: 80+
- ✅ All new tests passing (100%)
- ✅ No regressions in existing tests
- ✅ TDD methodology followed throughout

### Target Outcome
- ✅ Backend coverage: 90%+ (from 84%)
- ✅ New tests added: 120-160
- ✅ All tests passing (100%)
- ✅ OAuth integrations fully tested
- ✅ Document AI edge cases covered
- ✅ Valuation exports working
- ✅ Error handling comprehensive

### Stretch Outcome
- ✅ Backend coverage: 92%+ (from 84%)
- ✅ New tests added: 180+
- ✅ Zero skipped tests (unskip all OAuth tests)
- ✅ Production-ready WeasyPrint PDF export
- ✅ Performance benchmarks for all services

---

## Risk Mitigation

### Technical Risks
- **OAuth Mocking Complexity**: Use httpx.MockTransport for async
- **WeasyPrint Dependency**: Use alternative (reportlab) or mock
- **Test Isolation**: Ensure proper fixture cleanup
- **Performance**: Run tests in parallel where possible

### Schedule Risks
- **Time Overrun**: Prioritize P1 tests first
- **Blocked**: Document blockers, move to next area
- **Fatigue**: Take breaks between phases

### Quality Risks
- **Test Quality**: Follow TDD strictly (RED → GREEN → REFACTOR)
- **False Positives**: Verify mocks accurately reflect real behavior
- **Coverage Gaming**: Ensure tests actually validate behavior, not just hit lines

---

## Progress Tracking

### Coverage Milestones

| Milestone | Coverage | Tests Added | Status |
|-----------|----------|-------------|--------|
| Start | 84% | 0 | ✅ Complete |
| OAuth Complete | 87-89% | +55 | 📋 Pending |
| Document AI Complete | 89-90% | +36 | 📋 Pending |
| Valuation Complete | 90-91% | +18 | 📋 Pending |
| Error Handling Complete | 91-92% | +30 | 📋 Pending |
| **Final Target** | **90%+** | **120-160** | 📋 Pending |

### Daily Progress Log

**Day 1** (2025-11-17):
- Plan A (v1.1.0 release): ✅ Complete
- Coverage analysis: ✅ Complete
- Test plan created: ✅ Complete
- OAuth tests: 🔄 In Progress

**Day 2** (2025-11-18):
- OAuth tests: 📋 Pending
- Document AI tests: 📋 Pending

**Day 3** (2025-11-19):
- Valuation tests: 📋 Pending
- Error handling tests: 📋 Pending
- Final verification: 📋 Pending

---

## References

- **Coverage Report**: `backend/htmlcov/index.html`
- **Test Results**: `docs/tests/2025-11-17-backend-pre-release.txt`
- **TDD Guide**: `docs/bmad/technical_specifications.md#tdd`
- **pytest Docs**: https://docs.pytest.org/

---

**Status**: 🔄 **IN PROGRESS**

**Next Action**: Begin Phase 1 - OAuth Integration Tests

**Last Updated**: 2025-11-17T07:36:00Z

---

**End of Test Plan**
