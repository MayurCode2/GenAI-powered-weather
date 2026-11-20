import type { ImpactToggles, Profile } from '../types';

/** Deterministic what-if weights (demo approximations — not lab data). */
const WEIGHTS = {
  metro: { exposurePct: 18, co2Kg: 2.4 },
  windowsClosedMorning: { exposurePct: 22, co2Kg: 0 },
  purifier: { exposurePct: 15, co2Kg: 0.35 },
} as const;

export type ImpactResult = {
  exposureReductionPct: number;
  co2KgSaved: number;
  label: 'approx';
  breakdown: {
    key: keyof ImpactToggles;
    exposurePct: number;
    co2Kg: number;
  }[];
};

function familyMultiplier(profile: Pick<Profile, 'kids' | 'elderly'>): number {
  if (profile.kids && profile.elderly) return 1.2;
  if (profile.kids || profile.elderly) return 1.12;
  return 1;
}

/**
 * Instant what-if meter. Metro / windows closed / purifier → approx exposure% ↓ + CO₂ kg.
 * Family weight bump when kids or elderly are present.
 */
export function computeImpact(
  toggles: ImpactToggles,
  profile: Pick<Profile, 'kids' | 'elderly' | 'commute'>,
): ImpactResult {
  const mult = familyMultiplier(profile);
  const breakdown: ImpactResult['breakdown'] = [];
  let exposure = 0;
  let co2 = 0;

  if (toggles.metro) {
    // Already on metro → smaller incremental gain
    const alreadyMetro = profile.commute === 'metro';
    const e = (alreadyMetro ? WEIGHTS.metro.exposurePct * 0.35 : WEIGHTS.metro.exposurePct) * mult;
    const c = alreadyMetro ? WEIGHTS.metro.co2Kg * 0.2 : WEIGHTS.metro.co2Kg;
    exposure += e;
    co2 += c;
    breakdown.push({ key: 'metro', exposurePct: round1(e), co2Kg: round2(c) });
  }

  if (toggles.windowsClosedMorning) {
    const e = WEIGHTS.windowsClosedMorning.exposurePct * mult;
    const c = WEIGHTS.windowsClosedMorning.co2Kg;
    exposure += e;
    co2 += c;
    breakdown.push({
      key: 'windowsClosedMorning',
      exposurePct: round1(e),
      co2Kg: round2(c),
    });
  }

  if (toggles.purifier) {
    const e = WEIGHTS.purifier.exposurePct * mult;
    const c = WEIGHTS.purifier.co2Kg;
    exposure += e;
    co2 += c;
    breakdown.push({ key: 'purifier', exposurePct: round1(e), co2Kg: round2(c) });
  }

  // Soft cap so stacked toggles stay believable for demo
  const capped = Math.min(exposure, 55);

  return {
    exposureReductionPct: round1(capped),
    co2KgSaved: round2(co2),
    label: 'approx',
    breakdown,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
