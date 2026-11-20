import type { Dictionary } from '../i18n';
import type { AqiData } from '../types';
import { CitySearchSelect } from './CitySearchSelect';
import { SampleBanner } from './SampleBanner';

type Props = {
  aqi: AqiData | null;
  dict: Dictionary;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  fallbackCity?: string;
  cityValue: string;
  onCityChange: (city: string) => void;
};

function aqiTone(value: number): string {
  if (value <= 50) return '#3d6b5a';
  if (value <= 100) return '#6b8499';
  if (value <= 150) return '#9a7b4f';
  if (value <= 200) return '#a65d4a';
  return '#7a3f45';
}

export function AqiHero({
  aqi,
  dict,
  loading,
  error,
  onRetry,
  fallbackCity,
  cityValue,
  onCityChange,
}: Props) {
  const locationName = aqi?.city || fallbackCity || cityValue || '—';

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--mist-line)] bg-gradient-to-br from-[#cfdce8]/90 via-[#e4ebf1]/70 to-[#b8c9d8]/50 px-5 py-6">
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
        style={{ background: aqi ? aqiTone(aqi.aqi) : 'var(--mist-deep)' }}
        aria-hidden
      />

      <p className="font-display text-4xl tracking-tight text-[var(--mist-ink)] sm:text-5xl">
        AirWise
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--mist-deep)] sm:text-base">
        {dict.tagline}
      </p>

      <div className="mt-4 space-y-3">
        <div className="inline-flex max-w-full items-start gap-2 rounded-xl border border-[var(--mist-line)] bg-white/55 px-3 py-2.5 backdrop-blur-sm">
          <span
            className="mt-0.5 text-lg leading-none text-[var(--accent)]"
            aria-hidden
          >
            ⌖
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--mist-deep)]">
              {dict.home.yourLocation}
            </p>
            <p className="truncate text-base font-semibold text-[var(--mist-ink)] sm:text-lg">
              {locationName}
            </p>
          </div>
        </div>

        <CitySearchSelect
          label={dict.profile.city}
          searchHint={dict.profile.citySearchHint}
          placeholder={dict.profile.citySearchPlaceholder}
          value={cityValue}
          onChange={onCityChange}
        />
      </div>

      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--mist-ink)]/75">
        {dict.pitch}
      </p>

      <div className="mt-6">
        {loading && (
          <p className="text-sm text-[var(--mist-deep)]">{dict.home.loadingAqi}</p>
        )}
        {error && (
          <div className="space-y-2">
            <p className="text-sm text-rose-900">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {dict.home.retryAqi}
            </button>
          </div>
        )}
        {aqi && !loading && (
          <>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--mist-deep)]">
                  {dict.home.aqiLabel}
                </p>
                <p
                  className="font-display mt-1 text-5xl leading-none tabular-nums"
                  style={{ color: aqiTone(aqi.aqi) }}
                >
                  {aqi.aqi}
                </p>
              </div>
              <div className="pb-1 text-sm text-[var(--mist-ink)]/80">
                <p>
                  {dict.home.pm25} {aqi.pm25}
                  {aqi.category ? ` · ${aqi.category}` : ''}
                </p>
              </div>
            </div>
            <div className="mt-4">
              {aqi.isSample ? (
                <SampleBanner message={dict.home.sampleBanner} />
              ) : (
                <p className="text-xs text-[var(--mist-deep)]">
                  {aqi.label || dict.home.liveBanner}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
