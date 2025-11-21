// IntelliFlow SaaS Types
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: 'active' | 'suspended' | 'cancelled';
  subscription_tier: 'starter' | 'professional' | 'enterprise';
  subscription_started_at?: string;
  subscription_ends_at?: string;
  stripe_customer_id?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TenantMember {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invited_by?: string;
  invited_at?: string;
  joined_at?: string;
  status: 'active' | 'invited' | 'suspended';
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  timezone: string;
  language: string;
  notification_preferences: Record<string, any>;
  last_seen_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AIAgent {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  type: 'workflow' | 'connector' | 'analytics' | 'monitor';
  configuration: Record<string, any>;
  status: 'active' | 'paused' | 'error' | 'pending';
  created_by: string;
  last_execution_at?: string;
  execution_count: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  tenant_id: string;
  name: string;
  system_type: string; // 'erp', 'crm', 'ecommerce', etc.
  system_name: string; // 'salesforce', 'sage_intacct', etc.
  credentials: Record<string, any>;
  configuration: Record<string, any>;
  status: 'active' | 'paused' | 'error' | 'pending';
  health_check_url?: string;
  last_sync_at?: string;
  sync_frequency: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  trigger_config: Record<string, any>;
  steps: any[];
  status: 'active' | 'paused' | 'error' | 'pending';
  is_active: boolean;
  execution_count: number;
  last_execution_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  tenant_id: string;
  status: 'running' | 'completed' | 'failed';
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  error_message?: string;
  execution_time_ms?: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface AnalyticsMetric {
  id: string;
  tenant_id: string;
  metric_type: string;
  metric_name: string;
  value: number;
  dimensions: Record<string, any>;
  timestamp: string;
  created_at: string;
}

// Context Types
export interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  createTenant: (data: Partial<Tenant>) => Promise<void>;
  loading: boolean;
}

export interface AuthContextType {
  user: any | null;
  session: any | null;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}