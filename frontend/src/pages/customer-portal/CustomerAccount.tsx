/**
 * Customer Account Page
 * Account management for customer portal users
 */

import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Card, CardHeader, CardBody } from '../../components/ui'
import { WorkspaceContainer } from '@/components/layout/WorkspaceContainer'

export const CustomerAccount: React.FC = () => {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WorkspaceContainer maxWidth="4xl" className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account ID
                </label>
                <p className="text-gray-900 font-mono text-sm">{user?.id}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Account Status</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </CardBody>
        </Card>
      </WorkspaceContainer>
    </div>
  )
}

