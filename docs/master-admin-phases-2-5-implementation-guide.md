# Master Admin Portal - Phases 2-5 Implementation Guide

**Status**: Phases 2-5 In Progress
**Current Progress**: Phase 2 Hooks Complete, 2/7 components created

---

## Phase 2: Prospect Pipeline (IN PROGRESS)

### ✅ Completed
1. **useProspects.ts** - React Query hooks for prospects
2. **useDeals.ts** - React Query hooks for deals
3. **ProspectCard.tsx** - Prospect card component with status badge, contact info
4. **ProspectForm.tsx** - Create/edit prospect form

### 🔄 Remaining Components (Phase 2)

#### 1. **ProspectList.tsx**
```tsx
// List view with search, filters, pagination
- Search bar (by name, email, company)
- Status filter dropdown
- Sort options (name, created date, last contacted)
- Paginated table/grid view
- Click to open detail modal
- Quick actions (edit, delete)
```

#### 2. **ProspectKanban.tsx**
```tsx
// Kanban board with drag-and-drop
- Columns: NEW → QUALIFIED → ENGAGED → PROPOSAL → NEGOTIATION → WON/LOST
- Drag ProspectCards between columns
- Update status on drop
- Card count per column
- Add prospect button in each column
// Use @hello-pangea/dnd or similar library
```

#### 3. **ProspectDetailModal.tsx**
```tsx
// Full prospect details in modal
- Display all prospect fields
- Edit button → inline ProspectForm
- Delete button
- View associated deals (DealCard list)
- Add new deal button
- Activity history (linked activities from Activity Tracker)
- Close button
```

#### 4. **DealCard.tsx**
```tsx
// Mini deal card for prospect's deals
- Deal title, stage, value
- Probability percentage
- Expected close date
- Status badge
- Quick edit/delete
```

#### 5. **AddDealForm.tsx**
```tsx
// Quick add deal form
- Prospect ID (pre-filled)
- Title, stage, value, probability
- Expected close date
- Notes
- Submit → creates deal, refetches deals list
```

#### 6. **ProspectPipeline.tsx** (Page)
```tsx
// Main page with view toggle
- Header with "Prospect Pipeline" title
- View toggle: Kanban | List
- Search bar, filters
- Add Prospect button → opens ProspectForm in modal
- Kanban view (default): ProspectKanban
- List view: ProspectList
- Click prospect → ProspectDetailModal
```

#### 7. **Routing & Navigation**
```tsx
// Add to App.tsx
const ProspectPipeline = lazyNamed(() => import("./pages/master-admin/ProspectPipeline"), "ProspectPipeline")
<Route path="master-admin/prospects" element={<SignedIn><ProspectPipeline /></SignedIn>} />
```

---

## Phase 3: Campaign Manager

### Components to Create

#### 1. **CampaignCard.tsx**
```tsx
// Campaign summary card
- Campaign name, type (email/sms/mixed), status
- Stats: total recipients, sent count, opened count, clicked count
- Open rate %, click rate %
- Scheduled date or sent date
- Quick actions: edit, delete, send (if draft)
```

#### 2. **CampaignForm.tsx**
```tsx
// Create/edit campaign form
- Name, type (dropdown), status
- Subject line (for email)
- Content (textarea or rich text editor)
- Scheduled date/time picker
- Save draft / Schedule send buttons
```

#### 3. **CampaignList.tsx**
```tsx
// Paginated campaign list
- Table with columns: name, type, status, recipients, sent, opened, clicked
- Status filter (draft, scheduled, sending, sent, paused, cancelled)
- Sort options
- Click row → navigate to campaign detail page
```

#### 4. **RecipientManager.tsx**
```tsx
// Add/remove recipients
- Search prospects
- Bulk select checkboxes
- Add selected prospects as recipients
- Remove recipient button
```

#### 5. **RecipientList.tsx**
```tsx
// List of campaign recipients
- Table: prospect name, email, sent?, opened?, clicked?, bounced?
- Status icons
- Engagement timestamps
```

#### 6. **CampaignStats.tsx**
```tsx
// Visual stats dashboard
- Total recipients (number card)
- Sent count (number + %)
- Open rate (circular progress)
- Click rate (circular progress)
- Timeline chart (sent over time)
```

#### 7. **EmailPreview.tsx**
```tsx
// Preview email content
- Subject line display
- Content preview (formatted)
- Mobile/desktop view toggle
- Send test email button
```

#### 8. **CampaignManager.tsx** (Page)
```tsx
// Main campaign management page
- Header with "Campaign Manager" title
- Create Campaign button
- CampaignList
- Click campaign → navigate to /master-admin/campaigns/:id
```

#### 9. **CampaignDetail.tsx** (Page)
```tsx
// Campaign detail page
- Breadcrumb: Campaign Manager → {campaign name}
- Campaign info card (name, type, status, stats)
- Edit campaign button → CampaignForm modal
- Tabs:
  - Recipients tab: RecipientManager + RecipientList
  - Stats tab: CampaignStats
  - Preview tab: EmailPreview
- Send Campaign button (if draft/scheduled)
```

#### 10. **Hooks**
```tsx
// useCampaigns.ts
- useCampaigns(filters)
- useCampaign(id)
- useCreateCampaign()
- useUpdateCampaign()
- useDeleteCampaign()
- useSendCampaign()

// useCampaignRecipients.ts
- useCampaignRecipients(campaignId)
- useAddCampaignRecipient()
```

#### 11. **Routing**
```tsx
// Add to App.tsx
const CampaignManager = lazyNamed(() => import("./pages/master-admin/CampaignManager"), "CampaignManager")
const CampaignDetail = lazyNamed(() => import("./pages/master-admin/CampaignDetail"), "CampaignDetail")

<Route path="master-admin/campaigns" element={<SignedIn><CampaignManager /></SignedIn>} />
<Route path="master-admin/campaigns/:campaignId" element={<SignedIn><CampaignDetail /></SignedIn>} />
```

---

## Phase 4: Content Studio

### Components to Create

#### 1. **ScriptCard.tsx**
```tsx
// Content script card
- Title, type (youtube/podcast/blog/social), duration
- Keywords tags
- Edit, delete actions
- Click → open ScriptEditor modal
```

#### 2. **ScriptEditor.tsx**
```tsx
// Rich text editor for scripts
- Title input
- Type dropdown
- Duration input
- Keywords (comma-separated)
- Script content (textarea or react-quill)
- Save button
```

#### 3. **ScriptList.tsx**
```tsx
// List of scripts
- Grid or list view
- Type filter
- Search by title/keywords
- Sort by created date
- Add Script button
```

#### 4. **ContentPieceCard.tsx**
```tsx
// Content piece card
- Title, type, status badge
- Thumbnail image (if available)
- URLs (youtube, spotify, rss)
- View count
- Published date
- Quick actions: edit, delete, view stats
```

#### 5. **ContentPieceForm.tsx**
```tsx
// Create/edit content piece form
- Title, type, status dropdown
- Link to script (dropdown of scripts)
- Recording URL, edited URL, thumbnail URL
- Description, tags
- YouTube URL, Spotify URL, RSS URL
- Published date
- Save button
```

#### 6. **PublishingQueue.tsx**
```tsx
// Kanban-style publishing workflow
- Columns: IDEA → SCRIPTING → RECORDING → EDITING → READY → PUBLISHED
- Drag ContentPieceCards between columns
- Update status on drop
- Card count per column
```

#### 7. **ContentStats.tsx**
```tsx
// Content analytics
- Total pieces by type (chart)
- Total views
- Publishing rate (pieces per week)
- Status breakdown (pie chart)
```

#### 8. **ContentStudio.tsx** (Page)
```tsx
// Main content studio page
- Header with "Content Studio" title
- Two-column layout:
  - Left: Scripts section
    - Add Script button
    - ScriptList
  - Right: Content Pieces section
    - Add Content Piece button
    - PublishingQueue (default view)
    - Toggle to list view (ContentPieceCard grid)
- Stats dashboard at top
```

#### 9. **Hooks**
```tsx
// useContentScripts.ts
- useContentScripts()
- useContentScript(id)
- useCreateContentScript()
- useUpdateContentScript()
- useDeleteContentScript()

// useContentPieces.ts
- useContentPieces(filters)
- useContentPiece(id)
- useCreateContentPiece()
- useUpdateContentPiece()
- useDeleteContentPiece()
```

#### 10. **Routing**
```tsx
// Add to App.tsx
const ContentStudio = lazyNamed(() => import("./pages/master-admin/ContentStudio"), "ContentStudio")
<Route path="master-admin/content" element={<SignedIn><ContentStudio /></SignedIn>} />
```

---

## Phase 5: Lead Capture & Sales Collateral

### Components to Create

#### Lead Capture Components

#### 1. **LeadCaptureCard.tsx**
```tsx
// Lead capture card
- Name, email, phone, company
- Event name, event date
- Interest level badge (hot/warm/cold)
- Follow-up type
- GHL sync status icon
- Quick actions: edit, delete, sync to GHL
```

#### 2. **LeadCaptureForm.tsx**
```tsx
// Quick capture form
- Name, email, phone, company
- Event name (dropdown or text), event date
- Interest level (dropdown: hot/warm/cold)
- Follow-up type (dropdown: call/email/meeting)
- Notes, voice notes URL
- Submit button
```

#### 3. **LeadCaptureList.tsx**
```tsx
// Paginated lead list
- Event filter dropdown
- Interest level filter
- Search by name/email/company
- Sort by date
- Bulk sync to GHL button
```

#### 4. **GHLSyncStatus.tsx**
```tsx
// GoHighLevel sync status
- Sync status badge (synced/pending/failed)
- Last synced timestamp
- Manual sync button
- GHL contact ID (if synced)
```

#### 5. **LeadCapture.tsx** (Page)
```tsx
// Lead capture page
- Header with "Lead Capture" title
- Quick capture form (LeadCaptureForm) in sidebar
- LeadCaptureList (main area)
- Sync status summary
```

#### Sales Collateral Components

#### 6. **CollateralCard.tsx**
```tsx
// Collateral file card
- Title, type badge
- Thumbnail/icon
- File size, MIME type
- Download link
- Usage count
- Tags
- Quick actions: edit, delete, track usage
```

#### 7. **CollateralUpload.tsx**
```tsx
// File upload component
- Drag-and-drop zone (react-dropzone)
- File input button
- Title, type, description inputs
- Tags (comma-separated)
- Upload progress bar
- Submit button
```

#### 8. **CollateralList.tsx**
```tsx
// Grid view of collateral
- Type filter (dropdown)
- Search by title
- Sort options
- Grid of CollateralCards
- Upload button
```

#### 9. **CollateralUsageTracker.tsx**
```tsx
// Track usage form
- Collateral dropdown (select which piece)
- Prospect dropdown (optional - which prospect it was used with)
- Context input (e.g., "Sent in proposal email")
- Submit button → creates usage record
```

#### 10. **UsageStats.tsx**
```tsx
// Usage analytics
- Most used collateral (top 5 list)
- Usage by prospect (table)
- Usage over time (chart)
```

#### 11. **SalesCollateral.tsx** (Page)
```tsx
// Sales collateral page
- Header with "Sales Collateral" title
- Upload button → CollateralUpload modal
- CollateralList (grid view)
- Click collateral → detail view with usage stats
- Track usage button → CollateralUsageTracker modal
```

#### 12. **Hooks**
```tsx
// useLeadCaptures.ts
- useLeadCaptures(filters)
- useLeadCapture(id)
- useCreateLeadCapture()
- useUpdateLeadCapture()
- useDeleteLeadCapture()
- useSyncLeadToGHL()

// useCollateral.ts
- useCollateral()
- useCreateCollateral()
- useUpdateCollateral()
- useDeleteCollateral()

// useCollateralUsage.ts
- useTrackCollateralUsage()
```

#### 13. **Routing**
```tsx
// Add to App.tsx
const LeadCapture = lazyNamed(() => import("./pages/master-admin/LeadCapture"), "LeadCapture")
const SalesCollateral = lazyNamed(() => import("./pages/master-admin/SalesCollateral"), "SalesCollateral")

<Route path="master-admin/leads" element={<SignedIn><LeadCapture /></SignedIn>} />
<Route path="master-admin/collateral" element={<SignedIn><SalesCollateral /></SignedIn>} />
```

---

## Implementation Checklist

### Phase 2: Prospect Pipeline
- [x] useProspects hook
- [x] useDeals hook
- [x] ProspectCard
- [x] ProspectForm
- [ ] ProspectList
- [ ] ProspectKanban (requires drag-and-drop library)
- [ ] ProspectDetailModal
- [ ] DealCard
- [ ] AddDealForm
- [ ] ProspectPipeline page
- [ ] Routing

### Phase 3: Campaign Manager
- [ ] useCampaigns hook
- [ ] useCampaignRecipients hook
- [ ] CampaignCard
- [ ] CampaignForm
- [ ] CampaignList
- [ ] RecipientManager
- [ ] RecipientList
- [ ] CampaignStats
- [ ] EmailPreview
- [ ] CampaignManager page
- [ ] CampaignDetail page
- [ ] Routing

### Phase 4: Content Studio
- [ ] useContentScripts hook
- [ ] useContentPieces hook
- [ ] ScriptCard
- [ ] ScriptEditor
- [ ] ScriptList
- [ ] ContentPieceCard
- [ ] ContentPieceForm
- [ ] PublishingQueue
- [ ] ContentStats
- [ ] ContentStudio page
- [ ] Routing

### Phase 5: Lead Capture & Collateral
- [ ] useLeadCaptures hook
- [ ] useCollateral hook
- [ ] useCollateralUsage hook
- [ ] LeadCaptureCard
- [ ] LeadCaptureForm
- [ ] LeadCaptureList
- [ ] GHLSyncStatus
- [ ] CollateralCard
- [ ] CollateralUpload
- [ ] CollateralList
- [ ] CollateralUsageTracker
- [ ] UsageStats
- [ ] LeadCapture page
- [ ] SalesCollateral page
- [ ] Routing

---

## Dependencies to Install

```bash
npm install @hello-pangea/dnd  # Drag-and-drop for Kanban boards
npm install react-dropzone      # File upload for collateral
# Optional: npm install react-quill  # Rich text editor for scripts
```

---

## Total Effort

- **Phase 2**: ~4-5 hours (Kanban complexity)
- **Phase 3**: ~3-4 hours
- **Phase 4**: ~3-4 hours
- **Phase 5**: ~4-5 hours (file upload complexity)
- **TOTAL**: ~14-18 hours

---

## Next Steps

1. Complete Phase 2 remaining components
2. Test Phase 2 end-to-end
3. Move to Phase 3
4. Iterate through Phases 4-5
5. Comprehensive testing
6. Update BMAD progress tracker

**Current Files Created (Phase 2)**:
- ✅ `frontend/src/hooks/master-admin/useProspects.ts`
- ✅ `frontend/src/hooks/master-admin/useDeals.ts`
- ✅ `frontend/src/components/master-admin/prospects/ProspectCard.tsx`
- ✅ `frontend/src/components/master-admin/prospects/ProspectForm.tsx`

**Ready to continue with ProspectList.tsx and remaining Phase 2 components!**
