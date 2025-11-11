import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addPermission,
  listPermissions,
  removePermission,
  updatePermission,
  type DocumentPermission,
} from '../../services/api/documents'

interface PermissionModalProps {
  documentId: string
  isOpen: boolean
  onClose: () => void
}

const ROLE_OPTIONS: Array<{ value: DocumentPermission['role']; label: string }> = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'owner', label: 'Owner' },
]

export const PermissionModal: React.FC<PermissionModalProps> = ({ documentId, isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleError = (error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { data?: { detail?: string } } }).response
      const detail = response?.data?.detail
      setErrorMessage(detail ?? 'Unable to update permissions right now.')
    } else if (error instanceof Error) {
      setErrorMessage(error.message)
    } else {
      setErrorMessage('Unable to update permissions right now.')
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['document-permissions', documentId],
    queryFn: () => listPermissions(documentId),
    enabled: isOpen,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['document-permissions', documentId] })
  }

  const addMutation = useMutation({
    mutationFn: (payload: { user_email: string }) => addPermission(documentId, { ...payload, role: 'viewer' }),
    onSuccess: () => {
      setEmail('')
      setErrorMessage(null)
      invalidate()
    },
    onError: handleError,
  })

  const updateMutation = useMutation({
    mutationFn: (args: { permissionId: string; role: DocumentPermission['role'] }) =>
      updatePermission(args.permissionId, { role: args.role }),
    onSuccess: () => {
      setErrorMessage(null)
      invalidate()
    },
    onError: handleError,
  })

  const removeMutation = useMutation({
    mutationFn: (permissionId: string) => removePermission(permissionId),
    onSuccess: () => {
      setErrorMessage(null)
      invalidate()
    },
    onError: handleError,
  })

  if (!isOpen) {
    return null
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Manage document access</h2>
            <p className="mt-1 text-sm text-slate-500">Control who can view or edit this document.</p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {errorMessage && (
            <div role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email"
              className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              onClick={() => email.trim() && addMutation.mutate({ user_email: email.trim() })}
              disabled={!email.trim() || addMutation.isPending}
            >
              Add user
            </button>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading permissions...</p>
          ) : data && data.length > 0 ? (
            <ul className="space-y-2">
              {data.map((permission) => (
                <li
                  key={permission.id}
                  className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{permission.user_email}</p>
                    <p className="text-xs text-slate-500">Granted access</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-slate-500" htmlFor={`role-${permission.id}`}>
                      Role
                    </label>
                    <select
                      id={`role-${permission.id}`}
                      aria-label={`Role for ${permission.user_email}`}
                      className="rounded border border-slate-300 px-2 py-1 text-xs"
                      value={permission.role}
                      onChange={(event) =>
                        updateMutation.mutate({ permissionId: permission.id, role: event.target.value as DocumentPermission['role'] })
                      }
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="text-xs text-rose-500 hover:text-rose-600"
                      aria-label={`Remove ${permission.user_email}`}
                      onClick={() => removeMutation.mutate(permission.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No collaborators yet. Add teammates to share access.</p>
          )}
        </div>
      </div>
    </div>
  )
}
