import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { filterCities } from '../lib/cities';

type Props = {
  value: string;
  onChange: (city: string) => void;
  label: string;
  placeholder?: string;
  searchHint?: string;
};

export function CitySearchSelect({
  value,
  onChange,
  label,
  placeholder = 'Search city…',
  searchHint,
}: Props) {
  const id = useId();
  const listId = `${id}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const results = useMemo(() => filterCities(query, 14), [query]);

  const pick = (city: string) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <label className="block text-sm font-medium text-[var(--mist-ink)]" htmlFor={id}>
        {label}
      </label>
      {searchHint && (
        <p className="mt-1 text-xs text-[var(--mist-deep)]">{searchHint}</p>
      )}
      <div className="relative mt-1.5">
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className="field pr-9"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) {
              e.preventDefault();
              pick(results[0]);
            }
            if (e.key === 'Escape') setOpen(false);
          }}
        />
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mist-deep)]"
          aria-hidden
        >
          ▾
        </span>
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-[var(--mist-line)] bg-white py-1 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[var(--mist-deep)]">
              No city found — try another name
            </li>
          ) : (
            results.map((city) => (
              <li key={city} role="option" aria-selected={city === value}>
                <button
                  type="button"
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-[var(--accent-soft)] ${
                    city === value
                      ? 'font-semibold text-[var(--accent)]'
                      : 'text-[var(--mist-ink)]'
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(city)}
                >
                  {city}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
