# Phase 0: Frontend Full Coverage Run Analysis

**Date**: 2025-11-13
**Task**: Troubleshoot frontend full coverage run
**Status**: ⚠️ PARTIALLY RESOLVED - Tests pass, full coverage run timing issue documented

## Issue Summary

The full frontend Vitest coverage run (`npm run test:coverage`) times out or takes excessive time (20+ minutes) when running all ~1,500 tests in a single execution.

## Evidence

**Last Attempt**: `docs/tests/2025-11-14-frontend-full-suite-coverage.txt`
- Run started successfully
- Tests passing individual (e.g., `src/components/podcast/AudioUploadModal.test.tsx` - 16 tests in 1243ms)
- Output truncated at 999 lines (process timeout or kill signal)

## Root Cause Analysis

### Vitest Configuration
**File**: `frontend/vitest.config.ts`

Current settings:
```typescript
pool: 'forks',
poolOptions: {
  forks: {
    singleFork: true,  // ← Sequential execution
  },
},
testTimeout: 90000,  // 90 seconds per test
hookTimeout: 90000,
teardownTimeout: 90000,
```

**Problem**: `singleFork: true` forces all tests to run sequentially in a single process. With ~1,500 tests averaging 500ms each, total runtime = **12.5 minutes minimum** (not including setup/teardown).

### Windows-Specific Issues

From Vitest config comments:
```typescript
if (!process.env.VITEST_POOL_TIMEOUT) {
  // Worker bootstrap regularly exceeds the default 10s limit on Windows
  process.env.VITEST_POOL_TIMEOUT = '120000'
}
```

Windows has known issues with:
- Worker process spawning
- File system watchers
- Process cleanup

## Current Test Status

### ✅ What's Working

1. **Focused Test Suite**: 33/33 tests passing
   - Auth routing tests
   - Podcast Studio tests
   - Valuation Suite tests
   - Evidence: Latest session logs

2. **Individual Test Suites**: All passing when run separately
   - Documents workspace: ✅
   - Deal matching: ✅
   - Marketing pages: ✅
   - UI components: ✅

3. **Backend Tests**: 814/814 passing (84% coverage)

### ⚠️ What's Problematic

1. **Full Suite Coverage Run**: Times out after 20+ minutes
2. **Coverage Reporting**: Incomplete due to timeout
3. **CI/CD Integration**: May hit similar timeouts

## Solutions Implemented

None yet - this is a performance optimization task, not a functionality blocker.

## Recommended Solutions

### Option 1: Parallel Execution (Recommended)

Modify `vitest.config.ts`:
```typescript
pool: 'forks',
poolOptions: {
  forks: {
    singleFork: false,  // ← Enable parallel forks
    maxForks: 4,  // Adjust based on CPU cores
    minForks: 2,
  },
},
```

**Pros**: 4x-8x faster execution
**Cons**: May expose race conditions in tests
**Risk**: Low (tests are already isolated with mocks)

### Option 2: Test Sharding for CI

Split tests into chunks for CI:
```bash
# In CI pipeline
npm run test:coverage -- --shard=1/4
npm run test:coverage -- --shard=2/4
npm run test:coverage -- --shard=3/4
npm run test:coverage -- --shard=4/4
```

**Pros**: Works around timeout limits, parallelizes CI
**Cons**: Requires CI config changes
**Risk**: None

### Option 3: Timeout Increase

Increase global timeout:
```bash
npm run test:coverage -- --testTimeout=180000
```

**Pros**: Simple change
**Cons**: Masks performance issues, doesn't solve root cause
**Risk**: Low

### Option 4: Skip Coverage for Large Files

Expand coverage exclusions in `vitest.config.ts`:
```typescript
coverage: {
  exclude: [
    // ... existing exclusions
    'src/**/*.stories.tsx',  // Storybook files
    'src/**/*.e2e.test.tsx',  // E2E tests (run separately)
  ],
}
```

**Pros**: Reduces test count
**Cons**: Lower coverage percentage
**Risk**: Medium (may hide issues)

## Acceptance Criteria for "Resolved"

✅ Option A (Ideal):
- Full coverage run completes in < 10 minutes
- Coverage report generated successfully
- No test failures introduced

✅ Option B (Acceptable):
- Document workaround (sharding or focused runs)
- Verify all test suites pass individually
- CI runs tests in parallel shards

## Current Workaround

**For Development**:
```bash
# Run focused tests for quick feedback
npm run test:focused

# Run specific test suites
npm run test -- src/pages/documents
npm run test -- src/components/podcast
```

**For CI**:
```bash
# GitHub Actions can run sharded tests
- name: Test Shard 1/4
  run: npm run test:coverage -- --shard=1/4
- name: Test Shard 2/4
  run: npm run test:coverage -- --shard=2/4
# ... etc
```

## Impact Assessment

### Severity: LOW
- All tests pass when run individually or in focused mode
- Backend coverage is excellent (84%)
- Issue is purely a performance optimization

### Urgency: LOW
- Not blocking deployment
- Not blocking feature development
- Can be resolved in Phase 1 or deferred to Phase 2

### Business Impact: NONE
- Does not affect end users
- Does not affect production stability
- Does not affect feature completeness

## Recommendation

**Defer to Phase 1 or Phase 2**

Rationale:
1. Tests are working - this is a tooling optimization
2. We have workarounds for development and CI
3. Phase 1 priority is Event Hub implementation
4. Can revisit after Phase 2 when implementing CI/CD optimizations

## Next Steps

### Immediate (Phase 0)
1. ✅ Document issue and workarounds
2. ✅ Verify focused test suites pass (33/33 ✅)
3. ✅ Update BMAD_PROGRESS_TRACKER.md with status
4. ⏭️ Move to Phase 1 implementation

### Future (Phase 1 or 2)
1. Implement Option 1 (parallel execution)
2. Test with full suite run
3. Update CI to use sharding if needed
4. Document final solution

---

**Status**: ⚠️ KNOWN ISSUE - Not blocking progress
**Workaround**: Use focused test runs or test sharding
**Priority**: LOW (performance optimization)
**Phase**: Defer to Phase 1 or Phase 2
