import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MatchCriteria {
  id: string;
  name: string;
  deal_type: string;
  industries: string[];
  min_deal_size: string;
  max_deal_size: string;
  geographies?: string[];
  structures?: string[];
  weights?: Record<string, number>;
  created_at: string;
}

interface CreateMatchCriteriaData {
  name: string;
  deal_type: string;
  industries: string[];
  min_deal_size: number;
  max_deal_size: number;
  geographies?: string[];
  structures?: string[];
  negative_filters?: Record<string, any>;
  weights?: Record<string, number>;
}

const API_BASE = '/api';

export const useMatchCriteria = () => {
  return useQuery<MatchCriteria[]>({
    queryKey: ['match-criteria'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/match-criteria`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch match criteria');
      }

      return response.json();
    },
  });
};

export const useCreateMatchCriteria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMatchCriteriaData) => {
      const response = await fetch(`${API_BASE}/match-criteria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create match criteria');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-criteria'] });
    },
  });
};
