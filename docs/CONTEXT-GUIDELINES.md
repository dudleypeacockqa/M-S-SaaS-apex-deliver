# AI Context Guidelines & Maintenance

**Purpose:** keep the project’s context base consistent for both AI agents and humans, preventing duplicate or stale documents.

## Canonical Context Files
| Scope | File | Notes |
| --- | --- | --- |
| Primary brief | `CLAUDE.md` | Source of truth for AI assistants; update whenever standards or architecture shift. |
| Agent roster & conventions | `AGENTS.md` | Complementary to `CLAUDE.md`; do not duplicate sections elsewhere. |
| Comprehensive runbook | `CODEX-COMPLETE-PROJECT-GUIDE.md` | Long-form version of CLAUDE; reference instead of copying content into new docs. |
| Product requirements | `docs/bmad/prd.md` | Canonical PRD; avoid creating parallel versions in other folders. |
| Architecture | `docs/architecture/*.md` (sharded) | Always link to these files; do not re-export into planning folders. |
| Workflow status | `docs/bmad/bmm-workflow-status*.md` | Use these for progress references; do not keep separate status trackers. |
| Stories | `docs/bmad/stories/*.md` | One file per story. If a story is re-scoped, move/rename rather than duplicating. |

## Legacy Snapshots
- `ma-saas-platform-v2/` — retained for historical reference only; never load into AI sessions or modify.
- `_vendor/**` — vendored BMAD method packages; leave untouched.

## Maintenance Rules
1. **Centralize new context:** place new long-form references under `docs/bmad/` or existing architecture subfolders—skip creating parallel directories under `docs/planning/`, etc.
2. **Before adding a doc:** search (`rg -n "<keyword>" docs`) to confirm a file doesn’t already exist. Update the canonical doc instead of cloning.
3. **Keep `render.yaml` and README in sync** for service names, commands, and environment settings to avoid context drift.
4. **Delete empty or placeholder outputs** (0-byte deploy logs, test stubs) after incidents are resolved.
5. **Record dedupe steps:** note deleted duplicates in commit messages for traceability.

## Duplicate Detection
Run this from the repo root whenever touching documentation or context files:
```powershell
$paths = Get-ChildItem docs -Recurse -File
$paths += Get-Item README.md, CLAUDE.md, CODEX-COMPLETE-PROJECT-GUIDE.md, AGENTS.md -ErrorAction SilentlyContinue
$hashTable = @{}
foreach ($file in $paths) {
  $hash = Get-FileHash -Algorithm SHA256 -Path $file.FullName
  $hashTable[$hash.Hash] = $hashTable[$hash.Hash] + ,$file.FullName
}
$hashTable.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 }
```
Review the printed groups and delete or consolidate duplicates as needed.

## Deployment Log Hygiene
- Keep one canonical verification file per day (e.g., `verify-deployment-YYYY-MM-DD.txt`). If intermediate logs are needed, append to that file instead of creating new ones.
- Archive large incident payloads (Render JSON dumps, long log tails) under `docs/deployments/incidents/` with a readme describing contents; remove empty placeholders.

---
_Last updated: 2025-11-18._
