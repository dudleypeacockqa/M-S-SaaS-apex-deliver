/**
 * ProspectCard Component
 *
 * Display prospect summary with status badge and actions
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { Mail, Phone, Building2, User, Calendar, MoreVertical } from '@/lib/icons'
import { ProspectStatus } from '@/services/api/masterAdmin'
import type { AdminProspect } from '@/services/api/masterAdmin'

export interface ProspectCardProps {
  prospect: AdminProspect
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export const ProspectCard: React.FC<ProspectCardProps> = ({
  prospect,
  onClick,
  onEdit,
  onDelete,
  className,
}) => {
  const [showMenu, setShowMenu] = React.useState(false)

  const getStatusBadge = (status: ProspectStatus) => {
    const styles = {
      [ProspectStatus.NEW]: 'bg-gray-100 text-gray-800',
      [ProspectStatus.QUALIFIED]: 'bg-blue-100 text-blue-800',
      [ProspectStatus.ENGAGED]: 'bg-purple-100 text-purple-800',
      [ProspectStatus.PROPOSAL]: 'bg-yellow-100 text-yellow-800',
      [ProspectStatus.NEGOTIATION]: 'bg-orange-100 text-orange-800',
      [ProspectStatus.CLOSED_WON]: 'bg-green-100 text-green-800',
      [ProspectStatus.CLOSED_LOST]: 'bg-red-100 text-red-800',
    }

    const labels = {
      [ProspectStatus.NEW]: 'New',
      [ProspectStatus.QUALIFIED]: 'Qualified',
      [ProspectStatus.ENGAGED]: 'Engaged',
      [ProspectStatus.PROPOSAL]: 'Proposal',
      [ProspectStatus.NEGOTIATION]: 'Negotiation',
      [ProspectStatus.CLOSED_WON]: 'Won',
      [ProspectStatus.CLOSED_LOST]: 'Lost',
    }

    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          styles[status]
        )}
      >
        {labels[status]}
      </span>
    )
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:border-blue-300',
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {prospect.name}
          </h3>
          {getStatusBadge(prospect.status)}
        </div>

        {/* Actions Menu */}
        {(onEdit || onDelete) && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                  }}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-2">
        {prospect.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4 text-gray-400" />
            <a
              href={`mailto:${prospect.email}`}
              className="hover:text-blue-600"
              onClick={(e) => e.stopPropagation()}
            >
              {prospect.email}
            </a>
          </div>
        )}

        {prospect.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4 text-gray-400" />
            <a
              href={`tel:${prospect.phone}`}
              className="hover:text-blue-600"
              onClick={(e) => e.stopPropagation()}
            >
              {prospect.phone}
            </a>
          </div>
        )}

        {prospect.company && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4 text-gray-400" />
            <span>{prospect.company}</span>
          </div>
        )}

        {prospect.title && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            <span>{prospect.title}</span>
          </div>
        )}

        {prospect.last_contacted && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-3 pt-3 border-t border-gray-200">
            <Calendar className="h-4 w-4" />
            <span>
              Last contacted: {new Date(prospect.last_contacted).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {prospect.tags && (
        <div className="mt-3 flex flex-wrap gap-1">
          {JSON.parse(prospect.tags).map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
