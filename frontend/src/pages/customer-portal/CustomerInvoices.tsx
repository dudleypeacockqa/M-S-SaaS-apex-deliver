/**
 * Customer Invoices Page
 * Invoice viewing and management for customer portal users
 */

import React from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui'
import { WorkspaceContainer } from '@/components/layout/WorkspaceContainer'

export const CustomerInvoices: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WorkspaceContainer maxWidth="6xl" className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Invoice History</h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </WorkspaceContainer>
    </div>
  )
}

