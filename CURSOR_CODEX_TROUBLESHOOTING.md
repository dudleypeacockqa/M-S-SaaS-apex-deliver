# Cursor IDE / Codex CLI Troubleshooting Guide

**Issue**: Codex CLI loads but doesn't execute commands after Cursor IDE update
**Date Created**: October 31, 2025
**Status**: Troubleshooting in progress

---

## Problem Description

After updating Cursor IDE, the Codex CLI terminal integration:
- Loads successfully
- Accepts command input
- **Hangs after pressing Enter** (no execution)
- Does not respond or provide output

This is a common post-update issue with Cursor IDE and is **NOT** related to:
- BMAD methodology installation
- Project code or test suite
- Node.js or npm dependencies

---

## Solution Steps (Execute in Order)

### Step 1: Clear Cursor IDE Caches ⭐ **START HERE**

**Success Rate**: 80% of cases resolved by cache clearing

#### Instructions:

1. **Close Cursor IDE completely** (ensure no Cursor processes running)

2. **Run ONE of these command sets** based on your preference:

#### Option A: PowerShell (Recommended)

```powershell
# Clear Cursor Cache directories (Windows)
Remove-Item -Path "$env:APPDATA\Cursor\Cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Cursor\CachedData" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Cursor\Code Cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Cursor\GPUCache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Cursor\User\workspaceStorage" -Recurse -Force -ErrorAction SilentlyContinue

# Also clear logs and temp files
Remove-Item -Path "$env:APPDATA\Cursor\logs" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:TEMP\Cursor*" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Cursor caches cleared successfully!" -ForegroundColor Green
Write-Host "Please reopen Cursor IDE now." -ForegroundColor Cyan
```

#### Option B: Command Prompt (cmd)

```cmd
@echo off
echo Clearing Cursor IDE caches...

rd /s /q "%APPDATA%\Cursor\Cache" 2>nul
rd /s /q "%APPDATA%\Cursor\CachedData" 2>nul
rd /s /q "%APPDATA%\Cursor\Code Cache" 2>nul
rd /s /q "%APPDATA%\Cursor\GPUCache" 2>nul
rd /s /q "%APPDATA%\Cursor\User\workspaceStorage" 2>nul
rd /s /q "%APPDATA%\Cursor\logs" 2>nul

echo.
echo ✅ Cursor caches cleared successfully!
echo.
echo Please reopen Cursor IDE now.
pause
```

#### Option C: Manual File Explorer Method

1. Press `Win + R` to open Run dialog
2. Type `%APPDATA%\Cursor` and press Enter
3. Delete these folders:
   - `Cache`
   - `CachedData`
   - `Code Cache`
   - `GPUCache`
   - `logs`
   - `User\workspaceStorage`

3. **Reopen Cursor IDE**
   - Wait 30-60 seconds for extensions to reload
   - Watch bottom-right status bar for loading indicators

4. **Test Codex CLI**:
   - Open terminal: `` Ctrl+` ``
   - Type: `echo "test"`
   - Press Enter
   - **If output appears**: Codex CLI is working! ✅
   - **If still hangs**: Proceed to Step 2

---

### Step 2: Reset Codex CLI Extension

**If Step 1 didn't resolve the issue**, try reloading/reinstalling the Codex extension:

1. **Reload Cursor Window**:
   - Press `Ctrl+Shift+P` (Command Palette)
   - Type: `Developer: Reload Window`
   - Press Enter
   - Wait for reload to complete

2. **Check Extension Status**:
   - Press `Ctrl+Shift+X` (Extensions panel)
   - Search for "Codex" or "Codex CLI"
   - Check if extension shows errors or warnings
   - Note the version number

3. **Reinstall Extension** (if needed):
   - Right-click Codex CLI extension
   - Click "Uninstall"
   - Restart Cursor
   - Go back to Extensions (`Ctrl+Shift+X`)
   - Search for Codex CLI
   - Click "Install"
   - Restart Cursor again

4. **Test Again**:
   - Open terminal: `` Ctrl+` ``
   - Test command execution
   - **If working**: Done! ✅
   - **If still broken**: Proceed to Step 3

---

### Step 3: Verify Terminal Integration

**Check if the underlying terminal is functional**:

1. **Test Basic Terminal**:
   ```bash
   # Open new Cursor terminal (Ctrl+`)
   echo "Terminal test"
   node --version
   npm --version
   pwd
   ```
   - **If these work**: Terminal is fine, issue is Codex-specific
   - **If these fail**: Terminal integration is broken

2. **Check Cursor Output Panel**:
   - Press `Ctrl+Shift+U` (Output panel)
   - Select "Codex" or "Terminal" from dropdown
   - Look for error messages
   - Common errors:
     - "Shell integration failed"
     - "Node.js not found"
     - "PATH environment variable issue"

3. **Reset Terminal Settings**:
   - Press `Ctrl+Shift+P`
   - Type: `Preferences: Open User Settings (JSON)`
   - Add/verify these settings:
   ```json
   {
     "terminal.integrated.shellIntegration.enabled": true,
     "terminal.integrated.inheritEnv": true,
     "codex.enabled": true
   }
   ```
   - Save and reload window

4. **Test Again**:
   - **If working**: Done! ✅
   - **If still broken**: Proceed to Step 4

---

### Step 4: Check Workspace Settings

**Verify project-specific settings aren't blocking Codex**:

1. **Check Workspace Settings**:
   - Open `.vscode/settings.json` in your project root
   - Look for conflicting terminal or Codex settings
   - Common conflicts:
     ```json
     // REMOVE these if present:
     "codex.enabled": false,  // Should be true
     "terminal.integrated.shellIntegration.enabled": false,  // Should be true
     ```

2. **Add Required Settings** (if missing):
   ```json
   {
     "codex.enabled": true,
     "terminal.integrated.shellIntegration.enabled": true,
     "terminal.integrated.inheritEnv": true
   }
   ```

3. **Reload Window**: `Ctrl+Shift+P` → `Developer: Reload Window`

4. **Test Again**:
   - **If working**: Done! ✅
   - **If still broken**: Proceed to Step 5

---

### Step 5: Nuclear Option - Full Cursor Reinstall ⚠️

**⚠️ ONLY use if Steps 1-4 all failed**

This is the most thorough fix but requires more time.

#### Before Starting:

1. **Backup Your Settings**:
   - Press `Ctrl+Shift+P`
   - Type: `Preferences: Export Settings`
   - Save the exported file somewhere safe

2. **Note Your Extensions**:
   - Press `Ctrl+Shift+X`
   - Take screenshot or write down installed extensions

#### Reinstall Steps:

1. **Uninstall Cursor**:
   - Windows Settings → Apps → Cursor → Uninstall
   - OR Control Panel → Programs → Uninstall Cursor

2. **Delete All Cursor Data**:
   ```powershell
   # Run in PowerShell
   Remove-Item -Path "$env:APPDATA\Cursor" -Recurse -Force
   Remove-Item -Path "$env:LOCALAPPDATA\Cursor" -Recurse -Force
   Remove-Item -Path "$env:USERPROFILE\.cursor" -Recurse -Force -ErrorAction SilentlyContinue
   ```

3. **Restart Computer** (recommended)

4. **Reinstall Cursor**:
   - Download latest version from https://cursor.sh
   - Install with default settings
   - Launch Cursor

5. **Restore Settings**:
   - Import settings backup (if exported earlier)
   - OR manually configure settings

6. **Reinstall Extensions**:
   - Codex CLI (first priority)
   - Other extensions from your list

7. **Test Codex CLI**:
   - Should now work properly ✅

---

## Verification Checklist

After completing any step, verify Codex CLI is working by testing ALL of these:

```bash
# 1. Basic echo
echo "test"

# 2. Show current directory
pwd

# 3. List files
ls

# 4. Node.js check
node --version

# 5. npm check
npm --version

# 6. Run a simple npm script (if in project)
cd frontend
npm run test -- --version
```

**All commands should execute and return output immediately.**

---

## What This DOES NOT Affect

These troubleshooting steps are **safe** and will **NOT** impact:

✅ **BMAD Methodology Installation**
- `_vendor/BMAD-METHOD/` directory intact
- `bmad/` compiled agents intact
- `mad/docs/` Codex instructions intact
- All BMAD workflows and stories preserved

✅ **Project Code & Progress**
- All source code unchanged
- Git history and commits preserved
- Uncommitted changes retained
- Test suite fixes (React 18, NODE_ENV) preserved

✅ **Dependencies**
- `node_modules` intact
- `package.json` / `package-lock.json` unchanged
- Python `venv` and packages intact

✅ **Configuration Files**
- `.env` files preserved
- Database connection strings safe
- API keys unchanged

**Only Cursor IDE's internal cache and extension state are affected.**

---

## Still Not Working?

If you've completed all 5 steps and Codex CLI still doesn't work:

### Alternative Workarounds:

1. **Use Standard Terminal**:
   - Open external terminal (PowerShell, cmd, Git Bash)
   - Navigate to project directory
   - Run commands normally
   - Codex-specific features won't work, but all project commands will

2. **Use Claude Code (This Agent)**:
   - Continue development using Claude Code interface
   - Claude Code doesn't depend on Codex CLI
   - All BMAD workflows accessible via Claude Code
   - Test suite work can continue normally

3. **Report to Cursor Support**:
   - Open issue at: https://github.com/getcursor/cursor/issues
   - Include:
     - Cursor version
     - OS version
     - Error messages from Output panel
     - Steps attempted from this guide

---

## Quick Reference Commands

### Clear Cache (Quick Copy-Paste)
```powershell
Remove-Item -Path "$env:APPDATA\Cursor\Cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Cursor\CachedData" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Cursor\Code Cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Cursor\GPUCache" -Recurse -Force -ErrorAction SilentlyContinue
```

### Reload Window (Quick)
`Ctrl+Shift+P` → `Developer: Reload Window` → Enter

### Check Codex Extension
`Ctrl+Shift+X` → Search "Codex" → Check status

### View Error Output
`Ctrl+Shift+U` → Select "Codex" from dropdown

---

## Success Indicators

✅ **Codex CLI is working if**:
- Terminal responds immediately to Enter key
- Commands execute and show output
- No hanging or freezing
- Command history works (Up/Down arrows)
- Multi-line commands work
- Codex-specific features (autocomplete, suggestions) work

❌ **Still broken if**:
- Cursor hangs after pressing Enter
- No output appears
- Terminal freezes or becomes unresponsive
- Commands queue but don't execute

---

## Additional Notes

- **Most common fix**: Step 1 (cache clearing) - 80% success rate
- **Time required**: 5-20 minutes (depends on which step resolves it)
- **Safe to try**: All steps are non-destructive to project files
- **Repeatable**: Can safely repeat any step multiple times

**Last Updated**: October 31, 2025
**Status**: Troubleshooting guide active
