import { StatusBlock } from '../components/StatusBlock';
import type { Dictionary } from '../i18n';
import type { PlanData } from '../types';

type Props = {
  dict: Dictionary;
  plan: PlanData | null;
  fromCache: boolean;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
};

const SECTION_KEYS = [
  'lowEmissionRoutine',
  'indoorHacks',
  'sustainableAlternatives',
] as const;

export function Plan({
  dict,
  plan,
  fromCache,
  loading,
  error,
  onGenerate,
}: Props) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-[var(--mist-ink)]">
          {dict.plan.title}
        </h1>
        {fromCache && plan && (
          <p className="mt-1 text-xs font-medium text-[var(--mist-deep)]">
            {dict.plan.cached}
          </p>
        )}
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="rounded-xl bg-[var(--mist-ink)] px-4 py-2.5 text-sm font-semibold text-[var(--mist-bg)] disabled:opacity-50"
        >
          {loading ? dict.plan.regenerating : dict.plan.generate}
        </button>
      </div>

      <StatusBlock
        loading={loading && !plan}
        error={error}
        dict={dict}
        onRetry={onGenerate}
        loadingText={dict.plan.regenerating}
      />

      {!plan && !loading && !error && (
        <p className="text-sm text-[var(--mist-deep)]">{dict.plan.empty}</p>
      )}

      {plan && (
        <div className="space-y-8">
          <p className="text-base leading-relaxed text-[var(--mist-ink)]/90">
            {plan.summary}
          </p>

          {SECTION_KEYS.map((key) => (
            <section key={key}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                {dict.plan.sections[key]}
              </h2>
              <ul className="mt-3 space-y-4">
                {plan.sections[key].map((item, i) => (
                  <li
                    key={`${key}-${i}`}
                    className="rounded-xl border border-[var(--mist-line)] bg-white/40 px-4 py-3"
                  >
                    <p className="font-medium text-[var(--mist-ink)]">{item.tip}</p>
                    <p className="mt-1.5 text-sm text-[var(--mist-deep)]">
                      <span className="font-semibold text-[var(--mist-ink)]/70">
                        {dict.plan.why}:{' '}
                      </span>
                      {item.why}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
