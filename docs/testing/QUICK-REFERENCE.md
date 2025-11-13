# Accessibility Testing - Quick Reference Card

## One-Line Commands

```bash
# Run everything (automated)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ./scripts/run_local_audits.sh

# Manual two-terminal approach
# Terminal 1:
cd frontend && VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx npm run preview:test

# Terminal 2:
cd frontend && npm run audit:local
```

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run preview:test` | Start preview server on port 4173 |
| `npm run lighthouse:local` | Run Lighthouse performance audit |
| `npm run axe:local` | Run Axe accessibility scan |
| `npm run audit:local` | Run both Lighthouse + Axe |
| `npm run audit:help` | Show usage help |

## Required Environment Variables

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

Get your test key from: https://dashboard.clerk.com

## Report Locations

```
docs/testing/
├── lighthouse-report.html    # Open in browser
├── lighthouse-report.json    # Machine-readable
└── axe-report.json          # Accessibility violations
```

## Score Thresholds

| Category | Min | Target | Blocker |
|----------|-----|--------|---------|
| Performance | 90% | 95% | <85% |
| Accessibility | 95% | 100% | <90% |
| Best Practices | 90% | 95% | <85% |
| SEO | 90% | 95% | <85% |

## Common Issues & Quick Fixes

### Server won't start
```bash
# Kill existing processes
pkill -f vite
# Or on Windows
taskkill /F /IM node.exe
```

### Port 4173 already in use
```bash
# Find and kill process using port
# Windows
netstat -ano | findstr :4173
taskkill /PID <pid> /F

# macOS/Linux
lsof -ti:4173 | xargs kill -9
```

### Missing VITE_CLERK_PUBLISHABLE_KEY
```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Or create a .env file in frontend/
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx" > frontend/.env.local
```

### Lighthouse fails on Windows
```bash
# Temporarily disable Windows Defender
# Or use WSL:
wsl
cd /mnt/c/Projects/ma-saas-platform/M-S-SaaS-apex-deliver
./scripts/run_local_audits.sh
```

## Critical Accessibility Fixes

### 1. Color Contrast (Most Common)
```css
/* FAIL: 3.2:1 */
color: #777; background: #fff;

/* PASS: 7.1:1 */
color: #333; background: #fff;
```

### 2. Alt Text
```tsx
{/* FAIL */}
<img src="logo.png" />

{/* PASS */}
<img src="logo.png" alt="Company Logo" />
```

### 3. Form Labels
```tsx
{/* FAIL */}
<input type="text" />

{/* PASS */}
<label htmlFor="name">Name</label>
<input id="name" type="text" />
```

### 4. Button Names
```tsx
{/* FAIL */}
<button><X /></button>

{/* PASS */}
<button aria-label="Close"><X /></button>
```

## When to Run

- ✅ Before opening PR
- ✅ After accessibility changes
- ✅ Before deployment
- ✅ When adding new pages/components
- ✅ After major UI refactors

## CI/CD Integration

Add to GitHub Actions:
```yaml
- name: Run Accessibility Tests
  run: |
    cd frontend
    npm run build
    npm run preview:test &
    sleep 10
    npm run audit:local
```

## Resources

- Full Guide: [ACCESSIBILITY-TESTING.md](ACCESSIBILITY-TESTING.md)
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Lighthouse Docs: https://developer.chrome.com/docs/lighthouse/
- Axe Docs: https://www.deque.com/axe/

## Cheat Sheet

```bash
# Build frontend
cd frontend && npm run build

# Start preview
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx npm run preview:test &

# Wait for server
sleep 10

# Run tests
npm run audit:local

# View results
start ../docs/testing/lighthouse-report.html  # Windows
open ../docs/testing/lighthouse-report.html   # macOS
xdg-open ../docs/testing/lighthouse-report.html  # Linux

# Stop server
pkill -f "vite preview"
```

---

**Need More Help?** See [ACCESSIBILITY-TESTING.md](ACCESSIBILITY-TESTING.md)
