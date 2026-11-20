import { useState } from 'react';
import {
  SEED_GROUP,
  combinedGroupScore,
  type CommunityState,
} from '../lib/community';
import type { Dictionary } from '../i18n';
import type { ImpactToggles, Profile } from '../types';

type Props = {
  dict: Dictionary;
  community: CommunityState;
  toggles: ImpactToggles;
  profile: Profile;
  onJoin: (name: string) => void;
  onLeave: () => void;
};

export function Community({
  dict,
  community,
  toggles,
  profile,
  onJoin,
  onLeave,
}: Props) {
  const [name, setName] = useState(community.groupName ?? SEED_GROUP.name);
  const score = combinedGroupScore(community, toggles, profile);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-[var(--mist-ink)]">
          {dict.community.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--mist-deep)]">
          {dict.community.subtitle}
        </p>
      </header>

      <p className="text-xs leading-relaxed text-[var(--mist-deep)]">
        {dict.community.seedHint}
      </p>

      {community.groupName ? (
        <div className="space-y-4 rounded-2xl border border-[var(--mist-line)] bg-white/45 px-4 py-5">
          <p className="text-sm text-[var(--mist-deep)]">
            {dict.community.joinedAs}{' '}
            <span className="font-semibold text-[var(--mist-ink)]">
              {community.groupName}
            </span>
          </p>
          <ScoreRow
            label={dict.community.combinedScore}
            value={String(score.score)}
            meta={`${score.homes} ${dict.community.homes}`}
          />
          <ScoreRow
            label={dict.community.yourContribution}
            value={String(score.yourShare)}
          />
          <button
            type="button"
            onClick={onLeave}
            className="rounded-xl border border-[var(--mist-line)] px-4 py-2 text-sm font-semibold text-[var(--mist-ink)]"
          >
            {dict.community.leave}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-[var(--mist-deep)]">
            {dict.community.notJoined}
          </p>
          <label className="block text-sm font-medium text-[var(--mist-ink)]">
            {dict.community.groupName}
            <input
              className="mt-1.5 w-full rounded-xl border border-[var(--mist-line)] bg-white/60 px-3 py-2.5 text-[var(--mist-ink)] outline-none focus:border-[var(--accent)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={SEED_GROUP.name}
            />
          </label>
          <button
            type="button"
            onClick={() => onJoin(name)}
            className="rounded-xl bg-[var(--mist-ink)] px-4 py-2.5 text-sm font-semibold text-[var(--mist-bg)]"
          >
            {dict.community.join}
          </button>
        </div>
      )}
    </div>
  );
}

function ScoreRow({
  label,
  value,
  meta,
}: {
  label: string;
  value: string;
  meta?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mist-deep)]">
        {label}
      </p>
      <p className="font-display mt-1 text-3xl tabular-nums text-[var(--mist-ink)]">
        {value}
      </p>
      {meta && <p className="mt-0.5 text-xs text-[var(--mist-deep)]">{meta}</p>}
    </div>
  );
}
