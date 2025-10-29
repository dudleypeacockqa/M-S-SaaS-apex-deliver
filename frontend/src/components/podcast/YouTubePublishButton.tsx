interface YouTubePublishButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function YouTubePublishButton({ isLoading, disabled, onClick }: YouTubePublishButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? 'Publishing to YouTube…' : 'Publish episode'}
    </button>
  );
}
