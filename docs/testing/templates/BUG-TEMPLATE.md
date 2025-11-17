# Bug Report #[ID]

**Date Reported**: YYYY-MM-DD
**Reported By**: [Your Name]
**Environment**: Production / Staging / Local

---

## Classification

**Severity**: Critical / High / Medium / Low
**Component**: [Feature/Module Name]
**Affects Version**: v1.0.0
**Browser**: [Chrome 120 / Firefox 121 / Safari 17 / Edge 120]
**Device**: [Desktop / Mobile / Tablet]
**OS**: [Windows 11 / macOS 14 / iOS 17 / Android 14]

**Priority Matrix**:
- **Critical**: Blocks release, data loss, security issue, service down
- **High**: Major feature broken, workaround exists but difficult
- **Medium**: Minor feature issue, easy workaround available
- **Low**: Cosmetic issue, typo, minor UX improvement

---

## Description

### Summary
[Clear, concise description of the issue in 1-2 sentences]

### Detailed Description
[Comprehensive explanation of what's happening]

---

## Steps to Reproduce

1. [Step 1: Navigate to...]
2. [Step 2: Click on...]
3. [Step 3: Enter data...]
4. [Step 4: Observe error]

**Reproduction Rate**: Always / Sometimes (50%) / Rarely (10%)

---

## Expected Behavior

[What should happen when the steps above are followed]

**User Story**: As a [role], I expect [behavior] so that [value].

---

## Actual Behavior

[What actually happens - the bug manifestation]

**Error Messages** (if any):
```
Paste exact error message here
```

**Console Errors** (if applicable):
```javascript
// Paste browser console errors
```

**Network Errors** (if applicable):
```
Status Code: 500
Response: {...}
```

---

## Visual Evidence

### Screenshots
![Screenshot Description](path/to/screenshot.png)

**Or describe visual state**:
- What appears on screen
- What elements are visible/invisible
- Any visual glitches or rendering issues

### Screen Recording
[Link to Loom/video recording if available]

---

## Impact Assessment

### User Impact
- **Affected Users**: All users / Specific role / Specific feature users
- **Frequency**: Every time / Occasionally / Rare
- **Workaround Available**: Yes / No
  - If yes, describe: [workaround steps]

### Business Impact
- **Revenue Impact**: High / Medium / Low / None
- **User Experience Impact**: High / Medium / Low
- **Data Integrity Risk**: Yes / No
- **Security Risk**: Yes / No

---

## System Information

### User Context
- **User Role**: [Master Admin / Org Admin / User / Guest]
- **Organization**: [Test Org / Production Org]
- **Authentication State**: [Logged in / Logged out]
- **Permissions**: [List relevant permissions]

### Technical Context
- **Browser**: [Chrome 120.0.6099.109]
- **OS**: [Windows 11 Pro 22H2]
- **Screen Resolution**: [1920x1080]
- **Device Type**: [Desktop]
- **Network**: [WiFi / Ethernet / Mobile Data]
- **Connection Speed**: [Fast / Slow]

### Application State
- **Frontend Version**: [Check footer or about page]
- **API Version**: [Check network request headers]
- **Session Duration**: [How long user was logged in]
- **Recent Actions**: [What did user do before bug occurred]

---

## Investigation Notes

### Root Cause Analysis (if known)
[Technical analysis of what's causing the issue]

**Suspected Area**:
- [ ] Frontend (React component, state management)
- [ ] Backend (API endpoint, service layer)
- [ ] Database (query, migration, data integrity)
- [ ] Third-party integration (Clerk, Stripe, OAuth)
- [ ] Infrastructure (Render, CDN, network)

### Related Issues
- Related to #[other issue number]
- Similar to #[other issue number]
- Duplicate of #[other issue number]

### Attempted Fixes
1. [What was tried]
2. [Result of attempt]

---

## Additional Context

### Data Samples
```json
{
  "request": {
    "method": "POST",
    "url": "/api/master-admin/activities/",
    "body": {...}
  },
  "response": {
    "status": 500,
    "body": {...}
  }
}
```

### Log Excerpts
```
[2025-11-17 21:00:00] ERROR: ...
```

### Environment Variables (sanitized)
```
VITE_API_URL=https://...
VITE_ENABLE_MASTER_ADMIN=true
```

---

## Acceptance Criteria for Fix

### Definition of Done
- [ ] Bug no longer reproducible following steps above
- [ ] Root cause identified and fixed
- [ ] Unit test added to prevent regression
- [ ] Integration test added if applicable
- [ ] Documentation updated if behavior changed
- [ ] Code review completed
- [ ] QA verified fix in staging
- [ ] Production deployment successful
- [ ] Monitoring shows no new errors

### Regression Testing Required
- [ ] Test original bug scenario
- [ ] Test edge cases around fix
- [ ] Test related features not broken
- [ ] Verify no performance degradation

---

## Developer Notes

### Technical Solution
[To be filled by developer fixing the bug]

**Files Modified**:
- `path/to/file1.tsx`
- `path/to/file2.py`

**Commit**: [commit hash]

**PR**: [PR link]

---

## QA Verification

**QA Tester**: [Name]
**Verification Date**: YYYY-MM-DD
**Verification Environment**: Staging / Production

**Verification Steps**:
1. [Repeat reproduction steps]
2. [Verify expected behavior now occurs]
3. [Test related scenarios]

**Result**: ✅ Fixed / ❌ Still Reproducible / ⚠️ Partially Fixed

**Sign-Off**: [QA Name, Date]

---

## Status Tracking

**Current Status**: Open / In Progress / Fixed / Closed / Won't Fix

**Status History**:
- YYYY-MM-DD: Opened
- YYYY-MM-DD: Assigned to [Developer]
- YYYY-MM-DD: In Progress
- YYYY-MM-DD: Fixed in PR #[number]
- YYYY-MM-DD: Deployed to staging
- YYYY-MM-DD: Verified by QA
- YYYY-MM-DD: Deployed to production
- YYYY-MM-DD: Closed

---

## Labels

- `bug`
- `severity: [critical/high/medium/low]`
- `component: [master-admin/documents/financial/etc]`
- `browser: [chrome/firefox/safari/edge]`
- `needs-investigation`
- `has-workaround`
- `regression`
- `production-issue`

---

**Report Generated**: YYYY-MM-DDTHH:MM:SSZ
**Last Updated**: YYYY-MM-DDTHH:MM:SSZ
