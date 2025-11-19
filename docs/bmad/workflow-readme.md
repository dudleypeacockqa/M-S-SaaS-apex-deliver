# BMAD v6 Regression & Rollback Checklist

_Last updated: 19 Nov 2025_

Use this checklist whenever the vendored BMAD CLI is refreshed or methodology docs change. It keeps enterprise-bmad-method workflows auditable and provides a rollback path if the new assets misbehave.

## 1. Verify BMAD Installation

1. `cd _vendor/BMAD-METHOD && git status -sb` – ensure we’re tracking `be04d687` (6.0.0-alpha.12) or the intended tag.
2. `npm install` – install CLI deps if package-lock changed.
3. `npm run install:bmad` – interactive install (select Codex + Claude Code, `docs/sprint-artifacts` for sprint artefacts).
4. `npx bmad-method status` – confirm track detection (`PROJECT_TRACK=enterprise-bmad-method`) and IDEs codex/claude-code.

_Non-interactive option (CI/local automation):_

```bash
cd _vendor/BMAD-METHOD
node -e "const path=require('node:path');const fs=require('fs-extra');const yaml=require('js-yaml');const {Installer}=require('./tools/cli/installers/lib/core/installer');(async()=>{const project=path.resolve('..','..');const installer=new Installer();const modules=['bmb','bmm','cis'];const configs={};for(const moduleName of ['core',...modules]){const cfg=path.join(project,'.bmad',moduleName,'config.yaml');configs[moduleName]=yaml.load(await fs.readFile(cfg,'utf8'));}const version=require('./package.json').version;installer.configCollector.collectedConfig={...configs,_meta:{version,installDate:new Date().toISOString(),lastModified:new Date().toISOString()}};installer.configCollector.allAnswers={};for(const [moduleName,values] of Object.entries(configs)){for(const [key,value] of Object.entries(values||{})){installer.configCollector.allAnswers[`${moduleName}_${key}`]=value;}}await installer.install({actionType:'update',directory:project,installCore:true,modules,ides:['codex','claude-code'],_quickUpdate:true,_savedIdeConfigs:{'codex':{_alreadyConfigured:true},'claude-code':{_alreadyConfigured:true}},coreConfig:configs.core});})();"
```

## 2. Regression Test Matrix

| Surface | Command | Notes |
|---------|---------|-------|
| BMAD CLI | `npx bmad-method status` | Log output in `docs/tests/` when refreshing artefacts. |
| Backend | `backend/venv/Scripts/python.exe -m pytest backend/tests` | Capture log to `docs/tests/yyyy-mm-dd-backend.txt`. |
| Frontend | `cd frontend && npm run test -- --run --coverage` | Capture log to `docs/tests/yyyy-mm-dd-frontend.txt`. |
| Marketing smoke | `node scripts/run-marketing-playwright.mjs` | Stores artefacts under `docs/tests/` + `docs/deployments/`. |
| Lint | `cd frontend && npm run lint` / `cd backend && ruff check .` | Optional but recommended post-refresh. |

Archive all outputs in `docs/tests/` and cross-link from `docs/bmad/bmm-workflow-status.md`.

## 3. Documentation Sync

After the tests above pass:

- Update `docs/bmad/bmm-workflow-status.md` (NEXT_ACTION/NEXT_COMMAND, new session log).
- Add a tracker entry in `docs/bmad/BMAD_PROGRESS_TRACKER.md`.
- Reference the new release in `docs/bmad/bmad-v6-upstream-summary.md` if upstream behaviour changed.
- Ensure README/TODO/FINAL-COMPLETION-PLAN reflect any new commands or artefact locations.

## 4. Rollback Plan

If the refresh introduces regressions:

1. `git checkout <previous-good-commit> -- _vendor/BMAD-METHOD` to restore the older CLI snapshot (e.g., `1a52a199`).
2. Delete the regenerated `.bmad/` folder: `rimraf .bmad`.
3. Re-run `npm run install:bmad` (or the automation snippet) to rebuild `.bmad/` from the older vendor snapshot.
4. Re-run the regression matrix above to confirm parity, then note the rollback in both `docs/bmad/bmm-workflow-status.md` and `docs/bmad/BMAD_PROGRESS_TRACKER.md`.
5. When upstream issues are resolved, reattempt the upgrade using the verification steps in section 1.

Keep this file close to the BMAD entries in the tracker so anyone can quickly validate or roll back future CLI updates.

