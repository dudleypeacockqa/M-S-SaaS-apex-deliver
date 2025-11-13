# Installing Native Node.js in WSL (Fix for npm Resolution Issues)

**Problem**: WSL is using Windows Node.js via symlinks (`/usr/local/bin/node` → Windows binary), but Windows interop is broken, causing:
```
Cannot find module 'C:\usr\bin\npm'
UtilBindVsockAnyPort error
```

**Solution**: Install **native Linux Node.js** inside WSL to bypass Windows interop entirely.

---

## Quick Fix (5 minutes)

### Option 1: Using NodeSource Repository (Recommended)

```bash
# Remove any Windows symlinks
sudo rm -f /usr/local/bin/node /usr/local/bin/npm /usr/local/bin/npx

# Install Node.js 20 LTS (native Linux)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
which node    # Should show: /usr/bin/node (not /usr/local/bin or /mnt/c/)
node --version
npm --version

# Test npm works
npm --version && echo "✅ npm is working!"
```

---

### Option 2: Using NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell config
source ~/.bashrc

# Install Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verify
which node    # Should show: ~/.nvm/versions/node/v20.x.x/bin/node
node --version
npm --version
```

---

### Option 3: Using apt (Simpler, but older version)

```bash
# Remove Windows symlinks
sudo rm -f /usr/local/bin/node /usr/local/bin/npm /usr/local/bin/npx

# Install from Ubuntu repositories (may be older version)
sudo apt-get update
sudo apt-get install -y nodejs npm

# Verify
node --version
npm --version
```

---

## After Installation: Test the Audit Script

```bash
# Navigate to project
cd /mnt/c/Projects/ma-saas-platform/M-S-SaaS-apex-deliver

# Set Clerk key
export VITE_CLERK_PUBLISHABLE_KEY="pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k"

# Run audit script (should now work!)
bash scripts/run_local_audits.sh
```

---

## Verify Node is Native Linux

Run this diagnostic script:

```bash
# Check Node binary location
which node

# Check if it's a Windows path (BAD)
if [[ $(which node) == *"/mnt/c/"* ]] || [[ $(which node) == *"/usr/local/bin"* ]]; then
    echo "❌ Still using Windows Node.js (via interop or symlink)"
    echo "   Path: $(which node)"
    ls -la $(which node)
else
    echo "✅ Using native Linux Node.js"
    echo "   Path: $(which node)"
fi

# Check npm
which npm
npm --version && echo "✅ npm works!" || echo "❌ npm broken"

# Check npx
which npx
npx --version && echo "✅ npx works!" || echo "❌ npx broken"
```

Expected output:
```
✅ Using native Linux Node.js
   Path: /usr/bin/node
✅ npm works!
✅ npx works!
```

---

## Troubleshooting

### Issue: "node: command not found" after installation

**Solution**: Reload your shell or PATH
```bash
source ~/.bashrc
# OR
exec bash
```

### Issue: npm still tries to use Windows paths

**Solution**: Remove ALL Windows Node paths from WSL
```bash
# Find all node/npm binaries
find /usr -name node -o -name npm -o -name npx 2>/dev/null

# Remove Windows interop symlinks
sudo rm -f /usr/local/bin/node
sudo rm -f /usr/local/bin/npm
sudo rm -f /usr/local/bin/npx

# Reinstall Node using Option 1 above
```

### Issue: "Permission denied" when running npm

**Solution**: Fix npm permissions
```bash
# Reset npm cache ownership
sudo chown -R $(whoami) ~/.npm

# Or reinstall with correct permissions (NVM does this automatically)
```

### Issue: Script still can't find npm

**Solution**: Update the script's fallback path
```bash
# Find where npm actually is
which npm

# If it's at /home/user/.nvm/versions/node/v20.x.x/bin/npm
# Update line 41 in run_local_audits.sh to:
NPM_CMD=($(which npm))
```

---

## Why This Fixes the Problem

### Before (Broken):
```
WSL → /usr/local/bin/node (symlink) → /mnt/c/Program Files/nodejs/node.exe
                                    ↓
                           Windows Interop Layer (BROKEN)
                                    ↓
                              npm tries C:\usr\bin\npm ❌
```

### After (Fixed):
```
WSL → /usr/bin/node (native Linux binary)
            ↓
      npm via Linux (/usr/lib/node_modules/npm) ✅
```

No Windows interop = No path translation issues!

---

## Alternative: Run Everything from PowerShell (Already Working!)

If you don't want to install Linux Node.js, you already have a working solution:

```powershell
# This works NOW (no WSL needed)
.\scripts\run_audits.ps1
```

The PowerShell scripts are fully functional and were tested successfully. Only use WSL/bash if you specifically need Linux environment.

---

## Summary

| Method | Status | Use When |
|--------|--------|----------|
| PowerShell scripts | ✅ Working NOW | Windows development (recommended) |
| WSL + Native Node | ⚠️ Needs setup | Linux-specific testing, CI/CD |
| WSL + Windows Node | ❌ Broken | Don't use (interop issues) |

**Recommended Path**:
1. Use PowerShell scripts for daily development (already working!)
2. Install native Linux Node in WSL only if needed for CI/CD or Linux-specific work

---

## Next Steps After Installing Native Node

Once Node is installed natively in WSL:

```bash
# 1. Test npm works
npm --version

# 2. Navigate to project
cd /mnt/c/Projects/ma-saas-platform/M-S-SaaS-apex-deliver

# 3. Install frontend dependencies
cd frontend
npm install --include=dev

# 4. Run tests (if needed)
npm test

# 5. Run audit script
cd ..
export VITE_CLERK_PUBLISHABLE_KEY="pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k"
bash scripts/run_local_audits.sh
```

---

**Created**: November 13, 2025
**Purpose**: Fix WSL npm resolution issues for audit automation
**Alternative**: Use PowerShell scripts (already working!)
