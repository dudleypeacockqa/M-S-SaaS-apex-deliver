# Failing Frontend Tests Analysis

**Session**: 2025-11-11C (updated 2025-11-12 by Codex)
**Status**: Historical log – targeted reruns now pass when Vitest uses `--pool=vmThreads`. Full suite still needs confirmation.
**Overall Pass Rate**: 99.6% (previous run)

> ✅ 2025-11-12: Updated `npm test`/`npm run lint` scripts to force `--pool=vmThreads`, eliminating the Vitest threads-runner timeout observed on Windows. Individual files (`StatCard`, `MatchCard`, `ContactPage.form`) now pass locally. Re-run the full suite to refresh this report.

## Failing Tests Summary

### 1. StatCard.test.tsx (2 failures)

**File**: `src/components/master-admin/shared/StatCard.test.tsx`

#### Test 1: "should render with negative trend" (line 51)
**Status**: FAILING ❌

**Test Code**:
```typescript
it('should render with negative trend', () => {
  render(
    <StatCard
      title="Churn Rate"
      value="2.5%"
      trend={{ value: -5, isPositive: false }}
    />
  )

  expect(screen.getByText('Churn Rate')).toBeInTheDocument()
  expect(screen.getByText('2.5%')).toBeInTheDocument()
  const percentElements = screen.getAllByText(/5%/)
  expect(percentElements.length).toBeGreaterThan(0)
  expect(screen.getByText(/↓/)).toBeInTheDocument()
})
```

**Likely Issue**: The regex `/5%/` matches both "2.5%" (in the value) and "5%" (in the trend). The test might be failing because:
- The trend is not rendering correctly
- OR the down arrow "↓" character is not matching

#### Test 2: "should apply custom className" (line 86)
**Status**: FAILING ❌

**Test Code**:
```typescript
it('should apply custom className', () => {
  const { container } = render(<StatCard title="Custom" value={5} className="custom-class" />)

  const card = container.querySelector('.custom-class')
  expect(card).toBeInTheDocument()
  expect(card).toHaveClass('bg-white', 'custom-class')
})
```

**Likely Issue**: The component may not be applying the `className` prop correctly, or the `cn()` utility is not merging classes as expected.

---

### 2. MatchCard.test.tsx (1 failure)

**File**: `src/components/deal-matching/MatchCard.test.tsx`

**Test**: "shows loading state during actions" (line 80-ish)
**Status**: FAILING ❌

**Likely Issue**: The loading state visual indicator may not be rendering, or the test is checking for specific text/elements that don't exist.

---

### 3. ContactPage.form.test.tsx (1 failure)

**File**: `src/pages/marketing/__tests__/ContactPage.form.test.tsx`

**Test**: "emits schema metadata using the 100daysandbeyond.com domain"
**Status**: FAILING ❌

**Likely Issue**: Schema metadata (likely for SEO/structured data) is not using the expected domain "100daysandbeyond.com".

---

### 4. PodcastStudioRouting.test.tsx (1 failure)

**File**: `src/tests/integration/PodcastStudioRouting.test.tsx`

**Test**: "displays transcript status and download links when transcript exists"
**Status**: FAILING ❌

**Likely Issue**: Transcript UI elements are not rendering when a transcript exists on a podcast episode.

---

## Next Steps

1. Run individual test files to get detailed error messages
2. Fix each test following TDD methodology
3. Commit fixes atomically (one test file at a time)
4. Re-run full test suite to verify no regressions

## Priority

**HIGH**: These are the only blocking issues before proceeding to P0 feature work (Document Room UI Polish).

**Target**: All tests passing (100%) before continuing to next phase.
