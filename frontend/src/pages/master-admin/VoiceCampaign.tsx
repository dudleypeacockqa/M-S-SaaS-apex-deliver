/**
 * VoiceCampaign Page
 * 
 * Main page for AI-powered voice outreach campaigns.
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Phone, Play, MessageSquare } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import {
  useVoiceAgents,
  useCreateVoiceAgent,
  useMakeVoiceCall,
  useVoiceCall,
} from '@/hooks/useVoiceCalls'
import type { VoiceAgentCreate, VoiceCallCreate } from '@/services/api/voice'

export const VoiceCampaign: React.FC = () => {
  const navigate = useNavigate()
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)
  const [isMakingCall, setIsMakingCall] = useState(false)
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null)

  const { data: agents, isLoading: agentsLoading } = useVoiceAgents()
  const createAgent = useCreateVoiceAgent()
  const makeCall = useMakeVoiceCall()
  const { data: callStatus } = useVoiceCall(selectedCallId)

  const [agentFormData, setAgentFormData] = useState<VoiceAgentCreate>({
    name: '',
    voice: 'alloy',
    instructions: '',
    personality: '',
  })

  const [callFormData, setCallFormData] = useState<VoiceCallCreate>({
    phone_number: '',
    agent_id: '',
    contact_id: 0,
  })

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAgent.mutateAsync(agentFormData)
      setIsCreatingAgent(false)
      setAgentFormData({ name: '', voice: 'alloy', instructions: '', personality: '' })
    } catch (error) {
      console.error('Failed to create agent:', error)
    }
  }

  const handleMakeCall = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const call = await makeCall.mutateAsync(callFormData)
      setSelectedCallId(call.id)
      setIsMakingCall(false)
      setCallFormData({ phone_number: '', agent_id: '', contact_id: 0 })
    } catch (error) {
      console.error('Failed to make call:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" btnSize="sm" onClick={() => navigate('/master-admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Voice Campaigns</h1>
              <p className="text-gray-600 mt-1">AI-powered voice outreach with Synthflow</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsCreatingAgent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
              <Button variant="primary" onClick={() => setIsMakingCall(true)}>
                <Phone className="h-4 w-4 mr-2" />
                Make Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6">
        {/* Voice Agents List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Voice Agents</h2>
          {agentsLoading ? (
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
          ) : agents && agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-600">Voice: {agent.voice}</p>
                  <p className="text-sm text-gray-600">Status: {agent.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No agents created yet</p>
          )}
        </div>

        {/* Call Status */}
        {selectedCallId && callStatus && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Call Status</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {callStatus.status}</p>
              <p><strong>Phone:</strong> {callStatus.phone_number}</p>
              {callStatus.duration && <p><strong>Duration:</strong> {callStatus.duration}s</p>}
              {callStatus.transcript && (
                <div>
                  <p className="font-semibold mb-2">Transcript:</p>
                  <p className="text-gray-700">{callStatus.transcript}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Agent Modal */}
      {isCreatingAgent && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsCreatingAgent(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Voice Agent</h2>
              <form onSubmit={handleCreateAgent} className="space-y-4">
                <div>
                  <label htmlFor="voice-agent-name" className="block text-sm font-medium text-gray-700 mb-1">Agent Name *</label>
                  <input
                    type="text"
                    id="voice-agent-name"
                    name="voice-agent-name"
                    value={agentFormData.name}
                    onChange={(e) => setAgentFormData({ ...agentFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="voice-agent-voice" className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
                  <select
                    id="voice-agent-voice"
                    value={agentFormData.voice}
                    onChange={(e) => setAgentFormData({ ...agentFormData, voice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="alloy">Alloy</option>
                    <option value="echo">Echo</option>
                    <option value="fable">Fable</option>
                    <option value="onyx">Onyx</option>
                    <option value="nova">Nova</option>
                    <option value="shimmer">Shimmer</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="voice-agent-instructions" className="block text-sm font-medium text-gray-700 mb-1">Instructions *</label>
                  <textarea
                    id="voice-agent-instructions"
                    value={agentFormData.instructions}
                    onChange={(e) => setAgentFormData({ ...agentFormData, instructions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    required
                    placeholder="You are a professional sales agent. Be friendly and helpful..."
                  />
                </div>
                <div>
                  <label htmlFor="voice-agent-personality" className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
                  <input
                    type="text"
                    id="voice-agent-personality"
                    name="voice-agent-personality"
                    value={agentFormData.personality || ''}
                    onChange={(e) => setAgentFormData({ ...agentFormData, personality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="professional, friendly, etc."
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button type="submit" variant="primary" loading={createAgent.isPending}>
                    Create Agent
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreatingAgent(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Make Call Modal */}
      {isMakingCall && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMakingCall(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Make Voice Call</h2>
              <form onSubmit={handleMakeCall} className="space-y-4">
                <div>
                  <label htmlFor="voice-call-agent-id" className="block text-sm font-medium text-gray-700 mb-1">Agent ID *</label>
                  <input
                    type="text"
                    id="voice-call-agent-id"
                    name="voice-call-agent-id"
                    value={callFormData.agent_id}
                    onChange={(e) => setCallFormData({ ...callFormData, agent_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="voice-call-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="voice-call-phone"
                    name="voice-call-phone"
                    value={callFormData.phone_number}
                    onChange={(e) => setCallFormData({ ...callFormData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="voice-call-contact" className="block text-sm font-medium text-gray-700 mb-1">Contact ID *</label>
                  <input
                    type="number"
                    id="voice-call-contact"
                    name="voice-call-contact"
                    value={callFormData.contact_id || ''}
                    onChange={(e) => setCallFormData({ ...callFormData, contact_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button type="submit" variant="primary" loading={makeCall.isPending}>
                    <Phone className="h-4 w-4 mr-2" />
                    Make Call
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsMakingCall(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VoiceCampaign

