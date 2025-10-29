import { LiveStream, StreamQuality, StreamStatus } from '../../services/api/podcastStreams';

interface StreamControlPanelProps {
  stream: LiveStream;
  statusSnapshot: {
    viewerCount: number | null;
    updatedAt: string | null;
    averageBitrateKbps: number | null;
  } | null;
  onStart: () => void;
  onStop: () => void;
  onQualityChange: (quality: StreamQuality) => void;
  isStarting: boolean;
  isStopping: boolean;
}

const statusLabel = (status: StreamStatus) => {
  switch (status) {
    case 'live':
      return { text: 'Live', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    case 'starting':
      return { text: 'Starting', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    case 'stopping':
      return { text: 'Stopping', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    case 'failed':
    case 'error':
      return { text: 'Error', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    default:
      return { text: 'Offline', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};

const qualityOptions: Array<{ label: string; value: StreamQuality; description: string }> = [
  { label: '1080p', value: '1080p', description: 'Full HD — 6000 kbps bitrate' },
  { label: '720p', value: '720p', description: 'HD — 4500 kbps bitrate' },
  { label: '480p', value: '480p', description: 'SD — 2500 kbps bitrate' },
];

export function StreamControlPanel({
  stream,
  statusSnapshot,
  onStart,
  onStop,
  onQualityChange,
  isStarting,
  isStopping,
}: StreamControlPanelProps) {
  const status = statusLabel(stream.status);
  const disableStart = stream.status === 'live' || stream.status === 'starting' || isStarting;
  const disableStop = (stream.status !== 'live' && stream.status !== 'starting') || isStopping;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Stream controls</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage broadcast lifecycle and ensure the stream is healthy before going live.
          </p>
        </div>
        <span
          data-testid="stream-status"
          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${status.color}`}
        >
          {status.text}
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <button
            type="button"
            onClick={onStart}
            disabled={disableStart}
            className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-200"
          >
            {isStarting ? 'Starting…' : 'Start stream'}
          </button>
          <button
            type="button"
            onClick={onStop}
            disabled={disableStop}
            className="inline-flex w-full items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-200"
          >
            {isStopping ? 'Stopping…' : 'Stop stream'}
          </button>

          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Stream summary</p>
            <dl className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <dt>Viewer count</dt>
                <dd>{statusSnapshot?.viewerCount ?? stream.latestViewerCount ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Last started</dt>
                <dd>{stream.lastStartedAt ? new Date(stream.lastStartedAt).toLocaleString() : 'Never'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Average bitrate</dt>
                <dd>{statusSnapshot?.averageBitrateKbps ? `${statusSnapshot.averageBitrateKbps} kbps` : 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-4" aria-labelledby="quality-heading">
          <div>
            <h3 id="quality-heading" className="text-sm font-semibold text-slate-800">
              Quality settings
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Choose the target resolution for the RTMP encoder. We will auto-negotiate lower bitrates for viewers on
              slower connections.
            </p>
          </div>
          <fieldset className="space-y-3">
            {qualityOptions.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3">
                <input
                  type="radio"
                  name="stream-quality"
                  value={option.value}
                  checked={stream.quality === option.value}
                  onChange={() => onQualityChange(option.value)}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  <span className="text-sm font-semibold text-slate-800">{option.label}</span>
                  <span className="block text-xs text-slate-500">{option.description}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      </div>
    </section>
  );
}

