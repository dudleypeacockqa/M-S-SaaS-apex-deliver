import { useQuery } from '@tanstack/react-query'
import { listDealMatches, type DealMatch } from '../services/dealMatchingService'

export const useDealMatches = (dealId?: string) => {
  return useQuery<DealMatch[]>({
    queryKey: ['dealMatches', dealId],
    queryFn: () => listDealMatches(dealId as string),
    enabled: Boolean(dealId),
  })
}
