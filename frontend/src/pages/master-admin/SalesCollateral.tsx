/**
 * SalesCollateral Page
 *
 * Main page for sales collateral management
 * Simplified implementation with inline components
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, FileText, Download, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  useCollateral,
  useCreateCollateral,
  useUpdateCollateral,
  useDeleteCollateral,
} from '@/hooks/master-admin'
import { CollateralType } from '@/services/api/masterAdmin'
import type {
  AdminCollateral,
  AdminCollateralCreate,
  CollateralFilters,
} from '@/services/api/masterAdmin'

export const SalesCollateral: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<CollateralFilters>({ page: 1, per_page: 12 })
  const [isAdding, setIsAdding] = useState(false)
  const [editingCollateral, setEditingCollateral] = useState<AdminCollateral | null>(null)

  const { data, isLoading } = useCollateral(filters)
  const createCollateral = useCreateCollateral()
  const updateCollateral = useUpdateCollateral()
  const deleteCollateral = useDeleteCollateral()

  const [formData, setFormData] = useState<AdminCollateralCreate>({
    title: '',
    description: '',
    file_url: '',
    file_type: CollateralType.PDF,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCollateral) {
        await updateCollateral.mutateAsync({ collateralId: editingCollateral.id, update: formData })
        setEditingCollateral(null)
      } else {
        await createCollateral.mutateAsync(formData)
      }
      setIsAdding(false)
      setFormData({ title: '', description: '', file_url: '', file_type: CollateralType.PDF })
    } catch (error) {
      console.error('Failed to save collateral:', error)
    }
  }

  const handleDelete = async (collateral: AdminCollateral) => {
    if (confirm(`Delete collateral: ${collateral.title}?`)) {
      await deleteCollateral.mutateAsync(collateral.id)
    }
  }

  const items = data?.items || []
  const totalPages = data?.total ? Math.ceil(data.total / (filters.per_page || 12)) : 1

  const getFileTypeBadge = (type: CollateralType) => {
    const styles = {
      [CollateralType.PDF]: 'bg-red-100 text-red-800',
      [CollateralType.VIDEO]: 'bg-purple-100 text-purple-800',
      [CollateralType.PRESENTATION]: 'bg-blue-100 text-blue-800',
      [CollateralType.DOCUMENT]: 'bg-green-100 text-green-800',
      [CollateralType.SPREADSHEET]: 'bg-yellow-100 text-yellow-800',
    }
    const labels = {
      [CollateralType.PDF]: 'PDF',
      [CollateralType.VIDEO]: 'Video',
      [CollateralType.PRESENTATION]: 'Presentation',
      [CollateralType.DOCUMENT]: 'Document',
      [CollateralType.SPREADSHEET]: 'Spreadsheet',
    }
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>{labels[type]}</span>
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
              <h1 className="text-3xl font-bold text-gray-900">Sales Collateral</h1>
              <p className="text-gray-600 mt-1">Manage sales materials and track usage</p>
            </div>
            <Button variant="primary" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Collateral
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6">
        {/* Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
          <select value={filters.file_type || ''} onChange={e => setFilters(prev => ({ ...prev, file_type: e.target.value || undefined, page: 1 }))} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value={CollateralType.PDF}>PDF</option>
            <option value={CollateralType.VIDEO}>Video</option>
            <option value={CollateralType.PRESENTATION}>Presentation</option>
            <option value={CollateralType.DOCUMENT}>Document</option>
            <option value={CollateralType.SPREADSHEET}>Spreadsheet</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-56 rounded-lg" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>}
                    </div>
                  </div>
                  {getFileTypeBadge(item.file_type)}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{item.download_count || 0} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{item.view_count || 0} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                    <Calendar className="h-3 w-3" />
                    <span>Added {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {item.file_url && <Button variant="outline" btnSize="sm" onClick={() => window.open(item.file_url, '_blank')}>View</Button>}
                    <Button variant="outline" btnSize="sm" onClick={() => { setEditingCollateral(item); setFormData(item); setIsAdding(true); }}>Edit</Button>
                    <Button variant="danger" btnSize="sm" onClick={() => handleDelete(item)}>Delete</Button>
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
            <p className="text-lg">No collateral yet</p>
            <p className="text-sm mt-2">Add your first sales material to get started</p>
          </div>
        )}
      </div>

      {isAdding && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => { setIsAdding(false); setEditingCollateral(null); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{editingCollateral ? 'Edit Collateral' : 'Add New Collateral'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={formData.description || ''} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Type *</label>
                  <select value={formData.file_type} onChange={e => setFormData(prev => ({ ...prev, file_type: e.target.value as CollateralType }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value={CollateralType.PDF}>PDF</option>
                    <option value={CollateralType.VIDEO}>Video</option>
                    <option value={CollateralType.PRESENTATION}>Presentation</option>
                    <option value={CollateralType.DOCUMENT}>Document</option>
                    <option value={CollateralType.SPREADSHEET}>Spreadsheet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File URL *</label>
                  <input type="url" value={formData.file_url} onChange={e => setFormData(prev => ({ ...prev, file_url: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." required />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button type="submit" variant="primary" loading={createCollateral.isPending || updateCollateral.isPending}>{editingCollateral ? 'Update Collateral' : 'Add Collateral'}</Button>
                  <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingCollateral(null); }}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SalesCollateral
