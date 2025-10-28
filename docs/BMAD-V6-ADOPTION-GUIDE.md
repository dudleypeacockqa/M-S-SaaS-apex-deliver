# BMAD v6-Alpha Adoption Guide

**Quick Reference**: When and how to migrate from BMAD v4 to v6-alpha

**Last Updated**: October 28, 2025
**Current Status**: v6-alpha CLI installed (core + bmb + bmm + cis) & active
**Target**: Sustain & iterate on v6-alpha workflows

---

## Executive Summary

**Current State**: BMAD-METHOD v6-alpha modules (core, bmb, bmm, cis) installed on 2025-10-28; manifests and IDE exports regenerated.

**What Changed**:
- Compiled agents + manifests refreshed via Installer/ManifestGenerator scripts
- Codex + Claude Code integrations rebuilt (bmad/docs/*-instructions.md)
- docs/bmad/bmm-workflow-status.md activated for Level 4 greenfield tracking

**Next Actions**:
1. Keep workflow status file in sync with ongoing phases
2. Run agent rebuild + manifest script after YAML edits
3. Extend adoption to additional IDEs (Cursor/Windsurf) when needed

---

## Migration Snapshot (October 28, 2025)

- CLI install path: _vendor/BMAD-METHOD › project root mad/
- Modules active: core, bmb, bmm, cis (bmd preserved)
- IDE coverage: Codex CLI, Claude Code
- Support scripts: installer.compileAgents + ManifestGenerator snippets recorded in CLAUDE.md
- Status file: docs/bmad/bmm-workflow-status.md now authoritative

---

## Quick Decision Matrix

### Stay with v4 If:
- ✅ Current workflow is productive
- ✅ Team familiar with existing process
- ✅ Mid-sprint or near deadline
- ✅ No specific v6 features needed
- ✅ Project in maintenance mode

### Consider v6-Alpha If:
- 🎯 Need scale-adaptive workflows (Levels 0-4)
- 🎯 Want automated story management
- 🎯 Building custom domain agents
- 🎯 Multi-project environment with varying complexity
- 🎯 Between major project phases
- 🎯 Long-term project with update-safe customization needs

---

## Key v6-Alpha Benefits

### 1. Scale-Adaptive Workflow Engine™
**What it does**: Automatically routes projects to appropriate documentation based on complexity

| Level | Stories | Documentation | Example |
|-------|---------|---------------|---------|
| 0 | 1 | Atomic change | Fix typo |
| 1 | 1-10 | Brief PRD | Add button |
| 2 | 5-15 | Focused PRD | User profile |
| 3 | 12-40 | Full PRD + Arch | Payment system |
| 4 | 40+ | Comprehensive | Enterprise platform |

**Current Project**: Level 3-4 (already comprehensive in v4)

### 2. Automated Story Management
**v4 (Current)**:
- Manual story creation in `docs/bmad/stories/`
- Manual status tracking
- Human-written stories

**v6-Alpha**:
```bash
*create-story          # SM agent drafts story
*story-ready           # SM approves for dev
*dev-story             # DEV implements
*story-done            # Mark complete
```

**Benefit**: Consistency, automation, built-in templates

### 3. Update-Safe Customization
**Sidecar Files**: `bmad/_cfg/agents/[agent]-sidecar.md`

Customize agents without editing source:
- Communication style
- Domain-specific knowledge
- Code style preferences
- Language localization

**Example**: M&A-specific financial terminology in DEV agent

### 4. Modular Architecture
- **BMM** (BMad Method) - Software development
- **BMB** (BMad Builder) - Create custom agents
- **CIS** (Creative Intelligence) - Innovation toolkit

**Use Case**: Build custom M&A financial analysis agent with BMB

---

## Migration Checklist

### Pre-Migration (1-2 hours)

- [ ] Read `docs/BMAD-V6-ALPHA-REFERENCE.md` (comprehensive guide)
- [ ] Review `_vendor/BMAD-METHOD/README.md` (v6-alpha overview)
- [ ] Watch BMadCode YouTube tutorials (if available)
- [ ] Discuss with team (get buy-in)
- [ ] Create backup branch: `git checkout -b bmad-v4-backup`
- [ ] Choose migration timing (between sprints ideal)

### Installation (30 minutes)

```bash
cd _vendor/BMAD-METHOD
npm install

# Run interactive installer
npm run install:bmad

# Prompts will ask:
# - Full project path
# - Your name
# - Communication language
# - Technical level
# - Documentation language
# - Module selection (BMM for software dev)
```

**Result**: Creates `bmad/` folder with modular structure

### Content Migration (2-4 hours)

#### 1. Migrate PRD
```bash
# Old: docs/bmad/prd.md
# New: bmad/docs/prd.md

# Update format:
# - Add scale level indicator (Level 3-4)
# - Restructure to v6 sections
# - Reference: _vendor/BMAD-METHOD/src/modules/bmm/templates/
```

#### 2. Create Story Status File
```bash
# Create: bmad/docs/status.md

## BACKLOG
- [ ] DEV-012-next-feature
- [ ] DEV-013-another-feature

## TODO
- [ ] DEV-011-current-focus

## IN PROGRESS
- [x] DEV-010-active-work

## DONE
- [x] DEV-001-completed
- [x] DEV-002-completed
...
```

#### 3. Migrate Stories
```bash
# Old: docs/bmad/stories/DEV-*.md
# New: bmad/docs/stories/DEV-*.md

# Update each story:
# - Follow v6 template
# - Add state machine references
# - Include workflow commands
```

#### 4. Update CLAUDE.md
```bash
# Change line 7:
**Methodology**: BMAD v6-alpha (BMM Module) with TDD

# Update commands section to v6 syntax
# Add reference to bmad/ folder
```

### Post-Migration Testing (1-2 hours)

- [ ] Test `*prd` workflow with PM agent
- [ ] Create one story with `*create-story`
- [ ] Implement story with `*dev-story`
- [ ] Verify all commands work
- [ ] Validate story state transitions
- [ ] Check documentation generation

### Team Training (1-2 hours)

- [ ] Walkthrough v6 workflows with team
- [ ] Practice with non-critical story
- [ ] Document team-specific conventions
- [ ] Create quick reference card
- [ ] Set up customization sidecars if needed

---

## Rollback Plan

If migration doesn't work out:

```bash
# 1. Switch back to v4 backup branch
git checkout bmad-v4-backup

# 2. Verify everything works
npm test
npm run build

# 3. Resume v4 workflow
# Continue with docs/bmad/ structure
```

**Risk**: Low - v4 backup branch preserved

---

## Recommended Migration Timing

### Ideal Times:
1. **Sprint boundary** (between Sprint 4 and 5)
2. **Project milestone** (after major feature delivery)
3. **Holiday period** (when velocity naturally slower)
4. **Major version bump** (v2.0 → v3.0)

### Avoid:
1. **Mid-sprint** (disrupts velocity)
2. **Pre-deadline** (adds risk)
3. **During crisis** (technical debt, bugs)
4. **Team transition** (new hires, departures)

---

## Cost-Benefit Analysis

### Migration Costs:
- **Time**: 5-10 hours (installation + training)
- **Risk**: Learning curve, potential productivity dip
- **Effort**: Content migration, team training

### Benefits (Long-term):
- **Automation**: Story management, state tracking
- **Scalability**: Scale-adaptive workflows
- **Customization**: Update-safe agent modifications
- **Consistency**: Built-in templates, validation
- **Future-proof**: Active v6 development, community support

### Break-Even Point:
- **Small Project** (<20 stories): Stay with v4
- **Medium Project** (20-50 stories): Marginal benefit
- **Large Project** (50+ stories): Clear benefit
- **Multi-Project**: Strong benefit

**Current Project**: ~30 stories total → Marginal benefit now, stronger later

---

## Alternative: Gradual Adoption

Instead of full migration, adopt v6 concepts incrementally:

### Phase 1: Documentation (No Code Changes)
- Create `docs/status.md` tracking story states
- Add scale level indicator to PRD
- Use v6 story template for new stories

### Phase 2: Conventions (No Tool Changes)
- Follow v6 naming conventions
- Implement story state machine manually
- Track BACKLOG → TODO → IN PROGRESS → DONE

### Phase 3: Partial Migration (Selected Features)
- Install v6 for reference
- Use v6 agents for specific tasks only
- Keep existing workflow for rest

### Phase 4: Full Migration (When Ready)
- Complete installation
- Migrate all content
- Train team fully

**Advantage**: Lower risk, gradual learning, no disruption

---

## Decision Framework

### Questions to Ask:

1. **Is current workflow blocking us?**
   - No → Stay with v4
   - Yes → Consider v6

2. **Do we need scale-adaptive features?**
   - No → Stay with v4
   - Yes → Evaluate v6 benefits

3. **Are we building custom agents?**
   - No → Stay with v4 (less important)
   - Yes → v6 BMB module valuable

4. **Is team comfortable with change?**
   - No → Defer migration
   - Yes → Plan migration

5. **What's our project timeline?**
   - Tight → Stay with v4
   - Flexible → Consider v6

### Scoring System:

Give 1 point for each "Yes":
- [ ] Between major milestones (safe timing)
- [ ] Need automated story management
- [ ] Building custom domain agents
- [ ] Multi-project environment
- [ ] Long-term project (6+ months remaining)
- [ ] Team eager to learn new tools
- [ ] Current workflow has pain points

**Score**:
- **0-2 points**: Stay with v4
- **3-4 points**: Consider gradual adoption
- **5-7 points**: Migrate to v6-alpha

---

## Next Steps

### If Staying with v4:
1. ✅ Close this guide
2. ✅ Continue with `docs/bmad/` structure
3. ✅ Reference v6 concepts for improvements
4. ✅ Revisit decision at Sprint 5+

### If Migrating to v6:
1. 📋 Follow migration checklist above
2. 📖 Read `docs/BMAD-V6-ALPHA-REFERENCE.md` thoroughly
3. 🎓 Train team on v6 workflows
4. 🧪 Test with non-critical story first
5. 🚀 Gradually roll out to full project

---

## Support Resources

### Documentation:
- **Comprehensive Reference**: `docs/BMAD-V6-ALPHA-REFERENCE.md`
- **Current v4 Implementation**: `docs/BMAD-METHOD-IMPLEMENTATION.md`
- **v6-alpha Source**: `_vendor/BMAD-METHOD/` (with full docs)

### Community:
- **Discord**: https://discord.gg/gk8jAdXWmj (BMAD community support)
- **YouTube**: https://www.youtube.com/@BMadCode (tutorials and demos)
- **GitHub Issues**: https://github.com/bmad-code-org/BMAD-METHOD/issues

### Internal:
- **Team Discussion**: Schedule meeting to review this guide
- **Pilot Program**: Try v6 on small feature first
- **Feedback Loop**: Document lessons learned

---

## Conclusion

**BMAD v6-alpha is impressive**, but migration should be strategic, not rushed.

**For this project**: v4 conventions are working excellently. Consider v6 migration:
- After Sprint 5+ (stable period)
- When building custom M&A agents
- For next major project phase

**Your current workflow** has delivered production-ready software. Don't fix what isn't broken, but be aware of what's possible when the time is right.

---

**Document Version**: 1.0
**Last Updated**: October 28, 2025
**Review Schedule**: Sprint 5 Planning (Q4 2025)
**Maintained By**: Development Team



