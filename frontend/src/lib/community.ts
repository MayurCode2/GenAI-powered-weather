import { computeImpact } from './impact';
import type { ImpactToggles, Profile } from '../types';

const STORAGE_KEY = 'airwise_community';

export const SEED_GROUP = {
  name: 'Green Park Society',
  homes: 47,
  /** Baseline combined score from ~47 demo homes (arbitrary but stable). */
  baseScore: 1284,
} as const;

export type CommunityState = {
  groupName: string | null;
  joinedAt: string | null;
};

export function loadCommunity(): CommunityState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { groupName: null, joinedAt: null };
    const parsed = JSON.parse(raw) as CommunityState;
    return {
      groupName: parsed.groupName ?? null,
      joinedAt: parsed.joinedAt ?? null,
    };
  } catch {
    return { groupName: null, joinedAt: null };
  }
}

export function saveCommunity(state: CommunityState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function joinGroup(name: string): CommunityState {
  const trimmed = name.trim() || SEED_GROUP.name;
  const next: CommunityState = {
    groupName: trimmed,
    joinedAt: new Date().toISOString(),
  };
  saveCommunity(next);
  return next;
}

export function leaveGroup(): CommunityState {
  const next: CommunityState = { groupName: null, joinedAt: null };
  saveCommunity(next);
  return next;
}

/** Personal contribution derived from current what-if toggles. */
export function personalContribution(
  toggles: ImpactToggles,
  profile: Pick<Profile, 'kids' | 'elderly' | 'commute'>,
): number {
  const impact = computeImpact(toggles, profile);
  // Score blends exposure % and CO₂ for a single community number
  return Math.round(impact.exposureReductionPct * 4 + impact.co2KgSaved * 10);
}

/**
 * Combined neighbourhood score.
 * Seed group starts from Green Park Society (~47 homes) baseline;
 * your contribution is added when joined.
 */
export function combinedGroupScore(
  community: CommunityState,
  toggles: ImpactToggles,
  profile: Pick<Profile, 'kids' | 'elderly' | 'commute'>,
): {
  score: number;
  homes: number;
  isSeed: boolean;
  yourShare: number;
} {
  const yourShare = personalContribution(toggles, profile);

  if (!community.groupName) {
    return {
      score: yourShare,
      homes: 1,
      isSeed: false,
      yourShare,
    };
  }

  const isSeed =
    community.groupName.trim().toLowerCase() ===
    SEED_GROUP.name.toLowerCase();

  if (isSeed) {
    return {
      score: SEED_GROUP.baseScore + yourShare,
      homes: SEED_GROUP.homes + 1,
      isSeed: true,
      yourShare,
    };
  }

  // Custom groups: modest synthetic base so the meter isn't empty
  const base = 180;
  return {
    score: base + yourShare,
    homes: 8 + 1,
    isSeed: false,
    yourShare,
  };
}
