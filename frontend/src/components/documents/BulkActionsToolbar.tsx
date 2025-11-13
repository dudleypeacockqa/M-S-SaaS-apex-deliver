/**
 * BulkActionsToolbar Component
 * TDD GREEN phase - Implement minimal code to pass tests
 * Sprint 1.1 - DEV-008 Secure Document & Data Room
 */

import React from 'react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  disableDownload?: boolean;
  disableDelete?: boolean;
  disableManageAccess?: boolean;
  onDownload: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
  onManageAccess?: () => void;
  warningMessage?: string;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  disableDownload = false,
  disableDelete = false,
  onDownload,
  onDelete,
  onClearSelection,
  onManageAccess,
  disableManageAccess = false,
  warningMessage,
}) => {
  // Hide toolbar when nothing is selected
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-10 bg-indigo-600 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Selection summary */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-white">
            {selectedCount} selected
          </p>

          {/* Warning message */}
          {warningMessage && (
            <p className="text-sm text-yellow-200">
              {warningMessage}
            </p>
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3">
          {/* Download button */}
          <button
            type="button"
            onClick={onDownload}
            disabled={disableDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            aria-label="Download selected documents"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>

          {/* Delete button */}
          <button
            type="button"
            onClick={onDelete}
            disabled={disableDelete}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            aria-label="Delete selected documents"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>

          {onManageAccess && (
            <button
              type="button"
              onClick={onManageAccess}
              disabled={disableManageAccess}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              aria-label="Manage access for selected documents"
            >
              🔐 Manage access
            </button>
          )}

          {/* Clear selection button */}
          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 rounded-md transition-colors"
            aria-label="Clear selection"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
