# Next Steps - TDD Execution for 100% Completion

**Date**: 2025-11-15
**Status**: ✅ Tests Created, Ready for Execution
**Methodology**: BMAD v6-alpha + Strict TDD

---

## ✅ Completed Work

### 1. TDD Test Creation
- ✅ Created `backend/tests/test_document_service_error_paths.py`
- ✅ 7 comprehensive tests covering error paths:
  1. Folder deletion with documents (ValueError)
  2. Folder deletion with subfolders (ValueError)
  3. Unsupported file type upload (HTTPException)
  4. File size limit exceeded (HTTPException)
  5. Insufficient permissions for subfolder creation (HTTPException)
  6. Non-owner top-level folder creation (HTTPException)
  7. Non-owner root upload (HTTPException)

### 2. Tooling
- ✅ `backend/run_coverage_analysis.py` - Coverage analysis script
- ✅ `backend/verify_tests.py` - Test verification script

### 3. Documentation
- ✅ Updated workflow status
- ✅ Updated progress tracker
- ✅ Created execution plans and status documents

---

## 🎯 Immediate Next Steps

### Step 1: Verify Tests Pass (5-10 minutes)

```bash
cd backend

# Run all new error path tests
python -m pytest tests/test_document_service_error_paths.py -v

# Or run individual test
python -m pytest tests/test_document_service_error_paths.py::test_delete_folder_with_documents_raises_value_error -xvs
```

**Expected Result**: All 7 tests should pass (code paths already exist, just need coverage)

### Step 2: Measure Coverage Improvement (10-15 minutes)

```bash
cd backend

# Option 1: Use the coverage analysis script
python run_coverage_analysis.py

# Option 2: Run pytest with coverage
python -m pytest --cov=app --cov-report=term --cov-report=json:coverage_full.json -q

# Option 3: Focus on document service
python -m pytest --cov=app.services.document_service --cov-report=term-missing tests/test_document_service*.py
```

**Expected Result**: Coverage should increase from 77.1% toward 90% target

### Step 3: Review Coverage Gaps (15-30 minutes)

```bash
cd backend

# Generate HTML coverage report for detailed analysis
python -m pytest --cov=app --cov-report=html

# Open coverage report
# Windows: start htmlcov/index.html
# Mac/Linux: open htmlcov/index.html
```

**Action**: Identify remaining uncovered lines and write additional TDD tests if needed

### Step 4: Run Full Test Suites (30-60 minutes)

```bash
# Backend
cd backend
python -m pytest --cov=app --cov-report=html --cov-report=term

# Frontend
cd frontend
npm test -- --coverage
```

**Target**: 
- Backend: ≥90% coverage
- Frontend: ≥85% coverage (already met)
- All tests passing

---

## 📊 Coverage Targets

### Backend
- **Current**: 77.1%
- **Target**: ≥90%
- **Gap**: +12.9% (+897 statements)
- **New Tests**: Cover 7 error paths in document service

### Frontend
- **Current**: 85.1%
- **Target**: ≥85% ✅ (already met)

---

## 🔍 Test Details

### Test File: `backend/tests/test_document_service_error_paths.py`

**Tests Created**:
1. `test_delete_folder_with_documents_raises_value_error` - Line 854
2. `test_delete_folder_with_subfolders_raises_value_error` - Line 862
3. `test_upload_document_unsupported_file_type` - Lines 405-409
4. `test_upload_document_file_size_exceeds_limit` - Lines 415-419
5. `test_create_folder_insufficient_permissions_for_subfolder` - Lines 349-352
6. `test_create_folder_non_owner_cannot_create_top_level` - Lines 354-358
7. `test_upload_document_non_owner_cannot_upload_to_root` - Lines 399-403

**Test Quality**:
- ✅ Uses proper fixtures (`create_deal_for_org`, `db_session`)
- ✅ Async tests marked with `@pytest.mark.asyncio`
- ✅ Uses `_folder_to_response` helper (matches API route pattern)
- ✅ Verifies both status codes and error messages
- ✅ Follows existing code patterns

---

## 📝 Documentation Updates Needed

After running tests and measuring coverage:

1. **Update Story Files**
   - `docs/bmad/stories/DEV-008-document-room.md` - Add test coverage evidence

2. **Update BMAD Tracker**
   - `docs/bmad/BMAD_PROGRESS_TRACKER.md` - Add test results and coverage metrics

3. **Update Workflow Status**
   - `docs/bmad/bmm-workflow-status.md` - Update NEXT_ACTION with results

4. **Create Completion Report**
   - Final coverage numbers
   - Test pass/fail counts
   - Remaining gaps (if any)

---

## 🚀 Completion Checklist

- [ ] Run new error path tests
- [ ] Verify all tests pass
- [ ] Measure coverage improvement
- [ ] Review coverage gaps
- [ ] Write additional tests if needed (to reach ≥90%)
- [ ] Run full backend test suite
- [ ] Run full frontend test suite
- [ ] Update documentation
- [ ] Create completion report
- [ ] Prepare release notes

---

## ⚠️ Known Issues

### PowerShell Output
- PowerShell output redirection may not show in real-time
- Use the verification scripts or run tests directly in terminal
- Check output files if created (`test_results.txt`, `coverage_output.txt`)

### Test Execution
- Tests are properly structured and should pass
- If tests fail, check:
  - Fixture availability (`create_deal_for_org`, `db_session`)
  - Import statements
  - Database setup

---

## 📞 Support

If tests fail or coverage doesn't improve as expected:

1. Check test output for specific error messages
2. Verify fixtures are available in `backend/tests/conftest.py`
3. Check that service functions match expected signatures
4. Review `backend/tests/test_document_service.py` for similar test patterns

---

**Status**: ✅ READY FOR EXECUTION
**Estimated Time**: 1-2 hours for test verification and coverage measurement
**Next Session**: Run tests, measure coverage, update documentation

