import { useQuery } from '@tanstack/react-query'
import { listPipelineTemplates } from '@/services/api/pipelineTemplates'

export const PIPELINE_TEMPLATES_QUERY_KEY = ['pipeline-templates']

export function usePipelineTemplates() {
  return useQuery({
    queryKey: PIPELINE_TEMPLATES_QUERY_KEY,
    queryFn: listPipelineTemplates,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
