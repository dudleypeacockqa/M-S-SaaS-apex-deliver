<!-- markdownlint-disable MD013 MD031 MD032 MD036 MD040 -->
# M&A Intelligence Platform: Quick Start Guide

**Welcome!** This guide will help you get the project set up on your local machine (`C:\Projects\ma-saas-platform`) and start building with AI assistance.

---

## Step 1: Extract and Set Up the Project

### 1.1 Extract the ZIP File

1. Download `ma-saas-platform-v2-foundation.zip`
2. Extract to `C:\Projects\ma-saas-platform`
3. Open the folder in Visual Studio Code or Cursor IDE

### 1.2 Verify Project Structure

You should see:

```
C:\\Projects\\ma-saas-platform\\
├── backend          # FastAPI services, tests, Alembic migrations
├── frontend         # React + Vite app (src/, public/, dist/)
├── docs             # BMAD artefacts and guides
├── scripts          # Operational scripts
├── node_modules     # Committed Node workspace (local use only)
├── backend\\venv     # Committed Python virtualenv (refresh via pip install)
├── ma-saas-platform-v2 # Legacy snapshot, do not modify
└── *.md             # Onboarding and status documentation
```

Note: `ma-saas-platform-v2/` is an archived snapshot; leave it untouched and work from the root directories above.
> ⚠️  Refresh the backend environment: run `python -m venv .venv` (or reuse `backend/venv`) and `pip install -r backend/requirements.txt` so modules like `openai` are available before executing tests.


---

## Step 2: Install BMAD Method

### 2.1 Install BMAD CLI

Open a terminal in the project root and run:

```bash
npx bmad-method install
```

### 2.2 Select IDE

When prompted, select **Cursor** as your IDE.

### 2.3 Verify Installation

You should now have a `.bmad-core/` directory with agent configurations.

---

## Step 3: Set Up Environment Variables

### 3.1 Create .env Files

```bash
# Copy the template
cp .env.example .env

# For frontend
cd frontend
cp ../.env.example .env.local
```

### 3.2 Fill in Required Values

Edit `.env` and `.env.local` with your actual API keys:

**Required for initial setup**:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `VITE_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard
- `VITE_STRIPE_PUBLISHABLE_KEY` - From Stripe dashboard
- `STRIPE_SECRET_KEY` - From Stripe dashboard

**Optional (can be added later)**:

- OpenAI, Anthropic API keys
- Accounting platform credentials
- GoHighLevel API keys

---

## Step 4: Initialize Git and Push to GitHub

### 4.1 Create GitHub Repository

1. Go to <https://github.com/new>
2. Repository name: `ma-saas-platform`
3. Description: "M&A Intelligence Platform - Full Production"
4. **Private** repository
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### 4.2 Connect Local Repo to GitHub

```bash
# Add remote
git remote add origin https://github.com/dudleypeacockqa/ma-saas-platform.git

# Push to GitHub
git push -u origin master
```

---

## Step 5: Set Up Render Deployment

### 5.1 Create Render Account

1. Go to <https://render.com>
2. Sign up or log in
3. Connect your GitHub account

### 5.2 Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `ma-saas-db`
3. Region: Choose closest to your users
4. Plan: Free (for development) or Starter (for production)
5. Click "Create Database"
6. Copy the **Internal Database URL** to your `.env` file

### 5.3 Create Redis Instance

1. Click "New +" → "Redis"
2. Name: `ma-saas-redis`
3. Region: Same as database
4. Plan: Free (for development)
5. Click "Create Redis"
6. Copy the **Internal Redis URL** to your `.env` file

### 5.4 Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Name: `ma-saas-backend`
4. Environment: Python 3
5. Build Command: `cd backend && pip install -r requirements.txt`
6. Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables from your `.env` file
8. Click "Create Web Service"

### 5.5 Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Name: `ma-saas-frontend`
4. Build Command: `cd frontend && npm install && npm run build`
5. Publish Directory: `frontend/dist`
6. Add environment variables from your `.env.local` file
7. Click "Create Static Site"

---

## Step 6: Start Development with AI

### 6.1 Open in Cursor IDE

1. Open Cursor IDE
2. File → Open Folder → `C:\Projects\ma-saas-platform`
3. Verify CODEX and Claude Code CLIs are installed

### 6.2 Run Your First AI Prompt

Open the integrated terminal in Cursor and run:

```bash
codex -d "Set up Clerk authentication in the React frontend. Create environment variables for Clerk keys in .env.example. Wrap the main App component with the ClerkProvider. Create a basic layout with a header that shows user information and a sign-in/sign-out button. Create protected routes for the dashboard and public routes for the landing page using React Router. Follow TDD principles: write tests for protected route access first. Reference CLAUDE.md for context."
```

This will:

- Set up Clerk authentication
- Create protected routes
- Write tests first (TDD)
- Generate all necessary code

### 6.3 Review and Commit

After CODEX completes:

1. Review the generated code
2. Run tests: `cd frontend && npm test`
3. If tests pass, commit:

   ```bash
   git add .
   git commit -m "feat(auth): implement Clerk authentication with protected routes"
   git push
   ```

---

## Step 7: Follow the Development Roadmap

### 7.1 Use the AI Prompt Library

Open `docs/AI_PROMPT_LIBRARY.md` for a comprehensive list of prompts to build each feature.

### 7.2 Follow Phase 1 Priorities

**High Priority** (Months 1-3):

1. User & Organization Management (F-001)
2. Deal Flow & Pipeline Management (F-002)
3. Subscription & Billing (F-005)
4. Financial Intelligence Engine (F-006)
5. Multi-Method Valuation Suite (F-007)

### 7.3 Use BMAD Workflow

```bash
# 1. Create a story
*sm draft next

# 2. Implement with AI
codex -d "Implement [feature] following the story in docs/bmad/stories/[story-name].md"

# 3. Test
npm test  # or pytest for backend

# 4. Commit
git add .
git commit -m "feat([scope]): [description]"
git push
```

---

## Step 8: Monitor Progress

### 8.1 Use GitHub Projects

1. Create a GitHub Project board
2. Add columns: Backlog, In Progress, Testing, Done
3. Track features as issues

### 8.2 Use Render Dashboard

1. Monitor deployment status
2. View logs for debugging
3. Check resource usage

---

## Troubleshooting

### Issue: CODEX or Claude Code not found

**Solution**: Ensure the CLIs are installed in Cursor. Go to Settings → Extensions → Search for "CODEX" and "Claude Code".

### Issue: Database connection error

**Solution**: Verify `DATABASE_URL` in `.env` is correct. Ensure Render PostgreSQL is running.

### Issue: Tests failing

**Solution**: Read the error message carefully. Use Claude Code to debug:

```bash
claude-code -d "The test [test-name] is failing with error [error-message]. Analyze and fix."
```

---

## Next Steps

1. **Complete Phase 1 features** using the AI Prompt Library
2. **Deploy to production** after each feature is complete and tested
3. **Gather user feedback** and iterate
4. **Move to Phase 2** once revenue engine is operational

---

**You're ready to build!** Start with the first prompt in the AI Prompt Library and let the AI assistants do the heavy lifting. Your role is to guide, review, and ensure quality.

**Happy coding! 🚀**
