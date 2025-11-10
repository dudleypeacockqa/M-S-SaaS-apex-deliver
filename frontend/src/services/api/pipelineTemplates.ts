/**
 * Pipeline Template API client
 */

import { apiClient } from './client'

export interface PipelineTemplateStage {
  id: string
  name: string
  order_index: number
  probability?: number | null
  sla_hours?: number | null
  color?: string | null
}

export interface PipelineTemplate {
  id: string
  name: string
  description?: string | null
  is_default: boolean
  stages: PipelineTemplateStage[]
}

export async function listPipelineTemplates(): Promise<PipelineTemplate[]> {
  return apiClient.get<PipelineTemplate[]>('/api/pipeline-templates')
}
