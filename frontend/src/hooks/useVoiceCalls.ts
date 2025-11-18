/**
 * React Query Hooks for Voice Calls
 * 
 * Provides hooks for voice AI integration.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api/voice'
import type {
  VoiceCall,
  VoiceCallCreate,
  VoiceAgent,
  VoiceAgentCreate,
} from '@/services/api/voice'

// Query Keys
export const voiceKeys = {
  all: ['voice'] as const,
  agents: () => [...voiceKeys.all, 'agents'] as const,
  agentList: () => [...voiceKeys.agents(), 'list'] as const,
  calls: () => [...voiceKeys.all, 'calls'] as const,
  callDetail: (id: number) => [...voiceKeys.calls(), id] as const,
}

/**
 * List voice agents
 */
export function useVoiceAgents() {
  return useQuery({
    queryKey: voiceKeys.agentList(),
    queryFn: () => api.listVoiceAgents(),
  })
}

/**
 * Get voice call status
 */
export function useVoiceCall(callId: number | null) {
  return useQuery({
    queryKey: voiceKeys.callDetail(callId!),
    queryFn: () => api.getVoiceCallStatus(callId!),
    enabled: !!callId,
  })
}

/**
 * Create voice agent
 */
export function useCreateVoiceAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (agent: VoiceAgentCreate) => api.createVoiceAgent(agent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voiceKeys.agentList() })
    },
  })
}

/**
 * Make voice call
 */
export function useMakeVoiceCall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (call: VoiceCallCreate) => api.makeVoiceCall(call),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: voiceKeys.callDetail(data.id) })
      queryClient.invalidateQueries({ queryKey: voiceKeys.calls() })
    },
  })
}

