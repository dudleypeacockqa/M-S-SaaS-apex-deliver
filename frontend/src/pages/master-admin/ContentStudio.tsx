/**
 * ContentStudio Page
 *
 * Main page for content creation and management
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, FileText, Newspaper } from 'lucide-react'
import { cn } from '@/styles/design-tokens'
import { Button } from '@/components/ui/Button'
import {
  ScriptList,
  ScriptEditor,
  ContentPieceList,
  ContentPieceForm,
} from '@/components/master-admin/content'
import type { AdminContentScript, AdminContentPiece } from '@/services/api/masterAdmin'

type TabType = 'scripts' | 'published'

export const ContentStudio: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('scripts')
  const [selectedScript, setSelectedScript] = useState<AdminContentScript | null>(null)
  const [isAddingScript, setIsAddingScript] = useState(false)
  const [selectedPiece, setSelectedPiece] = useState<AdminContentPiece | null>(null)
  const [isAddingPiece, setIsAddingPiece] = useState(false)

  const handleScriptClick = (script: AdminContentScript) => {
    setSelectedScript(script)
  }

  const handleScriptEdit = (script: AdminContentScript) => {
    setSelectedScript(script)
  }

  const handlePieceClick = (piece: AdminContentPiece) => {
    setSelectedPiece(piece)
  }

  const handlePieceEdit = (piece: AdminContentPiece) => {
    setSelectedPiece(piece)
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Studio</h1>
              <p className="text-gray-600 mt-1">
                Create scripts and publish content
              </p>
            </div>

            {/* Add Button */}
            <Button
              variant="primary"
              onClick={() => (activeTab === 'scripts' ? setIsAddingScript(true) : setIsAddingPiece(true))}
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === 'scripts' ? 'New Script' : 'New Content'}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 -mb-4 pb-0">
            <button
              onClick={() => setActiveTab('scripts')}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                activeTab === 'scripts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              )}
            >
              <FileText className="h-4 w-4" />
              Scripts
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                activeTab === 'published'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              )}
            >
              <Newspaper className="h-4 w-4" />
              Published Content
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-6">
        {activeTab === 'scripts' ? (
          <ScriptList onScriptClick={handleScriptClick} onScriptEdit={handleScriptEdit} />
        ) : (
          <ContentPieceList onPieceClick={handlePieceClick} onPieceEdit={handlePieceEdit} />
        )}
      </div>

      {/* Add Script Modal */}
      {isAddingScript && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsAddingScript(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Create New Script</h2>
                <button
                  onClick={() => setIsAddingScript(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <ScriptEditor
                onSuccess={() => setIsAddingScript(false)}
                onCancel={() => setIsAddingScript(false)}
              />
            </div>
          </div>
        </>
      )}

      {/* Edit Script Modal */}
      {selectedScript && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedScript(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Edit Script</h2>
                <button
                  onClick={() => setSelectedScript(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <ScriptEditor
                script={selectedScript}
                onSuccess={() => setSelectedScript(null)}
                onCancel={() => setSelectedScript(null)}
              />
            </div>
          </div>
        </>
      )}

      {/* Add Content Piece Modal */}
      {isAddingPiece && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsAddingPiece(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Create Content Piece</h2>
                <button
                  onClick={() => setIsAddingPiece(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <ContentPieceForm
                onSuccess={() => setIsAddingPiece(false)}
                onCancel={() => setIsAddingPiece(false)}
              />
            </div>
          </div>
        </>
      )}

      {/* Edit Content Piece Modal */}
      {selectedPiece && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedPiece(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Edit Content Piece</h2>
                <button
                  onClick={() => setSelectedPiece(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <ContentPieceForm
                piece={selectedPiece}
                onSuccess={() => setSelectedPiece(null)}
                onCancel={() => setSelectedPiece(null)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ContentStudio
