/**
 * Master Admin Portal API Client
 *
 * TypeScript client for the Master Admin Portal backend API.
 * Mirrors all Pydantic schemas and provides typed API functions.
 *
 * Backend API Base: /api/master-admin
 */

import { apiClient } from './client'

// ============================================================================
// Enums (matching backend Python enums)
// ============================================================================

export enum ActivityType {
  DISCOVERY = 'discovery',
  EMAIL = 'email',
  VIDEO = 'video',
  CALL = 'call',
}

export enum ActivityStatus {
  DONE = 'done',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum NudgeType {
  REMINDER = 'reminder',
  SUGGESTION = 'suggestion',
  ALERT = 'alert',
  CELEBRATION = 'celebration',
}

export enum NudgePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum MeetingType {
  DISCOVERY = 'discovery',
  DEMO = 'demo',
  NEGOTIATION = 'negotiation',
  CLOSING = 'closing',
}

export enum ProspectStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  ENGAGED = 'engaged',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

export enum AdminDealStage {
  DISCOVERY = 'discovery',
  QUALIFICATION = 'qualification',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSING = 'closing',
  WON = 'won',
  LOST = 'lost',
}

export enum CampaignType {
  EMAIL = 'email',
  SMS = 'sms',
  MIXED = 'mixed',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  SENT = 'sent',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export enum ContentType {
  YOUTUBE = 'youtube',
  PODCAST = 'podcast',
  BLOG = 'blog',
  SOCIAL = 'social',
}

export enum ContentStatus {
  IDEA = 'idea',
  SCRIPTING = 'scripting',
  RECORDING = 'recording',
  EDITING = 'editing',
  READY = 'ready',
  PUBLISHED = 'published',
}

// ============================================================================
// Activity Tracker Types
// ============================================================================

export interface AdminGoal {
  id: number
  user_id: string
  week_start: string // ISO date string
  target_discoveries: number
  target_emails: number
  target_videos: number
  target_calls: number
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminGoalCreate {
  week_start: string // ISO date string
  target_discoveries?: number
  target_emails?: number
  target_videos?: number
  target_calls?: number
}

export interface AdminGoalUpdate {
  target_discoveries?: number
  target_emails?: number
  target_videos?: number
  target_calls?: number
}

export interface AdminActivity {
  id: number
  user_id: string
  type: ActivityType // Note: Backend uses 'type' in JSON
  status: ActivityStatus
  date: string // ISO date string
  amount: number
  notes?: string
  prospect_id?: number
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminActivityCreate {
  type: ActivityType
  status: ActivityStatus
  date: string // ISO date string
  amount?: number
  notes?: string
  prospect_id?: number
}

export interface AdminActivityUpdate {
  type?: ActivityType
  status?: ActivityStatus
  date?: string
  amount?: number
  notes?: string
  prospect_id?: number
}

export interface AdminScore {
  id: number
  user_id: string
  date: string // ISO date string
  score: number // 0-100
  streak_days: number
  activities_count: number
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminFocusSession {
  id: number
  user_id: string
  start_time: string // ISO datetime string
  end_time?: string // ISO datetime string
  duration_minutes: number
  completed: boolean
  interrupted: boolean
  notes?: string
  created_at: string // ISO datetime string
}

export interface AdminFocusSessionCreate {
  start_time: string // ISO datetime string
  duration_minutes?: number
  notes?: string
}

export interface AdminFocusSessionUpdate {
  end_time?: string
  completed?: boolean
  interrupted?: boolean
  notes?: string
}

export interface AdminNudge {
  id: number
  user_id: string
  type: NudgeType
  message: string
  priority: NudgePriority
  read: boolean
  action_url?: string
  expires_at?: string // ISO datetime string
  created_at: string // ISO datetime string
}

export interface AdminNudgeCreate {
  type: NudgeType
  message: string
  priority?: NudgePriority
  action_url?: string
  expires_at?: string
}

export interface AdminNudgeUpdate {
  read?: boolean
}

export interface AdminMeeting {
  id: number
  user_id: string
  title: string
  type: MeetingType
  duration_minutes: number
  agenda?: string
  questions?: string
  follow_up_tasks?: string
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminMeetingCreate {
  title: string
  type: MeetingType
  duration_minutes?: number
  agenda?: string
  questions?: string
  follow_up_tasks?: string
}

// ============================================================================
// Prospect & Pipeline Types
// ============================================================================

export interface AdminProspect {
  id: number
  user_id: string
  name: string
  email?: string
  phone?: string
  company?: string
  title?: string
  status: ProspectStatus
  source?: string
  tags?: string // JSON array string
  notes?: string
  voice_notes_url?: string
  ghl_contact_id?: string
  last_contacted?: string // ISO datetime string
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminProspectCreate {
  name: string
  email?: string
  phone?: string
  company?: string
  title?: string
  status?: ProspectStatus
  source?: string
  tags?: string
  notes?: string
  voice_notes_url?: string
  ghl_contact_id?: string
}

export interface AdminProspectUpdate {
  name?: string
  email?: string
  phone?: string
  company?: string
  title?: string
  status?: ProspectStatus
  source?: string
  tags?: string
  notes?: string
  voice_notes_url?: string
  ghl_contact_id?: string
  last_contacted?: string
}

export interface AdminDeal {
  id: number
  user_id: string
  prospect_id: number
  title: string
  stage: AdminDealStage
  value?: number
  probability: number // 0-100
  expected_close_date?: string // ISO date string
  actual_close_date?: string // ISO date string
  notes?: string
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminDealCreate {
  prospect_id: number
  title: string
  stage?: AdminDealStage
  value?: number
  probability?: number
  expected_close_date?: string
  actual_close_date?: string
  notes?: string
}

export interface AdminDealUpdate {
  title?: string
  stage?: AdminDealStage
  value?: number
  probability?: number
  expected_close_date?: string
  actual_close_date?: string
  notes?: string
}

// ============================================================================
// Campaign Management Types
// ============================================================================

export interface AdminCampaign {
  id: number
  user_id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  subject?: string
  content: string
  scheduled_at?: string // ISO datetime string
  sent_at?: string // ISO datetime string
  total_recipients: number
  sent_count: number
  opened_count: number
  clicked_count: number
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminCampaignCreate {
  name: string
  type: CampaignType
  status?: CampaignStatus
  subject?: string
  content: string
  scheduled_at?: string
}

export interface AdminCampaignUpdate {
  name?: string
  status?: CampaignStatus
  subject?: string
  content?: string
  scheduled_at?: string
}

export interface AdminCampaignRecipient {
  id: number
  campaign_id: number
  prospect_id: number
  sent: boolean
  opened: boolean
  clicked: boolean
  bounced: boolean
  sent_at?: string // ISO datetime string
  opened_at?: string // ISO datetime string
  clicked_at?: string // ISO datetime string
}

export interface AdminCampaignRecipientCreate {
  campaign_id: number
  prospect_id: number
}

// ============================================================================
// Content Creation Types
// ============================================================================

export interface AdminContentScript {
  id: number
  user_id: string
  title: string
  type: ContentType
  script_text: string
  duration_minutes?: number
  keywords?: string // JSON array string
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminContentScriptCreate {
  title: string
  type: ContentType
  script_text: string
  duration_minutes?: number
  keywords?: string
}

export interface AdminContentScriptUpdate {
  title?: string
  script_text?: string
  duration_minutes?: number
  keywords?: string
}

export interface AdminContentPiece {
  id: number
  user_id: string
  title: string
  type: ContentType
  status: ContentStatus
  script_id?: number
  recording_url?: string
  edited_url?: string
  thumbnail_url?: string
  description?: string
  tags?: string // JSON array string
  youtube_url?: string
  spotify_url?: string
  rss_url?: string
  views_count: number
  published_at?: string // ISO datetime string
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminContentPieceCreate {
  title: string
  type: ContentType
  status?: ContentStatus
  script_id?: number
  recording_url?: string
  edited_url?: string
  thumbnail_url?: string
  description?: string
  tags?: string
  youtube_url?: string
  spotify_url?: string
  rss_url?: string
}

export interface AdminContentPieceUpdate {
  title?: string
  status?: ContentStatus
  script_id?: number
  recording_url?: string
  edited_url?: string
  thumbnail_url?: string
  description?: string
  tags?: string
  youtube_url?: string
  spotify_url?: string
  rss_url?: string
  views_count?: number
  published_at?: string
}

// ============================================================================
// Lead Capture Types
// ============================================================================

export interface AdminLeadCapture {
  id: number
  user_id: string
  name: string
  email?: string
  phone?: string
  company?: string
  event_name?: string
  event_date?: string // ISO date string
  interest_level?: string
  follow_up_type?: string
  notes?: string
  voice_notes_url?: string
  synced_to_ghl: boolean
  ghl_contact_id?: string
  created_at: string // ISO datetime string
}

export interface AdminLeadCaptureCreate {
  name: string
  email?: string
  phone?: string
  company?: string
  event_name?: string
  event_date?: string
  interest_level?: string
  follow_up_type?: string
  notes?: string
  voice_notes_url?: string
}

export interface AdminLeadCaptureUpdate {
  name?: string
  email?: string
  phone?: string
  company?: string
  event_name?: string
  event_date?: string
  interest_level?: string
  follow_up_type?: string
  notes?: string
  voice_notes_url?: string
  synced_to_ghl?: boolean
  ghl_contact_id?: string
}

// ============================================================================
// Sales Collateral Types
// ============================================================================

export interface AdminCollateral {
  id: number
  user_id: string
  title: string
  type: string
  description?: string
  file_url: string
  file_size?: number
  mime_type?: string
  tags?: string // JSON array string
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

export interface AdminCollateralCreate {
  title: string
  type: string
  description?: string
  file_url: string
  file_size?: number
  mime_type?: string
  tags?: string
}

export interface AdminCollateralUpdate {
  title?: string
  type?: string
  description?: string
  tags?: string
}

export interface AdminCollateralUsage {
  id: number
  collateral_id: number
  prospect_id?: number
  context?: string
  used_at: string // ISO datetime string
}

export interface AdminCollateralUsageCreate {
  collateral_id: number
  prospect_id?: number
  context?: string
}

// ============================================================================
// List Response Types (with pagination)
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
}

export type AdminActivityListResponse = PaginatedResponse<AdminActivity>
export type AdminScoreListResponse = PaginatedResponse<AdminScore>
export type AdminFocusSessionListResponse = PaginatedResponse<AdminFocusSession>
export type AdminNudgeListResponse = PaginatedResponse<AdminNudge>
export type AdminMeetingListResponse = PaginatedResponse<AdminMeeting>
export type AdminProspectListResponse = PaginatedResponse<AdminProspect>
export type AdminDealListResponse = PaginatedResponse<AdminDeal>
export type AdminCampaignListResponse = PaginatedResponse<AdminCampaign>
export type AdminCampaignRecipientListResponse = PaginatedResponse<AdminCampaignRecipient>
export type AdminContentScriptListResponse = PaginatedResponse<AdminContentScript>
export type AdminContentPieceListResponse = PaginatedResponse<AdminContentPiece>
export type AdminLeadCaptureListResponse = PaginatedResponse<AdminLeadCapture>
export type AdminCollateralListResponse = PaginatedResponse<AdminCollateral>

// ============================================================================
// Dashboard Stats Type
// ============================================================================

export interface DashboardStats {
  score: number
  streak: number
  activities_today: number
  prospects_active: number
  deals_active: number
  unread_nudges: number
}

// ============================================================================
// API Functions - Goals
// ============================================================================

export async function createGoal(goal: AdminGoalCreate): Promise<AdminGoal> {
  return apiClient.post<AdminGoal>('/api/master-admin/goals', goal)
}

export async function getCurrentGoal(): Promise<AdminGoal> {
  return apiClient.get<AdminGoal>('/api/master-admin/goals/current')
}

export async function getGoalByWeek(weekStart: string): Promise<AdminGoal> {
  return apiClient.get<AdminGoal>(`/api/master-admin/goals/${weekStart}`)
}

export async function updateGoal(goalId: number, update: AdminGoalUpdate): Promise<AdminGoal> {
  return apiClient.put<AdminGoal>(`/api/master-admin/goals/${goalId}`, update)
}

// ============================================================================
// API Functions - Activities
// ============================================================================

export interface ActivityFilters {
  page?: number
  per_page?: number
  start_date?: string // ISO date
  end_date?: string // ISO date
  activity_type?: ActivityType
}

export async function listActivities(filters?: ActivityFilters): Promise<AdminActivityListResponse> {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.per_page) params.append('per_page', filters.per_page.toString())
  if (filters?.start_date) params.append('start_date', filters.start_date)
  if (filters?.end_date) params.append('end_date', filters.end_date)
  if (filters?.activity_type) params.append('activity_type', filters.activity_type)

  const query = params.toString()
  return apiClient.get<AdminActivityListResponse>(`/api/master-admin/activities${query ? `?${query}` : ''}`)
}

export async function createActivity(activity: AdminActivityCreate): Promise<AdminActivity> {
  return apiClient.post<AdminActivity>('/api/master-admin/activities', activity)
}

export async function getActivity(activityId: number): Promise<AdminActivity> {
  return apiClient.get<AdminActivity>(`/api/master-admin/activities/${activityId}`)
}

export async function updateActivity(activityId: number, update: AdminActivityUpdate): Promise<AdminActivity> {
  return apiClient.put<AdminActivity>(`/api/master-admin/activities/${activityId}`, update)
}

export async function deleteActivity(activityId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/activities/${activityId}`)
}

// ============================================================================
// API Functions - Scores
// ============================================================================

export async function getTodayScore(): Promise<AdminScore> {
  return apiClient.get<AdminScore>('/api/master-admin/scores/today')
}

export async function getCurrentStreak(): Promise<{ streak_days: number; current_score: number }> {
  return apiClient.get<{ streak_days: number; current_score: number }>('/api/master-admin/scores/streak')
}

export async function getScoreByDate(date: string): Promise<AdminScore> {
  return apiClient.get<AdminScore>(`/api/master-admin/scores/${date}`)
}

export async function getWeeklyScores(weekStart: string): Promise<AdminScoreListResponse> {
  return apiClient.get<AdminScoreListResponse>(`/api/master-admin/scores/week/${weekStart}`)
}

// ============================================================================
// API Functions - Focus Sessions
// ============================================================================

export async function startFocusSession(session: AdminFocusSessionCreate): Promise<AdminFocusSession> {
  return apiClient.post<AdminFocusSession>('/api/master-admin/focus-sessions', session)
}

export async function getActiveFocusSession(): Promise<AdminFocusSession | null> {
  try {
    return await apiClient.get<AdminFocusSession>('/api/master-admin/focus-sessions/active')
  } catch (error: any) {
    // Return null if no active session (404)
    if (error.statusCode === 404) return null
    throw error
  }
}

export async function completeFocusSession(sessionId: number, update: AdminFocusSessionUpdate): Promise<AdminFocusSession> {
  return apiClient.put<AdminFocusSession>(`/api/master-admin/focus-sessions/${sessionId}/complete`, update)
}

// ============================================================================
// API Functions - Nudges
// ============================================================================

export async function createNudge(nudge: AdminNudgeCreate): Promise<AdminNudge> {
  return apiClient.post<AdminNudge>('/api/master-admin/nudges', nudge)
}

export async function getUnreadNudges(): Promise<AdminNudgeListResponse> {
  return apiClient.get<AdminNudgeListResponse>('/api/master-admin/nudges/unread')
}

export async function markNudgeAsRead(nudgeId: number): Promise<AdminNudge> {
  return apiClient.put<AdminNudge>(`/api/master-admin/nudges/${nudgeId}/read`, { read: true })
}

// ============================================================================
// API Functions - Meetings
// ============================================================================

export async function createMeeting(meeting: AdminMeetingCreate): Promise<AdminMeeting> {
  return apiClient.post<AdminMeeting>('/api/master-admin/meetings', meeting)
}

export async function getMeetingsByType(meetingType: MeetingType): Promise<AdminMeetingListResponse> {
  return apiClient.get<AdminMeetingListResponse>(`/api/master-admin/meetings/type/${meetingType}`)
}

// ============================================================================
// API Functions - Prospects
// ============================================================================

export interface ProspectFilters {
  page?: number
  per_page?: number
  search?: string
  status?: ProspectStatus
}

export async function listProspects(filters?: ProspectFilters): Promise<AdminProspectListResponse> {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.per_page) params.append('per_page', filters.per_page.toString())
  if (filters?.search) params.append('search', filters.search)
  if (filters?.status) params.append('status', filters.status)

  const query = params.toString()
  return apiClient.get<AdminProspectListResponse>(`/api/master-admin/prospects${query ? `?${query}` : ''}`)
}

export async function createProspect(prospect: AdminProspectCreate): Promise<AdminProspect> {
  return apiClient.post<AdminProspect>('/api/master-admin/prospects', prospect)
}

export async function getProspect(prospectId: number): Promise<AdminProspect> {
  return apiClient.get<AdminProspect>(`/api/master-admin/prospects/${prospectId}`)
}

export async function updateProspect(prospectId: number, update: AdminProspectUpdate): Promise<AdminProspect> {
  return apiClient.put<AdminProspect>(`/api/master-admin/prospects/${prospectId}`, update)
}

export async function deleteProspect(prospectId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/prospects/${prospectId}`)
}

// ============================================================================
// API Functions - Deals
// ============================================================================

export interface DealFilters {
  page?: number
  per_page?: number
  stage?: AdminDealStage
}

export async function listDeals(filters?: DealFilters): Promise<AdminDealListResponse> {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.per_page) params.append('per_page', filters.per_page.toString())
  if (filters?.stage) params.append('stage', filters.stage)

  const query = params.toString()
  return apiClient.get<AdminDealListResponse>(`/api/master-admin/deals${query ? `?${query}` : ''}`)
}

export async function createDeal(deal: AdminDealCreate): Promise<AdminDeal> {
  return apiClient.post<AdminDeal>('/api/master-admin/deals', deal)
}

export async function updateDeal(dealId: number, update: AdminDealUpdate): Promise<AdminDeal> {
  return apiClient.put<AdminDeal>(`/api/master-admin/deals/${dealId}`, update)
}

export async function deleteDeal(dealId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/deals/${dealId}`)
}

// ============================================================================
// API Functions - Campaigns
// ============================================================================

export interface CampaignFilters {
  page?: number
  per_page?: number
  status?: CampaignStatus
}

export async function listCampaigns(filters?: CampaignFilters): Promise<AdminCampaignListResponse> {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.per_page) params.append('per_page', filters.per_page.toString())
  if (filters?.status) params.append('status', filters.status)

  const query = params.toString()
  return apiClient.get<AdminCampaignListResponse>(`/api/master-admin/campaigns${query ? `?${query}` : ''}`)
}

export async function createCampaign(campaign: AdminCampaignCreate): Promise<AdminCampaign> {
  return apiClient.post<AdminCampaign>('/api/master-admin/campaigns', campaign)
}

export async function getCampaign(campaignId: number): Promise<AdminCampaign> {
  return apiClient.get<AdminCampaign>(`/api/master-admin/campaigns/${campaignId}`)
}

export async function updateCampaign(campaignId: number, update: AdminCampaignUpdate): Promise<AdminCampaign> {
  return apiClient.put<AdminCampaign>(`/api/master-admin/campaigns/${campaignId}`, update)
}

export async function deleteCampaign(campaignId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/campaigns/${campaignId}`)
}

export async function sendCampaign(campaignId: number): Promise<AdminCampaign> {
  return apiClient.post<AdminCampaign>(`/api/master-admin/campaigns/${campaignId}/send`)
}

// Campaign Recipients
export async function listCampaignRecipients(campaignId: number, page = 1, perPage = 50): Promise<AdminCampaignRecipientListResponse> {
  return apiClient.get<AdminCampaignRecipientListResponse>(`/api/master-admin/campaigns/${campaignId}/recipients?page=${page}&per_page=${perPage}`)
}

export async function addCampaignRecipient(recipient: AdminCampaignRecipientCreate): Promise<AdminCampaignRecipient> {
  return apiClient.post<AdminCampaignRecipient>('/api/master-admin/campaigns/recipients', recipient)
}

// ============================================================================
// API Functions - Content Scripts
// ============================================================================

export async function listContentScripts(page = 1, perPage = 50): Promise<AdminContentScriptListResponse> {
  return apiClient.get<AdminContentScriptListResponse>(`/api/master-admin/content/scripts?page=${page}&per_page=${perPage}`)
}

export async function createContentScript(script: AdminContentScriptCreate): Promise<AdminContentScript> {
  return apiClient.post<AdminContentScript>('/api/master-admin/content/scripts', script)
}

export async function getContentScript(scriptId: number): Promise<AdminContentScript> {
  return apiClient.get<AdminContentScript>(`/api/master-admin/content/scripts/${scriptId}`)
}

export async function updateContentScript(scriptId: number, update: AdminContentScriptUpdate): Promise<AdminContentScript> {
  return apiClient.put<AdminContentScript>(`/api/master-admin/content/scripts/${scriptId}`, update)
}

export async function deleteContentScript(scriptId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/content/scripts/${scriptId}`)
}

// ============================================================================
// API Functions - Content Pieces
// ============================================================================

export interface ContentPieceFilters {
  page?: number
  per_page?: number
  status?: ContentStatus
}

export async function listContentPieces(filters?: ContentPieceFilters): Promise<AdminContentPieceListResponse> {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.per_page) params.append('per_page', filters.per_page.toString())
  if (filters?.status) params.append('status', filters.status)

  const query = params.toString()
  return apiClient.get<AdminContentPieceListResponse>(`/api/master-admin/content/pieces${query ? `?${query}` : ''}`)
}

export async function createContentPiece(piece: AdminContentPieceCreate): Promise<AdminContentPiece> {
  return apiClient.post<AdminContentPiece>('/api/master-admin/content/pieces', piece)
}

export async function getContentPiece(pieceId: number): Promise<AdminContentPiece> {
  return apiClient.get<AdminContentPiece>(`/api/master-admin/content/pieces/${pieceId}`)
}

export async function updateContentPiece(pieceId: number, update: AdminContentPieceUpdate): Promise<AdminContentPiece> {
  return apiClient.put<AdminContentPiece>(`/api/master-admin/content/pieces/${pieceId}`, update)
}

export async function deleteContentPiece(pieceId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/content/pieces/${pieceId}`)
}

// ============================================================================
// API Functions - Lead Captures
// ============================================================================

export interface LeadCaptureFilters {
  page?: number
  per_page?: number
  event_name?: string
}

export async function listLeadCaptures(filters?: LeadCaptureFilters): Promise<AdminLeadCaptureListResponse> {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.per_page) params.append('per_page', filters.per_page.toString())
  if (filters?.event_name) params.append('event_name', filters.event_name)

  const query = params.toString()
  return apiClient.get<AdminLeadCaptureListResponse>(`/api/master-admin/lead-captures${query ? `?${query}` : ''}`)
}

export async function createLeadCapture(lead: AdminLeadCaptureCreate): Promise<AdminLeadCapture> {
  return apiClient.post<AdminLeadCapture>('/api/master-admin/lead-captures', lead)
}

export async function getLeadCapture(leadId: number): Promise<AdminLeadCapture> {
  return apiClient.get<AdminLeadCapture>(`/api/master-admin/lead-captures/${leadId}`)
}

export async function updateLeadCapture(leadId: number, update: AdminLeadCaptureUpdate): Promise<AdminLeadCapture> {
  return apiClient.put<AdminLeadCapture>(`/api/master-admin/lead-captures/${leadId}`, update)
}

export async function deleteLeadCapture(leadId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/lead-captures/${leadId}`)
}

export async function syncLeadToGHL(leadId: number): Promise<AdminLeadCapture> {
  return apiClient.post<AdminLeadCapture>(`/api/master-admin/lead-captures/${leadId}/sync-ghl`)
}

// ============================================================================
// API Functions - Sales Collateral
// ============================================================================

export async function listCollateral(page = 1, perPage = 50): Promise<AdminCollateralListResponse> {
  return apiClient.get<AdminCollateralListResponse>(`/api/master-admin/collateral?page=${page}&per_page=${perPage}`)
}

export async function createCollateral(collateral: AdminCollateralCreate): Promise<AdminCollateral> {
  return apiClient.post<AdminCollateral>('/api/master-admin/collateral', collateral)
}

export async function getCollateral(collateralId: number): Promise<AdminCollateral> {
  return apiClient.get<AdminCollateral>(`/api/master-admin/collateral/${collateralId}`)
}

export async function updateCollateral(collateralId: number, update: AdminCollateralUpdate): Promise<AdminCollateral> {
  return apiClient.put<AdminCollateral>(`/api/master-admin/collateral/${collateralId}`, update)
}

export async function deleteCollateral(collateralId: number): Promise<void> {
  return apiClient.delete<void>(`/api/master-admin/collateral/${collateralId}`)
}

export async function trackCollateralUsage(usage: AdminCollateralUsageCreate): Promise<AdminCollateralUsage> {
  return apiClient.post<AdminCollateralUsage>('/api/master-admin/collateral/usage', usage)
}

// ============================================================================
// API Functions - Dashboard
// ============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>('/api/master-admin/dashboard')
}
