import React from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { Bell, HelpCircle } from 'lucide-react'
import { Breadcrumbs } from './Breadcrumbs'
import { ContextualSubMenu } from './ContextualSubMenu'
import { APP_TITLE } from '../../const'

export const AppHeader: React.FC = () => {

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/dashboard"
              className="text-lg lg:text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors whitespace-nowrap"
            >
              {APP_TITLE}
            </Link>
          </div>

          {/* Center: Breadcrumbs */}
          <div className="flex-1 flex justify-center min-w-0 px-4">
            <Breadcrumbs />
          </div>

          {/* Right: Status, Notifications, Help, User */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Status Indicator - can be enhanced with actual system status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All Systems Operational</span>
            </div>

            {/* Notifications */}
            <button
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge can be added here */}
            </button>

            {/* Help */}
            <button
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Button */}
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Contextual Sub-Menu */}
      <ContextualSubMenu />
    </>
  )
}

