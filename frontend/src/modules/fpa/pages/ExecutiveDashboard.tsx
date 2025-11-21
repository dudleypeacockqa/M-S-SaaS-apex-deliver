import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '../components/DashboardLayout';
import { fpaApi, type DashboardMetrics } from '../services/fpaApi';
import { formatCurrency } from '../../../services/api/deals';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Factory } from 'lucide-react';

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
}> = ({ title, value, change, subtitle, icon: Icon }) => {
  const isPositive = change !== undefined && change > 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${changeColor}`}>
            <ChangeIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
};

export const ExecutiveDashboard: React.FC = () => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['fpa', 'dashboard'],
    queryFn: () => fpaApi.getDashboardMetrics(),
  });

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Failed to load dashboard metrics. Please try again.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Dashboard</h1>
          <p className="text-gray-600">{currentDate}</p>
          <p className="text-sm text-gray-500 mt-1">Real-time manufacturing operations overview</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={metrics ? formatCurrency(metrics.total_revenue, 'GBP') : 'N/A'}
            change={metrics?.revenue_growth}
            subtitle="Monthly recurring revenue"
            icon={DollarSign}
          />
          <MetricCard
            title="Active Orders"
            value={metrics?.active_orders.toLocaleString() || '0'}
            change={8.5}
            subtitle="Orders in production"
            icon={Factory}
          />
          <MetricCard
            title="Inventory Value"
            value={metrics ? formatCurrency(metrics.inventory_value, 'GBP') : 'N/A'}
            change={-2.1}
            subtitle="Current stock valuation"
            icon={Package}
          />
          <MetricCard
            title="Active Customers"
            value={metrics?.active_customers.toLocaleString() || '0'}
            change={12.3}
            subtitle="Customers with active orders"
            icon={Users}
          />
        </div>

        {/* Working Capital & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Working Capital */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Working Capital</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics ? formatCurrency(metrics.working_capital_current, 'GBP') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">30-Day Projection</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics ? formatCurrency(metrics.working_capital_30day, 'GBP') : 'N/A'}
                  </p>
                  {metrics?.working_capital_growth && (
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {metrics.working_capital_growth.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Key Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h2>
            <div className="space-y-3">
              {metrics && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue Growth</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {metrics.revenue_growth.toFixed(1)}%
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Order Fulfillment</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {metrics.order_fulfillment.toFixed(1)}%
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {metrics.customer_satisfaction.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Inventory Turnover</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {metrics.inventory_turnover.toFixed(1)}x
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Run Forecast</h3>
            </div>
            <p className="text-sm text-gray-600">Generate demand forecast</p>
          </button>

          <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Working Capital</h3>
            </div>
            <p className="text-sm text-gray-600">Analyze cash flow</p>
          </button>

          <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">What-If Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">Scenario modeling</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

