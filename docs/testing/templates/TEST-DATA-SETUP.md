# Test Data Setup Guide

**Purpose**: Comprehensive guide for setting up test data for QA validation
**Target Environment**: Staging / Local Development
**Last Updated**: 2025-11-17

---

## Prerequisites

### Account Requirements
- ✅ Clerk authentication account
- ✅ Test organization created
- ✅ Master Admin permissions assigned
- ✅ Valid test email addresses

### System Access
- ✅ Backend API access (https://ma-saas-backend.onrender.com)
- ✅ Frontend access (https://100daysandbeyond.com)
- ✅ Database access (if testing locally)
- ✅ Admin dashboard access

---

## Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run automated test data setup script
cd scripts
python qa_db_snapshot.py --action create --profile comprehensive

# This creates:
# - 1 test organization
# - 3 test users (admin, user, viewer)
# - Sample data for all 7 Master Admin features
# - 10 activities, 5 prospects, 3 campaigns, etc.
```

### Option 2: Manual Setup
Follow the detailed steps below for each feature.

---

## Test Organization Setup

### Create Test Organization

**Via UI** (Recommended):
1. Sign up with test email: `test-admin+[timestamp]@example.com`
2. Complete onboarding flow
3. Organization auto-created
4. Note the Organization ID from URL or API

**Via API** (Advanced):
```bash
curl -X POST https://ma-saas-backend.onrender.com/api/organizations \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Test Organization",
    "slug": "qa-test-org-123"
  }'
```

**Expected Result**:
```json
{
  "id": "org-abc123",
  "name": "QA Test Organization",
  "slug": "qa-test-org-123",
  "created_at": "2025-11-17T21:00:00Z"
}
```

---

## Test Users Setup

### User Roles Needed
1. **Master Admin** - Full access to all features
2. **Organization Admin** - Admin access within organization
3. **Standard User** - Regular user access
4. **Viewer** - Read-only access

### Create Test Users

**Master Admin User** (Your test account):
- Email: `test-master-admin@example.com`
- Password: [Use secure test password]
- Role: Master Admin
- Permissions: All

**Additional Test Users**:
```json
{
  "users": [
    {
      "email": "test-admin@example.com",
      "role": "admin",
      "first_name": "Test",
      "last_name": "Admin"
    },
    {
      "email": "test-user@example.com",
      "role": "user",
      "first_name": "Test",
      "last_name": "User"
    },
    {
      "email": "test-viewer@example.com",
      "role": "viewer",
      "first_name": "Test",
      "last_name": "Viewer"
    }
  ]
}
```

---

## Master Admin Feature Data

### 1. Dashboard Data

**Automatic**: Dashboard calculates from activities, so create activities first (see below).

**Manual Verification**:
```bash
# Check dashboard stats
curl -X GET https://ma-saas-backend.onrender.com/api/master-admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Data**:
- Current score: Calculated from activities
- Streak: Days of consecutive activity
- Total activities: Count of all activities
- Recent activities: Last 10 activities

---

### 2. Activity Tracker Data

**Sample Activities to Create**:

**Activity 1: Podcast Recording**
```json
{
  "activity_type": "content_creation",
  "title": "Recorded podcast episode on M&A trends",
  "description": "45-minute interview with industry expert",
  "date": "2025-11-17",
  "points": 5,
  "metadata": {
    "duration_minutes": 45,
    "platform": "Riverside"
  }
}
```

**Activity 2: LinkedIn Post**
```json
{
  "activity_type": "social_media",
  "title": "Published LinkedIn article",
  "description": "Shared insights on deal sourcing strategies",
  "date": "2025-11-17",
  "points": 3,
  "metadata": {
    "platform": "LinkedIn",
    "engagement": "125 likes, 15 comments"
  }
}
```

**Activity 3: Cold Outreach**
```json
{
  "activity_type": "outreach",
  "title": "Sent 20 cold emails to prospects",
  "description": "Targeting healthcare sector deals",
  "date": "2025-11-16",
  "points": 4,
  "metadata": {
    "emails_sent": 20,
    "sector": "healthcare"
  }
}
```

**Create via UI**:
1. Navigate to Master Admin → Activity Tracker
2. Click "Log Activity"
3. Fill in form with data above
4. Click "Save"
5. Repeat for 10+ activities

**Create via API**:
```bash
curl -X POST https://ma-saas-backend.onrender.com/api/master-admin/activities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @activity-data.json
```

---

### 3. Prospect Pipeline Data

**Sample Prospects**:

**Prospect 1: Tech Startup**
```json
{
  "company_name": "TechVenture Inc.",
  "industry": "SaaS",
  "contact_name": "John Smith",
  "contact_email": "john@techventure.com",
  "contact_phone": "+1-555-0123",
  "status": "qualified",
  "revenue": 5000000,
  "employees": 50,
  "location": "San Francisco, CA",
  "notes": "Looking to scale, potential acquisition target"
}
```

**Prospect 2: Manufacturing Company**
```json
{
  "company_name": "ManufacturePro Ltd.",
  "industry": "Manufacturing",
  "contact_name": "Sarah Johnson",
  "contact_email": "sarah@manufacturepro.com",
  "contact_phone": "+1-555-0124",
  "status": "contacted",
  "revenue": 15000000,
  "employees": 150,
  "location": "Chicago, IL",
  "notes": "Family-owned, exploring exit options"
}
```

**Sample Deals**:

**Deal 1: TechVenture Acquisition**
```json
{
  "prospect_id": "[prospect-1-id]",
  "deal_name": "TechVenture Acquisition",
  "deal_stage": "due_diligence",
  "deal_value": 20000000,
  "probability": 60,
  "expected_close_date": "2025-12-31",
  "deal_type": "acquisition",
  "notes": "Progressing well, financial documents under review"
}
```

**Create 5-10 prospects** with varying stages:
- Sourcing
- Contacted
- Qualified
- Negotiation
- Due Diligence
- Closing
- Won
- Lost

---

### 4. Campaign Manager Data

**Sample Campaigns**:

**Campaign 1: Q4 Outreach**
```json
{
  "name": "Q4 2025 SaaS Sector Outreach",
  "description": "Targeted outreach to SaaS companies for potential M&A opportunities",
  "campaign_type": "email",
  "status": "active",
  "start_date": "2025-10-01",
  "end_date": "2025-12-31",
  "goal": "50 qualified prospects",
  "budget": 5000,
  "metadata": {
    "target_sector": "SaaS",
    "target_revenue": "1M-10M",
    "geography": "North America"
  }
}
```

**Campaign Recipients**:
```json
{
  "recipients": [
    {
      "campaign_id": "[campaign-id]",
      "prospect_id": "[prospect-id]",
      "email": "prospect1@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "company": "Example Corp",
      "status": "sent",
      "sent_date": "2025-11-10",
      "opened": true,
      "clicked": false,
      "replied": false
    }
  ]
}
```

**Create 3 campaigns**:
- 1 active campaign
- 1 completed campaign
- 1 draft campaign

---

### 5. Content Studio Data

**Sample Content Scripts**:

**Script 1: Podcast Intro**
```json
{
  "title": "M&A Insights Podcast - Episode 10 Intro",
  "content_type": "script",
  "script_type": "podcast_intro",
  "content": "Welcome to M&A Insights, the podcast where we explore the strategies, challenges, and opportunities in mergers and acquisitions. I'm your host...",
  "duration_estimate": 60,
  "metadata": {
    "episode_number": 10,
    "guest": "John Smith, M&A Expert"
  }
}
```

**Sample Content Pieces**:

**Piece 1: LinkedIn Article**
```json
{
  "title": "Top 5 M&A Trends in 2025",
  "content_type": "article",
  "platform": "LinkedIn",
  "content": "As we navigate through 2025, several key trends are shaping the M&A landscape...",
  "status": "published",
  "published_date": "2025-11-15",
  "engagement": {
    "views": 1500,
    "likes": 125,
    "comments": 18,
    "shares": 45
  }
}
```

**Create 5-10 content pieces** of different types:
- Podcast scripts
- LinkedIn articles
- Twitter threads
- Email sequences
- Blog posts

---

### 6. Lead Capture Data

**Sample Leads**:

**Lead 1: Website Form Submission**
```json
{
  "first_name": "Alice",
  "last_name": "Williams",
  "email": "alice@example.com",
  "company": "Williams Ventures",
  "phone": "+1-555-0125",
  "source": "website_form",
  "status": "new",
  "interest_level": "high",
  "notes": "Interested in valuation services",
  "custom_fields": {
    "company_size": "10-50",
    "industry": "Technology",
    "timeline": "immediate"
  },
  "submitted_at": "2025-11-17T10:30:00Z"
}
```

**Lead 2: Event Registration**
```json
{
  "first_name": "Bob",
  "last_name": "Chen",
  "email": "bob@example.com",
  "company": "Chen Consulting",
  "phone": "+1-555-0126",
  "source": "event_registration",
  "status": "contacted",
  "interest_level": "medium",
  "notes": "Registered for M&A webinar",
  "custom_fields": {
    "event_name": "M&A Masterclass",
    "event_date": "2025-11-20"
  },
  "submitted_at": "2025-11-15T14:00:00Z"
}
```

**Create 10-20 leads** with different:
- Sources (website, event, referral, social media)
- Statuses (new, contacted, qualified, converted, lost)
- Interest levels (high, medium, low)

---

### 7. Sales Collateral Data

**Sample Files to Upload**:

**Document 1: Pitch Deck**
- File: `MA-Services-Pitch-Deck-2025.pdf`
- Category: Presentations
- Size: ~5MB
- Description: "Company overview and services pitch deck"

**Document 2: Case Study**
- File: `Case-Study-TechCorp-Acquisition.pdf`
- Category: Case Studies
- Size: ~2MB
- Description: "Successful acquisition case study"

**Document 3: Pricing Sheet**
- File: `MA-Services-Pricing-Q4-2025.xlsx`
- Category: Pricing
- Size: ~500KB
- Description: "Current pricing and packages"

**Document 4: One-Pager**
- File: `MA-Services-One-Pager.pdf`
- Category: Marketing Materials
- Size: ~1MB
- Description: "Quick overview of our services"

**Upload via UI**:
1. Navigate to Master Admin → Sales Collateral
2. Click "Upload File"
3. Select file
4. Fill in metadata (category, description, tags)
5. Click "Upload"

**Categories to use**:
- Presentations
- Case Studies
- Pricing
- Marketing Materials
- Templates
- Reports
- Proposals

---

## Test Data Validation

### Verification Checklist
After creating test data, verify:

**Dashboard**:
- [ ] Score displays correctly
- [ ] Streak calculated properly
- [ ] Activity count matches
- [ ] Recent activities show up

**Activity Tracker**:
- [ ] All 10+ activities visible
- [ ] Can filter by activity type
- [ ] Can edit existing activity
- [ ] Can delete activity
- [ ] Points calculated correctly

**Prospect Pipeline**:
- [ ] All prospects visible in list
- [ ] Deals linked to prospects
- [ ] Can move deal between stages
- [ ] Stage counts correct in pipeline view

**Campaign Manager**:
- [ ] All campaigns visible
- [ ] Recipients show correct status
- [ ] Can add/remove recipients
- [ ] Analytics display correctly

**Content Studio**:
- [ ] All content pieces visible
- [ ] Can filter by type/platform
- [ ] Can edit content
- [ ] Status updates work

**Lead Capture**:
- [ ] All leads visible
- [ ] Can filter by status/source
- [ ] Can update lead status
- [ ] Can convert lead to prospect

**Sales Collateral**:
- [ ] All files visible
- [ ] Can download files
- [ ] Can search/filter
- [ ] Categories display correctly

---

## Data Cleanup

### After Testing
When QA is complete, clean up test data:

**Option 1: Automated Cleanup**
```bash
cd scripts
python qa_db_snapshot.py --action cleanup --profile comprehensive
```

**Option 2: Manual Cleanup**
1. Delete all test activities
2. Delete all test prospects and deals
3. Delete all test campaigns
4. Delete all test content
5. Delete all test leads
6. Delete all uploaded test files
7. Delete test organization (if needed)

### Preserve Test Data
If you want to keep test data for future sessions:

**Create Snapshot**:
```bash
python qa_db_snapshot.py --action snapshot --name "qa-baseline-2025-11-17"
```

**Restore Snapshot**:
```bash
python qa_db_snapshot.py --action restore --name "qa-baseline-2025-11-17"
```

---

## Test Data Files

### Sample Data Templates
Location: `scripts/test-data/`

Files included:
- `activities-sample.json` - 20 sample activities
- `prospects-sample.json` - 15 sample prospects
- `deals-sample.json` - 10 sample deals
- `campaigns-sample.json` - 5 sample campaigns
- `content-sample.json` - 15 sample content pieces
- `leads-sample.json` - 30 sample leads

**Usage**:
```bash
# Load all sample data
python qa_db_snapshot.py --action load --file test-data/activities-sample.json --type activities
```

---

## Troubleshooting

### Common Issues

**Issue**: Cannot create activities
**Solution**: Ensure you're logged in as Master Admin with correct permissions

**Issue**: Files won't upload
**Solution**: Check file size limits (max 10MB), ensure proper file format

**Issue**: Cannot see created data
**Solution**: Check organization context, ensure you're viewing correct org

**Issue**: API returns 401
**Solution**: Refresh Clerk token, ensure session is still valid

### Getting Help
- Check API documentation: `/api/docs`
- Review error messages in browser console
- Check network tab for API responses
- Contact development team if persistent issues

---

## Advanced Setup

### Production-Like Data Volume
For performance testing, create larger datasets:

```bash
# Create high-volume test data
python qa_db_snapshot.py --action create --profile performance
# Creates:
# - 100 prospects
# - 50 deals
# - 200 activities
# - 10 campaigns with 500 recipients each
# - 100 content pieces
# - 500 leads
```

### Multi-User Testing
Setup multiple user accounts with different roles for collaboration testing:

```bash
python qa_db_snapshot.py --action create --profile multi-user
# Creates:
# - 1 Master Admin
# - 3 Org Admins
# - 5 Standard Users
# - 2 Viewers
# - Each with sample activities/data
```

---

**Guide Version**: 1.0
**Last Updated**: 2025-11-17
**Maintained By**: QA Team
**Next Review**: After v1.0 release
