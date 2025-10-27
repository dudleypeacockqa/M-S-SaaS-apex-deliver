/**
 * Tests for FinancialOverview Component - DEV-010 Phase 2.1
 * TDD: Write tests first, then implement component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FinancialOverview } from './FinancialOverview';

describe('FinancialOverview Component', () => {
  it('should render connection status card when not connected', () => {
    const mockProps = {
      dealId: 'deal-123',
      isConnected: false,
      lastSyncAt: null,
      onConnect: vi.fn(),
      onSync: vi.fn(),
    };

    render(<FinancialOverview {...mockProps} />);

    // Should show disconnected status
    expect(screen.getByText(/not connected/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect accounting system/i })).toBeInTheDocument();

    // Should NOT show sync button when disconnected
    expect(screen.queryByRole('button', { name: /sync data/i })).not.toBeInTheDocument();
  });

  it('should render connection status card when connected', () => {
    const mockProps = {
      dealId: 'deal-123',
      isConnected: true,
      platform: 'xero',
      platformOrgName: 'Acme Corp Ltd',
      lastSyncAt: '2025-10-26T10:30:00Z',
      onConnect: vi.fn(),
      onSync: vi.fn(),
    };

    render(<FinancialOverview {...mockProps} />);

    // Should show connected status
    expect(screen.getByText(/connected/i)).toBeInTheDocument();
    expect(screen.getByText(/xero/i)).toBeInTheDocument();
    expect(screen.getByText(/acme corp ltd/i)).toBeInTheDocument();

    // Should show sync button when connected
    expect(screen.getByRole('button', { name: /sync data/i })).toBeInTheDocument();

    // Should NOT show connect button when already connected
    expect(screen.queryByRole('button', { name: /connect accounting system/i })).not.toBeInTheDocument();
  });

  it('should display last sync timestamp when available', () => {
    const mockProps = {
      dealId: 'deal-123',
      isConnected: true,
      platform: 'xero',
      lastSyncAt: '2025-10-26T10:30:00Z',
      onConnect: vi.fn(),
      onSync: vi.fn(),
    };

    render(<FinancialOverview {...mockProps} />);

    // Should show formatted timestamp
    expect(screen.getByText(/last sync/i)).toBeInTheDocument();
    expect(screen.getByText(/oct 26/i)).toBeInTheDocument();
  });

  it('should call onConnect when connect button is clicked', async () => {
    const onConnectMock = vi.fn();
    const mockProps = {
      dealId: 'deal-123',
      isConnected: false,
      lastSyncAt: null,
      onConnect: onConnectMock,
      onSync: vi.fn(),
    };

    render(<FinancialOverview {...mockProps} />);

    const connectButton = screen.getByRole('button', { name: /connect accounting system/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onSync when sync button is clicked', async () => {
    const onSyncMock = vi.fn();
    const mockProps = {
      dealId: 'deal-123',
      isConnected: true,
      platform: 'xero',
      lastSyncAt: '2025-10-26T10:30:00Z',
      onConnect: vi.fn(),
      onSync: onSyncMock,
    };

    render(<FinancialOverview {...mockProps} />);

    const syncButton = screen.getByRole('button', { name: /sync data/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(onSyncMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should show loading state during sync', () => {
    const mockProps = {
      dealId: 'deal-123',
      isConnected: true,
      platform: 'xero',
      lastSyncAt: '2025-10-26T10:30:00Z',
      isLoading: true,
      onConnect: vi.fn(),
      onSync: vi.fn(),
    };

    render(<FinancialOverview {...mockProps} />);

    // Sync button should be disabled during loading
    const syncButton = screen.getByRole('button', { name: /sync/i });
    expect(syncButton).toBeDisabled();
  });
});
