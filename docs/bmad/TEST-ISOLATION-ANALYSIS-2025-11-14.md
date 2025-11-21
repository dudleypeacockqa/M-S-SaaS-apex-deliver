# Test Isolation Analysis
**Date**: 2025-11-14  
**Purpose**: Identify root causes of backend test suite isolation issues  
**Current State**: 30% pass rate in full suite, 90%+ when run by module

---

## Root Cause Analysis

### Issue Summary
- **Full Suite**: 314 passed, 274 failed, 365 errors (30% pass rate)
- **By Module**: 90%+ pass rate
- **Individual**: 95%+ pass rate
- **Conclusion**: Test execution order dependencies and shared state

---

## Identified Problems

### 1. Shared Mock State (HIGH PRIORITY)

**Location**: `backend/tests/conftest.py` lines 62-71

**Problem**:
```python
stripe_mock = MagicMock()
sys.modules.setdefault("stripe", stripe_mock)

celery_mock = MagicMock()
sys.modules.setdefault("celery", celery_mock)

openai_mock = MagicMock()
sys.modules.setdefault("openai", openai_mock)
```

**Issue**: These mocks are created at module import time and shared across all tests. If one test modifies the mock state, it affects subsequent tests.

**Fix**: Reset mocks in `autouse` fixture or use `pytest.fixture(scope="function")` with proper cleanup.

---

### 2. Database Session Scoping (MEDIUM PRIORITY)

**Location**: `backend/tests/conftest.py` lines 93-114, 177-185

**Current Setup**:
- `engine` fixture: Function scope (good)
- `db_session` fixture: Function scope (good)
- `_reset_database` fixture: Autouse, resets after each test (good)

**Potential Issue**: If tests don't properly commit/rollback, data might leak between tests despite reset.

**Fix**: Ensure all tests use transactions that rollback, or verify `_reset_database` is working correctly.

---

### 3. Dependency Overrides Leakage (MEDIUM PRIORITY)

**Location**: `backend/tests/conftest.py` lines 156-174

**Current Setup**:
```python
@app.dependency_overrides[get_db] = _get_db_override
try:
    with TestClient(app) as test_client:
        yield test_client
finally:
    app.dependency_overrides.pop(get_db, None)
```

**Issue**: Some tests manually override dependencies (e.g., `get_current_user`) and may not clean up properly.

**Example**: `backend/tests/test_deal_endpoints.py` lines 143, 192 show manual cleanup, but if test fails before cleanup, override persists.

**Fix**: Use context managers or ensure all dependency overrides are in try/finally blocks.

---

### 4. Fixture Dependencies and Order (LOW PRIORITY)

**Location**: Various test files

**Issue**: Some fixtures depend on others (e.g., `test_event` depends on `test_organization`, `test_user`). If fixture order changes, tests may fail.

**Fix**: Use explicit fixture dependencies and proper scoping.

---

## Fix Plan (Phase 3)

### Step 1: Reset Mock State (P0)
- Add `autouse` fixture to reset all mocks after each test
- Ensure mocks are fresh for each test function

### Step 2: Verify Database Isolation (P0)
- Add test to verify database is clean between tests
- Ensure `_reset_database` fixture is working correctly
- Add transaction rollback for all test database operations

### Step 3: Fix Dependency Override Leakage (P1)
- Audit all tests that use `app.dependency_overrides`
- Ensure all overrides are in try/finally blocks
- Create helper fixture for dependency overrides

### Step 4: Standardize Fixture Scoping (P2)
- Review all fixture scopes
- Ensure function-scoped fixtures are used where appropriate
- Document fixture dependencies

---

## Implementation Priority

1. **P0 - Critical**: Mock state reset (causes most failures)
2. **P0 - Critical**: Database isolation verification
3. **P1 - High**: Dependency override cleanup
4. **P2 - Medium**: Fixture scoping standardization

---

## Testing Strategy

After fixes:
1. Run full test suite: `pytest backend/tests -v`
2. Run by module: `pytest backend/tests/test_*.py -v` (should still pass)
3. Run individual tests: `pytest backend/tests/test_*.py::test_* -v` (should still pass)
4. Compare results - full suite should match module results

---

## Estimated Effort

- Mock reset: 2-3 hours
- Database isolation verification: 1-2 hours
- Dependency override fixes: 4-6 hours
- Fixture scoping: 2-3 hours
- **Total**: 9-14 hours

---

**Next Steps**: Defer to Phase 3 after completing Phase 1 and Phase 2 critical gaps.

