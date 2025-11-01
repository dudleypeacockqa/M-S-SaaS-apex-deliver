/**
 * Master Admin API Client Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as api from './masterAdmin'
import { apiClient } from './client'
import { ActivityType, ActivityStatus, ProspectStatus } from './masterAdmin'

// Mock the apiClient
vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Master Admin API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Goals API', () => {
    it('should create a goal', async () => {
      const mockGoal = {
        id: 1,
        user_id: 'user123',
        week_start: '2025-11-01',
        target_discoveries: 10,
        target_emails: 20,
        target_videos: 5,
        target_calls: 15,
        created_at: '2025-11-01T00:00:00Z',
        updated_at: '2025-11-01T00:00:00Z',
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockGoal)

      const result = await api.createGoal({
        week_start: '2025-11-01',
        target_discoveries: 10,
        target_emails: 20,
        target_videos: 5,
        target_calls: 15,
      })

      expect(apiClient.post).toHaveBeenCalledWith('/api/master-admin/goals', {
        week_start: '2025-11-01',
        target_discoveries: 10,
        target_emails: 20,
        target_videos: 5,
        target_calls: 15,
      })
      expect(result).toEqual(mockGoal)
    })

    it('should get current goal', async () => {
      const mockGoal = { id: 1, week_start: '2025-11-01' }
      vi.mocked(apiClient.get).mockResolvedValue(mockGoal)

      const result = await api.getCurrentGoal()

      expect(apiClient.get).toHaveBeenCalledWith('/api/master-admin/goals/current')
      expect(result).toEqual(mockGoal)
    })

    it('should update a goal', async () => {
      const mockGoal = { id: 1, target_discoveries: 15 }
      vi.mocked(apiClient.put).mockResolvedValue(mockGoal)

      const result = await api.updateGoal(1, { target_discoveries: 15 })

      expect(apiClient.put).toHaveBeenCalledWith('/api/master-admin/goals/1', {
        target_discoveries: 15,
      })
      expect(result).toEqual(mockGoal)
    })
  })

  describe('Activities API', () => {
    it('should list activities without filters', async () => {
      const mockResponse = {
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await api.listActivities()

      expect(apiClient.get).toHaveBeenCalledWith('/api/master-admin/activities')
      expect(result).toEqual(mockResponse)
    })

    it('should list activities with filters', async () => {
      const mockResponse = {
        items: [],
        total: 0,
        page: 1,
        per_page: 20,
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const filters = {
        page: 1,
        per_page: 20,
        start_date: '2025-11-01',
        end_date: '2025-11-07',
        activity_type: ActivityType.DISCOVERY,
      }

      await api.listActivities(filters)

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/master-admin/activities?page=1&per_page=20&start_date=2025-11-01&end_date=2025-11-07&activity_type=discovery'
      )
    })

    it('should create an activity', async () => {
      const mockActivity = {
        id: 1,
        user_id: 'user123',
        type: ActivityType.EMAIL,
        status: ActivityStatus.DONE,
        date: '2025-11-01',
        amount: 5,
        created_at: '2025-11-01T00:00:00Z',
        updated_at: '2025-11-01T00:00:00Z',
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockActivity)

      const result = await api.createActivity({
        type: ActivityType.EMAIL,
        status: ActivityStatus.DONE,
        date: '2025-11-01',
        amount: 5,
      })

      expect(apiClient.post).toHaveBeenCalledWith('/api/master-admin/activities', {
        type: ActivityType.EMAIL,
        status: ActivityStatus.DONE,
        date: '2025-11-01',
        amount: 5,
      })
      expect(result).toEqual(mockActivity)
    })

    it('should delete an activity', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      await api.deleteActivity(1)

      expect(apiClient.delete).toHaveBeenCalledWith('/api/master-admin/activities/1')
    })
  })

  describe('Scores API', () => {
    it('should get today\'s score', async () => {
      const mockScore = {
        id: 1,
        user_id: 'user123',
        date: '2025-11-01',
        score: 85,
        streak_days: 7,
        activities_count: 10,
        created_at: '2025-11-01T00:00:00Z',
        updated_at: '2025-11-01T00:00:00Z',
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockScore)

      const result = await api.getTodayScore()

      expect(apiClient.get).toHaveBeenCalledWith('/api/master-admin/scores/today')
      expect(result).toEqual(mockScore)
    })

    it('should get current streak', async () => {
      const mockStreak = { streak_days: 7, current_score: 85 }
      vi.mocked(apiClient.get).mockResolvedValue(mockStreak)

      const result = await api.getCurrentStreak()

      expect(apiClient.get).toHaveBeenCalledWith('/api/master-admin/scores/streak')
      expect(result).toEqual(mockStreak)
    })
  })

  describe('Focus Sessions API', () => {
    it('should start a focus session', async () => {
      const mockSession = {
        id: 1,
        user_id: 'user123',
        start_time: '2025-11-01T10:00:00Z',
        duration_minutes: 50,
        completed: false,
        interrupted: false,
        created_at: '2025-11-01T10:00:00Z',
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockSession)

      const result = await api.startFocusSession({
        start_time: '2025-11-01T10:00:00Z',
        duration_minutes: 50,
      })

      expect(apiClient.post).toHaveBeenCalledWith('/api/master-admin/focus-sessions', {
        start_time: '2025-11-01T10:00:00Z',
        duration_minutes: 50,
      })
      expect(result).toEqual(mockSession)
    })

    it('should get active focus session', async () => {
      const mockSession = { id: 1, completed: false }
      vi.mocked(apiClient.get).mockResolvedValue(mockSession)

      const result = await api.getActiveFocusSession()

      expect(apiClient.get).toHaveBeenCalledWith('/api/master-admin/focus-sessions/active')
      expect(result).toEqual(mockSession)
    })

    it('should return null if no active session (404)', async () => {
      const error = new Error('Not found')
      ;(error as any).statusCode = 404
      vi.mocked(apiClient.get).mockRejectedValue(error)

      const result = await api.getActiveFocusSession()

      expect(result).toBeNull()
    })
  })

  describe('Prospects API', () => {
    it('should list prospects without filters', async () => {
      const mockResponse = {
        items: [],
        total: 0,
        page: 1,
        per_page: 50,
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await api.listProspects()

      expect(apiClient.get).toHaveBeenCalledWith('/api/master-admin/prospects')
      expect(result).toEqual(mockResponse)
    })

    it('should list prospects with filters', async () => {
      const mockResponse = { items: [], total: 0, page: 1, per_page: 20 }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const filters = {
        page: 1,
        per_page: 20,
        search: 'John',
        status: ProspectStatus.QUALIFIED,
      }

      await api.listProspects(filters)

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/master-admin/prospects?page=1&per_page=20&search=John&status=qualified'
      )
    })

    it('should create a prospect', async () => {
      const mockProspect = {
        id: 1,
        user_id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        status: ProspectStatus.NEW,
        created_at: '2025-11-01T00:00:00Z',
        updated_at: '2025-11-01T00:00:00Z',
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockProspect)

      const result = await api.createProspect({
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(apiClient.post).toHaveBeenCalledWith('/api/master-admin/prospects', {
        name: 'John Doe',
        email: 'john@example.com',
      })
      expect(result).toEqual(mockProspect)
    })
  })

  describe('Dashboard API', () => {
    it('should get dashboard stats', async () => {
      const mockStats = {
        score: 85,
        streak: 7,
        activities_today: 10,
        prospects_active: 25,
        deals_active: 5,
        unread_nudges: 3,
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockStats)

      const result = await api.getDashboardStats()

      expect(apiClient.get).toHaveBeenCalledWith('/api/master-admin/dashboard')
      expect(result).toEqual(mockStats)
    })
  })
})
