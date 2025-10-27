# BMAD v6-Alpha Reference Guide

**Document Purpose**: Reference guide for the official BMAD-METHOD v6-alpha framework - available for optional adoption.

**Last Updated**: October 27, 2025
**Current Project Status**: BMAD-Inspired manual workflow (NOT using official framework)
**This Document**: Reference for official BMAD-METHOD v6-alpha framework

---

## ⚠️ Critical Clarification

**This project does NOT currently use the official BMAD-METHOD framework (v4 OR v6-alpha).**

### What We Actually Do:
- ✅ Follow BMAD **principles** manually (Business-first, Architecture, Iterative, TDD)
- ✅ Use BMAD **structure** (`docs/bmad/` directory, PRD, stories)
- ✅ Inspired by BMAD **methodology**

### What We DON'T Do:
- ❌ Use official BMAD-METHOD CLI/tooling
- ❌ Run `npx bmad-method install`
- ❌ Use BMAD agent commands (`*prd`, `*create-story`, etc.)

**This document** describes the official BMAD-METHOD v6-alpha framework, which you can **optionally adopt** if you want automated agents and workflows.

**v6-alpha is available in**: `_vendor/BMAD-METHOD/` (for reference/installation if desired)

---

## What is BMAD v6-Alpha?

BMAD v6-alpha is a **complete ground-up rewrite** of the BMAD-METHOD framework, introducing:

### Core Innovations

1. **C.O.R.E. Philosophy**: Collaboration Optimized Reflection Engine
   - Human amplification, not replacement
   - Guided collaboration with AI agents
   - Reflective workflows that unlock insights
   - Domain mastery over simple answers

2. **Modular Architecture**: Specialized modules for different domains
   - **BMM** (BMad Method Module) - Software development
   - **BMB** (BMad Builder) - Create custom agents
   - **CIS** (Creative Intelligence Suite) - Innovation toolkit

3. **Scale-Adaptive Workflow Engine™**: Automatically adjusts from simple tasks to enterprise projects

4. **Update-Safe Customization**: Agent sidecars in `bmad/_cfg/agents/`

---

## Key Differences: v4 vs v6-Alpha

### Installation & Structure

**v4 (Current)**:
```
M-S-SaaS-apex-deliver/
├── _vendor/BMAD-METHOD/          # Vendor copy
├── docs/bmad/                     # Project docs
│   ├── prd.md
│   ├── stories/
│   └── *.md
└── CLAUDE.md                      # AI context
```

**v6-alpha**:
```
M-S-SaaS-apex-deliver/
├── bmad/                          # Unified installation
│   ├── _cfg/agents/               # Customization sidecars
│   ├── bmm/                       # Software dev module
│   ├── bmb/                       # Builder module
│   ├── core/                      # Core framework
│   └── docs/                      # Generated docs
├── _vendor/BMAD-METHOD/           # Source (reference)
└── CLAUDE.md
```

### Workflow Methodology

**v4 (Current)**:
```
PO creates PRD
  ↓
SM shards into stories
  ↓
DEV implements with TDD
  ↓
QA validates
  ↓
Deploy
```

**v6-alpha**:
```
Phase 1: ANALYSIS (Optional)
├── Brainstorm project
├── Research
└── Product brief

Phase 2: PLANNING (Required)
├── Scale-adaptive PRD (Levels 0-4)
└── Automatic complexity routing

Phase 3: SOLUTIONING (Level 3-4 only)
├── Architecture design
└── Epic-specific tech specs (Just-In-Time)

Phase 4: IMPLEMENTATION (Iterative)
├── Story State Machine: BACKLOG → TODO → IN PROGRESS → DONE
├── SM drafts story
├── SM approves for dev
├── DEV implements
├── DEV/SR reviews
└── Retrospective
```

### Scale Levels (v6-Alpha Feature)

| Level | Stories | Scope | Documentation |
|-------|---------|-------|---------------|
| **0** | 1 | Atomic change | Minimal |
| **1** | 1-10 | Small feature | Brief PRD |
| **2** | 5-15 | Medium feature | Focused PRD |
| **3** | 12-40 | Large feature | Full PRD + Architecture |
| **4** | 40+ | Enterprise project | Comprehensive docs |

**Current Project**: Level 3-4 (comprehensive PRD + architecture already created in v4)

### Agent Roles

**v4 (Current)**:
- PO (Product Owner)
- SM (Story Manager)
- Analyst
- Architect
- DEV (Developer)
- QA

**v6-alpha (Enhanced)**:
- PM (Product Manager) - Replaces PO
- Analyst
- Architect
- SM (Scrum Master) - Enhanced story management
- DEV (Developer)
- TEA (Test Architect) - New comprehensive testing role
- UX (User Experience) - New design role
- SR (Senior Reviewer) - New code review role

### Story Management

**v4 (Current)**:
- Stories in `docs/bmad/stories/`
- Manual status tracking
- Completion summaries

**v6-alpha**:
- Stories in `bmad/docs/stories/`
- State machine: `bmad/docs/status.md`
- Automated status tracking
- Built-in templates and validation

---

## v6-Alpha Module Deep Dive

### BMM (BMad Method Module)

**Purpose**: Complete software development lifecycle management

**Key Workflows**:

1. **Analysis Phase** (Optional)
   - `*brainstorm-project` - Ideation
   - `*research` - Market/technical research
   - `*product-brief` - Strategy document

2. **Planning Phase** (Required)
   - `*prd` - Scale-adaptive project planning
   - Automatically routes to Level 0-4 documentation

3. **Solutioning Phase** (Level 3-4)
   - `*3-solutioning` - Architecture design
   - `*tech-spec` - Epic-specific specifications

4. **Implementation Phase** (Iterative)
   - `*create-story` - SM drafts story
   - `*story-ready` - SM approves for development
   - `*story-context` - Expertise injection
   - `*dev-story` - DEV implements
   - `*story-done` - Mark complete
   - `*review-story` - Quality validation
   - `*correct-course` - Issue resolution
   - `*retrospective` - Continuous improvement

**Example v6 Workflow**:
```bash
# Load PM agent
@pm

# Start planning phase
*prd

# PM guides you through scale-adaptive planning
# System determines project is Level 3
# Full PRD + Architecture created

# Transition to implementation
# Stories added to BACKLOG in status.md

# SM drafts first story
*create-story

# SM reviews and approves
*story-ready

# DEV implements
*dev-story

# Mark complete
*story-done
```

### BMB (BMad Builder Module)

**Purpose**: Create custom agents, workflows, and modules

**Agent Types**:
1. **Full Module Agents**: Complete functionality with all features
2. **Hybrid Agents**: Mix of module and standalone capabilities
3. **Lightweight Standalone**: Simple, focused agents

**Use Cases**:
- Create domain-specific agents (M&A, finance, legal)
- Customize existing agents with sidecars
- Build organization-specific workflows

**Example**: Creating a Financial Analysis Agent
```bash
@bmb

*create-agent

# BMB guides you through:
# 1. Agent purpose and domain
# 2. Communication style
# 3. Workflow integration
# 4. Command definitions
# 5. Template generation
```

### CIS (Creative Intelligence Suite)

**Purpose**: Unlock creative thinking and innovation

**Features**:
- Brainstorming workflows (used by other modules)
- Problem-solving frameworks
- Innovation facilitation
- Creative writing support

**Use Cases**:
- Product ideation
- Technical problem-solving
- Marketing content creation
- Strategic planning

---

## Migration Path to v6-Alpha

### When to Consider Migration

**Good Times**:
- ✅ Between major project phases
- ✅ Starting a new project
- ✅ Need scale-adaptive workflows
- ✅ Want advanced agent customization
- ✅ Building custom agents/workflows

**Bad Times**:
- ❌ Mid-sprint during active development
- ❌ Right before production deployment
- ❌ Current v4 setup working perfectly
- ❌ Team not trained on v6 concepts

### Migration Steps (When Ready)

#### Phase 1: Preparation (1-2 hours)
1. **Backup current project**
   ```bash
   git checkout -b bmad-v4-backup
   git push origin bmad-v4-backup
   ```

2. **Study v6 documentation**
   - Read `_vendor/BMAD-METHOD/README.md`
   - Review `_vendor/BMAD-METHOD/src/modules/bmm/README.md`
   - Watch BMadCode YouTube tutorials

3. **Plan migration approach**
   - Identify which module you need (BMM for software dev)
   - Decide on customization needs
   - Create migration checklist

#### Phase 2: Installation (30 minutes)
```bash
cd /path/to/your/project

# Install v6-alpha
cd _vendor/BMAD-METHOD
npm install
npm run install:bmad

# Follow interactive prompts:
# - Full path to project
# - Your name (how agents address you)
# - Communication language
# - Technical level (beginner/advanced)
# - Documentation language
# - Module selection (BMM for software dev)
```

This creates:
```
your-project/
├── bmad/
│   ├── _cfg/               # Your customizations
│   ├── bmm/                # BMM module
│   ├── core/               # Core framework
│   └── docs/               # Will be generated
```

#### Phase 3: Content Migration (2-4 hours)

1. **Migrate PRD**
   ```bash
   # Old: docs/bmad/prd.md
   # New: bmad/docs/prd.md

   # Copy and update to v6 format:
   # - Add scale level indicator
   # - Update section structure
   # - Add state machine reference
   ```

2. **Migrate Stories**
   ```bash
   # Old: docs/bmad/stories/DEV-*.md
   # New: bmad/docs/stories/DEV-*.md

   # Create status.md:
   bmad/docs/status.md
   ---
   ## BACKLOG
   - [ ] DEV-012-next-feature
   - [ ] DEV-013-another-feature

   ## TODO
   - [ ] DEV-011-current-focus

   ## IN PROGRESS
   - [x] DEV-010-in-progress

   ## DONE
   - [x] DEV-001-completed
   - [x] DEV-002-completed
   ```

3. **Update CLAUDE.md**
   - Change methodology line to "BMAD v6-alpha (BMM Module)"
   - Update commands section
   - Add v6 workflow references

#### Phase 4: Team Training (1-2 hours)
1. **Introduce new workflows** to team
2. **Practice with** non-critical stories
3. **Document** team-specific conventions
4. **Customize agents** via sidecars if needed

#### Phase 5: Gradual Rollout
1. **Start with** next story using v6 workflow
2. **Validate** process works smoothly
3. **Iterate** and improve
4. **Fully adopt** once comfortable

---

## Agent Customization (v6-Alpha)

### Using Sidecar Files

**Location**: `bmad/_cfg/agents/`

**Example**: Customize DEV agent to use Python best practices

Create `bmad/_cfg/agents/dev-sidecar.md`:

```markdown
# DEV Agent Customization - M&A SaaS Platform

## Additional Context

This project uses:
- Python 3.11+ with FastAPI
- React 18+ with TypeScript
- Test-Driven Development (TDD) with 85% coverage minimum

## Code Style Requirements

### Python
- Use type hints for all functions
- Follow PEP 8 and Black formatting
- Pydantic v2 for validation
- Async/await for I/O operations

### TypeScript
- Strict mode enabled
- React functional components with hooks
- Explicit return types
- Test files: *.test.tsx

## Testing Requirements

**Python**:
```python
# Always write tests first
@pytest.mark.asyncio
async def test_feature(client: AsyncClient):
    response = await client.post("/api/endpoint")
    assert response.status_code == 201
```

**TypeScript**:
```typescript
describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Communication Preferences

- Address user as "you" (not name)
- Technical level: Advanced
- Explain trade-offs when making decisions
- Reference file paths: `file.py:123`
```

This sidecar is automatically loaded by the DEV agent on every invocation!

### Customization Options

**What you can customize**:
- ✅ Communication style and tone
- ✅ Technical level of explanations
- ✅ Language (English, Spanish, etc.)
- ✅ Domain-specific knowledge
- ✅ Code style preferences
- ✅ Testing requirements
- ✅ Workflow variations

**What persists through updates**:
- ✅ Sidecar files
- ✅ Project configuration
- ✅ Status tracking
- ✅ Generated documentation

---

## v6-Alpha Advantages Over v4

### For This Project (M&A SaaS)

**Current v4 Approach** ✅:
- Works great for established workflow
- Comprehensive PRD already created
- Stories well-organized
- Team familiar with process

**v6-Alpha Would Add** 🎯:
1. **Scale Adaptation**: Future features automatically routed to appropriate docs
2. **Agent Customization**: M&A-specific terminology and patterns
3. **Story State Machine**: Automated tracking in status.md
4. **Just-In-Time Design**: Tech specs per epic (vs upfront)
5. **Enhanced Testing**: TEA agent for comprehensive test strategy
6. **Modularity**: Add BMB for custom M&A agents

### When v6-Alpha Shines

**Scenarios where v6-alpha is superior**:
- ✨ **Multiple project types**: Varying complexity levels
- ✨ **Large teams**: Need standardized workflows
- ✨ **Custom domains**: Building M&A-specific agents
- ✨ **Frequent context switching**: Scale-adaptive routing
- ✨ **Long-term projects**: Update-safe customizations

---

## Current Recommendation

**For M&A SaaS Platform** (as of October 2025):

### Stay with v4 Conventions ✅

**Reasons**:
1. **Production deployment complete** - v4 got you there successfully
2. **Team velocity high** - 4 sprints completed efficiently
3. **Documentation comprehensive** - PRD and architecture already Level 3-4 quality
4. **Learning curve** - v6 requires training, could slow momentum
5. **No blocking issues** - Current workflow works

### When to Revisit v6-Alpha 🔄

**Consider migration when**:
- Starting Sprint 5+ (after stabilization period)
- Need custom M&A financial analysis agents
- Want to build reusable templates for deal types
- Team requests advanced agent customization
- Project expanding to multiple products

### Best of Both Worlds 🎯

**Current hybrid approach**:
- ✅ Use v4 conventions that work
- ✅ Reference v6-alpha documentation (`_vendor/BMAD-METHOD/`)
- ✅ Adopt v6 concepts gradually (scale levels, state machine)
- ✅ Keep options open for future migration
- ✅ Learn from v6-alpha best practices

---

## Resources

### Official v6-Alpha Documentation

**In** `_vendor/BMAD-METHOD/`:
- `README.md` - Overview and quick start
- `src/modules/bmm/README.md` - BMM module documentation
- `src/modules/bmm/workflows/README.md` - Complete workflow guide
- `src/modules/bmb/README.md` - Agent creation guide
- `src/modules/cis/readme.md` - Creative intelligence toolkit

### External Resources

- **GitHub**: https://github.com/bmad-code-org/BMAD-METHOD/tree/v6-alpha
- **YouTube**: https://www.youtube.com/@BMadCode (tutorials)
- **Discord**: https://discord.gg/gk8jAdXWmj (community support)

### Internal Documentation

- `docs/BMAD-METHOD-IMPLEMENTATION.md` - Current v4 usage
- `docs/bmad/prd.md` - Product Requirements Document
- `docs/bmad/technical_specifications.md` - Architecture
- `docs/bmad/stories/` - User stories
- `CLAUDE.md` - AI assistant context

---

## Conclusion

**v6-alpha is impressive**, but your **v4-based workflow is proven and production-ready**. This reference guide ensures you understand the latest BMAD developments while maintaining momentum on your successful project.

**When the time is right** for migration, you'll have:
- ✅ This comprehensive guide
- ✅ v6-alpha source in `_vendor/`
- ✅ Clear migration path
- ✅ Team familiarity with core BMAD concepts

**For now**: Keep building great software with the methodology that got you to production! 🚀

---

**Last Updated**: October 27, 2025
**Next Review**: Sprint 5 planning (Q4 2025)
**Maintained By**: Development Team
