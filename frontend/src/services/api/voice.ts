/**
 * Voice API Client
 * 
 * TypeScript client for voice AI integration API endpoints.
 */
import { apiClient } from './client'

// Types
export interface VoiceCall {
  id: number
  organization_id: string
  campaign_id?: number
  contact_id: number
  phone_number: string
  status: 'queued' | 'calling' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  duration?: number
  recording_url?: string
  transcript?: string
  metadata?: Record<string, any>
  synthflow_call_id?: string
  synthflow_agent_id?: string
  created_at: string
  updated_at: string
}

export interface VoiceCallCreate {
  phone_number: string
  agent_id?: string
  campaign_id?: number
  contact_id: number
  metadata?: Record<string, any>
}

export interface VoiceAgent {
  id: string
  name: string
  voice: string
  personality?: string
  instructions: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface VoiceAgentCreate {
  name: string
  voice?: string
  personality?: string
  instructions: string
  phone_number?: string
  webhook_url?: string
  max_call_duration?: number
  language?: string
}

// API Functions
export async function createVoiceAgent(agent: VoiceAgentCreate): Promise<VoiceAgent> {
  const response = await apiClient.post('/master-admin/voice/agents', agent)
  return response.data
}

export async function listVoiceAgents(): Promise<VoiceAgent[]> {
  const response = await apiClient.get('/master-admin/voice/agents')
  return response.data
}

export async function makeVoiceCall(call: VoiceCallCreate): Promise<VoiceCall> {
  const response = await apiClient.post('/master-admin/voice/calls', call)
  return response.data
}

export async function getVoiceCallStatus(callId: number): Promise<VoiceCall> {
  const response = await apiClient.get(`/master-admin/voice/calls/${callId}`)
  return response.data
}

