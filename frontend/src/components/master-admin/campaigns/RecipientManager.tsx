/**
 * RecipientManager Component
 *
 * Manage campaign recipients (add/remove)
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { RecipientList } from './RecipientList'
import { useAddCampaignRecipient, useProspects } from '@/hooks/master-admin'
import { Plus, Search } from '@/lib/icons'
import type { AdminProspect } from '@/services/api/masterAdmin'

export interface RecipientManagerProps {
  campaignId: number
}

export const RecipientManager: React.FC<RecipientManagerProps> = ({ campaignId }) => {
  const [isAddingRecipients, setIsAddingRecipients] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: prospectsData, isLoading: prospectsLoading } = useProspects({ per_page: 100 })
  const addRecipient = useAddCampaignRecipient()

  const handleAddRecipient = async (prospectId: number) => {
    try {
      await addRecipient.mutateAsync({
        campaign_id: campaignId,
        prospect_id: prospectId,
      })
    } catch (error) {
      console.error('Failed to add recipient:', error)
    }
  }

  const filteredProspects = prospectsData?.items?.filter((prospect) => {
    const query = searchQuery.toLowerCase()
    return (
      prospect.name.toLowerCase().includes(query) ||
      prospect.email?.toLowerCase().includes(query) ||
      prospect.company?.toLowerCase().includes(query)
    )
  }) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recipients</h3>
        <Button
          variant="primary"
          btnSize="sm"
          onClick={() => setIsAddingRecipients(!isAddingRecipients)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Recipients
        </Button>
      </div>

      {/* Add Recipients Panel */}
      {isAddingRecipients && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Add from Prospects</h4>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prospects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prospects List */}
          {prospectsLoading ? (
            <div className="text-center py-4 text-gray-500">Loading prospects...</div>
          ) : filteredProspects.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredProspects.map((prospect) => (
                <div
                  key={prospect.id}
                  className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{prospect.name}</p>
                    {prospect.email && <p className="text-sm text-gray-600 truncate">{prospect.email}</p>}
                    {prospect.company && <p className="text-xs text-gray-500 truncate">{prospect.company}</p>}
                  </div>
                  <Button
                    variant="outline"
                    btnSize="sm"
                    onClick={() => handleAddRecipient(prospect.id)}
                    loading={addRecipient.isPending}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchQuery ? 'No prospects match your search' : 'No prospects available'}
            </div>
          )}
        </div>
      )}

      {/* Recipients List */}
      <RecipientList campaignId={campaignId} />
    </div>
  )
}
