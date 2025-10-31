/**
 * TDD RED phase: LiveStreamManager component tests (DEV-016 Podcast Studio)
 *
 * Story: DEV-016-podcast-studio-subscription (Phase 7 - Live Streaming UI)
 *
 * Validates enterprise live streaming controls:
 * - Creating live streams with RTMP credentials
 * - Copying RTMP details to clipboard
 * - Stream lifecycle status handling (offline -> starting -> live -> stopping)
 * - Start/stop controls and recording options
 * - Multi-language streaming support for enterprise subscribers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LiveStreamManager from './LiveStreamManager';

vi.mock('../../services/api/podcastStreams', () => ({
  fetchLiveStream: vi.fn(),
  createLiveStream: vi.fn(),
  startLiveStream: vi.fn(),
  stopLiveStream: vi.fn(),
  getLiveStreamStatus: vi.fn(),
  updateLiveStreamPreferences: vi.fn(),
}));

import {
  fetchLiveStream,
  createLiveStream,
  startLiveStream,
  stopLiveStream,
  getLiveStreamStatus,
  updateLiveStreamPreferences,
} from '../../services/api/podcastStreams';

type TestStreamStatus = 'offline' | 'starting' | 'live' | 'stopping';

type TestLiveStream = {
  id: string;
  podcastId: string;
  serverUrl: string;
  streamKey: string;
  playbackUrl: string;
  status: TestStreamStatus;
  recording: {
    enabled: boolean;
    retentionDays: number;
    storageLocation: 'cloud' | 'local';
  };
  languages: string[];
  createdAt: string;
  lastStartedAt: string | null;
};

const createTestStream = (overrides: Partial<TestLiveStream> = {}): TestLiveStream => ({
  id: 'stream-abc123',
  podcastId: 'pod-123',
  serverUrl: 'rtmp://stream.example.com/live',
  streamKey: 'stream-key-xyz',
  playbackUrl: 'https://cdn.example.com/live/stream-abc123.m3u8',
  status: 'offline',
  recording: {
    enabled: true,
    retentionDays: 30,
    storageLocation: 'cloud',
  },
  languages: ['en', 'es', 'fr'],
  createdAt: '2025-10-28T12:00:00Z',
  lastStartedAt: null,
  ...overrides,
});

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderManager = (
  props: Partial<React.ComponentProps<typeof LiveStreamManager>> = {}
) => {
  const queryClient = createQueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return render(
    <LiveStreamManager podcastId="pod-123" tier="enterprise" {...props} />,
    { wrapper }
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('LiveStreamManager - create flow', () => {
  it('should render create stream button and invoke API on click', async () => {
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(null);
    const createdStream = createTestStream();
    vi.mocked(createLiveStream).mockResolvedValueOnce(createdStream);
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(createdStream);

    renderManager();

    const createButton = await screen.findByRole('button', {
      name: /create stream/i,
    });

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(createLiveStream).toHaveBeenCalledWith(
        expect.objectContaining({ podcastId: 'pod-123' })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('rtmp://stream.example.com/live')).toBeInTheDocument();
      expect(screen.getByText('stream-key-xyz')).toBeInTheDocument();
    });
  });
});

describe('LiveStreamManager - RTMP configuration', () => {
  it('should display RTMP server URL and stream key when stream exists', async () => {
    const liveStream = createTestStream();
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(liveStream);

    renderManager();

    await waitFor(() => {
      expect(screen.getByText(liveStream.serverUrl)).toBeInTheDocument();
      expect(screen.getByText(liveStream.streamKey)).toBeInTheDocument();
    });
  });

  it('should copy RTMP details to clipboard', async () => {
    const liveStream = createTestStream();
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(liveStream);

    const writeText = vi.fn();
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: {
        writeText,
      },
    } as unknown as Navigator);

    renderManager();

    const copyServerButton = await screen.findByRole('button', {
      name: /copy server url/i,
    });
    const copyKeyButton = await screen.findByRole('button', {
      name: /copy stream key/i,
    });

    fireEvent.click(copyServerButton);
    fireEvent.click(copyKeyButton);

    expect(writeText).toHaveBeenCalledWith(liveStream.serverUrl);
    expect(writeText).toHaveBeenCalledWith(liveStream.streamKey);
  });
});

describe('LiveStreamManager - status handling', () => {
  it.each<[
    TestStreamStatus,
    RegExp
  ]>([
    ['offline', /offline/i],
    ['starting', /starting/i],
    ['live', /live/i],
    ['stopping', /stopping/i],
  ])('should display %s status text', async (status, matcher) => {
    vi.mocked(fetchLiveStream).mockResolvedValue(createTestStream({ status }));

    renderManager();

    const statusBadge = await screen.findByTestId('stream-status');
    expect(statusBadge).toHaveTextContent(matcher);
  });

  it('should start a stream and show transitional status', async () => {
    const stream = createTestStream({ status: 'offline' });
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(stream);
    vi.mocked(startLiveStream).mockResolvedValueOnce(
      createTestStream({ status: 'starting' })
    );
    vi.mocked(getLiveStreamStatus).mockResolvedValueOnce({
      status: 'starting',
      updatedAt: '2025-10-29T12:00:00Z',
      viewerCount: 0,
    });

    renderManager();

    const startButton = await screen.findByRole('button', {
      name: /start stream/i,
    });

    fireEvent.click(startButton);

    await waitFor(() => {
      expect(startLiveStream).toHaveBeenCalledWith(stream.id);
    });

    await waitFor(() => {
      expect(getLiveStreamStatus).toHaveBeenCalledWith(stream.id);
    });
  });

  it('should stop an active stream and request status refresh', async () => {
    const stream = createTestStream({ status: 'live' });
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(stream);
    vi.mocked(stopLiveStream).mockResolvedValueOnce(
      createTestStream({ status: 'stopping' })
    );
    vi.mocked(getLiveStreamStatus).mockResolvedValueOnce({
      status: 'stopping',
      updatedAt: '2025-10-29T12:05:00Z',
      viewerCount: 12,
    });

    renderManager();

    const stopButton = await screen.findByRole('button', {
      name: /stop stream/i,
    });

    fireEvent.click(stopButton);

    await waitFor(() => {
      expect(stopLiveStream).toHaveBeenCalledWith(stream.id);
    });

    await waitFor(() => {
      expect(getLiveStreamStatus).toHaveBeenCalledWith(stream.id);
    });
  });
});

describe('LiveStreamManager - status polling', () => {
  it('should poll stream status at intervals when stream is active', async () => {
    const timers: Array<() => void> = [];
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout').mockImplementation((cb, ms) => {
      if (typeof cb === 'function') {
        timers.push(cb as () => void);
      }
      return 0 as unknown as number;
    });

    try {
      const stream = createTestStream({ status: 'live' });
      vi.mocked(fetchLiveStream).mockResolvedValueOnce(stream);

      const firstSnapshot = {
        status: 'live',
        updatedAt: '2025-10-29T12:10:00Z',
        viewerCount: 12,
        averageBitrateKbps: 2800,
      };
      const secondSnapshot = {
        status: 'live',
        updatedAt: '2025-10-29T12:10:05Z',
        viewerCount: 24,
        averageBitrateKbps: 3200,
      };

      vi.mocked(getLiveStreamStatus).mockResolvedValueOnce(firstSnapshot);

      renderManager();

      const summary = await screen.findByText(/stream summary/i);

      await waitFor(() => {
        expect(getLiveStreamStatus).toHaveBeenCalledWith(stream.id);
      });

      await waitFor(() => {
        expect(within(summary.parentElement!).getByText('12')).toBeInTheDocument();
      });

      expect(timers.length).toBeGreaterThan(0);

      vi.mocked(getLiveStreamStatus).mockResolvedValueOnce(secondSnapshot);
      act(() => {
        const nextTick = timers.shift();
        nextTick?.();
      });

      await waitFor(() => {
        expect(within(summary.parentElement!).getByText('24')).toBeInTheDocument();
      });
    } finally {
      setTimeoutSpy.mockRestore();
    }
  });

  it('should stop polling when stream is offline', async () => {
    const timers: Array<() => void> = [];
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout').mockImplementation((cb, ms) => {
      if (typeof cb === 'function') {
        timers.push(cb as () => void);
      }
      return 0 as unknown as number;
    });

    try {
      const stream = createTestStream({ status: 'offline' });
      vi.mocked(fetchLiveStream).mockResolvedValueOnce(stream);

      renderManager();

      await screen.findByTestId('stream-status');

      expect(getLiveStreamStatus).not.toHaveBeenCalled();
      expect(timers.length).toBe(0);
    } finally {
      setTimeoutSpy.mockRestore();
    }
  });
});

describe('LiveStreamManager - recording controls', () => {
  it('should render recording toggle and retention selector', async () => {
    const stream = createTestStream({
      recording: {
        enabled: true,
        retentionDays: 45,
        storageLocation: 'cloud',
      },
    });
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(stream);

    renderManager();

    const recordingToggle = await screen.findByRole('checkbox', {
      name: /record stream/i,
    });
    expect(recordingToggle).toBeChecked();

    const retentionSelect = screen.getByRole('combobox', {
      name: /recording retention/i,
    });

    expect(retentionSelect).toHaveValue('45');
    expect(
      within(retentionSelect).getByRole('option', { name: /45 days/i })
    ).toBeInTheDocument();
  });

  it('should persist recording preferences when toggled', async () => {
    const stream = createTestStream({
      recording: {
        enabled: false,
        retentionDays: 30,
        storageLocation: 'cloud',
      },
    });
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(stream);

    renderManager();

    const recordingToggle = await screen.findByRole('checkbox', {
      name: /record stream/i,
    });

    fireEvent.click(recordingToggle);

    await waitFor(() => {
      expect(updateLiveStreamPreferences).toHaveBeenCalledWith(stream.id, {
        recording: {
          enabled: true,
          retentionDays: 30,
          storageLocation: 'cloud',
          postProcessing: [],
        },
      });
    });
  });
});

describe('LiveStreamManager - multi-language support', () => {
  it('should show language selector with multiple options for enterprise tier', async () => {
    const stream = createTestStream({ languages: ['en', 'es', 'de'] });
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(stream);

    renderManager({ tier: 'enterprise' });

    const languageSelect = await screen.findByRole('combobox', {
      name: /stream language/i,
    });

    expect(languageSelect).toBeInTheDocument();
    expect(within(languageSelect).getByRole('option', { name: /english/i })).toBeInTheDocument();
    expect(within(languageSelect).getByRole('option', { name: /spanish/i })).toBeInTheDocument();
    expect(within(languageSelect).getByRole('option', { name: /german/i })).toBeInTheDocument();
  });

  it('should update selected language preference', async () => {
    const stream = createTestStream({ languages: ['en', 'es', 'it'] });
    vi.mocked(fetchLiveStream).mockResolvedValueOnce(stream);

    renderManager({ tier: 'enterprise' });

    const languageSelect = await screen.findByRole('combobox', {
      name: /stream language/i,
    });

    fireEvent.change(languageSelect, { target: { value: 'es' } });

    await waitFor(() => {
      expect(updateLiveStreamPreferences).toHaveBeenCalledWith(stream.id, {
        languages: ['es'],
      });
    });
  });
});


