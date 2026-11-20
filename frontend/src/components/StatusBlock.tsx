import type { Dictionary } from '../i18n';

type Props = {
  loading?: boolean;
  error?: string | null;
  dict: Dictionary;
  onRetry?: () => void;
  loadingText?: string;
};

export function StatusBlock({
  loading,
  error,
  dict,
  onRetry,
  loadingText,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--mist-line)] bg-white/45 px-4 py-3">
        <span className="haze-pulse inline-block h-2.5 w-2.5 rounded-full bg-[var(--mist-deep)]" />
        <p className="text-sm text-[var(--mist-deep)]">
          {loadingText ?? dict.common.loading}
        </p>
      </div>
    );
  }

  if (!error) return null;

  return (
    <div className="rounded-xl border border-rose-800/20 bg-rose-50/90 px-4 py-3">
      <p className="text-sm font-medium text-rose-950">{dict.common.error}</p>
      <p className="mt-1 text-sm text-rose-900/80">{error}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-rose-900 px-3 py-1.5 text-xs font-semibold text-rose-50"
        >
          {dict.common.retry}
        </button>
      )}
    </div>
  );
}
