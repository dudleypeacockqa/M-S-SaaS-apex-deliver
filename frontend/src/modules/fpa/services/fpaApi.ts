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

export interface DemandForecastCreate {
  name?: string;
  period: string;
  forecasted_demand: number;
  confidence_level: number;
  assumptions?: Record<string, any>;
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

export interface ScenarioVariablesPayload {
  gaba_red_price: number;
  gaba_black_price: number;
  gaba_gold_price: number;
  production_volume: number;
  material_costs: number;
  labor_efficiency: number;
}

export interface ScenarioCalculationRequest {
  variables: ScenarioVariablesPayload;
}

export interface ScenarioMetrics {
  revenue: number;
  gross_margin: number;
  ebitda: number;
  ebitda_margin: number;
}

export interface ScenarioCalculationResponse {
  metrics: ScenarioMetrics;
  baseline?: ScenarioMetrics;
}

export interface PredefinedScenario {
  id: string;
  name: string;
  description: string;
  variables: ScenarioVariablesPayload;
  revenue_impact: number;
  ebitda_impact: number;
}

export interface ApplyScenarioResponse {
  scenario: PredefinedScenario;
  metrics: ScenarioMetrics;
  baseline: ScenarioMetrics;
}

export interface FpaReportResponse {
  id: string;
  report_type: string;
  payload: Record<string, any>;
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
  async createDemandForecast(data: DemandForecastCreate): Promise<DemandForecast> {
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
   * Calculate scenario impact using backend engine
   */
  async calculateScenarioImpact(payload: ScenarioCalculationRequest): Promise<ScenarioCalculationResponse> {
    return apiClient.post<ScenarioCalculationResponse>('/api/fpa/what-if/calculate', payload);
  },

  /**
   * Fetch curated scenario presets
   */
  async getScenarioPresets(): Promise<PredefinedScenario[]> {
    return apiClient.get<PredefinedScenario[]>('/api/fpa/what-if/presets');
  },

  /**
   * Apply a predefined scenario server-side
   */
  async applyScenario(scenarioId: string): Promise<ApplyScenarioResponse> {
    return apiClient.post<ApplyScenarioResponse>('/api/fpa/what-if/apply', { scenario_id: scenarioId });
  },

  /**
   * Generate financial report
   */
  async generateReport(reportType: string, params?: Record<string, any>): Promise<FpaReportResponse> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const query = searchParams.toString()
    const endpoint = query ? `/api/fpa/reports/${reportType}?${query}` : `/api/fpa/reports/${reportType}`
    return apiClient.get<FpaReportResponse>(endpoint)
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

