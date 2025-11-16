# BMAD-METHOD Update: v6.0.0-alpha.9

**Date**: 2025-11-16
**Previous Version**: v6.0.0-alpha.8 (installed 2025-11-13)
**New Version**: v6.0.0-alpha.9 (released 2025-11-12)
**Update Method**: Direct compilation via `compileAgents()`

---

## Summary

Successfully updated BMAD-METHOD from v6.0.0-alpha.8 to v6.0.0-alpha.9 using a clean reinstall approach. All agents and workflows have been recompiled with the latest features.

---

## What's New in v6.0.0-alpha.9

### 1. **Workflow Engine Revolution**
- New intelligent file discovery protocol
- Three loading strategies:
  - `FULL_LOAD` - Load entire documents
  - `SELECTIVE_LOAD` - Load specific sections
  - `INDEX_GUIDED` - Use index files for navigation
- Automatic detection of sharded vs whole documents

### 2. **Track-Based System** (Breaking Change)
Replaced "Level 0-4" terminology with intuitive tracks:
- `quick-flow` - Bug fixes, small features (formerly Level 0)
- `bmad-method` - Full planning workflow (formerly Levels 1-3)
- `enterprise-bmad-method` - Extended planning (formerly Level 4)

**Action Required**: Update `docs/bmad/bmm-workflow-status.yaml` if it references "levels"

### 3. **Folder Structure Changes** (Breaking Change)
- **Eliminated**: `.bmad-ephemeral/` folder
- **New Default**: `docs/sprint-artifacts/` for Phase 4 content
- **Benefit**: Cleaner project structure, customizable output folder

**Action Required**: Update `.gitignore` if needed

### 4. **Configuration Improvements**
- Dynamic path placeholders: `{bmad_folder}` instead of hardcoded `.bmad`
- Fully customizable installation folder names
- Better multi-environment support

**Impact**: Agents now use `{bmad_folder}` placeholders (visible in compiled `.md` files)

### 5. **Documentation**
- New: Agent Customization Guide
- New: Web Bundles & Platform Guide
- Improved: GitHub Pages support for web bundles

---

## Update Process

### Steps Taken

1. **Backup**: Created `bmad-update-backup` branch
2. **Update Vendor**:
   ```bash
   cd _vendor/BMAD-METHOD
   git stash
   git fetch --tags
   git checkout v6.0.0-alpha.9
   npm install
   ```
3. **Recompile Agents**:
   ```bash
   node -e "..."  # Direct call to Installer.compileAgents()
   ```
4. **Verify**: Checked manifest, agents, and IDE commands
5. **Document**: Updated CLAUDE.md and created this document

### Files Updated

**BMAD Core**:
- `.bmad/_cfg/manifest.yaml` - Version updated to 6.0.0-alpha.9
- `.bmad/bmb/agents/*.md` - Recompiled with latest templates
- `.bmad/bmm/agents/*.md` - Recompiled with latest templates
- `.bmad/cis/agents/*.md` - Recompiled with latest templates
- `.bmad/core/agents/*.md` - Recompiled with latest templates

**IDE Integrations**:
- `.claude/commands/bmad/**/*.md` - All 58 commands regenerated
- `~/.codex/prompts/bmad_*.txt` - Codex CLI commands updated (59 files)

**Project Documentation**:
- `CLAUDE.md` - Version and date updated
- `docs/bmad/BMAD-UPDATE-2025-11-16.md` - This document

---

## Breaking Changes Addressed

### ✅ Path Placeholders
- **Old**: Hardcoded `.bmad` paths in config files
- **New**: `{bmad_folder}` dynamic placeholders
- **Status**: Automatically handled by recompilation

### ✅ Track Terminology
- **Old**: "Level 0-4" system
- **New**: Track names (quick-flow, bmad-method, enterprise-bmad-method)
- **Status**: Will update workflow status files if needed

### ⏳ Folder Structure
- **Old**: `.bmad-ephemeral/` for sprint artifacts
- **New**: `docs/sprint-artifacts/` (configurable)
- **Status**: May need to update `.gitignore` in future sprints

---

## Verification

### Version Check
```yaml
# .bmad/_cfg/manifest.yaml
installation:
  version: 6.0.0-alpha.9
  installDate: '2025-11-16T06:44:07.354Z'
  lastUpdated: '2025-11-16T06:44:07.356Z'
```

### Agent Check
Agents now use dynamic placeholders:
```markdown
<step n="2">Load and read {project-root}/{bmad_folder}/bmm/config.yaml NOW</step>
```

### IDE Commands
- **Claude Code**: 58 commands in `.claude/commands/bmad/`
- **Codex CLI**: 59 prompts in `~/.codex/prompts/`

---

## Post-Update Tasks

### Immediate
- [x] Update CLAUDE.md with new version
- [x] Create update documentation
- [x] Commit changes to backup branch

### Optional (Future)
- [ ] Update workflow status files to use track terminology
- [ ] Review `.gitignore` for new folder structure
- [ ] Test workflows with new loading strategies
- [ ] Review Agent Customization Guide for optimization opportunities

---

## Rollback Plan

If issues arise:
```bash
git checkout bmad-update-backup  # Go to backup branch
cd _vendor/BMAD-METHOD
git checkout v6.0.0-alpha.8
npm install
node -e "..." # Recompile with old version
```

---

## Notes

- **Installation Method**: Used direct `compileAgents()` call instead of interactive installer
- **Modules**: Same as before (core, bmb, bmm, cis)
- **IDE**: Same as before (codex, claude-code)
- **Project Impact**: Minimal - mostly internal BMAD improvements

---

## References

- **Release Notes**: https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v6.0.0-alpha.9
- **Changelog**: 32 commits between alpha.8 and alpha.9
- **Installation**: `_vendor/BMAD-METHOD/` (tag: v6.0.0-alpha.9)

---

**Status**: ✅ UPDATE COMPLETE
**Next Review**: When v6.0.0-alpha.10 is released
