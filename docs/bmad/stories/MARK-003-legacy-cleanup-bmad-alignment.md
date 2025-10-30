# MARK-003: Legacy Cleanup & BMAD Alignment

**Story ID**: MARK-003
**Epic**: Marketing & Lead Generation
**Priority**: Critical
**Sprint**: Marketing 70% → 100% Completion
**Estimated Effort**: 4 hours
**Status**: In Progress
**Created**: 2025-10-30
**Assigned To**: Claude Code (AI Developer)

---

## Story Description

### User Story
**As a** development team maintaining the 100daysandbeyond.com website
**I want** to remove duplicate legacy files and establish full BMAD v6-alpha compliance
**So that** the codebase is clean, maintainable, and follows our TDD+BMAD methodology

### Business Context
The marketing website currently has:
- 11 duplicate legacy files (About.tsx, Contact.tsx, etc.) alongside newer *Page.tsx versions
- Incomplete BMAD story coverage (only 2 of 8+ needed stories exist)
- MARK-002 incorrectly marked 100% complete (actually 60% complete)
- No active marketing workflow tracking in BMAD status files

This technical debt creates:
- **Confusion**: Developers unsure which files are canonical
- **Risk**: Accidental edits to wrong files
- **Poor Tracking**: Marketing progress not visible in BMAD workflow
- **Incomplete Documentation**: Missing stories for blog, case studies, promotional pages

Cleaning this up is **critical** before adding new features.

### Success Metrics
- Zero duplicate files remaining
- All 8 marketing BMAD stories created and documented
- BMAD workflow status accurately reflects marketing work
- BMAD_PROGRESS_TRACKER.md shows correct completion percentages
- No broken imports or test failures after cleanup

---

## Requirements

### Functional Requirements

#### FR-1: Delete Duplicate Legacy Files
- **FR-1.1**: Delete 11 legacy marketing page files:
  - About.tsx → Use AboutPage.tsx instead
  - Contact.tsx → Use ContactPage.tsx instead
  - Features.tsx → Use FeaturesPage.tsx instead
  - Pricing.tsx → Use PricingPage.tsx instead
  - Terms.tsx → Use legal/TermsOfService.tsx instead
  - Privacy.tsx → Use legal/PrivacyPolicy.tsx instead
  - Cookies.tsx → Use legal/CookiePolicy.tsx instead
  - Team.tsx → Use TeamPage.tsx instead
  - Podcast.tsx → Use PodcastPage.tsx instead
  - Security.tsx → Use SecurityPage.tsx instead
  - Home.tsx → Use LandingPage.tsx or EnhancedLandingPage.tsx
- **FR-1.2**: Verify no import statements reference deleted files
- **FR-1.3**: Verify App.tsx routing uses canonical file names
- **FR-1.4**: Run full test suite to ensure no breakage

#### FR-2: Create Missing BMAD Stories
- **FR-2.1**: Create MARK-003-legacy-cleanup-bmad-alignment.md (this story)
- **FR-2.2**: Create MARK-004-test-coverage-critical.md
- **FR-2.3**: Create MARK-005-enhanced-website-phases-3-10.md
- **FR-2.4**: Create MARK-006-blog-system-complete.md
- **FR-2.5**: Create MARK-007-case-studies-social-proof.md
- **FR-2.6**: Create MARK-008-promotional-pages-polish.md
- **FR-2.7**: Follow official BMAD story template format
- **FR-2.8**: Include TDD requirements in each story

#### FR-3: Update BMAD Workflow Status
- **FR-3.1**: Update `docs/bmad/bmm-workflow-status.md`:
  - Set CURRENT_STORY to MARK-003
  - Set CURRENT_SPRINT to "Marketing Website 70% → 100%"
  - Update NEXT_ACTION to reflect cleanup work
- **FR-3.2**: Update `docs/bmad/BMAD_PROGRESS_TRACKER.md`:
  - Correct MARK-002 status from 100% to 60%
  - Add new session entry for MARK-003 start
  - Document legacy file deletion
- **FR-3.3**: Update `MARKETING_WEBSITE_STATUS.md`:
  - Reflect accurate 70% completion
  - Add cleanup task to completion checklist

### Non-Functional Requirements

#### NFR-1: Code Quality
- **NFR-1.1**: Zero TypeScript errors after cleanup
- **NFR-1.2**: Zero ESLint warnings
- **NFR-1.3**: All existing tests continue passing

#### NFR-2: Documentation Quality
- **NFR-2.1**: All BMAD stories follow template format
- **NFR-2.2**: All stories include TDD requirements
- **NFR-2.3**: All stories include acceptance criteria

---

## Technical Design

### Files to Delete (11 total)
```
frontend/src/pages/marketing/
├── About.tsx ❌ DELETE
├── Contact.tsx ❌ DELETE
├── Cookies.tsx ❌ DELETE
├── Features.tsx ❌ DELETE
├── Home.tsx ❌ DELETE
├── Podcast.tsx ❌ DELETE
├── Pricing.tsx ❌ DELETE
├── Privacy.tsx ❌ DELETE
├── Security.tsx ❌ DELETE
├── Team.tsx ❌ DELETE
└── Terms.tsx ❌ DELETE
```

### Canonical Files (Keep)
```
frontend/src/pages/marketing/
├── AboutPage.tsx ✅ KEEP
├── ContactPage.tsx ✅ KEEP
├── FeaturesPage.tsx ✅ KEEP
├── PricingPage.tsx ✅ KEEP
├── TeamPage.tsx ✅ KEEP
├── PodcastPage.tsx ✅ KEEP
├── SecurityPage.tsx ✅ KEEP
├── LandingPage.tsx ✅ KEEP
├── EnhancedLandingPage.tsx ✅ KEEP (current homepage)
└── legal/
    ├── TermsOfService.tsx ✅ KEEP
    ├── PrivacyPolicy.tsx ✅ KEEP
    └── CookiePolicy.tsx ✅ KEEP
```

### BMAD Stories to Create

#### MARK-003: Legacy Cleanup & BMAD Alignment (this story)
- **Focus**: Delete duplicates, create stories, update BMAD tracking
- **Effort**: 4 hours
- **Priority**: Critical (blocking)

#### MARK-004: Test Coverage Critical Path
- **Focus**: Add tests for NotFound, Blog, Security, Team, FAQ, promotional pages
- **Effort**: 12 hours
- **Priority**: Critical (TDD compliance)

#### MARK-005: Enhanced Website Phases 3-10
- **Focus**: Complete MARK-002 phases 3-10 (assets, performance, SEO, analytics)
- **Effort**: 30 hours
- **Priority**: High (feature completion)

#### MARK-006: Blog System Complete
- **Focus**: Backend API, CMS integration, full TDD coverage
- **Effort**: 6 hours
- **Priority**: Medium (content marketing)

#### MARK-007: Case Studies & Social Proof
- **Focus**: Case study system, customer success stories
- **Effort**: 4 hours
- **Priority**: Medium (trust building)

#### MARK-008: Promotional Pages Polish
- **Focus**: Enhance CapLiquifyFPA, FourStageCycle, SalesPromotion pages
- **Effort**: 6 hours
- **Priority**: Medium (conversion optimization)

---

## Test-Driven Development (TDD) Plan

### Test Coverage Target
- **Current**: 323/358 tests passing (90%)
- **Post-Cleanup**: 323/358 tests passing (90% - no change expected)
- **Goal**: Maintain 100% pass rate of existing tests

### Pre-Cleanup Verification
```bash
# Verify no imports reference legacy files
grep -r "from.*\/marketing\/(About|Contact|Features|Pricing|Terms|Privacy|Cookies|Team|Podcast|Security|Home)" frontend/src

# Expected: No results (already verified in plan)
```

### Post-Cleanup Verification
```bash
# Run full test suite
cd frontend && npm test

# Expected: 323/358 tests passing (same as before)
```

### Test Suite Validation
```typescript
// No new tests required for this story
// Focus is on cleanup without breaking existing tests
```

---

## Implementation Phases

### Phase 1: Verify No Import Dependencies (15 min) ✅ COMPLETE
- [x] Search codebase for imports of legacy files
- [x] Search for exports in index files
- [x] Verify App.tsx uses canonical file names
- [x] Result: No dependencies found, safe to delete

### Phase 2: Delete Legacy Files (15 min) ✅ IN PROGRESS
- [x] Delete 11 legacy files via bash command
- [ ] Verify files deleted successfully
- [ ] Run test suite to ensure no breakage
- [ ] Verify TypeScript compilation succeeds

### Phase 3: Create BMAD Stories (2 hours)
1. ✅ **MARK-003**: This story (in progress)
2. **MARK-004**: Test coverage critical path
3. **MARK-005**: Enhanced website phases 3-10
4. **MARK-006**: Blog system complete
5. **MARK-007**: Case studies & social proof
6. **MARK-008**: Promotional pages polish

Each story must include:
- Story description with user story format
- Business context and success metrics
- Functional and non-functional requirements
- Technical design
- TDD plan with test specifications
- Implementation phases
- Acceptance criteria
- Definition of done

### Phase 4: Update BMAD Workflow Status (1 hour)
- [ ] Update `docs/bmad/bmm-workflow-status.md`:
  ```yaml
  CURRENT_STORY: MARK-003-legacy-cleanup-bmad-alignment
  CURRENT_SPRINT: Marketing Website 70% → 100%
  NEXT_ACTION: Delete legacy files, create BMAD stories, update tracking
  ```
- [ ] Update `docs/bmad/BMAD_PROGRESS_TRACKER.md`:
  - Add session entry for 2025-10-30
  - Document legacy file deletion
  - Correct MARK-002 completion to 60%
- [ ] Update `MARKETING_WEBSITE_STATUS.md`:
  - Set completion to 70% (accurate)
  - Add cleanup checklist item

### Phase 5: Commit Changes (30 min)
- [ ] Stage all changes
- [ ] Create commit with detailed message
- [ ] Push to origin/main
- [ ] Verify no CI/CD failures

---

## Acceptance Criteria

### Must Have
- [x] All 11 duplicate legacy files deleted
- [ ] Zero imports reference deleted files (verified)
- [ ] All existing tests still passing (323/358)
- [ ] Zero TypeScript compilation errors
- [ ] All 6 new BMAD stories created (MARK-003 through MARK-008)
- [ ] BMAD workflow status reflects MARK-003 as current story
- [ ] BMAD_PROGRESS_TRACKER.md shows accurate completion percentages
- [ ] MARKETING_WEBSITE_STATUS.md updated to 70% complete
- [ ] Changes committed and pushed to main branch

### Should Have
- [ ] Each BMAD story includes comprehensive TDD plan
- [ ] Each BMAD story includes acceptance criteria
- [ ] BMAD documentation follows official template format

### Nice to Have
- [ ] BMAD story manifest updated automatically
- [ ] Git commit includes story references

---

## Dependencies

### Internal Dependencies
- ✅ MARK-001: Marketing Website (provides canonical files to keep)
- ✅ MARK-002: Enhanced Website (defines phases 3-10 to execute)

### External Dependencies
- None (cleanup work is self-contained)

---

## Risks & Mitigation

### Risk 1: Accidental Deletion of Active Files
**Risk**: Deleting wrong files could break the website
**Mitigation**: ✅ Verified no imports exist, verified App.tsx routing, run test suite before commit

### Risk 2: BMAD Story Format Inconsistency
**Risk**: New stories don't follow template, causing confusion
**Mitigation**: Use MARK-001 as template, include all required sections

### Risk 3: Documentation Drift
**Risk**: BMAD tracking files become outdated again
**Mitigation**: Update all tracking files atomically, commit together

---

## Future Enhancements
- Automated script to detect duplicate files
- BMAD story validation in CI/CD
- Git hooks to prevent duplicate file creation

---

## Notes
- **Deletion Safety**: All legacy files verified unused before deletion
- **BMAD Compliance**: All new stories follow official BMAD v6-alpha template
- **TDD Integration**: Every story includes TDD plan with RED → GREEN → REFACTOR phases
- **Documentation First**: Create stories before implementing features

---

## Definition of Done
- [x] All 11 legacy files deleted successfully
- [ ] Full test suite passing (323/358 minimum)
- [ ] TypeScript compilation succeeds with zero errors
- [ ] All 6 BMAD stories created with complete documentation
- [ ] BMAD workflow status updated to reflect MARK-003
- [ ] BMAD_PROGRESS_TRACKER.md updated with accurate metrics
- [ ] MARKETING_WEBSITE_STATUS.md updated to 70%
- [ ] Changes committed with descriptive message
- [ ] Changes pushed to origin/main
- [ ] No CI/CD failures
- [ ] Story marked complete in tracker

---

**Story Created**: 2025-10-30
**Last Updated**: 2025-10-30
**Author**: Claude Code (AI Developer)
**Reviewer**: TBD
