/**
 * Financial API Client Tests - DEV-010
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from '../api';
import {
  calculateFinancialRatios,
  getFinancialConnections,
  getFinancialNarrative,
  getFinancialRatios,
  type FinancialDataInput,
} from './financial';

// Mock the api module
vi.mock('../api');

describe('Financial API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateFinancialRatios', () => {
    it('should call POST /deals/:dealId/financial/calculate-ratios', async () => {
      const mockResponse = {
        data: {
          deal_id: 'deal-123',
          organization_id: 'org-456',
          current_ratio: 2.0,
          quick_ratio: 1.6,
          gross_profit_margin: 40.0,
          calculated_at: '2025-10-26T12:00:00Z',
          data_quality: 'complete' as const,
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const financialData: FinancialDataInput = {
        current_assets: 100000,
        current_liabilities: 50000,
        inventory: 20000,
        revenue: 500000,
        cogs: 300000,
      };

      const result = await calculateFinancialRatios('deal-123', financialData);

      expect(api.post).toHaveBeenCalledWith(
        '/deals/deal-123/financial/calculate-ratios',
        financialData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getFinancialConnections', () => {
    it('should call GET /deals/:dealId/financial/connections', async () => {
      const mockResponse = {
        data: [
          {
            id: 'conn-123',
            deal_id: 'deal-123',
            platform: 'xero' as const,
            connection_status: 'active' as const,
            last_sync_at: '2025-10-26T10:00:00Z',
            created_at: '2025-10-20T10:00:00Z',
          },
        ],
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await getFinancialConnections('deal-123');

      expect(api.get).toHaveBeenCalledWith('/deals/deal-123/financial/connections');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getFinancialNarrative', () => {
    it('should call GET /deals/:dealId/financial/narrative', async () => {
      const mockResponse = {
        data: {
          id: 'narrative-123',
          deal_id: 'deal-123',
          summary: 'This company shows strong liquidity and profitability metrics.',
          strengths: ['High current ratio', 'Strong profit margins'],
          weaknesses: ['High debt-to-equity ratio'],
          red_flags: [],
          readiness_score: 78.5,
          readiness_score_breakdown: {
            data_quality_score: 20,
            financial_health_score: 32,
            growth_trajectory_score: 15,
            risk_assessment_score: 11.5,
          },
          generated_at: '2025-10-26T12:00:00Z',
          ai_model: 'gpt-4',
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await getFinancialNarrative('deal-123');

      expect(api.get).toHaveBeenCalledWith('/deals/deal-123/financial/narrative');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getFinancialRatios', () => {
    it('should call GET /deals/:dealId/financial/ratios', async () => {
      const mockResponse = {
        data: {
          deal_id: 'deal-123',
          organization_id: 'org-456',
          current_ratio: 2.0,
          debt_to_equity: 0.8,
          calculated_at: '2025-10-26T12:00:00Z',
          data_quality: 'partial' as const,
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await getFinancialRatios('deal-123');

      expect(api.get).toHaveBeenCalledWith('/deals/deal-123/financial/ratios');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
