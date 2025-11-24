# Master Admin QA Execution Guide - 2025-11-22

**Status**: Ready for Execution
**Method**: Manual QA with evidence capture
**Estimated Time**: 4-6 hours

---

## Pre-Execution Checklist

- [x] Evidence directories created
- [x] QA preparation document created
- [ ] Clerk test account verified (with master_admin role)
- [ ] Test account can access https://100daysandbeyond.com/master-admin
- [ ] Browser console open for error monitoring
- [ ] Network tab open for API call verification

---

## Execution Steps

### Feature 1: Dashboard (`/master-admin`)

**Steps**:
1. Navigate to https://100daysandbeyond.com/master-admin
2. Verify authentication required (should redirect if not logged in)
3. Sign in with test account
4. Verify dashboard loads

**Verification Points**:
- [ ] Score display visible (blue gradient card)
- [ ] Streak counter visible (orange gradient card)
- [ ] 4 stat cards display: Activities Today, Active Prospects, Active Deals, Unread Nudges
- [ ] Quick action buttons visible
- [ ] No console errors
- [ ] API call to `/api/master-admin/dashboard` succeeds (check Network tab)

**Evidence**:
- Screenshot: `screenshots/dashboard.png`
- Network log: `logs/dashboard-api-calls.json`

---

### Feature 2: Activity Tracker (`/master-admin/activity`)

**Steps**:
1. Navigate to `/master-admin/activity`
2. Test create activity
3. Test edit activity
4. Test delete activity
5. Verify empty state (if no activities)

**Verification Points**:
- [ ] Page loads correctly
- [ ] Create form works
- [ ] Edit form works
- [ ] Delete confirmation works
- [ ] Empty state displays when no activities
- [ ] API calls succeed

**Evidence**:
- Screenshots: `screenshots/activity-create.png`, `screenshots/activity-edit.png`, `screenshots/activity-delete.png`
- Network logs: `logs/activity-api-calls.json`

---

### Features 3-7: Similar Pattern

Follow the same pattern for:
- Prospect Pipeline (`/master-admin/prospects`)
- Campaign Manager (`/master-admin/campaigns`)
- Content Studio (`/master-admin/content`)
- Lead Capture (`/master-admin/leads`)
- Sales Collateral (`/master-admin/collateral`)

For each feature:
- [ ] Navigate to page
- [ ] Test CRUD operations
- [ ] Verify list views
- [ ] Test filtering/search (if applicable)
- [ ] Capture screenshots
- [ ] Log API calls

---

## Automated Alternative

If you have a Clerk sign-in token, you can use the automated script:

```bash
$env:CLERK_SIGN_IN_TOKEN="<token>"
node scripts/exercise-master-admin-crud.mjs
```

This will automatically exercise all CRUD operations and capture evidence.

---

## Evidence Compilation

After completing QA:

1. **Create QA Summary** (`QA-SUMMARY.md`)
   - Pass/fail status for each feature
   - Screenshot references
   - Issues found
   - Recommendations

2. **Archive Evidence**
   - Organize screenshots by feature
   - Export Network tab logs
   - Save console error logs (if any)

3. **Update BMAD Trackers**
   - Update `docs/bmad/bmm-workflow-status.md`
   - Update `docs/bmad/BMAD_PROGRESS_TRACKER.md`

---

**Note**: Manual QA requires browser interaction. Use this guide to execute QA, or use the automated script if you have a Clerk sign-in token.

