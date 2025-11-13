# GitHub Actions Setup for Accessibility Audits

## Quick Start - Setting Up GitHub Secrets

The accessibility audit workflow requires two secrets to be configured in your GitHub repository.

### Step 1: Navigate to GitHub Secrets

1. Go to your GitHub repository: https://github.com/{your-username}/{your-repo}
2. Click **Settings** (top menu)
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 2: Add Required Secrets

Add these two secrets (values from `.env` file):

#### Secret 1: VITE_CLERK_PUBLISHABLE_KEY
```
Name: VITE_CLERK_PUBLISHABLE_KEY
Value: pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k
```

Click **Add secret**

#### Secret 2: VITE_API_URL
```
Name: VITE_API_URL
Value: https://ma-saas-backend.onrender.com
```

Click **Add secret**

### Step 3: Verify Secrets

You should now see two secrets listed:
- ✅ `VITE_CLERK_PUBLISHABLE_KEY`
- ✅ `VITE_API_URL`

---

## Triggering the Workflow

### Option 1: Push to Main Branch (Automatic)

```bash
git add .
git commit -m "feat(ci): add accessibility audit workflow"
git push origin main
```

This will automatically trigger:
- Full preview build audit
- Full production URL audit
- Report generation and artifact upload

### Option 2: Manual Trigger (On-Demand)

1. Go to **Actions** tab in GitHub
2. Click **Accessibility Audit** in left sidebar
3. Click **Run workflow** button (top right)
4. Select branch (usually `main`)
5. Click green **Run workflow** button

### Option 3: Pull Request (Automatic)

When you create a PR:
```bash
git checkout -b feature/my-feature
# ... make changes ...
git commit -m "feat: add new feature"
git push origin feature/my-feature
# Create PR on GitHub
```

The workflow will:
- Run preview build audit
- Comment results on the PR
- Show pass/fail status

### Option 4: Weekly Schedule (Automatic)

The workflow runs automatically every Monday at 9 AM UTC. No action needed.

---

## Viewing Results

### In GitHub Actions UI

1. Go to **Actions** tab
2. Click on the workflow run
3. You'll see three jobs:
   - 🔵 `lighthouse-preview` - Local build tests
   - 🔵 `lighthouse-production` - Live site tests (main branch only)
   - 🔵 `accessibility-compliance-check` - Summary

4. Click on any job to see logs
5. Scroll to bottom to see **Artifacts** section
6. Download the artifact zip file

### Artifact Contents

Each artifact ZIP contains:

```
lighthouse-reports-preview-{run_number}/
├── .lighthouseci/
│   ├── lhr-{timestamp}-{url}.html    # Interactive reports
│   └── lhr-{timestamp}-{url}.json    # Raw data
└── frontend/docs/testing/
    ├── lighthouse-report.html
    ├── lighthouse-report.json
    └── axe-report.json

lighthouse-reports-production-{run_number}/
└── docs/marketing/lighthouse-reports-{date}/
    ├── SUMMARY.md                     # Quick overview
    ├── lighthouse-home.html
    ├── lighthouse-home.json
    ├── lighthouse-pricing.html
    ├── lighthouse-pricing.json
    ├── axe-home.json
    └── ... (more pages)
```

### Reading the SUMMARY.md

Example output:

```markdown
# Accessibility Audit Summary

**Date**: 2025-11-13
**Commit**: a1b2c3d4
**Run**: #42

## Lighthouse Scores

### home
- **Performance**: 92%
- **Accessibility**: 95%
- **Best Practices**: 96%
- **SEO**: 100%

### pricing
- **Performance**: 88%
- **Accessibility**: 93%
- **Best Practices**: 95%
- **SEO**: 98%

...
```

---

## Interpreting Results

### ✅ Passing Criteria

All pages must meet:
- Accessibility ≥ 90%
- Performance ≥ 80%
- Best Practices ≥ 85%
- SEO ≥ 85%

### ❌ What to Do If Tests Fail

1. **Download the HTML report** from artifacts
2. **Open in browser** - it's an interactive report showing:
   - Exact issues found
   - Code snippets with problems
   - Recommendations for fixes
   - Links to documentation

3. **Common fixes**:
   ```tsx
   // ❌ Bad - no alt text
   <img src="logo.png" />

   // ✅ Good - descriptive alt text
   <img src="logo.png" alt="100 Days & Beyond M&A Platform" />

   // ❌ Bad - poor contrast
   <button className="text-gray-400 bg-gray-300">Click</button>

   // ✅ Good - 4.5:1 contrast ratio
   <button className="text-white bg-blue-600">Click</button>

   // ❌ Bad - missing label
   <input type="email" />

   // ✅ Good - proper label association
   <label htmlFor="email">Email Address</label>
   <input id="email" type="email" aria-required="true" />
   ```

4. **Fix the issues** in your code
5. **Commit and push** to re-trigger the workflow
6. **Verify** the scores improve

---

## Troubleshooting

### Issue: "Secrets not found" Error

**Error Message**:
```
Error: VITE_CLERK_PUBLISHABLE_KEY is not defined
```

**Solution**:
Go back to **Step 2** above and add the missing secret(s).

### Issue: Workflow Doesn't Appear in Actions Tab

**Check**:
1. Workflow file is in correct location: `.github/workflows/accessibility-audit.yml`
2. File has valid YAML syntax
3. You've pushed to `main` branch

**Verify**:
```bash
# Check file exists
ls -la .github/workflows/accessibility-audit.yml

# Validate YAML syntax
cat .github/workflows/accessibility-audit.yml | python -c "import sys, yaml; yaml.safe_load(sys.stdin)"
```

### Issue: Preview Build Succeeds but Production Fails

**Likely Cause**: Environment-specific issues (CORS, authentication, etc.)

**Investigation**:
1. Check production logs in Render dashboard
2. Compare preview vs. production configs
3. Verify all environment variables set in Render match `.env`

### Issue: Lighthouse Scores Vary Between Runs

**Expected Behavior**: Scores can fluctuate ±5 points due to:
- Server response time variations
- Network latency
- Background processes on CI runner

**Mitigation**:
- Focus on trends, not individual runs
- Re-run if score drops unexpectedly
- Use weekly schedule to track long-term trends

---

## Advanced Configuration

### Changing Pages Tested

Edit `.github/workflows/accessibility-audit.yml`:

```yaml
# Line 41: Preview build pages
urls: |
  http://localhost:4173
  http://localhost:4173/pricing
  http://localhost:4173/new-page      # Add your page
```

### Adjusting Thresholds

Edit the compliance check job:

```yaml
# Line 181: Acceptance criteria
echo "Minimum acceptable scores:"
echo "- Accessibility: 95+"   # Increase from 90
echo "- Performance: 85+"     # Increase from 80
```

### Adding More Audit Tools

You can extend the workflow to include:
- **Pa11y**: `npm install -g pa11y && pa11y http://localhost:4173`
- **HTML Validator**: `npm install -g vnu-jar`
- **Security scan**: `npm audit --audit-level=moderate`

Example:

```yaml
- name: Run Pa11y
  run: |
    npm install -g pa11y
    pa11y http://localhost:4173 \
      --reporter json > pa11y-report.json
```

### Sending Results to Slack

Add a Slack notification step:

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "⚠️ Accessibility audit failed on ${{ github.ref }}"
      }
```

---

## Monitoring & Metrics

### Setting Up Long-Term Tracking

Create a dashboard by:

1. **Downloading all artifact reports** weekly
2. **Extracting scores** from `SUMMARY.md`
3. **Plotting trends** in spreadsheet or dashboard tool
4. **Setting alerts** for score drops > 10 points

Example script to extract data:

```bash
#!/bin/bash
# extract-scores.sh

for SUMMARY in docs/marketing/lighthouse-reports-*/SUMMARY.md; do
  DATE=$(echo "$SUMMARY" | grep -oP '\d{4}-\d{2}-\d{2}')
  ACCESSIBILITY=$(grep "Accessibility:" "$SUMMARY" | head -1 | grep -oP '\d+')
  echo "$DATE,$ACCESSIBILITY"
done > accessibility-trends.csv
```

### Integration with Datadog/Sentry

For production monitoring, send Lighthouse scores to your monitoring platform:

```javascript
// In workflow or post-deploy script
const lighthouse = require('lighthouse');
const { DatadogAPI } = require('@datadog/api');

async function reportToDatadog(scores) {
  const api = new DatadogAPI({ apiKey: process.env.DATADOG_API_KEY });

  await api.metrics.submit({
    series: [
      {
        metric: 'lighthouse.accessibility.score',
        points: [[Math.floor(Date.now() / 1000), scores.accessibility * 100]],
        type: 'gauge',
        tags: ['env:production', 'page:home']
      }
    ]
  });
}
```

---

## Maintenance

### Monthly Tasks

- [ ] Review weekly audit results
- [ ] Update acceptance criteria if needed
- [ ] Check for Lighthouse CLI updates (`npm outdated -g`)
- [ ] Verify secrets haven't expired (Clerk keys)

### Quarterly Tasks

- [ ] Full manual accessibility audit by expert
- [ ] User testing with assistive technology
- [ ] Update this documentation
- [ ] Team training on new WCAG guidelines

---

## Quick Reference

### URLs

- **Production site**: https://100daysandbeyond.com
- **Backend API**: https://ma-saas-backend.onrender.com
- **GitHub repo**: [Your GitHub URL]
- **Workflow file**: `.github/workflows/accessibility-audit.yml`

### Commands

```bash
# Trigger workflow manually
gh workflow run accessibility-audit.yml

# List recent runs
gh run list --workflow=accessibility-audit.yml

# Download latest artifact
gh run download --name lighthouse-reports-production-latest

# View workflow logs
gh run view --log
```

### Key Files

```
.github/workflows/accessibility-audit.yml    - Workflow definition
docs/marketing/ACCESSIBILITY_AUDIT_PROCESS.md - Full documentation
scripts/run_lighthouse_audits.sh              - Manual audit script
frontend/package.json                         - Audit npm scripts
```

---

## Next Steps

1. ✅ **Set up secrets** (see Step 1-2 above)
2. ✅ **Push to GitHub** to trigger first run
3. ✅ **Download artifacts** and review reports
4. ✅ **Fix any issues** found
5. ✅ **Set up monitoring** (optional but recommended)

---

**Questions?** See `docs/marketing/ACCESSIBILITY_AUDIT_PROCESS.md` for detailed troubleshooting.

**Status**: Ready to deploy ✅
**Last Updated**: 2025-11-13
