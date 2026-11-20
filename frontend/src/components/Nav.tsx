import type { Dictionary } from '../i18n';
import type { Screen } from '../types';

type Props = {
  screen: Screen;
  dict: Dictionary;
  onNavigate: (screen: Screen) => void;
};

const ITEMS: Screen[] = ['home', 'plan', 'impact', 'community', 'profile'];

export function Nav({ screen, dict, onNavigate }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--mist-line)] bg-[color-mix(in_srgb,var(--mist-bg)_88%,white)]/95 backdrop-blur-md"
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1 px-2 py-2">
        {ITEMS.map((id) => {
          const active = screen === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(id)}
                className={`w-full rounded-lg px-1 py-2 text-center text-[11px] font-semibold tracking-wide transition sm:text-xs ${
                  active
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-[var(--mist-deep)] hover:bg-white/40'
                }`}
              >
                {dict.nav[id]}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
