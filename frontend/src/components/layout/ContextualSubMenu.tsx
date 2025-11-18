import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { WORKSPACE_NAV_ITEMS } from '../../const'

export const ContextualSubMenu: React.FC = () => {
  const location = useLocation()

  // Find the parent navigation item that matches the current route
  const parentItem = WORKSPACE_NAV_ITEMS.find((item) => {
    if (item.hasSubMenu && item.subMenuItems) {
      // Check if current path matches the parent or any sub-item
      if (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) {
        return true
      }
    }
    return false
  })

  // If no parent item with sub-menu found, don't render
  if (!parentItem || !parentItem.subMenuItems || parentItem.subMenuItems.length === 0) {
    return null
  }

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-full mx-auto px-4 lg:px-6">
        <nav 
          className="flex gap-0.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent" 
          aria-label="Sub-navigation"
          style={{ scrollbarWidth: 'thin' }}
        >
          {parentItem.subMenuItems.map((subItem) => {
            const isActive = location.pathname === subItem.path || 
              (subItem.path !== parentItem.path && location.pathname.startsWith(subItem.path))

            return (
              <NavLink
                key={subItem.path}
                to={subItem.path}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150
                  ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 font-semibold bg-indigo-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                {subItem.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

