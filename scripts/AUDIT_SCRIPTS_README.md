# Local Audit Scripts

This directory contains scripts for running Lighthouse performance audits and Axe accessibility audits on the M&A Platform frontend.

## Available Scripts

### For Windows (Native PowerShell)

**PowerShell Script**: `run_local_audits.ps1`
**Batch Wrapper**: `run_local_audits.bat`

#### Usage (PowerShell)

```powershell
# Set environment variable and run
$env:VITE_CLERK_PUBLISHABLE_KEY="pk_test_xxxx"
.\scripts\run_local_audits.ps1
```

#### Usage (Command Prompt with Batch)

```cmd
set VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx && scripts\run_local_audits.bat
```

#### Usage (One-liner PowerShell)

```powershell
$env:VITE_CLERK_PUBLISHABLE_KEY="pk_test_xxxx"; .\scripts\run_local_audits.ps1
```

### For Linux/Mac/WSL (Bash)

**Bash Script**: `run_local_audits.sh`

#### Usage

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ./scripts/run_local_audits.sh
```

## Requirements

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Clerk Test Key** - Get from https://dashboard.clerk.com

The scripts will automatically install required npm packages:
- `lighthouse` - Performance auditing
- `@axe-core/cli` - Accessibility auditing

## What the Scripts Do

1. **Install Dependencies** - Runs `npm install` in the frontend directory
2. **Build Frontend** - Runs `npm run build` to create production bundle
3. **Start Preview Server** - Launches Vite preview server on port 4173
4. **Wait for Server** - Polls until server is ready (up to 60 seconds)
5. **Run Lighthouse** - Performance, accessibility, best practices, SEO audit
6. **Run Axe** - Detailed accessibility violation detection
7. **Generate Reports** - Saves HTML and JSON reports to `docs/testing/`
8. **Display Summary** - Shows score overview in terminal
9. **Cleanup** - Stops preview server automatically

## Output Reports

Reports are saved to `docs/testing/`:

- `lighthouse-report.html` - Human-readable Lighthouse report (open in browser)
- `lighthouse-report.json` - Machine-readable Lighthouse data
- `axe-report.json` - Accessibility violations with severity levels

## Environment Variables (Optional)

You can customize behavior with these environment variables:

```powershell
# PowerShell
$env:AUDIT_PREVIEW_URL = "http://127.0.0.1:4173"
$env:AUDIT_PREVIEW_FALLBACK = "http://localhost:4173"
$env:AUDIT_WAIT_SECONDS = "60"
```

```bash
# Bash
export AUDIT_PREVIEW_URL="http://127.0.0.1:4173"
export AUDIT_PREVIEW_FALLBACK="http://localhost:4173"
export AUDIT_WAIT_SECONDS="60"
```

## Troubleshooting

### WSL: "Cannot find module 'C:\usr\bin\npm'" or "UtilBindVsockAnyPort"

**Problem**: WSL is trying to use Windows Node.js via interop, but interop is broken.

**Solution**: Install native Linux Node.js in WSL

```bash
# Quick fix (5 minutes)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify it works
which node  # Should show /usr/bin/node (NOT /mnt/c/ or /usr/local/bin)
npm --version
```

**Full guide**: See [scripts/INSTALL_NODE_WSL.md](INSTALL_NODE_WSL.md)

**Alternative**: Just use PowerShell scripts instead (already working!)
```powershell
.\scripts\run_audits.ps1  # No WSL needed
```

### "Server failed to start within X seconds"

**Solution**: Increase wait time or check if port 4173 is already in use

```powershell
$env:AUDIT_WAIT_SECONDS = "120"
```

### "Lighthouse/Axe not found"

**Solution**: Ensure npm dependencies are installed

```bash
cd frontend
npm install
```

### PowerShell Execution Policy Error

**Solution**: Run PowerShell as Administrator and set execution policy

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use the batch file wrapper instead.

### VITE_CLERK_PUBLISHABLE_KEY Missing

**Solution**: Get your test key from Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Select your application
3. Copy the "Publishable Key" from the API Keys section
4. Use the key that starts with `pk_test_`

## Quality Gates

Per CLAUDE.md standards:

| Category | Minimum Score | Target Score |
|----------|--------------|--------------|
| Performance | 90% | 95%+ |
| Accessibility | 95% | 100% |
| Best Practices | 90% | 95%+ |
| SEO | 90% | 95%+ |

## When to Run

- **Before every PR** - Ensure no regressions
- **After accessibility changes** - Verify fixes work
- **Before deployment** - Final quality gate
- **After major UI changes** - Check performance impact

## Related Documentation

- [Full Testing Guide](../docs/testing/ACCESSIBILITY-TESTING.md)
- [CLAUDE.md](../CLAUDE.md) - Development standards
- [BMAD Progress Tracker](../docs/bmad/BMAD_PROGRESS_TRACKER.md)
