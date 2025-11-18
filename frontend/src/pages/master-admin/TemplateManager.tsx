/**
 * TemplateManager Page
 * 
 * Main page for campaign template management.
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Eye, Trash2, Edit } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import {
  useTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useRenderTemplatePreview,
} from '@/hooks/useTemplates'
import type { CampaignTemplate, CampaignTemplateCreate } from '@/services/api/templates'

export const TemplateManager: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<{ type?: string }>({})
  const [isAdding, setIsAdding] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<CampaignTemplate | null>(null)
  const [previewingTemplate, setPreviewingTemplate] = useState<number | null>(null)
  const [previewData, setPreviewData] = useState<Record<string, string>>({})

  const { data, isLoading } = useTemplates(filters)
  const createTemplate = useCreateTemplate()
  const updateTemplate = useUpdateTemplate()
  const deleteTemplate = useDeleteTemplate()
  const renderPreview = useRenderTemplatePreview()

  const [formData, setFormData] = useState<CampaignTemplateCreate>({
    name: '',
    type: 'email',
    content: '',
    subject: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync({ templateId: editingTemplate.id, update: formData })
        setEditingTemplate(null)
      } else {
        await createTemplate.mutateAsync(formData)
      }
      setIsAdding(false)
      setFormData({ name: '', type: 'email', content: '', subject: '' })
    } catch (error) {
      console.error('Failed to save template:', error)
    }
  }

  const handleDelete = async (template: CampaignTemplate) => {
    if (confirm(`Delete template: ${template.name}?`)) {
      await deleteTemplate.mutateAsync(template.id)
    }
  }

  const handlePreview = async (templateId: number) => {
    setPreviewingTemplate(templateId)
    try {
      const result = await renderPreview.mutateAsync({
        templateId,
        contactData: previewData,
      })
      // Preview would be displayed in a modal
      alert(`Preview:\nSubject: ${result.subject}\nContent: ${result.content}`)
    } catch (error) {
      console.error('Failed to preview template:', error)
    }
  }

  const templates = data?.items || []

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
              <h1 className="text-3xl font-bold text-gray-900">Template Manager</h1>
              <p className="text-gray-600 mt-1">Manage reusable campaign templates</p>
            </div>
            <Button variant="primary" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ type: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="voice">Voice</option>
            <option value="linkedin">LinkedIn</option>
            <option value="multi_channel">Multi-Channel</option>
          </select>
        </div>

        {/* Template List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
            ))}
          </div>
        ) : templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                  {template.type}
                </span>
                {template.variables && template.variables.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((varName) => (
                        <span key={varName} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {`{{${varName}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    btnSize="sm"
                    onClick={() => handlePreview(template.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    btnSize="sm"
                    onClick={() => {
                      setEditingTemplate(template)
                      setFormData(template)
                      setIsAdding(true)
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="danger" btnSize="sm" onClick={() => handleDelete(template)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No templates yet</p>
            <p className="text-sm mt-2">Create your first template to get started</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isAdding && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => { setIsAdding(false); setEditingTemplate(null); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hello {{first_name}}"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    required
                    placeholder="Hi {{first_name}}, welcome to {{company}}!"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use {{variable_name}} for template variables</p>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button type="submit" variant="primary" loading={createTemplate.isPending || updateTemplate.isPending}>
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingTemplate(null); }}>
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

export default TemplateManager

