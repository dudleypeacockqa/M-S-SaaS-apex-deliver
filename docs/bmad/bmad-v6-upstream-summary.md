# BMAD v6 Upstream Summary

_Last updated: 19 Nov 2025_

This note captures the most relevant updates from the upstream `bmad-code-org/BMAD-METHOD` repository so we can align our local workflows and documentation with the v6-alpha series.

## Core Platform (README Highlights)

- **BMad CORE upgrades:** Agent orchestration now supports persistent customization via `{bmad_folder}/_cfg/agents/`, independent communication/output languages, and update-safe personalization for every module, including new web-bundle distribution paths. [[source]](https://github.com/bmad-code-org/BMAD-METHOD)
- **Scale-adaptive planning:** BMM v6 replaces level-based guidance with three planning tracks (Quick Flow, BMad Method, Enterprise) and enforces a four-phase lifecycle (Analysis → Planning → Solutioning → Implementation) staffed by 12 specialized agents. [[source]](https://github.com/bmad-code-org/BMAD-METHOD)
- **Module clarity:** BMM (agile dev), BMB (builder), CIS (creative) each ship with refreshed quick-start, agents, and workflow guides plus brownfield onboarding instructions.

## Release 6.0.0-alpha.9 Notes

- **Workflow engine:** New `discover_inputs` protocol standardizes document sharding across workflows, replacing brittle hardcoded file lists. Track-based terminology (`quick-flow`, `bmad-method`, `enterprise-bmad-method`) cascades through every Phase 1-4 workflow. [[changelog]](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- **Documentation surge:** Agent customization and web bundle guides added; workflow docs reorganized for direct linking from IDE contexts.
- **Folder + config changes:** `.ephemeral/` and `.bmad-ephemeral/` are removed. All sprint artifacts now land under `{output_folder}/{sprint_artifacts}` (default `docs/sprint-artifacts/`), configurable at install time. Variable names and installer prompts updated around `{bmad_folder}` + `{output-folder}`.
- **Tech-spec intelligence:** Intent-driven stack detection removes legacy boilerplate, consolidating story generation and reducing workflow files by ~50%.
- **Impact:** 98 files touched, 6,567 deletions, 40+ workflows updated, 12 duplicates removed. Breaking changes center on terminology shift and artifact path expectations.

## Immediate Implications for ApexDeliver

1. **Vendor refresh required:** `_vendor/BMAD-METHOD/` must be rebased to the 6.0.0-alpha.9 commit so we inherit the new workflow engine and installer prompts.
2. **Docs + runbooks:** Any reference to “Level 0-4”, `.bmad-ephemeral`, or legacy sprint artifact folders must switch to the new track names and `docs/sprint-artifacts/` location.
3. **Workflow trackers:** `docs/bmad/bmm-workflow-status.md` and downstream runbooks should reference the new commands (`*workflow-init`, `/bmad:bmm:workflows:*`) and emphasize the scale-adaptive track selection.
4. **Validation:** After vendoring we should rerun `npx bmad-method status`, backend `pytest`, and frontend `npm run test` to ensure no config regressions before promoting the new documentation.

Keep this summary in sync whenever upstream releases another alpha or beta so downstream documentation stays accurate.

