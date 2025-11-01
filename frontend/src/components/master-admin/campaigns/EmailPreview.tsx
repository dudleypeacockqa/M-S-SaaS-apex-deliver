/**
 * EmailPreview Component
 *
 * Preview email content (HTML and text versions)
 */

import React, { useState } from 'react'
import { cn } from '@/styles/design-tokens'
import { Mail, FileText } from 'lucide-react'
import type { AdminCampaign } from '@/services/api/masterAdmin'

export interface EmailPreviewProps {
  campaign: AdminCampaign
  className?: string
}

type PreviewMode = 'html' | 'text'

export const EmailPreview: React.FC<EmailPreviewProps> = ({ campaign, className }) => {
  const [mode, setMode] = useState<PreviewMode>('html')

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Preview</h3>

        {/* Mode Toggle */}
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setMode('html')}
            className={cn(
              'px-4 py-2 text-sm font-medium border',
              mode === 'html'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              'rounded-l-lg transition-colors'
            )}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            HTML
          </button>
          <button
            onClick={() => setMode('text')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-t border-r border-b',
              mode === 'text'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              'rounded-r-lg transition-colors'
            )}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Text
          </button>
        </div>
      </div>

      {/* Subject Line */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Subject:</p>
        <p className="font-medium text-gray-900">{campaign.subject_line || '(No subject)'}</p>
      </div>

      {/* Preview Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {mode === 'html' ? (
          /* HTML Preview */
          campaign.body_html ? (
            <div className="p-6">
              {/* Render HTML in iframe for safety */}
              <iframe
                srcDoc={campaign.body_html}
                className="w-full border-0"
                style={{ minHeight: '400px' }}
                sandbox="allow-same-origin"
                title="Email HTML Preview"
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No HTML content</p>
            </div>
          )
        ) : (
          /* Text Preview */
          campaign.body_text ? (
            <div className="p-6">
              <pre className="font-sans text-sm text-gray-900 whitespace-pre-wrap">
                {campaign.body_text}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No plain text content</p>
            </div>
          )
        )}
      </div>

      {/* Warnings */}
      <div className="space-y-2">
        {!campaign.body_html && !campaign.body_text && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <p className="font-medium">⚠️ Missing Content</p>
            <p className="mt-1">Add HTML or plain text content before sending this campaign.</p>
          </div>
        )}
        {!campaign.subject_line && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <p className="font-medium">⚠️ Missing Subject</p>
            <p className="mt-1">Add a subject line to improve open rates.</p>
          </div>
        )}
        {campaign.body_html && !campaign.body_text && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium">💡 Tip</p>
            <p className="mt-1">Add a plain text version as a fallback for email clients that don't support HTML.</p>
          </div>
        )}
      </div>
    </div>
  )
}
