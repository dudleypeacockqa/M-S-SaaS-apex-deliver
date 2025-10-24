# CODEX Prompt: BMAD Knowledge Base Integration

Use this prompt in Cursor to set up your BMAD knowledge base documentation system and integrate all reference files.

---

## Full CODEX Prompt

```
I need to integrate BMAD methodology knowledge base files into my M&A SaaS Platform project and set up proper documentation indexing.

PROJECT CONTEXT:
- Project: M&A Intelligence Platform (full production, not MVP)
- Methodology: BMAD v6-alpha
- IDE: Cursor with CODEX CLI
- Repository: C:\Projects\ma-saas-platform
- Documentation location: docs/bmad/knowledge-base/

EXISTING KNOWLEDGE BASE FILES:
1. docs/bmad/knowledge-base/knowledge-base-index.md
2. docs/bmad/knowledge-base/financial-models-reference.md
3. docs/bmad/knowledge-base/ma-toolkit-reference.md
4. docs/bmad/knowledge-base/pmi-toolkit-reference.md

PENDING TASK:
- Extract text from: "48 - Eric Andrews Modelling Spreadsheets/Marketing Budget Explainer.pdf"
- Append insights to financial-models-reference.md

OBJECTIVES:
1. Create a central docs/index.md that surfaces all documentation including the BMAD knowledge base
2. Update .bmad-core/core-config.yaml to include these files in devLoadAlwaysFiles for automatic context loading
3. Extract and integrate the Marketing Budget Explainer PDF content into the financial models reference
4. Set up proper cross-referencing between all knowledge base documents
5. Create a documentation navigation structure that makes all references easily discoverable

REQUIREMENTS:
1. Follow BMAD v6-alpha methodology standards
2. Ensure all documentation is cross-referenced and searchable
3. Set up automatic context loading so AI assistants always have access to these references
4. Create a clear hierarchy: index.md → knowledge-base-index.md → specific references
5. Include metadata in each document (last updated, version, related documents)
6. Add proper Markdown formatting with tables of contents
7. Ensure the documentation structure scales as we add more knowledge base files

DELIVERABLES:
1. docs/index.md - Central documentation index
2. Updated .bmad-core/core-config.yaml with devLoadAlwaysFiles configuration
3. Updated docs/bmad/knowledge-base/financial-models-reference.md with Marketing Budget Explainer content
4. Navigation improvements to all knowledge base files
5. A README explaining the documentation structure and how to add new knowledge base files

ADDITIONAL CONTEXT:
- This is a full production system with all features (not MVP)
- We're using Test-Driven Development (TDD)
- We have CLAUDE.md as our main AI context file
- We want AI assistants to automatically load relevant knowledge base files when working on related features

Please provide:
1. Complete file contents for docs/index.md
2. Complete .bmad-core/core-config.yaml configuration
3. Instructions for extracting PDF content and integrating it
4. A documentation structure diagram
5. Best practices for maintaining this knowledge base as the project grows

Reference CLAUDE.md for coding standards and project context.
```

---

## What CODEX Will Generate

### 1. Central Documentation Index (`docs/index.md`)

A comprehensive index that links to:
- Project README
- Quick Start Guide
- BMAD knowledge base
- API documentation
- Deployment guides
- Security documentation
- All other docs

### 2. BMAD Core Configuration (`.bmad-core/core-config.yaml`)

Updated configuration with:
```yaml
devLoadAlwaysFiles:
  - docs/CLAUDE.md
  - docs/bmad/knowledge-base/knowledge-base-index.md
  - docs/bmad/knowledge-base/financial-models-reference.md
  - docs/bmad/knowledge-base/ma-toolkit-reference.md
  - docs/bmad/knowledge-base/pmi-toolkit-reference.md
  - docs/FULL_PRODUCTION_PRD.md
  - docs/COMPLETE_PRODUCT_PROMPT_TEMPLATE.md
```

### 3. PDF Extraction Instructions

Step-by-step guide to:
- Extract text from the Marketing Budget Explainer PDF
- Structure the content appropriately
- Integrate it into financial-models-reference.md
- Maintain proper formatting and references

### 4. Documentation Structure Diagram

Visual representation of how all docs connect:
```
docs/
├── index.md (CENTRAL HUB)
├── CLAUDE.md
├── bmad/
│   ├── knowledge-base/
│   │   ├── knowledge-base-index.md
│   │   ├── financial-models-reference.md
│   │   ├── ma-toolkit-reference.md
│   │   └── pmi-toolkit-reference.md
│   ├── prd.md
│   └── technical_specifications.md
├── AI_PROMPT_LIBRARY.md
├── RENDER_DEPLOYMENT_GUIDE.md
└── ... (other guides)
```

### 5. Knowledge Base Maintenance Guide

Best practices for:
- Adding new reference documents
- Updating existing references
- Cross-referencing between documents
- Versioning knowledge base content
- Keeping AI context files synchronized

---

## Alternative: Quick Manual Setup

If you want to do this manually without CODEX, here's a quick version:

### Step 1: Create `docs/index.md`

```markdown
# M&A Intelligence Platform - Documentation Index

## Quick Start
- [README](../README.md)
- [Quick Start Guide](QUICK_START_GUIDE.md)
- [Initial Build Plan](INITIAL_BUILD_PLAN.md)

## BMAD Knowledge Base
- [Knowledge Base Index](bmad/knowledge-base/knowledge-base-index.md)
- [Financial Models Reference](bmad/knowledge-base/financial-models-reference.md)
- [M&A Toolkit Reference](bmad/knowledge-base/ma-toolkit-reference.md)
- [PMI Toolkit Reference](bmad/knowledge-base/pmi-toolkit-reference.md)

## Product & Architecture
- [Full Production PRD](FULL_PRODUCTION_PRD.md)
- [Product Prompt Template](COMPLETE_PRODUCT_PROMPT_TEMPLATE.md)
- [Technical Specifications](bmad/technical_specifications.md)

## Development
- [AI Prompt Library](AI_PROMPT_LIBRARY.md)
- [BMAD Workflow Guide](AI_WORKFLOW_QUICKSTART.md)
- [Business-First Implementation](BUSINESS_FIRST_IMPLEMENTATION_GUIDE.md)

## Deployment & Infrastructure
- [Render Deployment Guide](RENDER_DEPLOYMENT_GUIDE.md)
- [Existing Render Setup](EXISTING_RENDER_SETUP.md)
- [Database Security Guide](DATABASE_SECURITY_GUIDE.md)

## AI Context Files
- [CLAUDE.md](CLAUDE.md) - Main AI context
- [VIBE_CODING_CHEAT_SHEET.md](VIBE_CODING_CHEAT_SHEET.md)
```

### Step 2: Update `.bmad-core/core-config.yaml`

Add this section:

```yaml
devLoadAlwaysFiles:
  - docs/CLAUDE.md
  - docs/bmad/knowledge-base/knowledge-base-index.md
  - docs/bmad/knowledge-base/financial-models-reference.md
  - docs/bmad/knowledge-base/ma-toolkit-reference.md
  - docs/bmad/knowledge-base/pmi-toolkit-reference.md
  - docs/FULL_PRODUCTION_PRD.md
```

### Step 3: Extract PDF Content

For the Marketing Budget Explainer PDF:

1. **Option A - Manual**:
   - Open the PDF
   - Copy text content
   - Paste into a new section in `financial-models-reference.md`

2. **Option B - Automated** (using Python):
   ```python
   import PyPDF2
   
   with open('48 - Eric Andrews Modelling Spreadsheets/Marketing Budget Explainer.pdf', 'rb') as file:
       reader = PyPDF2.PdfReader(file)
       text = ""
       for page in reader.pages:
           text += page.extract_text()
   
   print(text)
   ```

3. **Option C - Use CODEX**:
   ```bash
   codex -d "Extract all text content from the PDF file at '48 - Eric Andrews Modelling Spreadsheets/Marketing Budget Explainer.pdf' and format it as a new section titled 'Marketing Budget Model' to be added to docs/bmad/knowledge-base/financial-models-reference.md. Include any formulas, assumptions, and key insights."
   ```

---

## My Recommendation

**Use the full CODEX prompt** because:

1. ✅ **Automated**: CODEX will generate all files correctly
2. ✅ **Comprehensive**: Covers all three next steps plus documentation structure
3. ✅ **Consistent**: Follows BMAD methodology standards
4. ✅ **Scalable**: Sets up a system that grows with your project
5. ✅ **Time-saving**: ~5 minutes vs. 30+ minutes manual work

**Time estimate**:
- CODEX prompt: 5-10 minutes (mostly automated)
- Manual setup: 30-45 minutes

---

## After Running the Prompt

Once CODEX completes, you'll have:

1. ✅ Central documentation hub (`docs/index.md`)
2. ✅ Automatic context loading configured
3. ✅ PDF content integrated
4. ✅ Cross-referenced knowledge base
5. ✅ Maintenance guide for future updates

Then you can:
- Run `*po index-docs` to update BMAD's documentation index
- Verify all files load automatically when starting a new story
- Use the knowledge base references in your development work

---

## Ready to Use?

Copy the full CODEX prompt above and run it in your Cursor terminal:

```bash
codex -d "<paste the full prompt here>"
```

Or let me know if you'd prefer the manual setup approach!

