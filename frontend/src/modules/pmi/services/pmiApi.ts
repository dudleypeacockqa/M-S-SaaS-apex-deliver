import { apiClient } from '../../../services/api/client';

// PMI Project Types
export interface PMIProject {
  id: string;
  organization_id: string;
  deal_id: string;
  name: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  close_date?: string;
  day_one_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PMIProjectCreate {
  name: string;
  deal_id: string;
  status?: PMIProject['status'];
  close_date?: string;
  day_one_date?: string;
  target_completion_date?: string;
  description?: string;
}

// PMI Workstream Types
export interface PMIWorkstream {
  id: string;
  project_id: string;
  organization_id: string;
  name: string;
  workstream_type: 'it' | 'hr' | 'finance' | 'sales' | 'operations' | 'legal' | 'culture' | 'other';
  owner_id?: string;
  status: 'not_started' | 'in_progress' | 'at_risk' | 'completed' | 'blocked';
  priority: string;
  phase?: 'stabilization' | 'integration' | 'optimization';
  description?: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface PMIWorkstreamCreate {
  project_id: string;
  name: string;
  workstream_type: PMIWorkstream['workstream_type'];
  owner_id?: string;
  status?: PMIWorkstream['status'];
  priority?: string;
  phase?: PMIWorkstream['phase'];
  description?: string;
  progress_percentage?: number;
}

// PMI Milestone Types
export interface PMIMilestone {
  id: string;
  workstream_id: string;
  organization_id: string;
  name: string;
  description?: string;
  target_date?: string;
  actual_date?: string;
  status: string;
  dependencies?: string;
  created_at: string;
  updated_at: string;
}

export interface PMIMilestoneCreate {
  workstream_id: string;
  name: string;
  description?: string;
  target_date?: string;
  status?: string;
  dependencies?: string;
}

// PMI Synergy Types
export interface PMISynergy {
  id: string;
  project_id: string;
  organization_id: string;
  name: string;
  category: 'cost_synergy' | 'revenue_synergy' | 'operational_efficiency';
  planned_value: number;
  realized_value?: number;
  currency: string;
  target_date?: string;
  realized_date?: string;
  status: 'planned' | 'in_progress' | 'realized' | 'at_risk' | 'cancelled';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PMISynergyCreate {
  project_id: string;
  name: string;
  category: PMISynergy['category'];
  planned_value: number;
  realized_value?: number;
  currency?: string;
  target_date?: string;
  status?: PMISynergy['status'];
  description?: string;
}

// PMI Metric Types
export interface PMIMetric {
  id: string;
  project_id: string;
  organization_id: string;
  metric_type: 'ktrr' | 'ccr' | 'srr' | 'nps' | 'integration_cost' | 'time_to_synergy' | 'other';
  value: number;
  target_value?: number;
  measurement_date: string;
  description?: string;
  created_at: string;
}

export interface PMIMetricCreate {
  project_id: string;
  metric_type: PMIMetric['metric_type'];
  value: number;
  target_value?: number;
  measurement_date: string;
  description?: string;
}

// PMI Risk Types
export interface PMIRisk {
  id: string;
  project_id: string;
  workstream_id?: string;
  organization_id: string;
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'mitigated' | 'closed' | 'accepted';
  mitigation_plan?: string;
  owner_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PMIRiskCreate {
  project_id: string;
  workstream_id?: string;
  title: string;
  description?: string;
  severity: PMIRisk['severity'];
  status?: PMIRisk['status'];
  mitigation_plan?: string;
  owner_id?: string;
}

// PMI Day One Checklist Types
export interface PMIDayOneChecklist {
  id: string;
  project_id: string;
  organization_id: string;
  category: 'it' | 'hr' | 'finance' | 'legal' | 'communications' | 'operations' | 'other';
  item: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'complete' | 'at_risk';
  owner_id?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PMIDayOneChecklistCreate {
  project_id: string;
  category: PMIDayOneChecklist['category'];
  item: string;
  description?: string;
  status?: PMIDayOneChecklist['status'];
  owner_id?: string;
  due_date?: string;
}

// PMI Dashboard Types
export interface PMIDashboard {
  project: PMIProject;
  total_workstreams: number;
  completed_workstreams: number;
  total_synergies: number;
  realized_synergies: number;
  synergy_realization_rate: number;
  total_risks: number;
  critical_risks: number;
  day_one_readiness_percentage: number;
  current_phase?: 'stabilization' | 'integration' | 'optimization';
  days_since_day_one?: number;
  days_remaining?: number;
  recent_metrics: PMIMetric[];
  workstreams_summary: PMIWorkstream[];
}

/**
 * PMI API Service
 */
export const pmiApi = {
  /**
   * Create a new PMI project
   */
  async createProject(data: PMIProjectCreate): Promise<PMIProject> {
    return apiClient.post<PMIProject>('/api/pmi/projects', data);
  },

  /**
   * List all PMI projects
   */
  async listProjects(params?: {
    page?: number;
    per_page?: number;
    status?: PMIProject['status'];
    deal_id?: string;
  }): Promise<{ items: PMIProject[]; total: number; page: number; page_size: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.deal_id) queryParams.append('deal_id', params.deal_id);
    const query = queryParams.toString();
    return apiClient.get(`/api/pmi/projects${query ? `?${query}` : ''}`);
  },

  /**
   * Get PMI project by ID
   */
  async getProject(projectId: string): Promise<PMIProject> {
    return apiClient.get<PMIProject>(`/api/pmi/projects/${projectId}`);
  },

  /**
   * Update PMI project
   */
  async updateProject(projectId: string, data: Partial<PMIProject>): Promise<PMIProject> {
    return apiClient.put<PMIProject>(`/api/pmi/projects/${projectId}`, data);
  },

  /**
   * Get PMI dashboard
   */
  async getDashboard(projectId: string): Promise<PMIDashboard> {
    return apiClient.get<PMIDashboard>(`/api/pmi/projects/${projectId}/dashboard`);
  },

  /**
   * Generate 100-day plan template
   */
  async generatePlan(projectId: string): Promise<{ message: string }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/generate-plan`);
  },

  /**
   * Create workstream
   */
  async createWorkstream(projectId: string, data: PMIWorkstreamCreate): Promise<PMIWorkstream> {
    return apiClient.post<PMIWorkstream>(`/api/pmi/projects/${projectId}/workstreams`, data);
  },

  /**
   * List workstreams for a project
   */
  async listWorkstreams(projectId: string): Promise<{ items: PMIWorkstream[]; total: number }> {
    return apiClient.get(`/api/pmi/projects/${projectId}/workstreams`);
  },

  /**
   * Get workstream by ID
   */
  async getWorkstream(workstreamId: string): Promise<PMIWorkstream> {
    return apiClient.get<PMIWorkstream>(`/api/pmi/workstreams/${workstreamId}`);
  },

  /**
   * Update workstream
   */
  async updateWorkstream(workstreamId: string, data: Partial<PMIWorkstream>): Promise<PMIWorkstream> {
    return apiClient.put<PMIWorkstream>(`/api/pmi/workstreams/${workstreamId}`, data);
  },

  /**
   * Create milestone
   */
  async createMilestone(workstreamId: string, data: PMIMilestoneCreate): Promise<PMIMilestone> {
    return apiClient.post<PMIMilestone>(`/api/pmi/workstreams/${workstreamId}/milestones`, data);
  },

  /**
   * Update milestone
   */
  async updateMilestone(milestoneId: string, data: Partial<PMIMilestone>): Promise<PMIMilestone> {
    return apiClient.put<PMIMilestone>(`/api/pmi/milestones/${milestoneId}`, data);
  },

  /**
   * Create synergy
   */
  async createSynergy(projectId: string, data: PMISynergyCreate): Promise<PMISynergy> {
    return apiClient.post<PMISynergy>(`/api/pmi/projects/${projectId}/synergies`, data);
  },

  /**
   * List synergies for a project
   */
  async listSynergies(projectId: string): Promise<{ items: PMISynergy[]; total: number }> {
    return apiClient.get(`/api/pmi/projects/${projectId}/synergies`);
  },

  /**
   * Update synergy
   */
  async updateSynergy(synergyId: string, data: Partial<PMISynergy>): Promise<PMISynergy> {
    return apiClient.put<PMISynergy>(`/api/pmi/synergies/${synergyId}`, data);
  },

  /**
   * Create metric
   */
  async createMetric(projectId: string, data: PMIMetricCreate): Promise<PMIMetric> {
    return apiClient.post<PMIMetric>(`/api/pmi/projects/${projectId}/metrics`, data);
  },

  /**
   * List metrics for a project
   */
  async listMetrics(projectId: string, params?: { metric_type?: string; limit?: number }): Promise<PMIMetric[]> {
    const queryParams = new URLSearchParams();
    if (params?.metric_type) queryParams.append('metric_type', params.metric_type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiClient.get<PMIMetric[]>(`/api/pmi/projects/${projectId}/metrics${query ? `?${query}` : ''}`);
  },

  /**
   * Create risk
   */
  async createRisk(projectId: string, data: PMIRiskCreate): Promise<PMIRisk> {
    return apiClient.post<PMIRisk>(`/api/pmi/projects/${projectId}/risks`, data);
  },

  /**
   * List risks for a project
   */
  async listRisks(projectId: string, params?: { workstream_id?: string; severity?: PMIRisk['severity'] }): Promise<{ items: PMIRisk[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.workstream_id) queryParams.append('workstream_id', params.workstream_id);
    if (params?.severity) queryParams.append('severity', params.severity);
    const query = queryParams.toString();
    return apiClient.get(`/api/pmi/projects/${projectId}/risks${query ? `?${query}` : ''}`);
  },

  /**
   * Update risk
   */
  async updateRisk(riskId: string, data: Partial<PMIRisk>): Promise<PMIRisk> {
    return apiClient.put<PMIRisk>(`/api/pmi/risks/${riskId}`, data);
  },

  /**
   * Create Day 1 checklist item
   */
  async createDayOneChecklistItem(projectId: string, data: PMIDayOneChecklistCreate): Promise<PMIDayOneChecklist> {
    return apiClient.post<PMIDayOneChecklist>(`/api/pmi/projects/${projectId}/day-one-checklist`, data);
  },

  /**
   * List Day 1 checklist items for a project
   */
  async listDayOneChecklist(projectId: string, params?: { category?: string }): Promise<{ items: PMIDayOneChecklist[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    const query = queryParams.toString();
    return apiClient.get(`/api/pmi/projects/${projectId}/day-one-checklist${query ? `?${query}` : ''}`);
  },

  /**
   * Update Day 1 checklist item
   */
  async updateDayOneChecklistItem(itemId: string, data: Partial<PMIDayOneChecklist>): Promise<PMIDayOneChecklist> {
    return apiClient.put<PMIDayOneChecklist>(`/api/pmi/day-one-checklist/${itemId}`, data);
  },

  /**
   * Mark Day 1 checklist item as complete
   */
  async completeDayOneChecklistItem(itemId: string): Promise<PMIDayOneChecklist> {
    return apiClient.post<PMIDayOneChecklist>(`/api/pmi/day-one-checklist/${itemId}/complete`);
  },

  // AI-Powered Features
  /**
   * Identify risks using AI
   */
  async identifyRisks(projectId: string): Promise<{ risks: any[]; count: number }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/risks/ai-identify`);
  },

  /**
   * Analyze risk mitigation strategies
   */
  async analyzeRiskMitigation(riskId: string): Promise<any> {
    return apiClient.post(`/api/pmi/risks/${riskId}/ai-mitigation`);
  },

  /**
   * Predict risk escalation
   */
  async predictRiskEscalation(projectId: string): Promise<{ predictions: any[] }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/risks/ai-predict-escalation`);
  },

  /**
   * Suggest synergy opportunities
   */
  async suggestSynergies(projectId: string): Promise<{ synergies: any[]; count: number }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/synergies/ai-suggest`);
  },

  /**
   * Validate synergy feasibility
   */
  async validateSynergy(synergyId: string): Promise<any> {
    return apiClient.post(`/api/pmi/synergies/${synergyId}/ai-validate`);
  },

  /**
   * Optimize synergy timing
   */
  async optimizeSynergyTiming(projectId: string): Promise<any> {
    return apiClient.post(`/api/pmi/projects/${projectId}/synergies/ai-optimize-timing`);
  },

  /**
   * Get best practices
   */
  async getBestPractices(projectId: string, workstreamType?: string): Promise<any> {
    const url = workstreamType
      ? `/api/pmi/projects/${projectId}/best-practices?workstream_type=${workstreamType}`
      : `/api/pmi/projects/${projectId}/best-practices`;
    return apiClient.get(url);
  },

  /**
   * Get action recommendations
   */
  async getRecommendations(projectId: string): Promise<{ recommendations: any[] }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/recommendations`);
  },

  /**
   * Benchmark against industry
   */
  async benchmarkAgainstIndustry(projectId: string): Promise<any> {
    return apiClient.get(`/api/pmi/projects/${projectId}/benchmark`);
  },

  // Workstream Dependencies
  /**
   * Analyze workstream dependencies
   */
  async analyzeDependencies(projectId: string): Promise<{ dependencies: any[]; count: number }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/workstreams/analyze-dependencies`);
  },

  /**
   * Get dependency graph
   */
  async getDependencyGraph(projectId: string): Promise<any> {
    return apiClient.get(`/api/pmi/projects/${projectId}/workstreams/dependency-graph`);
  },

  // PDF Reports
  /**
   * Generate status report PDF
   */
  async generateStatusReport(projectId: string): Promise<{ download_url: string; file_path: string }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/reports/status-pdf`);
  },

  /**
   * Generate synergy report PDF
   */
  async generateSynergyReport(projectId: string): Promise<{ download_url: string; file_path: string }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/reports/synergy-pdf`);
  },

  /**
   * Generate risk report PDF
   */
  async generateRiskReport(projectId: string): Promise<{ download_url: string; file_path: string }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/reports/risk-pdf`);
  },

  /**
   * Generate 100-day report PDF
   */
  async generate100DayReport(projectId: string): Promise<{ download_url: string; file_path: string }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/reports/100day-pdf`);
  },

  // Notifications
  /**
   * Send test notification
   */
  async sendTestNotification(projectId: string, notificationType: string): Promise<{ sent: boolean; message: string }> {
    return apiClient.post(`/api/pmi/projects/${projectId}/notifications/test?notification_type=${notificationType}`, null);
  },
};

