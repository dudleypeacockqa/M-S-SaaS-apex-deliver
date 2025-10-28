# BMAD Method Implementation Record

**Project**: M&A Intelligence SaaS Platform
**Methodology**: BMAD v6-alpha (core + bmb + bmm + cis) with Test-Driven Development
**Created**: 2025-10-26
**Last Updated**: 2025-10-28

---

## ✅ Official Adoption Summary

The project now runs on the official **BMAD-METHOD v6-alpha** toolchain. The full CLI install was refreshed from `_vendor/BMAD-METHOD` and compiled directly into the repository-level `bmad/` directory. All CLI assets, manifests, and IDE integrations have been generated for both **Codex CLI** and **Claude Code**, enabling agent-driven workflows end-to-end.

### Installed Modules
- **core** – platform scaffolding, master orchestrator, workflow status engine
- **bmb** – builder toolchain for creating/maintaining BMAD agents & workflows
- **bmm** – full software delivery framework (analysis → planning → solutioning → implementation)
- **cis** – Creative Intelligence Suite for ideation, storytelling, and innovation workshops
- **bmd** – maintainer tooling for BMAD framework stewardship (carried forward from prior install)

### Generated Artefacts
- `bmad/_cfg/manifest.yaml` recorded the refreshed installation (modules + ides)
- `bmad/_cfg/*.csv` manifests rebuilt (agents, workflows, tasks, files, tools)
- Markdown agents compiled for all modules (`bmad/<module>/agents/*.md`)
- Creative suite resources added under `bmad/cis/`

---

## ⚙️ Installation Procedure (documented)

```
cd _vendor/BMAD-METHOD
npm install                          # once per environment
npm run install:bmad                 # follow prompts
  • Target: C:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver
  • Choose "Modify BMAD Installation"
  • Modules: bmb, bmm, cis (core auto-included, bmd preserved)
  • IDEs: Codex, Claude Code (others optional)
```

> **Non-interactive maintenance**: For agent rebuilds inside automation, patch the CLI UI to skip IDE prompts, then call:
>
> ```bash
> node -e "const path=require('node:path');
> const ui=require('./tools/cli/lib/ui');
> ui.UI.prototype.promptToolSelection = async () => ({ skipIde: true, ides: ['codex','claude-code'] });
> const {Installer}=require('./tools/cli/installers/lib/core/installer');
> (async()=>{const installer=new Installer();
>   await installer.compileAgents({ directory: path.resolve('..','..') });})();"
> ```

### Recompiling / Regenerating Manifests
```
cd _vendor/BMAD-METHOD
node -e "const path=require('node:path');const {ManifestGenerator}=require('./tools/cli/installers/lib/core/manifest-generator');
(async()=>{const project=path.resolve('..','..');const bmad=path.join(project,'bmad');
  const gen=new ManifestGenerator();
  await gen.generateManifests(bmad,['bmb','bmm','cis'],[],{ ides:['codex','claude-code'], preservedModules:['bmd']});})();"
```
(Use after copying fresh module sources or editing YAML agents.)

---

## 📂 Repository Structure (BMAD folders)

```
M-S-SaaS-apex-deliver/
├── bmad/
│   ├── core/                 # master orchestrator + templates
│   ├── bmb/                  # agent/workflow builder utilities
│   ├── bmm/                  # primary method workflows & agents
│   ├── cis/                  # creative intelligence agents & teams
│   ├── bmd/                  # maintainer agents (carried forward)
│   ├── docs/                 # IDE usage instructions (Codex, Claude)
│   └── _cfg/                 # manifest + IDE metadata
│       ├── manifest.yaml
│       ├── agent-manifest.csv
│       ├── workflow-manifest.csv
│       ├── files-manifest.csv
│       ├── task-manifest.csv
│       └── tool-manifest.csv
└── docs/bmad/                # PRD, architecture, stories, progress artefacts
```

`docs/bmad/bmm-workflow-status.md` now stores the live workflow state for BMAD agents (see below).

---

## 🔁 BMAD Delivery Workflow (v6-alpha)

1. **Workflow Status** (`/bmad:bmm:workflows:workflow-status`)
   - Detects project type/level (Level 4 greenfield)
   - Routes agents to the next required workflow
2. **Planning & Solutioning**
   - `/bmad:bmm:workflows:prd`
   - `/bmad:bmm:workflows:tech-spec`
3. **Implementation Loop**
   - `/bmad:bmm:workflows:create-story`
   - `/bmad:bmm:workflows:story-ready`
   - `/bmad:bmm:workflows:dev-story`
   - `/bmad:bmm:workflows:review-story`
4. **Quality Gate**
   - `/bmad:bmm:workflows:retrospective`

All workflows read/write status in `docs/bmad/bmm-workflow-status.md` ensuring every agent knows the current phase, next command, and owning role.

---

## 🧭 Workflow Status File

`docs/bmad/bmm-workflow-status.md` is no longer a template—it reflects the live session state:

```
PROJECT_NAME: M&A Intelligence Platform
PROJECT_TYPE: software
PROJECT_LEVEL: 4
FIELD_TYPE: greenfield
START_DATE: 2025-10-28
WORKFLOW_PATH: bmad/bmm/workflows/workflow-status/paths/greenfield-level-4.yaml

CURRENT_PHASE: 2-Planning
CURRENT_WORKFLOW: prd
CURRENT_AGENT: pm
PHASE_1_COMPLETE: true
PHASE_2_COMPLETE: false
PHASE_3_COMPLETE: false
PHASE_4_COMPLETE: false

NEXT_ACTION: Draft or update PRD using pm agent
NEXT_COMMAND: /bmad:bmm:workflows:prd
NEXT_AGENT: pm

LAST_UPDATED: 2025-10-28T09:45:30Z
```

Update this file whenever a workflow completes so the status router stays accurate.

---

## 💻 Agent & IDE Usage

### Codex CLI
- `/bmad-bmm-agents-dev`
- `/bmad-bmm-workflows-dev-story`
- `/bmad-cis-agents-storyteller`

### Claude Code
- `/bmad:bmm:agents:pm`
- `/bmad:bmm:workflows:workflow-status`
- `/bmad:cis:agents:creative-problem-solver`

Prompts are auto-registered in the respective home directories (`~/.codex/prompts`, `.claude/commands`).

---

## 📈 Sprint Context (unchanged)

- **Sprint 1**: Foundation & core infrastructure ✅
- **Sprint 2**: Billing & financial features ✅
- **Sprint 3**: Intelligence & automation (in progress)
- **Sprint 5 Focus**: DEV-011 valuation suite + subscription gating (current work)

Progress tracking remains in `docs/bmad/BMAD_PROGRESS_TRACKER.md`.

---

## 🛠 Maintenance Checklist

- `npm install` (inside `_vendor/BMAD-METHOD`) after pulls
- `npm run install:bmad` when adding/removing modules or IDEs
- Re-run agent compilation script after editing YAML agents or custom sidecars
- Regenerate manifests after copying module sources (`ManifestGenerator` snippet above)
- Review `bmad/_cfg/files-manifest.csv` before commits to ensure hashes capture new artefacts

---

## 🚀 Next Steps

1. Align BMAD workflow status with active sprint ceremonies (update when moving to Phase 3/4)
2. Backfill story documents using `/bmad:bmm:workflows:create-story`
3. Expand IDE exports if new assistants are introduced (Cursor, Windsurf, etc.)
4. Keep `CLAUDE.md` and `docs/BMAD-V6-ADOPTION-GUIDE.md` in sync with new practices

---

**Document Version**: 2.0
**Framework Status**: BMAD v6-alpha (core+bmb+bmm+cis) installed & operational
**Quality**: Production-ready (TDD enforced, BMAD agents compiled)
