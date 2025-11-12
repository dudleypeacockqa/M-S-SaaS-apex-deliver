import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createShareLink,
  listShareLinks,
  revokeShareLink,
  type ShareLink,
} from '../../services/api/documents'

interface ShareLinkModalProps {
  documentId: string
  documentName?: string | null
  isOpen: boolean
  onClose: () => void
}

const shareLinksKey = (documentId: string) => ['document-share-links', documentId]

const DEFAULT_EXPIRY = 7

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ documentId, documentName, isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const [expiresInDays, setExpiresInDays] = useState(DEFAULT_EXPIRY)
  const [allowDownload, setAllowDownload] = useState(true)
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  const query = useQuery<ShareLink[]>({
    enabled: isOpen,
    queryKey: shareLinksKey(documentId),
    queryFn: () => listShareLinks(documentId),
    staleTime: 10_000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: shareLinksKey(documentId) })

  const createMutation = useMutation({
    mutationFn: () =>
      createShareLink(documentId, {
        expires_in_days: expiresInDays,
        allow_download: allowDownload,
        password_protected: passwordProtected,
        password: passwordProtected ? password : undefined,
      }),
    onSuccess: () => {
      setPassword('')
      setPasswordProtected(false)
      setExpiresInDays(DEFAULT_EXPIRY)
      setAllowDownload(true)
      invalidate()
    },
  })

  const revokeMutation = useMutation({
    mutationFn: (shareLinkId: string) => revokeShareLink(documentId, shareLinkId),
    onSuccess: () => invalidate(),
  })

  useEffect(() => {
    if (!isOpen) {
      setCopyStatus(null)
      setPassword('')
      setPasswordProtected(false)
      setExpiresInDays(DEFAULT_EXPIRY)
      setAllowDownload(true)
    }
  }, [isOpen])

  const links = query.data ?? []

  const handleCopy = async (link: ShareLink) => {
    try {
      await navigator.clipboard?.writeText(link.share_url)
      setCopyStatus('Link copied to clipboard')
      setTimeout(() => setCopyStatus(null), 2000)
    } catch (error) {
      setCopyStatus('Unable to copy link')
      setTimeout(() => setCopyStatus(null), 2000)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Secure sharing</p>
            <h2 className="text-lg font-semibold text-slate-900">Share “{documentName ?? 'Document'}”</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </header>

        <div className="grid gap-5 border-b border-slate-100 px-5 py-4 md:grid-cols-[1.1fr_0.9fr]">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              createMutation.mutate()
            }}
          >
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="expires">
                Expiration (days)
              </label>
              <input
                id="expires"
                type="number"
                min={0}
                max={365}
                value={expiresInDays}
                onChange={(event) => setExpiresInDays(Number(event.target.value))}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-slate-500">Links can last up to 365 days. Set 0 for immediate expiry.</p>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={allowDownload}
                onChange={(event) => setAllowDownload(event.target.checked)}
              />
              Allow recipients to download the file
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={passwordProtected}
                onChange={(event) => setPasswordProtected(event.target.checked)}
              />
              Require password
            </label>

            {passwordProtected && (
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="share-password">
                  Password
                </label>
                <input
                  id="share-password"
                  type="password"
                  value={password}
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Enter a strong password"
                />
                <p className="mt-1 text-xs text-slate-500">Recipients must enter this password to view the document.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={createMutation.isPending || (passwordProtected && password.length < 8)}
              className="inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {createMutation.isPending ? 'Creating link…' : 'Create share link'}
            </button>
            {createMutation.isError && (
              <p className="text-xs text-red-600">Unable to create share link. Please try again.</p>
            )}
          </form>

          <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-wide text-slate-500">Guidelines</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
              <li>Links auto-expire after the selected period.</li>
              <li>Passwords must be at least 8 characters.</li>
              <li>Access attempts are logged in the activity drawer.</li>
            </ul>
          </div>
        </div>

        <section className="max-h-72 overflow-y-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Active share links</h3>
            {copyStatus && <span className="text-xs text-emerald-600">{copyStatus}</span>}
          </div>

          {query.isLoading ? (
            <p className="mt-4 text-sm text-slate-500">Loading share links…</p>
          ) : query.isError ? (
            <div className="mt-4 text-sm text-red-600">
              Unable to load share links
              <button type="button" onClick={() => query.refetch()} className="ml-2 text-indigo-600">
                Retry
              </button>
            </div>
          ) : links.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No share links yet. Generate one above.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.share_link_id} className="rounded border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{link.share_url}</p>
                      <p className="text-xs text-slate-500">
                        Expires {new Date(link.expires_at).toLocaleDateString()} · Accesses {link.access_count}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(link)}
                        className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => revokeMutation.mutate(link.share_link_id)}
                        disabled={revokeMutation.isPending}
                        className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default ShareLinkModal
