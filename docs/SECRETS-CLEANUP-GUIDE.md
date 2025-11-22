# Secrets Cleanup Guide

**Date**: 2025-11-22  
**Status**: Prepared for BFG Repo-Cleaner execution

---

## Overview

This guide documents the process for removing exposed secrets from git history using BFG Repo-Cleaner.

## Exposed Secrets

The following secrets were exposed in git history (commits `b2b94046` and `12ffd9ac`):

1. **Clerk Secret Key**: `[REDACTED - Use Render Dashboard]`
2. **Stripe Restricted Key**: `[REDACTED - Use Render Dashboard]`
3. **OpenAI API Key**: `[REDACTED - Use Render Dashboard]`
4. **Anthropic API Key**: `[REDACTED - Use Render Dashboard]`
5. **SendGrid API Key**: `[REDACTED - Use Render Dashboard]`

## Pre-Cleanup Steps Completed

✅ All secrets moved to gitignored files:
- `.env-backend.md` (gitignored)
- `.env-frontend.md` (gitignored)
- `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` (gitignored)

✅ All tracked files redacted:
- `FinanceFlo Environment Variables - Master Reference.md` → moved to `docs/secrets/` and redacted
- `docs/deployments/2025-11-22-redeploy-checklist-execution.md` → redacted
- `docs/financeflo/backend-auth-alignment.md` → redacted
- `docs/testing/master-admin/2025-11-21/headers.md` → redacted

✅ Scripts containing secrets deleted:
- `redact_secrets.ps1` → deleted
- `replace-secrets.sh` → deleted

✅ `.env.example` templates created:
- `backend/.env.example` → created with placeholders
- `frontend/.env.example` → created with placeholders

✅ `.gitignore` updated:
- Added `docs/secrets/`
- Added `.git-rewrite/`
- Added script files to ignore

## BFG Repo-Cleaner Execution

### Prerequisites

1. **Install Java** (BFG requires Java 8+)
   ```bash
   # Verify Java is installed
   java -version
   ```

2. **Download BFG Repo-Cleaner**
   - Download from: https://rtyley.github.io/bfg-repo-cleaner/
   - Place `bfg.jar` in project root or system PATH

3. **Create fresh clone** (BFG requires clean working directory)
   ```bash
   cd /tmp  # or another location
   git clone https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver.git
   cd M-S-SaaS-apex-deliver
   ```

### Execution Steps

1. **Prepare replacement file**
   - The file `secrets-to-remove.txt` is already created in the repository
   - Format: `old_secret==>replacement_text`

2. **Run BFG**
   ```bash
   java -jar bfg.jar --replace-text secrets-to-remove.txt
   ```

3. **Clean up git references**
   ```bash
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

4. **Verify changes**
   ```bash
   # Check that secrets are replaced
   git log --all --source --full-history | grep -i "REDACTED"
   
   # Verify no actual secrets remain
   git log --all --source --full-history | grep -E "\[REDACTED\]"
   ```

5. **Force push** (⚠️ **WARNING**: This rewrites history)
   ```bash
   git push --force --all
   git push --force --tags
   ```

### Post-Cleanup Steps

1. **Rotate all exposed secrets** (CRITICAL):
   - Clerk: Generate new secret key in Clerk dashboard
   - Stripe: Generate new restricted key in Stripe dashboard
   - OpenAI: Generate new API key in OpenAI dashboard
   - Anthropic: Generate new API key in Anthropic dashboard
   - SendGrid: Generate new API key in SendGrid dashboard

2. **Update local files**:
   - Update `.env-backend.md` with new values
   - Update `.env-frontend.md` with new values
   - Update `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` with new values

3. **Update Render dashboard**:
   - Update all environment variables with new secret values

4. **Verify GitHub secret scanning**:
   - Push should no longer be blocked
   - If still blocked, use GitHub bypass URLs temporarily while investigating

## Files Modified

- `.gitignore` - Added secrets directory and script files
- `README.md` - Added security section
- `docs/deployments/2025-11-22-redeploy-checklist-execution.md` - Redacted secrets
- `docs/financeflo/backend-auth-alignment.md` - Redacted secrets
- `docs/testing/master-admin/2025-11-21/headers.md` - Redacted secrets
- `backend/.env.example` - Created template
- `frontend/.env.example` - Created template
- `secrets-to-remove.txt` - Created for BFG

## Files Deleted

- `redact_secrets.ps1` - Contained secrets in patterns
- `replace-secrets.sh` - Contained secrets in patterns
- `FinanceFlo Environment Variables - Master Reference.md` (root) - Moved to `docs/secrets/`

## Files Moved to Gitignore

- `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` - Contains redacted reference (gitignored)

## Important Notes

- **Secret Rotation is MANDATORY**: All exposed secrets must be rotated immediately
- **BFG requires fresh clone**: Do not run BFG in the current repository
- **Force push required**: Git history rewrite requires force push (coordinate with team)
- **Backup first**: Create full backup before rewriting history
- **Test locally**: Verify BFG changes before pushing

## Success Criteria

- ✅ No secrets found in tracked files via grep
- ✅ GitHub push succeeds without secret scanning errors
- ✅ `.gitignore` properly excludes all secret files
- ✅ `.env.example` files exist with placeholders
- ✅ Git history is clean (verified via `git log` inspection)
- ✅ All exposed secrets rotated in their respective services

---

**Next Steps**: Execute BFG Repo-Cleaner in a fresh clone, then rotate all exposed secrets.

