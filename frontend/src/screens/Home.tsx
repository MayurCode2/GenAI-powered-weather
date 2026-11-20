import { AqiHero } from '../components/AqiHero';
import { StatusBlock } from '../components/StatusBlock';
import type { Dictionary } from '../i18n';
import type { AqiData, PlanData } from '../types';

type Props = {
  dict: Dictionary;
  aqi: AqiData | null;
  aqiLoading: boolean;
  aqiError: string | null;
  onRetryAqi: () => void;
  plan: PlanData | null;
  planLoading: boolean;
  planError: string | null;
  onGeneratePlan: () => void;
  onOpenPlan: () => void;
  profileCity?: string;
  cityValue: string;
  onCityChange: (city: string) => void;
};

export function Home({
  dict,
  aqi,
  aqiLoading,
  aqiError,
  onRetryAqi,
  plan,
  planLoading,
  planError,
  onGeneratePlan,
  onOpenPlan,
  profileCity,
  cityValue,
  onCityChange,
}: Props) {
  const cards = plan?.homeCards?.slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      <AqiHero
        aqi={aqi}
        dict={dict}
        loading={aqiLoading}
        error={aqiError}
        onRetry={onRetryAqi}
        fallbackCity={profileCity}
        cityValue={cityValue}
        onCityChange={onCityChange}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onGeneratePlan}
          disabled={planLoading || !aqi}
          className="rounded-xl bg-[var(--mist-ink)] px-4 py-2.5 text-sm font-semibold text-[var(--mist-bg)] disabled:opacity-50"
        >
          {planLoading ? dict.home.generating : dict.home.generatePlan}
        </button>
        {plan && (
          <button
            type="button"
            onClick={onOpenPlan}
            className="rounded-xl border border-[var(--mist-line)] bg-white/50 px-4 py-2.5 text-sm font-semibold text-[var(--mist-ink)]"
          >
            {dict.home.viewPlan}
          </button>
        )}
      </div>

      <StatusBlock
        loading={false}
        error={planError}
        dict={dict}
        onRetry={onGeneratePlan}
      />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--mist-deep)]">
          {dict.home.actionCards}
        </h2>
        {cards.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--mist-deep)]">{dict.home.noCards}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {cards.map((card, i) => (
              <li
                key={`${card.title}-${i}`}
                className="border-l-2 border-[var(--accent)] pl-4"
              >
                <p className="font-semibold text-[var(--mist-ink)]">{card.title}</p>
                <p className="mt-0.5 text-sm text-[var(--mist-deep)]">
                  {card.subtitle}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
