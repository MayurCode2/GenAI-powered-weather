import { useEffect, useState, type ReactNode } from 'react';
import { CitySearchSelect } from '../components/CitySearchSelect';
import type { Dictionary } from '../i18n';
import {
  DELHI_FAMILY_SEED,
  type Commute,
  type Profile as ProfileType,
} from '../types';

type Props = {
  dict: Dictionary;
  profile: ProfileType;
  onSave: (profile: ProfileType) => void;
};

export function Profile({ dict, profile, onSave }: Props) {
  const [draft, setDraft] = useState<ProfileType>(profile);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const update = <K extends keyof ProfileType>(key: K, value: ProfileType[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const pickCity = (city: string) => {
    setDraft((d) => ({
      ...d,
      city,
      locationLabel: city,
      lat: null,
      lon: null,
    }));
  };

  const handleSave = () => {
    const city = draft.city.trim() || 'Delhi';
    const next: ProfileType = {
      ...draft,
      city,
      locationLabel: city,
      lat: null,
      lon: null,
    };
    onSave(next);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  };

  const loadDemo = () => {
    setDraft(DELHI_FAMILY_SEED);
    onSave(DELHI_FAMILY_SEED);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  };

  const commuteOptions: Commute[] = ['bike', 'car', 'metro', 'walk'];
  const homeTypes = ['apartment', 'house', 'villa'] as const;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-[var(--mist-ink)]">
          {dict.profile.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--mist-deep)]">
          {dict.profile.subtitle}
        </p>
      </header>

      <button
        type="button"
        onClick={loadDemo}
        className="rounded-xl border border-dashed border-[var(--accent)]/50 bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--accent)]"
      >
        {dict.profile.demoSeed}
      </button>

      <div className="space-y-4">
        <CitySearchSelect
          label={dict.profile.city}
          searchHint={dict.profile.citySearchHint}
          placeholder={dict.profile.citySearchPlaceholder}
          value={draft.city}
          onChange={pickCity}
        />

        <div className="rounded-xl border border-[var(--mist-line)] bg-white/50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--mist-deep)]">
            {dict.profile.selectedLocation}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[var(--mist-ink)]">
            {draft.city || '—'}
          </p>
        </div>

        <Field label={dict.profile.homeType}>
          <select
            className="field"
            value={draft.homeType}
            onChange={(e) => update('homeType', e.target.value)}
          >
            {homeTypes.map((h) => (
              <option key={h} value={h}>
                {dict.profile.homeTypes[h]}
              </option>
            ))}
          </select>
        </Field>

        <fieldset>
          <legend className="text-sm font-medium text-[var(--mist-ink)]">
            {dict.profile.commute}
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {commuteOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => update('commute', c)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  draft.commute === c
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'border-[var(--mist-line)] bg-white/40 text-[var(--mist-ink)]'
                }`}
              >
                {dict.profile.commuteOptions[c]}
              </button>
            ))}
          </div>
        </fieldset>

        <ToggleRow
          label={dict.profile.kids}
          checked={draft.kids}
          yes={dict.common.yes}
          no={dict.common.no}
          onChange={(v) => update('kids', v)}
        />
        <ToggleRow
          label={dict.profile.elderly}
          checked={draft.elderly}
          yes={dict.common.yes}
          no={dict.common.no}
          onChange={(v) => update('elderly', v)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-[var(--mist-ink)] px-4 py-2.5 text-sm font-semibold text-[var(--mist-bg)]"
        >
          {dict.profile.save}
        </button>
        {savedFlash && (
          <span className="text-sm font-medium text-[var(--accent)]">
            {dict.profile.saved}
          </span>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-[var(--mist-ink)]">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  yes,
  no,
  onChange,
}: {
  label: string;
  checked: boolean;
  yes: string;
  no: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--mist-line)] bg-white/40 px-4 py-3">
      <span className="text-sm font-medium text-[var(--mist-ink)]">{label}</span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-lg px-3 py-1 text-xs font-semibold ${
            checked
              ? 'bg-[var(--mist-ink)] text-[var(--mist-bg)]'
              : 'text-[var(--mist-deep)]'
          }`}
        >
          {yes}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-lg px-3 py-1 text-xs font-semibold ${
            !checked
              ? 'bg-[var(--mist-ink)] text-[var(--mist-bg)]'
              : 'text-[var(--mist-deep)]'
          }`}
        >
          {no}
        </button>
      </div>
    </div>
  );
}
