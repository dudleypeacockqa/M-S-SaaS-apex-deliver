import React, { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import {
  formatFileSize,
  listDocuments,
  uploadDocument,
  type PaginatedDocuments,
} from '../../services/api/documents'

const DOCUMENTS_QUERY_KEY = (dealId: string) => ['deal-documents', dealId]

export const DealDocuments: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (!dealId) {
    throw new Error('dealId param is required to render DealDocuments')
  }

  const documentsQuery = useQuery({
    queryKey: DOCUMENTS_QUERY_KEY(dealId),
    queryFn: () => listDocuments(dealId),
  })

  const uploadMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => uploadDocument(dealId, file, { folderId: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY(dealId) })
    },
  })

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    await uploadMutation.mutateAsync({ file })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const data: PaginatedDocuments | undefined = documentsQuery.data
  const documents = data?.items ?? []

  return (
    <section data-testid="deal-documents" className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Deal Documents</h1>
        <p className="mt-2 text-slate-500">
          Manage diligence materials, contracts, disclosures, and track version history for every upload.
        </p>
      </header>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={uploadMutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Upload document
        </button>
        <input
          ref={fileInputRef}
          type="file"
          aria-label="Upload document"
          className="sr-only"
          onChange={handleFileChange}
          disabled={uploadMutation.isPending}
        />
        {uploadMutation.isPending && (
          <span className="text-sm text-slate-500" role="status">
            Uploading...
          </span>
        )}
      </div>

      {documentsQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          No documents uploaded yet. Use the upload action above to add your first file.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200" aria-label="Documents">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Version
                </th>
                <th scope="col" className="px-4 py-3">
                  Size
                </th>
                <th scope="col" className="px-4 py-3">
                  Uploaded
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{doc.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      v{doc.version}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatFileSize(doc.file_size)}</td>
                  <td className="px-4 py-3">
                    {new Date(doc.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500" disabled>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
