import type { YouTubePublishStatus } from '../../services/api/podcasts';

const STATUS_COPY: Record<YouTubePublishStatus, { label: string; className: string }> = {
  not_published: {
    label: 'Not published',
    className: 'bg-gray-100 text-gray-700',
  },
  uploading: {
    label: 'Uploading…',
    className: 'bg-blue-100 text-blue-700',
  },
  processing: {
    label: 'Processing…',
    className: 'bg-amber-100 text-amber-700',
  },
  published: {
    label: 'Published',
    className: 'bg-emerald-100 text-emerald-700',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-100 text-red-700',
  },
};

export function YouTubeStatusBadge({ status }: { status: YouTubePublishStatus }) {
  const variant = STATUS_COPY[status];

  return (
    <span
      data-testid="youtube-status-badge"
      className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize', variant.className].join(' ')}
    >
      {variant.label}
    </span>
  );
}
