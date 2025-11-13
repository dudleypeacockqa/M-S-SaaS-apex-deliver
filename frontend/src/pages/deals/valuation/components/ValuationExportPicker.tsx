/**
 * Valuation Export Template Picker Component
 * Provides template selection with preview for valuation exports
 */

import React, { useState } from 'react'

export interface ExportTemplate {
  id: string
  name: string
  description: string
  preview: string
}

interface ValuationExportPickerProps {
  templates: ExportTemplate[]
  onSelect: (templateId: string, format: 'pdf' | 'docx') => void
  defaultFormat?: 'pdf' | 'docx'
}

export const ValuationExportPicker: React.FC<ValuationExportPickerProps> = ({
  templates,
  onSelect,
  defaultFormat = 'pdf',
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx'>(defaultFormat)

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate, selectedFormat)
    }
  }

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate)

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="export-format" className="block text-sm font-medium text-gray-700 mb-2">
          Export Format
        </label>
        <select
          id="export-format"
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value as 'pdf' | 'docx')}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="pdf">PDF</option>
          <option value="docx">Word Document (.docx)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Export Template
        </label>
        <div className="grid grid-cols-1 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleTemplateClick(template.id)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                selectedTemplate === template.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{template.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{template.description}</p>
                </div>
                {selectedTemplate === template.id && (
                  <span className="ml-2 text-indigo-600">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedTemplateData && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Template Preview</h4>
          <p className="text-sm text-gray-600">{selectedTemplateData.preview}</p>
          <button
            type="button"
            onClick={handleConfirm}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Use This Template
          </button>
        </div>
      )}
    </div>
  )
}

