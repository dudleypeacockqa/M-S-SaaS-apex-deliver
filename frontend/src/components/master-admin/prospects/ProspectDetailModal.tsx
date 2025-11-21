/**
 * ProspectDetailModal Component
 *
 * Modal displaying full prospect details with deals and actions
 */

import React, { useState } from 'react'
import { cn } from '@/styles/design-tokens'
import { X, Edit2, Trash2, Plus, Mail, Phone, Building2, User, Tag } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { ProspectForm } from './ProspectForm'
import { DealCard } from './DealCard'
import { AddDealForm } from './AddDealForm'
import { useDeleteProspect, useDeals, useDeleteDeal } from '@/hooks/master-admin'
import type { AdminProspect } from '@/services/api/masterAdmin'

export interface ProspectDetailModalProps {
  prospect: AdminProspect
  isOpen: boolean
  onClose: () => void
  onDeleted?: () => void
}

export const ProspectDetailModal: React.FC<ProspectDetailModalProps> = ({
  prospect,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingDeal, setIsAddingDeal] = useState(false)

  const deleteProspect = useDeleteProspect()
  const deleteDeal = useDeleteDeal()
  const { data: dealsData } = useDeals({ page: 1, per_page: 50 })

  // Filter deals for this prospect
  const prospectDeals = dealsData?.items?.filter((deal) => deal.prospect_id === prospect.id) || []

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${prospect.name}? This will also delete all associated deals.`)) {
      try {
        await deleteProspect.mutateAsync(prospect.id)
        onDeleted?.()
        onClose()
      } catch (error) {
        console.error('Failed to delete prospect:', error)
      }
    }
  }

  const handleDeleteDeal = async (dealId: number) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal.mutateAsync(dealId)
      } catch (error) {
        console.error('Failed to delete deal:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={cn(
            'bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto',
            'transform transition-all'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Prospect' : prospect.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              /* Edit Mode */
              <ProspectForm
                prospect={prospect}
                onSuccess={() => {
                  setIsEditing(false)
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Prospect Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prospect.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <a
                          href={`mailto:${prospect.email}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {prospect.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {prospect.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a
                          href={`tel:${prospect.phone}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {prospect.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {prospect.company && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Company</p>
                        <p className="text-sm font-medium text-gray-900">{prospect.company}</p>
                      </div>
                    </div>
                  )}

                  {prospect.title && (
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Title</p>
                        <p className="text-sm font-medium text-gray-900">{prospect.title}</p>
                      </div>
                    </div>
                  )}

                  {prospect.source && (
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Source</p>
                        <p className="text-sm font-medium text-gray-900">{prospect.source}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {prospect.tags && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(prospect.tags).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {prospect.notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Notes</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {prospect.notes}
                    </p>
                  </div>
                )}

                {/* Deals Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Deals ({prospectDeals.length})
                    </h3>
                    <Button
                      variant="primary"
                      btnSize="sm"
                      onClick={() => setIsAddingDeal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Deal
                    </Button>
                  </div>

                  {isAddingDeal && (
                    <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                      <AddDealForm
                        prospectId={prospect.id}
                        onSuccess={() => setIsAddingDeal(false)}
                        onCancel={() => setIsAddingDeal(false)}
                      />
                    </div>
                  )}

                  {prospectDeals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prospectDeals.map((deal) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          onDelete={() => handleDeleteDeal(deal.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No deals yet.</p>
                      <p className="text-sm mt-1">Add a deal to track opportunities with this prospect.</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Prospect
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    loading={deleteProspect.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Prospect
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
