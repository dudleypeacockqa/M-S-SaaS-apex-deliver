/**
 * CampaignManager Page
 *
 * Main page for campaign management with list view and create modal
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import {
  CampaignList,
  CampaignDetailModal,
  CampaignForm,
  SendCampaignDialog,
} from '@/components/master-admin/campaigns'
import type { AdminCampaign } from '@/services/api/masterAdmin'

export const CampaignManager: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCampaign, setSelectedCampaign] = useState<AdminCampaign | null>(null)
  const [isAddingCampaign, setIsAddingCampaign] = useState(false)
  const [campaignToSend, setCampaignToSend] = useState<AdminCampaign | null>(null)

  const handleCampaignClick = (campaign: AdminCampaign) => {
    setSelectedCampaign(campaign)
  }

  const handleCampaignEdit = (campaign: AdminCampaign) => {
    setSelectedCampaign(campaign)
  }

  const handleCampaignSend = (campaign: AdminCampaign) => {
    setCampaignToSend(campaign)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              btnSize="sm"
              onClick={() => navigate('/master-admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaign Manager</h1>
              <p className="text-gray-600 mt-1">
                Create and manage email campaigns
              </p>
            </div>

            {/* Add Campaign Button */}
            <Button variant="primary" onClick={() => setIsAddingCampaign(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-6">
        <CampaignList
          onCampaignClick={handleCampaignClick}
          onCampaignEdit={handleCampaignEdit}
          onCampaignSend={handleCampaignSend}
        />
      </div>

      {/* Add Campaign Modal */}
      {isAddingCampaign && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsAddingCampaign(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
                <button
                  onClick={() => setIsAddingCampaign(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <CampaignForm
                onSuccess={() => {
                  setIsAddingCampaign(false)
                }}
                onCancel={() => setIsAddingCampaign(false)}
              />
            </div>
          </div>
        </>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onDeleted={() => setSelectedCampaign(null)}
        />
      )}

      {/* Send Campaign Dialog */}
      {campaignToSend && (
        <SendCampaignDialog
          campaign={campaignToSend}
          isOpen={!!campaignToSend}
          onClose={() => setCampaignToSend(null)}
          onSuccess={() => setCampaignToSend(null)}
        />
      )}
    </div>
  )
}

export default CampaignManager
