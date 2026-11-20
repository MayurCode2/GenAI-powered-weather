import type { Language } from '../types';
import type { Dictionary } from '../i18n';

type Props = {
  lang: Language;
  dict: Dictionary;
  onChange: (lang: Language) => void;
};

export function LanguageToggle({ lang, dict, onChange }: Props) {
  return (
    <div
      className="inline-flex rounded-lg border border-[var(--mist-line)] bg-white/40 p-0.5"
      role="group"
      aria-label={dict.lang.label}
    >
      <button
        type="button"
        className={`px-2.5 py-1 text-xs font-semibold tracking-wide transition ${
          lang === 'en'
            ? 'rounded-md bg-[var(--mist-ink)] text-[var(--mist-bg)]'
            : 'text-[var(--mist-deep)]'
        }`}
        onClick={() => onChange('en')}
      >
        {dict.lang.en}
      </button>
      <button
        type="button"
        className={`px-2.5 py-1 text-xs font-semibold tracking-wide transition ${
          lang === 'hi'
            ? 'rounded-md bg-[var(--mist-ink)] text-[var(--mist-bg)]'
            : 'text-[var(--mist-deep)]'
        }`}
        onClick={() => onChange('hi')}
      >
        {dict.lang.hi}
      </button>
    </div>
  );
}
