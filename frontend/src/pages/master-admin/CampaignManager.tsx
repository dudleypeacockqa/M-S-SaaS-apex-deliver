/**
 * CampaignManager Page
 * 
 * Main page for campaign management with multi-channel support.
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Mail, Phone, Calendar, Play, BarChart, Filter } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import {
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useScheduleCampaign,
  useExecuteCampaign,
  useCampaignAnalytics,
} from '@/hooks/useCampaigns'
import type { Campaign, CampaignCreate } from '@/services/api/campaigns'

export const CampaignManager: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<{ page?: number; per_page?: number; status?: string; type?: string }>({
    page: 1,
    per_page: 12,
  })
  const [isAdding, setIsAdding] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null)

  const { data, isLoading } = useCampaigns(filters)
  const createCampaign = useCreateCampaign()
  const updateCampaign = useUpdateCampaign()
  const deleteCampaign = useDeleteCampaign()
  const scheduleCampaign = useScheduleCampaign()
  const executeCampaign = useExecuteCampaign()
  const { data: analytics } = useCampaignAnalytics(selectedCampaign)

  const [formData, setFormData] = useState<CampaignCreate>({
    name: '',
    type: 'email',
    content: '',
    subject: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCampaign) {
        await updateCampaign.mutateAsync({ campaignId: editingCampaign.id, update: formData })
        setEditingCampaign(null)
      } else {
        await createCampaign.mutateAsync(formData)
      }
      setIsAdding(false)
      setFormData({ name: '', type: 'email', content: '', subject: '' })
    } catch (error) {
      console.error('Failed to save campaign:', error)
    }
  }

  const handleDelete = async (campaign: Campaign) => {
    if (confirm(`Delete campaign: ${campaign.name}?`)) {
      await deleteCampaign.mutateAsync(campaign.id)
    }
  }

  const handleSchedule = async (campaign: Campaign) => {
    const scheduleTime = prompt('Enter schedule time (ISO format):')
    if (scheduleTime) {
      await scheduleCampaign.mutateAsync({ campaignId: campaign.id, scheduleAt: scheduleTime })
    }
  }

  const handleExecute = async (campaign: Campaign) => {
    if (confirm(`Execute campaign: ${campaign.name}?`)) {
      await executeCampaign.mutateAsync(campaign.id)
    }
  }

  const campaigns = data?.items || []
  const totalPages = data?.total ? Math.ceil(data.total / (filters.per_page || 12)) : 1

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'voice':
        return <Phone className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'sending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" btnSize="sm" onClick={() => navigate('/master-admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaign Manager</h1>
              <p className="text-gray-600 mt-1">Manage multi-channel outreach campaigns</p>
            </div>
            <Button variant="primary" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined, page: 1 })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="sent">Sent</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.type || ''}
              onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined, page: 1 })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="email">Email</option>
              <option value="voice">Voice</option>
              <option value="linkedin">LinkedIn</option>
              <option value="multi_channel">Multi-Channel</option>
            </select>
          </div>
        </div>

        {/* Analytics for selected campaign */}
        {selectedCampaign && analytics && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{(analytics.open_rate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{(analytics.click_rate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.sent_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.total_recipients}</p>
              </div>
            </div>
          </div>
        )}

        {/* Campaign List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    {getCampaignTypeIcon(campaign.type)}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)} mb-2`}>
                    {campaign.status}
                  </span>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Type: {campaign.type}</p>
                    <p>Recipients: {campaign.total_recipients}</p>
                    <p>Sent: {campaign.sent_count}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {campaign.status === 'draft' && (
                      <>
                        <Button variant="outline" btnSize="sm" onClick={(e) => { e.stopPropagation(); handleSchedule(campaign); }}>
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button variant="primary" btnSize="sm" onClick={(e) => { e.stopPropagation(); handleExecute(campaign); }}>
                          <Play className="h-3 w-3 mr-1" />
                          Execute
                        </Button>
                      </>
                    )}
                    <Button variant="outline" btnSize="sm" onClick={(e) => { e.stopPropagation(); setEditingCampaign(campaign); setFormData(campaign); setIsAdding(true); }}>
                      Edit
                    </Button>
                    <Button variant="danger" btnSize="sm" onClick={(e) => { e.stopPropagation(); handleDelete(campaign); }}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Page {filters.page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    btnSize="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={(filters.page || 1) <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    btnSize="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={(filters.page || 1) >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No campaigns yet</p>
            <p className="text-sm mt-2">Create your first campaign to get started</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isAdding && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => { setIsAdding(false); setEditingCampaign(null); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    id="campaign-name"
                    name="campaign-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="campaign-type" className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    id="campaign-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="email">Email</option>
                    <option value="voice">Voice</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="multi_channel">Multi-Channel</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="campaign-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    id="campaign-subject"
                    name="campaign-subject"
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="campaign-content" className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <textarea
                    id="campaign-content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button type="submit" variant="primary" loading={createCampaign.isPending || updateCampaign.isPending}>
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingCampaign(null); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CampaignManager
