import { apiClient } from '../../../services/api/client';

export interface DashboardMetrics {
  total_revenue: number;
  active_orders: number;
  inventory_value: number;
  active_customers: number;
  revenue_growth: number;
  order_fulfillment: number;
  customer_satisfaction: number;
  inventory_turnover: number;
  working_capital_current: number;
  working_capital_30day: number;
  working_capital_growth: number;
}

export interface DemandForecast {
  id: string;
  period: string;
  forecasted_demand: number;
  actual_demand?: number;
  confidence_level: number;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  current_stock: number;
  reorder_point: number;
  unit_cost: number;
  category: string;
}

export interface ProductionMetric {
  id: string;
  date: string;
  units_produced: number;
  efficiency: number;
  downtime: number;
}

export interface QualityMetric {
  id: string;
  date: string;
  defect_rate: number;
  pass_rate: number;
  total_inspections: number;
}

export interface WorkingCapitalAnalysis {
  current: number;
  projection_30day: number;
  growth_percentage: number;
  dso: number;
  dpo: number;
  dio: number;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  assumptions: Record<string, any>;
  results: Record<string, any>;
  created_at: string;
}

/**
 * FP&A API Service
 */
export const fpaApi = {
  /**
   * Get executive dashboard metrics
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return apiClient.get<DashboardMetrics>('/api/fpa/dashboard');
  },

  /**
   * Get demand forecasts
   */
  async getDemandForecasts(): Promise<DemandForecast[]> {
    return apiClient.get<DemandForecast[]>('/api/fpa/demand-forecast');
  },

  /**
   * Create new demand forecast
   */
  async createDemandForecast(data: Partial<DemandForecast>): Promise<DemandForecast> {
    return apiClient.post<DemandForecast>('/api/fpa/demand-forecast', data);
  },

  /**
   * Get inventory items
   */
  async getInventoryItems(): Promise<InventoryItem[]> {
    return apiClient.get<InventoryItem[]>('/api/fpa/inventory');
  },

  /**
   * Get production metrics
   */
  async getProductionMetrics(): Promise<ProductionMetric[]> {
    return apiClient.get<ProductionMetric[]>('/api/fpa/production');
  },

  /**
   * Get quality metrics
   */
  async getQualityMetrics(): Promise<QualityMetric[]> {
    return apiClient.get<QualityMetric[]>('/api/fpa/quality');
  },

  /**
   * Get working capital analysis
   */
  async getWorkingCapitalAnalysis(): Promise<WorkingCapitalAnalysis> {
    return apiClient.get<WorkingCapitalAnalysis>('/api/fpa/working-capital');
  },

  /**
   * Get what-if scenarios
   */
  async getWhatIfScenarios(): Promise<WhatIfScenario[]> {
    return apiClient.get<WhatIfScenario[]>('/api/fpa/what-if');
  },

  /**
   * Create what-if scenario
   */
  async createWhatIfScenario(data: Partial<WhatIfScenario>): Promise<WhatIfScenario> {
    return apiClient.post<WhatIfScenario>('/api/fpa/what-if', data);
  },

  /**
   * Generate financial report
   */
  async generateReport(reportType: string, params: Record<string, any>): Promise<Blob> {
    return apiClient.get<Blob>(`/api/fpa/reports/${reportType}`, {
      responseType: 'blob',
      ...params,
    });
  },

  /**
   * Import data
   */
  async importData(file: File, importType: string): Promise<{ success: boolean; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('import_type', importType);
    
    return apiClient.post<{ success: boolean; message: string }>('/api/fpa/import', formData, {
      contentType: null, // Let browser set Content-Type for FormData
    });
  },
};

