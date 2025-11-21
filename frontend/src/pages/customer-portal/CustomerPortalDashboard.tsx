/**
 * Customer Portal Dashboard
 * Main dashboard for customer portal sub-sub-accounts (B2B2C)
 */

import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardBody } from '../../components/ui'
import { WorkspaceContainer } from '@/components/layout/WorkspaceContainer'

export const CustomerPortalDashboard: React.FC = () => {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WorkspaceContainer className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.firstName || 'Customer'}
          </h1>
          <p className="text-indigo-100 text-lg">
            Customer Portal Dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Account</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600 mb-4">Manage your account information and preferences</p>
              <Link
                to="/customer-portal/account"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                View Account
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Invoices</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600 mb-4">View and download your invoices</p>
              <Link
                to="/customer-portal/invoices"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                View Invoices
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Settings</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600 mb-4">Configure your portal preferences</p>
              <Link
                to="/customer-portal/settings"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Manage Settings
              </Link>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">No recent activity to display.</p>
          </CardBody>
        </Card>
      </WorkspaceContainer>
    </div>
  )
}

