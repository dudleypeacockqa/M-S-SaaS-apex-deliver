import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { findMatchesForDeal, saveMatch, updateMatchStatus } from '../services/dealMatchingService';

interface DealMatch {
  id: string;
  dealId: string;
  dealName: string;
  targetCompany?: string;
  industry?: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  explanation?: any;
  status?: 'pending' | 'saved' | 'passed';
}

interface FindMatchesRequest {
  criteria_id?: string;
  criteria?: any;
  top_n?: number;
  min_score?: number;
}

interface SaveMatchRequest {
  dealId: string;
  matchedDealId: string;
  score: number;
  confidence: string;
  explanation: any;
}

interface UpdateMatchStatusRequest {
  matchId: string;
  status: 'saved' | 'passed';
}

export const useDealMatches = (dealId: string, criteriaId?: string) => {
  return useQuery<DealMatch[]>({
    queryKey: ['dealMatches', dealId, criteriaId],
    queryFn: async () => {
      const request: FindMatchesRequest = {
        criteria_id: criteriaId,
        top_n: 10,
        min_score: 40.0,
      };

      const response = await findMatchesForDeal(dealId, request);
      return response.matches || [];
    },
    enabled: !!dealId,
  });
};

export const useSaveMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SaveMatchRequest) => {
      return await saveMatch(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate matches for the deal
      queryClient.invalidateQueries({ queryKey: ['dealMatches', variables.dealId] });
    },
  });
};

export const useUpdateMatchStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, status }: UpdateMatchStatusRequest) => {
      return await updateMatchStatus(matchId, status);
    },
    onSuccess: () => {
      // Invalidate all match queries
      queryClient.invalidateQueries({ queryKey: ['dealMatches'] });
    },
  });
};
