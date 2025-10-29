import React from 'react';

import { LiveStream } from '../../services/api/podcastStreams';

interface StreamConfigPanelProps {
  stream: LiveStream;
  onCopyServerUrl: () => void;
  onCopyStreamKey: () => void;
}

export function StreamConfigPanel({ stream, onCopyServerUrl, onCopyStreamKey }: StreamConfigPanelProps) {
  const [showStreamKey, setShowStreamKey] = React.useState(false);

  return (
    <section aria-labelledby="stream-config-heading" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="stream-config-heading" className="text-lg font-semibold text-slate-900">RTMP configuration</h2>
          <p className="mt-1 text-sm text-slate-500">
            Connect OBS, Streamlabs, or your encoder using the credentials below.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
          Secure
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="rtmp-server" className="block text-sm font-medium text-slate-700">
            RTMP server URL
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              id="rtmp-server"
              type="text"
              readOnly
              value={stream.serverUrl}
              className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
            />
            <button
              type="button"
              onClick={onCopyServerUrl}
              className="inline-flex items-center rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Copy Server URL
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="rtmp-key" className="block text-sm font-medium text-slate-700">
            Stream key
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              id="rtmp-key"
              type={showStreamKey ? 'text' : 'password'}
              readOnly
              value={stream.streamKey}
              className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowStreamKey((value) => !value)}
              className="inline-flex items-center rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {showStreamKey ? 'Hide key' : 'Show key'}
            </button>
            <button
              type="button"
              onClick={onCopyStreamKey}
              className="inline-flex items-center rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Copy Stream Key
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">OBS Studio</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Open Settings → Stream.</li>
            <li>Set service to Custom and paste the RTMP server URL.</li>
            <li>Paste the stream key and click Apply.</li>
          </ol>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Streamlabs</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Open Settings → Stream.</li>
            <li>Select Custom Streaming Server.</li>
            <li>Paste the RTMP details and click Done.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
