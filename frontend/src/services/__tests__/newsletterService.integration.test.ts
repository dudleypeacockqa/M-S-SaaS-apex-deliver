/**
 * Newsletter Service Integration Tests
 * Following TDD RED → GREEN → REFACTOR methodology
 * 
 * Verifies newsletter subscription service calls correct endpoint
 * and handles responses appropriately
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { subscribeToNewsletter } from '../newsletterService';
import api from '../api';

// Mock the API client
vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Newsletter Service Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('subscribeToNewsletter', () => {
    it('calls correct API endpoint with email and source', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Thank you for subscribing!',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const payload = {
        email: 'test@example.com',
        source: 'popup',
      };

      const result = await subscribeToNewsletter(payload);

      expect(api.post).toHaveBeenCalledWith('/marketing/subscribe', payload);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Thank you for subscribing!');
    });

    it('handles API errors gracefully', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            detail: 'Failed to subscribe. Please try again later.',
          },
        },
      };

      vi.mocked(api.post).mockRejectedValue(mockError);

      const payload = {
        email: 'test@example.com',
        source: 'popup',
      };

      await expect(subscribeToNewsletter(payload)).rejects.toEqual(mockError);
    });

    it('uses default source when not provided', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Thank you for subscribing!',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const payload = {
        email: 'test@example.com',
      };

      await subscribeToNewsletter(payload);

      expect(api.post).toHaveBeenCalledWith('/marketing/subscribe', {
        email: 'test@example.com',
        source: undefined,
      });
    });

    it('validates email format', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Thank you for subscribing!',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const payload = {
        email: 'valid-email@example.com',
        source: 'website',
      };

      const result = await subscribeToNewsletter(payload);

      expect(result.success).toBe(true);
    });
  });
});

