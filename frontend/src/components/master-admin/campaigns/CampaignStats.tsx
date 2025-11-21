/**
 * CampaignStats Component
 *
 * Display campaign performance statistics
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { Mail, Eye, MousePointer, Users, TrendingUp } from '@/lib/icons'
import type { AdminCampaign } from '@/services/api/masterAdmin'

export interface CampaignStatsProps {
  campaign: AdminCampaign
  className?: string
}

export const CampaignStats: React.FC<CampaignStatsProps> = ({ campaign, className }) => {
  const openRate = campaign.total_sent && campaign.total_sent > 0
    ? ((campaign.total_opened || 0) / campaign.total_sent) * 100
    : 0

  const clickRate = campaign.total_sent && campaign.total_sent > 0
    ? ((campaign.total_clicked || 0) / campaign.total_sent) * 100
    : 0

  const clickToOpenRate = campaign.total_opened && campaign.total_opened > 0
    ? ((campaign.total_clicked || 0) / campaign.total_opened) * 100
    : 0

  const stats = [
    {
      label: 'Total Recipients',
      value: campaign.total_recipients || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Sent',
      value: campaign.total_sent || 0,
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Opened',
      value: campaign.total_opened || 0,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      subtitle: `${openRate.toFixed(1)}% open rate`,
    },
    {
      label: 'Clicked',
      value: campaign.total_clicked || 0,
      icon: MousePointer,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtitle: `${clickRate.toFixed(1)}% click rate`,
    },
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className={cn('inline-flex items-center justify-center p-2 rounded-lg mb-3', stat.bgColor)}>
              <stat.icon className={cn('h-6 w-6', stat.color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{stat.label}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      {campaign.total_sent && campaign.total_sent > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>

          <div className="space-y-4">
            {/* Open Rate Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Open Rate</span>
                <span className="text-sm font-semibold text-gray-900">{openRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(openRate, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {campaign.total_opened || 0} of {campaign.total_sent} opened
              </p>
            </div>

            {/* Click Rate Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Click Rate</span>
                <span className="text-sm font-semibold text-gray-900">{clickRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(clickRate, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {campaign.total_clicked || 0} of {campaign.total_sent} clicked
              </p>
            </div>

            {/* Click-to-Open Rate Bar */}
            {campaign.total_opened && campaign.total_opened > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Click-to-Open Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{clickToOpenRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(clickToOpenRate, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {campaign.total_clicked || 0} of {campaign.total_opened} openers clicked
                </p>
              </div>
            )}
          </div>

          {/* Benchmarks (Optional) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Industry Benchmarks:</strong> Open rate: 20-25%, Click rate: 2-5%, Click-to-Open: 10-15%
            </p>
          </div>
        </div>
      )}

      {/* No Stats Yet */}
      {(!campaign.total_sent || campaign.total_sent === 0) && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="font-medium text-gray-900">No stats yet</p>
          <p className="text-sm text-gray-600 mt-1">Send this campaign to see performance metrics</p>
        </div>
      )}
    </div>
  )
}
