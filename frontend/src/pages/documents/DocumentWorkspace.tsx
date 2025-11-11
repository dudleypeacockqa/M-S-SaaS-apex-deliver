import React, { useState } from 'react'
import { FolderTree } from '../../components/documents/FolderTree'
import { DocumentList } from '../../components/documents/DocumentList'
import UploadPanel from '../../components/documents/UploadPanel'
import { PermissionModal } from '../../components/documents/PermissionModal'
import type { Document } from '../../services/api/documents'

export interface DocumentWorkspaceProps {
  dealId: string
}

const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({ dealId }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false)

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId)
  }

  const handleManagePermissions = (document: Document) => {
    setSelectedDocument(document)
    setPermissionModalOpen(true)
  }

  const closePermissionModal = () => {
    setPermissionModalOpen(false)
    setSelectedDocument(null)
  }

  return (
    <div
      data-testid="workspace-layout"
      className="grid grid-cols-[320px_1fr] gap-6 h-full"
    >
      <aside data-testid="folder-pane" className="border rounded-lg bg-white">
        <FolderTree
          dealId={dealId}
          selectedFolderId={selectedFolderId}
          onFolderSelect={handleFolderSelect}
        />
      </aside>

      <section data-testid="document-pane" className="flex flex-col border rounded-lg bg-white">
        <DocumentList
          dealId={dealId}
          folderId={selectedFolderId}
          onManagePermissions={handleManagePermissions}
        />
      </section>

      <div data-testid="upload-pane" className="border rounded-lg bg-white p-4">
        <UploadPanel onUpload={() => {}} isUploading={false} />
      </div>

      {selectedDocument && (
        <PermissionModal
          documentId={selectedDocument.id}
          isOpen={isPermissionModalOpen}
          onClose={closePermissionModal}
        />
      )}
    </div>
  )
}

export default DocumentWorkspace
