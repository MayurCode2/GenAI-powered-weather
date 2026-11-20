import { computeImpact } from '../lib/impact';
import type { Dictionary } from '../i18n';
import type { ImpactToggles, Profile } from '../types';

type Props = {
  dict: Dictionary;
  toggles: ImpactToggles;
  profile: Profile;
  onChange: (next: ImpactToggles) => void;
};

export function Impact({ dict, toggles, profile, onChange }: Props) {
  const result = computeImpact(toggles, profile);
  const sensitive = profile.kids || profile.elderly;

  const rows: { key: keyof ImpactToggles; label: string }[] = [
    { key: 'metro', label: dict.impact.toggles.metro },
    {
      key: 'windowsClosedMorning',
      label: dict.impact.toggles.windowsClosedMorning,
    },
    { key: 'purifier', label: dict.impact.toggles.purifier },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-[var(--mist-ink)]">
          {dict.impact.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--mist-deep)]">{dict.impact.subtitle}</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <MeterCard
          label={`${dict.impact.exposureDown} (${dict.impact.approx})`}
          value={`${result.exposureReductionPct}%`}
        />
        <MeterCard
          label={`${dict.impact.co2Saved} (${dict.impact.approx})`}
          value={`${result.co2KgSaved}`}
          unit={dict.impact.kg}
        />
      </div>

      <ul className="space-y-3">
        {rows.map(({ key, label }) => (
          <li
            key={key}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--mist-line)] bg-white/40 px-4 py-3"
          >
            <label htmlFor={`toggle-${key}`} className="text-sm font-medium text-[var(--mist-ink)]">
              {label}
            </label>
            <button
              id={`toggle-${key}`}
              type="button"
              role="switch"
              aria-checked={toggles[key]}
              onClick={() => onChange({ ...toggles, [key]: !toggles[key] })}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                toggles[key] ? 'bg-[var(--accent)]' : 'bg-[var(--mist-deep)]/35'
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  toggles[key] ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      {sensitive && (
        <p className="text-xs text-[var(--mist-deep)]">{dict.impact.familyNote}</p>
      )}
      <p className="text-xs text-[var(--mist-deep)]/80">{dict.impact.tip}</p>
    </div>
  );
}

function MeterCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--mist-line)] bg-gradient-to-b from-white/60 to-[#d5e0ea]/50 px-4 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mist-deep)]">
        {label}
      </p>
      <p className="font-display mt-2 text-4xl tabular-nums text-[var(--mist-ink)]">
        {value}
      </p>
      {unit && <p className="mt-1 text-xs text-[var(--mist-deep)]">{unit}</p>}
    </div>
  );
}
