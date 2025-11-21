/**
 * LeadCapture Page
 *
 * Main page for lead capture management
 * Simplified implementation with inline components
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Mail, Calendar, ChevronLeft, ChevronRight } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import {
  useLeadCaptures,
  useCreateLeadCapture,
  useUpdateLeadCapture,
  useDeleteLeadCapture,
} from '@/hooks/master-admin'
import type {
  AdminLeadCapture,
  AdminLeadCaptureCreate,
  LeadCaptureFilters,
} from '@/services/api/masterAdmin'

export const LeadCapture: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<LeadCaptureFilters>({ page: 1, per_page: 12 })
  const [isAdding, setIsAdding] = useState(false)
  const [editingCapture, setEditingCapture] = useState<AdminLeadCapture | null>(null)

  const { data, isLoading } = useLeadCaptures(filters)
  const createCapture = useCreateLeadCapture()
  const updateCapture = useUpdateLeadCapture()
  const deleteCapture = useDeleteLeadCapture()

  const [formData, setFormData] = useState<AdminLeadCaptureCreate>({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    ghl_contact_id: '',
    captured_at: new Date().toISOString(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCapture) {
        await updateCapture.mutateAsync({ captureId: editingCapture.id, update: formData })
        setEditingCapture(null)
      } else {
        await createCapture.mutateAsync(formData)
      }
      setIsAdding(false)
      setFormData({ name: '', email: '', phone: '', company: '', source: '', ghl_contact_id: '', captured_at: new Date().toISOString() })
    } catch (error) {
      console.error('Failed to save lead capture:', error)
    }
  }

  const handleDelete = async (capture: AdminLeadCapture) => {
    if (confirm(`Delete lead: ${capture.name}?`)) {
      await deleteCapture.mutateAsync(capture.id)
    }
  }

  const captures = data?.items || []
  const totalPages = data?.total ? Math.ceil(data.total / (filters.per_page || 12)) : 1

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
              <h1 className="text-3xl font-bold text-gray-900">Lead Capture</h1>
              <p className="text-gray-600 mt-1">Manage captured leads and sync with GoHighLevel</p>
            </div>
            <Button variant="primary" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
            ))}
          </div>
        ) : captures.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {captures.map((capture) => (
                <div key={capture.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{capture.name}</h3>
                  {capture.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Mail className="h-4 w-4" />
                      <span>{capture.email}</span>
                    </div>
                  )}
                  {capture.company && <p className="text-sm text-gray-600 mb-2">Company: {capture.company}</p>}
                  {capture.source && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">{capture.source}</span>}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                    <Calendar className="h-3 w-3" />
                    <span>Captured {new Date(capture.captured_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" btnSize="sm" onClick={() => { setEditingCapture(capture); setFormData(capture); setIsAdding(true); }}>Edit</Button>
                    <Button variant="danger" btnSize="sm" onClick={() => handleDelete(capture)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">Page {filters.page} of {totalPages}</div>
                <div className="flex gap-2">
                  <button onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))} disabled={(filters.page || 1) <= 1} className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"><ChevronLeft className="h-5 w-5" /></button>
                  <button onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))} disabled={(filters.page || 1) >= totalPages} className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"><ChevronRight className="h-5 w-5" /></button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No leads captured yet</p>
            <p className="text-sm mt-2">Add your first lead to get started</p>
          </div>
        )}
      </div>

      {isAdding && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => { setIsAdding(false); setEditingCapture(null); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{editingCapture ? 'Edit Lead' : 'Add New Lead'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={formData.email || ''} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={formData.phone || ''} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" value={formData.company || ''} onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input type="text" value={formData.source || ''} onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Website, LinkedIn, Event" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button type="submit" variant="primary" loading={createCapture.isPending || updateCapture.isPending}>{editingCapture ? 'Update Lead' : 'Add Lead'}</Button>
                  <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingCapture(null); }}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LeadCapture
