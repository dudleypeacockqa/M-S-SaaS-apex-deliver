import { useCallback, useMemo, useState } from 'react'
import { uploadDocument } from '../services/api/documents'
import type { UploadQueueItem } from '../components/documents/UploadPanel'

interface StartUploadOptions {
  folderId?: string | null
}

interface UseDocumentUploadsResult {
  uploadQueue: UploadQueueItem[]
  isUploading: boolean
  errorMessage: string | null
  startUpload: (files: FileList | File[], options?: StartUploadOptions) => Promise<void>
  clearQueue: () => void
}

function createQueueItem(file: File): UploadQueueItem {
  return {
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    progress: 0,
    status: 'pending',
    size: file.size,
  }
}

export function useDocumentUploads(dealId: string): UseDocumentUploadsResult {
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resetQueue = useCallback(() => {
    setUploadQueue([])
    setErrorMessage(null)
    setIsUploading(false)
  }, [])

  const startUpload = useCallback<UseDocumentUploadsResult['startUpload']>(
    async (files, options) => {
      const fileArray = Array.isArray(files) ? files : Array.from(files)
      if (fileArray.length === 0) {
        return
      }

      setIsUploading(true)
      setErrorMessage(null)

      const queueItems = fileArray.map((file) => createQueueItem(file))
      setUploadQueue(queueItems)

      try {
        for (let index = 0; index < fileArray.length; index += 1) {
          const file = fileArray[index]
          const queueId = queueItems[index].id

          setUploadQueue((current) =>
            current.map((item) =>
              item.id === queueId
                ? {
                    ...item,
                    status: 'uploading',
                    progress: 20,
                  }
                : item
            )
          )

          await uploadDocument(dealId, file, { folderId: options?.folderId ?? undefined })

          setUploadQueue((current) =>
            current.map((item) =>
              item.id === queueId
                ? {
                    ...item,
                    status: 'complete',
                    progress: 100,
                  }
                : item
            )
          )
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to upload files right now.'
        setErrorMessage(message)
        setUploadQueue((current) => current.map((item) => ({ ...item, status: 'error', error: message })))
        throw error
      } finally {
        setIsUploading(false)
      }
    },
    [dealId]
  )

  const clearQueue = useCallback(() => {
    resetQueue()
  }, [resetQueue])

  return useMemo(
    () => ({ uploadQueue, isUploading, errorMessage, startUpload, clearQueue }),
    [uploadQueue, isUploading, errorMessage, startUpload, clearQueue]
  )
}
