/**
 * ProspectPipeline Page
 *
 * Main page for prospect management with Kanban and List views
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, LayoutGrid, List } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import {
  ProspectKanban,
  ProspectList,
  ProspectDetailModal,
  ProspectForm,
} from '@/components/master-admin/prospects'
import { ProspectStatus } from '@/services/api/masterAdmin'
import type { AdminProspect } from '@/services/api/masterAdmin'

type ViewMode = 'kanban' | 'list'

export const ProspectPipeline: React.FC = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [selectedProspect, setSelectedProspect] = useState<AdminProspect | null>(null)
  const [isAddingProspect, setIsAddingProspect] = useState(false)
  const [initialStatus, setInitialStatus] = useState<ProspectStatus | undefined>()

  const handleAddProspect = (status?: ProspectStatus) => {
    setInitialStatus(status)
    setIsAddingProspect(true)
  }

  const handleProspectClick = (prospect: AdminProspect) => {
    setSelectedProspect(prospect)
  }

  const handleProspectEdit = (prospect: AdminProspect) => {
    setSelectedProspect(prospect)
  }

  const handleProspectDelete = (prospect: AdminProspect) => {
    if (confirm(`Are you sure you want to delete ${prospect.name}?`)) {
      // Delete is handled by ProspectCard/ProspectDetailModal
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Prospect Pipeline</h1>
              <p className="text-gray-600 mt-1">
                Manage your prospects and track deal progress
              </p>
            </div>

            {/* View Toggle & Add Button */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-4 py-2 text-sm font-medium border ${
                    viewMode === 'kanban'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } rounded-l-lg transition-colors`}
                >
                  <LayoutGrid className="h-4 w-4 inline mr-2" />
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium border-t border-r border-b ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } rounded-r-lg transition-colors`}
                >
                  <List className="h-4 w-4 inline mr-2" />
                  List
                </button>
              </div>

              {/* Add Prospect Button */}
              <Button variant="primary" onClick={() => handleAddProspect()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Prospect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-6">
        {viewMode === 'kanban' ? (
          <ProspectKanban
            onProspectClick={handleProspectClick}
            onProspectEdit={handleProspectEdit}
            onProspectDelete={handleProspectDelete}
            onAddProspect={handleAddProspect}
          />
        ) : (
          <ProspectList
            onProspectClick={handleProspectClick}
            onProspectEdit={handleProspectEdit}
            onProspectDelete={handleProspectDelete}
          />
        )}
      </div>

      {/* Add Prospect Modal */}
      {isAddingProspect && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsAddingProspect(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add New Prospect</h2>
                <button
                  onClick={() => setIsAddingProspect(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <ProspectForm
                prospect={initialStatus ? { status: initialStatus } as any : undefined}
                onSuccess={() => {
                  setIsAddingProspect(false)
                  setInitialStatus(undefined)
                }}
                onCancel={() => {
                  setIsAddingProspect(false)
                  setInitialStatus(undefined)
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Prospect Detail Modal */}
      {selectedProspect && (
        <ProspectDetailModal
          prospect={selectedProspect}
          isOpen={!!selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onDeleted={() => setSelectedProspect(null)}
        />
      )}
    </div>
  )
}

export default ProspectPipeline
