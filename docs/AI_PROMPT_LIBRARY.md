# M&A Intelligence Platform: AI Prompt Library

**Document Purpose**: This file contains a comprehensive library of prompts for AI coding assistants (CODEX, Claude Code) to build the M&A Intelligence Platform following BMAD methodology and TDD principles.

**Last Updated**: October 23, 2025

---

## Instructions for Use

1. **Always run prompts from the project root**: `C:\Projects\ma-saas-platform`
2. **Use the correct AI for the task**: CODEX for general implementation, Claude Code for complex logic and debugging.
3. **Reference context files**: Always include `-c CLAUDE.md` or similar to provide context.
4. **Follow TDD**: Prompts are structured to write tests first.

---

## Phase 1: Foundational Core & Revenue Engine (Months 1-3)

### F-001: User & Organization Management

#### 1.1: Clerk Authentication Setup (Frontend)

```bash
# CODEX Prompt
codex -d "Set up Clerk authentication in the React frontend. Create environment variables for Clerk keys in .env.example. Wrap the main App component with the ClerkProvider. Create a basic layout with a header that shows user information and a sign-in/sign-out button. Create protected routes for the dashboard and public routes for the landing page using React Router. Follow TDD principles: write tests for protected route access first. Reference CLAUDE.md for context."
```

#### 1.2: User Model & Service (Backend)

```bash
# Claude Code Prompt
claude-code -d "Create the User model in backend/app/models/user.py with fields for id, email, first_name, last_name, organization_id, and role. Create a corresponding Pydantic schema in backend/app/schemas/user.py. Implement a user service in backend/app/services/user_service.py with functions to create, get, update, and delete users. Handle Clerk webhooks for user creation and updates. Implement a /api/users/me endpoint to get the current user. Follow TDD: write comprehensive pytest tests for the user service and API endpoint first. Reference CLAUDE.md for database schema and API design principles."
```

#### 1.3: Organization Model & Service (Backend)

```bash
# CODEX Prompt
codex -d "Create the Organization model and service in the backend. The model should include id, name, and owner_id. The service should allow creating an organization, getting an organization by ID, and adding users to an organization. Implement API endpoints for these operations. Follow TDD. Reference CLAUDE.md for context."
```

#### 1.4: Master Admin Portal (Frontend)

```bash
# Claude Code Prompt
claude-code -d "Build the Master Admin Portal in the frontend. Create a new page at /admin. This page should be protected and only accessible to users with the 'admin' role. The portal should have tables to display all users and all organizations. Implement functionality to view user details, change user roles, and view organization details. Use React Query to fetch data from the backend. Follow TDD. Reference CLAUDE.md for context."
```

---

### F-002: Deal Flow & Pipeline Management

#### 2.1: Deal Model & Service (Backend)

```bash
# CODEX Prompt
codex -d "Create the Deal model and service in the backend. The model should include id, name, stage, organization_id, and custom fields (JSONB). The service should support full CRUD operations. Implement API endpoints for deals. Follow TDD. Reference CLAUDE.md for multi-tenancy and API design."
```

#### 2.2: Kanban Board Component (Frontend)

```bash
# Claude Code Prompt
claude-code -d "Build the Deal Pipeline Kanban board component in the frontend. Use react-beautiful-dnd for drag-and-drop functionality. Fetch deals from the backend and display them as cards in columns representing pipeline stages. Implement functionality to update a deal's stage when it's moved to a new column. Follow TDD. Reference CLAUDE.md for UI/UX guidelines."
```

---

### F-005: Subscription & Billing System

#### 3.1: Stripe Integration (Backend)

```bash
# Claude Code Prompt
claude-code -d "Integrate Stripe for subscription billing in the backend. Create a billing service that can create Stripe Checkout sessions for the four subscription tiers. Implement a webhook handler at /api/webhooks/stripe to listen for payment success, failure, and cancellation events. Update the user's subscription status in the database based on webhook events. Follow TDD: write tests to mock Stripe API calls and webhook events. Reference CLAUDE.md for Stripe keys and product IDs."
```

#### 3.2: Pricing Page (Frontend)

```bash
# CODEX Prompt
codex -d "Create the Pricing Page at /pricing in the frontend. Display the four subscription tiers with their features and pricing. Each tier should have a 'Subscribe' button that calls the backend to create a Stripe Checkout session and redirects the user to Stripe. Follow TDD. Reference CLAUDE.md for tier details."
```

---

### F-006: Financial Intelligence Engine

#### 4.1: Accounting Integrations (Backend)

```bash
# Claude Code Prompt
claude-code -d "Implement OAuth 2.0 integration for Xero and QuickBooks in the backend. Create API endpoints to initiate the OAuth flow and handle the callback. Securely store access and refresh tokens. Create a service to fetch financial statements (Profit & Loss, Balance Sheet) from the connected accounting platforms. Follow TDD. Reference CLAUDE.md for API credentials and redirect URIs."
```

#### 4.2: Financial Ratio Calculation (Backend)

```bash
# CODEX Prompt
codex -d "Create a financial analysis service in the backend that takes financial statements as input and calculates all 47 financial ratios listed in the PRD. Organize the ratios into categories (liquidity, profitability, etc.). Follow TDD: write comprehensive tests for each ratio calculation with sample data. Reference CLAUDE.md for the list of ratios."
```

#### 4.3: AI Narrative Generation (Backend)

```bash
# Claude Code Prompt
claude-code -d "Implement the AI narrative generation feature. Create a service that takes the calculated financial ratios, sends them to OpenAI's GPT-4 API with a structured prompt, and returns a concise narrative summary of the company's financial health. Follow TDD. Reference CLAUDE.md for the prompt structure and API integration guidelines."
```

---

## Phase 2: Advanced Intelligence & Collaboration (Months 4-6)

### F-004: Task Management & Workflow Automation

```bash
# CODEX Prompt
codex -d "Implement task management features. Create Task model and service in the backend. Users should be able to create, assign, and track tasks related to a deal. Implement workflow automation using Celery to trigger tasks based on deal stage changes. Follow TDD."
```

### F-008: Intelligent Deal Matching

```bash
# Claude Code Prompt
claude-code -d "Build the intelligent deal matching engine. Create services to create sell-side and buy-side mandates. Use pgvector to store embeddings of mandate profiles. Implement a matching service that uses Anthropic's Claude 3 API to analyze mandates, generate embeddings, and find the best matches with confidence scores and rationale. Follow TDD."
```

---

## Phase 3: Ecosystem & Network Effects (Months 7-12)

### F-011: Podcast & Video Production Studio

```bash
# CODEX Prompt
codex -d "Create the Podcast Studio feature. Implement audio recording in the frontend. Use Whisper API for transcription in the backend. Create a service to generate RSS feeds for podcast distribution. Follow TDD."
```

### F-012: Event Management Hub

```bash
# Claude Code Prompt
claude-code -d "Build the Event Management Hub. Create models and services for events and tickets. Integrate Stripe for ticket payments. Implement functionality to create event pages, manage registrations, and communicate with attendees. Follow TDD."
```

---

## TDD & Refactoring Prompts

### Writing Tests First

```bash
# CODEX Prompt
codex -d "Write a comprehensive pytest test suite for the Deal service in backend/app/services/deal_service.py. Cover all CRUD operations, including edge cases and error handling. Ensure 100% test coverage for this service."
```

### Refactoring Existing Code

```bash
# Claude Code Prompt
claude-code -d "Refactor the DealPipeline component in frontend/src/components/DealPipeline.tsx. It currently has performance issues with large datasets. Implement virtual scrolling using react-window and optimize state management to improve performance. Ensure all existing tests continue to pass after refactoring."
```

### Debugging

```bash
# Claude Code Prompt
claude-code -d "The test 'test_create_deal_with_invalid_stage' in tests/api/test_deals.py is failing with a 500 Internal Server Error instead of a 422 Unprocessable Entity. Analyze the code in app/api/deals.py and app/services/deal_service.py to identify the cause of the error and provide a fix that makes the test pass."
```

---

This prompt library provides a starting point for building the M&A Intelligence Platform. Each prompt should be executed from the project root, and the AI assistant should always be instructed to follow TDD principles and reference the `CLAUDE.md` context file.

