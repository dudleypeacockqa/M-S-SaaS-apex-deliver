# BFG Repo-Cleaner Execution Instructions

**CRITICAL**: Before pushing to GitHub, you must run BFG Repo-Cleaner to remove secrets from git history.

## Current Situation

GitHub push protection is blocking because secrets exist in commits:
- `b2b94046` - Contains secrets in `FinanceFlo Environment Variables - Master Reference.md`
- `12ffd9ac` - Contains secrets in `redact_secrets.ps1` and `replace-secrets.sh`

## Solution: Use BFG Repo-Cleaner

### Step 1: Install Prerequisites

1. **Install Java** (if not already installed):
   ```bash
   # Verify Java is installed
   java -version
   # Should show Java 8 or higher
   ```

2. **Download BFG Repo-Cleaner**:
   - Visit: https://rtyley.github.io/bfg-repo-cleaner/
   - Download `bfg.jar`
   - Place it in a convenient location (e.g., `C:\Tools\bfg.jar`)

### Step 2: Create Fresh Clone

BFG requires a clean working directory. Create a fresh clone:

```bash
# Navigate to a temporary location
cd C:\Temp

# Clone the repository
git clone https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver.git
cd M-S-SaaS-apex-deliver

# Verify you're on the correct branch
git checkout main
```

### Step 3: Prepare Replacement File

The `secrets-to-remove.txt` file is already in the repository. Verify it exists:

```bash
cat secrets-to-remove.txt
```

It should contain:
```
[REDACTED - Use .env file]==>[REDACTED - Use .env file]
[REDACTED - Use .env file]==>[REDACTED - Use .env file]
...
```

### Step 4: Run BFG

```bash
# Replace C:\Tools\bfg.jar with your actual path
java -jar C:\Tools\bfg.jar --replace-text secrets-to-remove.txt
```

BFG will:
- Scan all commits in the repository
- Replace the secrets with `[REDACTED - Use .env file]`
- Show you a summary of changes

### Step 5: Clean Up Git References

```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 6: Verify Changes

```bash
# Check that secrets are replaced
git log --all --source --full-history | Select-String -Pattern "REDACTED"

# Verify no actual secrets remain (should return nothing)
git log --all --source --full-history | Select-String -Pattern "[REDACTED - Use .env file]"
```

### Step 7: Force Push

⚠️ **WARNING**: This rewrites git history. Coordinate with your team first.

```bash
# Push all branches
git push --force --all

# Push all tags
git push --force --tags
```

### Step 8: Verify GitHub Push

After force push, verify that GitHub no longer blocks:

```bash
git push origin main
```

If still blocked, you may need to use GitHub's bypass URLs (provided in error message).

## Alternative: Use GitHub Bypass URLs

If BFG execution is delayed, you can temporarily use GitHub's bypass URLs:

1. Stripe API Key: https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver/security/secret-scanning/unblock-secret/35olW0hiNj4HPYB5G46RbWf0A8m
2. Stripe Live API Restricted Key: https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver/security/secret-scanning/unblock-secret/35olVwwNfE7jb8Ztpc1E3ukLiOz
3. OpenAI API Key: https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver/security/secret-scanning/unblock-secret/35olVwt2yWZZzUkyUB84d0RaQA2
4. Anthropic API Key: https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver/security/secret-scanning/unblock-secret/35olW2Quo5M10fBn9gyH1iuldge
5. SendGrid API Key: https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver/security/secret-scanning/unblock-secret/35olW2lX3B1W4X6lbfyk6Ian1fH

**Note**: Using bypass URLs does NOT remove secrets from history. You still need to run BFG and rotate secrets.

## Post-BFG: Rotate All Secrets

After BFG execution, **immediately rotate** all exposed secrets:

1. **Clerk**: Generate new secret key in Clerk dashboard
2. **Stripe**: Generate new restricted key in Stripe dashboard  
3. **OpenAI**: Generate new API key in OpenAI dashboard
4. **Anthropic**: Generate new API key in Anthropic dashboard
5. **SendGrid**: Generate new API key in SendGrid dashboard

Then update:
- `.env-backend.md` with new values
- `.env-frontend.md` with new values
- `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` with new values
- Render dashboard with new values

## Troubleshooting

**Issue**: BFG says "clean working directory required"
- **Solution**: Make sure you're in a fresh clone, not your working repository

**Issue**: Force push fails with "remote rejected"
- **Solution**: You may need to disable branch protection temporarily, or use GitHub bypass URLs

**Issue**: GitHub still blocks after BFG
- **Solution**: Wait a few minutes for GitHub's cache to update, or use bypass URLs

---

**See also**: `docs/SECRETS-CLEANUP-GUIDE.md` for complete cleanup documentation.

