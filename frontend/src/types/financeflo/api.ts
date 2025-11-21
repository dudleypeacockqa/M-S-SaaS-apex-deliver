// API response types for GHL service
export interface GHLContactResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
  timezone?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GHLOpportunityResponse {
  id: string;
  contactId: string;
  pipelineId: string;
  stageId: string;
  title: string;
  monetaryValue?: number;
  source?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GHLConversationResponse {
  id: string;
  contactId: string;
  messages: Array<{
    id: string;
    type: 'SMS' | 'Email' | 'WhatsApp';
    body: string;
    direction: 'inbound' | 'outbound';
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GHLAppointmentResponse {
  id: string;
  calendarId: string;
  contactId: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  appointmentStatus: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface GHLPipelineResponse {
  id: string;
  name: string;
  stages: Array<{
    id: string;
    name: string;
    position: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GHLContactSearchResponse {
  contact: GHLContactResponse | null;
}

export interface GHLAPIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormSubmissionResult {
  success: boolean;
  contactId?: string;
  leadScore?: number;
  qualificationStatus?: string;
  message: string;
  error?: string;
  details?: unknown;
  webhookResults?: string;
}