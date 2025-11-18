import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Factory, Gauge, Hourglass } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { fpaApi, type ProductionMetric } from '../services/fpaApi';

const SummaryCard: React.FC<{ label: string; value: string; icon: React.ComponentType<{ className?: string }>; trend?: string }> = ({ label, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm text-gray-500 uppercase tracking-wide">{label}</p>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
  </div>
);

const calculateKpis = (metrics: ProductionMetric[]) => {
  if (!metrics.length) {
    return {
      avgEfficiency: 0,
      avgDowntime: 0,
      totalUnits: 0,
    };
  }

  const totals = metrics.reduce(
    (acc, metric) => {
      acc.efficiency += metric.efficiency;
      acc.downtime += metric.downtime;
      acc.units += metric.units_produced;
      return acc;
    },
    { efficiency: 0, downtime: 0, units: 0 }
  );

  return {
    avgEfficiency: totals.efficiency / metrics.length,
    avgDowntime: totals.downtime / metrics.length,
    totalUnits: totals.units,
  };
};

export const ProductionTracking: React.FC = () => {
  const { data: productionMetrics = [], isLoading, error } = useQuery({
    queryKey: ['fpa', 'production'],
    queryFn: () => fpaApi.getProductionMetrics(),
  });

  const kpis = useMemo(() => calculateKpis(productionMetrics), [productionMetrics]);
  const latestMetrics = productionMetrics.at(-1);
  const alertMetrics = productionMetrics.filter(metric => metric.efficiency < 85 || metric.downtime > 3);

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Production Tracking</h1>
          <p className="text-gray-600 text-sm">Monitor throughput, efficiency, and downtime trends.</p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            Unable to load production metrics. Please try again shortly.
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard
                label="Average Efficiency"
                value={`${kpis.avgEfficiency.toFixed(1)}%`}
                icon={Gauge}
                trend={latestMetrics ? `Last reading: ${latestMetrics.efficiency.toFixed(1)}%` : undefined}
              />
              <SummaryCard
                label="Average Downtime"
                value={`${kpis.avgDowntime.toFixed(1)} hrs`}
                icon={Hourglass}
                trend={latestMetrics ? `Last reading: ${latestMetrics.downtime.toFixed(1)} hrs` : undefined}
              />
              <SummaryCard
                label="Units Produced (period)"
                value={kpis.totalUnits.toLocaleString()}
                icon={Factory}
                trend={latestMetrics ? `${latestMetrics.units_produced.toLocaleString()} units last run` : undefined}
              />
            </div>

            {productionMetrics.length === 0 ? (
              <div className="bg-white rounded-lg border border-dashed border-gray-300 p-10 text-center">
                <p className="text-gray-700 font-medium mb-2">No production data available yet</p>
                <p className="text-sm text-gray-500">
                  Connect your MES or import a CSV to unlock real-time production insight.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-x-auto">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Production Runs</h2>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Units</th>
                        <th className="pb-3">Efficiency</th>
                        <th className="pb-3">Downtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionMetrics.map(metric => (
                        <tr key={metric.id} className="border-t border-gray-100">
                          <td className="py-3">{metric.date}</td>
                          <td className="py-3 font-semibold">{metric.units_produced.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`font-semibold ${metric.efficiency < 90 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {metric.efficiency.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3">{metric.downtime.toFixed(1)} hrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Performance Alerts</h2>
                  {alertMetrics.length === 0 ? (
                    <p className="text-sm text-gray-600">All lines running within target bands.</p>
                  ) : (
                    alertMetrics.map(metric => (
                      <div key={metric.id} className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800">{metric.date}</p>
                          <p className="text-xs text-amber-700">
                            Efficiency {metric.efficiency.toFixed(1)}% • Downtime {metric.downtime.toFixed(1)} hrs
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

