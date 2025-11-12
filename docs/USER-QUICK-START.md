# User Quick Start Guide - M&A Intelligence Platform

**Purpose**: Get started with the M&A Intelligence Platform and discover all available features.

**Last Updated**: 2025-11-12
**Estimated Time**: 15 minutes

---

## Welcome to the M&A Intelligence Platform! 🚀

This guide will help you discover and use all the powerful features available in your platform.

---

## Important: Deal-Centric Architecture

**Key Concept**: Most advanced features (FP&A tools, valuations, document room) are accessed **through deals**.

```
Dashboard → Create Deal → Access Features
                    ↓
        ┌──────────────────────────┐
        │  Deal: "Acme Corp M&A"   │
        ├──────────────────────────┤
        │  → Valuation Suite       │ ← FP&A Tools here!
        │  → Financial Dashboard   │ ← Financial analysis here!
        │  → Document Room         │ ← Secure docs here!
        │  → Deal Details          │
        └──────────────────────────┘
```

**Why?** Each deal has its own valuation models, financial data, and document room for organization and security.

---

## Quick Start (5 minutes)

### Step 1: Create Your First Deal

1. **From Dashboard**: Click **"Create Deal"** button
2. **Or**: Navigate to **Deals** → **"New Deal"**

3. **Fill in Deal Details**:
   ```
   Deal Name: Acme Corp Acquisition
   Stage: Due Diligence
   Deal Size: £5,000,000
   Currency: GBP
   Target Company: Acme Corp
   ```

4. **Click "Create"**

### Step 2: Access FP&A Tools

Once your deal is created, you'll see a deal card. **Click on the deal** to open it.

**Now you can access**:

1. **Valuation Suite** (`/deals/[dealId]/valuation`)
   - DCF (Discounted Cash Flow) valuation
   - Comparables analysis
   - Precedent transactions
   - Sensitivity analysis
   - Export to Excel

2. **Financial Dashboard** (`/deals/[dealId]/financial`)
   - 47+ financial ratios
   - AI-generated narrative analysis (GPT-4)
   - Deal Readiness Score
   - Liquidity, profitability, efficiency metrics

3. **Document Room** (`/deals/[dealId]/documents`)
   - Secure file upload/download
   - Folder organization
   - Permission controls
   - Version history

4. **Deal Details** (`/deals/[dealId]`)
   - Deal overview
   - Stage progression
   - Team collaboration
   - Activity timeline

---

## Feature Overview by Menu

### 📊 Dashboard (`/dashboard`)

**What it shows**:
- Deal pipeline overview
- Active deals by stage
- Quick stats

**First-time users**: Dashboard will be empty until you create your first deal.

**Action**: Click **"Create Deal"** to get started.

---

### 🤝 Deals (`/deals`)

**What it shows**: Kanban board with all your deals organized by stage

**Available Stages**:
1. **Sourcing** - Initial deal identification
2. **Evaluation** - Preliminary analysis
3. **Due Diligence** - Deep investigation
4. **Negotiation** - Terms discussion
5. **Closing** - Final execution

**Actions**:
- ✅ Drag deals between stages
- ✅ Click deal to view details
- ✅ Filter by stage, size, or date
- ✅ Create new deal

---

### 💰 Valuation Suite (`/deals/[dealId]/valuation`)

**Access**: Click on any deal → **"Valuation"** tab

**Features**:

#### 1. DCF Valuation
- **Input**: Revenue projections, WACC, growth rates
- **Output**: Enterprise value, equity value, price per share
- **Export**: Excel spreadsheet with full model

#### 2. Comparables Analysis
- **Input**: Target company metrics
- **Compare**: Industry peers, public companies
- **Output**: Valuation multiples (P/E, EV/EBITDA, etc.)

#### 3. Precedent Transactions
- **Input**: Transaction criteria
- **Compare**: Similar M&A transactions
- **Output**: Transaction multiples and trends

#### 4. Sensitivity Analysis
- **Input**: Key assumptions (growth rate, margin, WACC)
- **Output**: Valuation ranges under different scenarios
- **Visual**: Tornado charts, scenario tables

**Export Options**:
- 📊 Excel (full model with formulas)
- 📄 PDF (presentation-ready)
- 📧 Email to team

---

### 📈 Financial Intelligence (`/deals/[dealId]/financial`)

**Access**: Click on any deal → **"Financial"** tab

**Features**:

#### 1. Financial Ratios (47+ metrics)

**Liquidity Ratios**:
- Current Ratio
- Quick Ratio
- Cash Ratio

**Profitability Ratios**:
- Gross Margin
- Operating Margin
- Net Margin
- ROE, ROA, ROIC

**Efficiency Ratios**:
- Asset Turnover
- Inventory Turnover
- Receivables Turnover

**Leverage Ratios**:
- Debt-to-Equity
- Interest Coverage
- Debt Service Coverage

#### 2. AI-Generated Narrative (GPT-4)

**What it does**: Analyzes all ratios and generates a 2-3 paragraph executive summary highlighting:
- Key strengths
- Potential weaknesses
- Deal readiness assessment
- Actionable insights

#### 3. Deal Readiness Score (0-100)

**Factors**:
- Financial health (40%)
- Growth potential (30%)
- Risk factors (30%)

**Thresholds**:
- 80-100: **Strong** - Highly attractive deal
- 60-79: **Moderate** - Acceptable with caveats
- 0-59: **Weak** - Requires improvement

#### 4. Integration with Accounting Platforms

**Supported Platforms**:
- ✅ Xero
- ✅ QuickBooks
- ✅ Sage
- ✅ NetSuite

**How it works**:
1. Connect your accounting platform
2. Auto-import financial statements
3. Ratios calculated automatically
4. Real-time updates

---

### 📁 Document Room (`/deals/[dealId]/documents`)

**Access**: Click on any deal → **"Documents"** tab

**Features**:

#### 1. File Upload
- **Max file size**: 100MB per file
- **Supported formats**: PDF, DOCX, XLSX, PPT, images, etc.
- **Validation**: Automatic virus scanning

#### 2. Folder Organization
- Create custom folder hierarchy
- Drag-and-drop files between folders
- Folder permissions

#### 3. Permission Controls
- **Owner**: Full access
- **Editor**: Upload, edit, delete
- **Viewer**: Read-only access
- **Quota Management**: Storage limits per user

#### 4. Bulk Operations
- Select multiple files
- Bulk move to folder
- Bulk archive
- Bulk permission updates

#### 5. Storage Quotas
- **Starter**: 5GB
- **Professional**: 50GB
- **Enterprise**: 500GB
- **Visual indicator**: Progress bar shows usage

---

### 🎙️ Podcast Studio (`/podcast`) - Growth/Enterprise Tiers

**Access**: Navigate to **"Podcast Studio"** in menu (Growth/Enterprise users)

**Features**:

#### 1. Audio/Video Upload
- **Formats**: MP3, WAV, MP4, MOV
- **Max size**: 2GB per file

#### 2. AI Transcription (Whisper)
- Automatic transcription
- 95%+ accuracy
- Multiple languages

#### 3. YouTube Publishing
- Direct upload to YouTube
- Auto-generated descriptions
- SEO optimization

#### 4. Live Streaming (Enterprise Only)
- Stream to multiple platforms
- Real-time analytics
- Viewer engagement tools

#### 5. Quota Management
- **Professional**: 10 episodes/month
- **Enterprise**: Unlimited episodes

---

### 🔧 Admin Portal (`/admin`) - Admin Role Required

**Access**: Navigate to **"Admin"** in menu (requires admin role)

**Features**:

#### 1. User Management
- View all users in your organization
- Invite team members
- Assign roles
- Deactivate users

#### 2. Organization Settings
- Company profile
- Billing details
- Subscription management

#### 3. Team Collaboration
- Assign deals to team members
- Set permissions
- Track activity

---

### 🛠️ Master Admin Portal (`/master-admin`) - Platform Admin Only

**Access**: Navigate to **"Master Admin"** in menu (requires admin role + feature flag)

**Features**:

#### 1. Platform-Wide User Management
- View all users across all organizations
- Manage organizations
- System configuration

#### 2. System Analytics
- Platform usage metrics
- Performance monitoring
- Revenue tracking

#### 3. Platform Configuration
- Feature flags
- System settings
- Maintenance mode

**Note**: This is for platform administrators only. Most users will not need this.

---

## Common Questions

### Q: Why can't I see FP&A tools on the dashboard?

**A**: FP&A tools (Valuation Suite, Financial Dashboard) are accessed **through deals**.

**Steps**:
1. Create a deal first
2. Click on the deal
3. Navigate to **"Valuation"** or **"Financial"** tab

---

### Q: Where are my financial ratios?

**A**: Financial ratios are in the **Financial Dashboard** for each deal.

**Steps**:
1. Go to **Deals**
2. Click on a deal
3. Click **"Financial"** tab
4. See 47+ ratios + AI narrative

---

### Q: How do I upload documents?

**A**: Documents are organized per deal in the **Document Room**.

**Steps**:
1. Go to **Deals**
2. Click on a deal
3. Click **"Documents"** tab
4. Drag and drop files or click **"Upload"**

---

### Q: I don't see the Admin or Master Admin menu items

**A**: You need the `admin` role in Clerk.

**Steps**:
1. Read [Admin Setup Guide](./ADMIN-SETUP.md)
2. Set `role: admin` in Clerk Dashboard → Users → Public Metadata
3. Log out and log back in
4. Admin menu items should now appear

---

### Q: What's the difference between Admin and Master Admin?

**Admin** (`/admin`):
- Organization-level administration
- Manage users in your organization
- Configure organization settings

**Master Admin** (`/master-admin`):
- Platform-level administration
- Manage all organizations
- System-wide configuration
- **Only for platform owners/administrators**

---

## Feature Roadmap

### Available Now ✅
- ✅ Deal Pipeline Management
- ✅ Valuation Suite (DCF, Comps, Precedents)
- ✅ Financial Intelligence (47+ ratios)
- ✅ Document Room
- ✅ Subscription & Billing
- ✅ Podcast Studio (Growth/Enterprise)
- ✅ Admin Portals

### Coming Soon 🔜
- Deal Matching AI (match buyers with sellers)
- Automated Document Generation (NDA, LOI, etc.)
- Task Management & Workflow Automation
- Event Management Hub
- Professional Community Platform

---

## Support & Resources

### Documentation
- 📖 [Admin Setup Guide](./ADMIN-SETUP.md) - Configure admin access
- 📖 [Production Launch Checklist](./PRODUCTION-LAUNCH-CHECKLIST.md) - Technical details
- 📖 [Deployment Health](./DEPLOYMENT_HEALTH.md) - System status

### API Documentation
- 🔧 [API Docs](https://ma-saas-backend.onrender.com/api/docs) - OpenAPI/Swagger UI

### Support Channels
- 📧 Email: support@ma-platform.com
- 💬 In-app chat: Coming soon (Intercom)
- 📊 Status page: https://status.ma-platform.com

---

## Next Steps

1. ✅ Create your first deal
2. ✅ Explore Valuation Suite
3. ✅ Upload financial statements to Document Room
4. ✅ Review Financial Dashboard with AI analysis
5. ✅ Set up admin access (if needed)
6. ✅ Invite team members

---

**Happy deal-making! 🤝**

**End of User Quick Start Guide**
