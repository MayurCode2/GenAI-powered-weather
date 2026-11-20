import {
  DEFAULT_PROFILE,
  DEFAULT_TOGGLES,
  type ImpactToggles,
  type Language,
  type PlanData,
  type Profile,
} from '../types';

const KEYS = {
  profile: 'airwise_profile',
  plan: 'airwise_plan',
  lang: 'airwise_lang',
  toggles: 'airwise_toggles',
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadProfile(): Profile {
  return readJson(KEYS.profile, DEFAULT_PROFILE);
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export function loadPlan(): PlanData | null {
  return readJson<PlanData | null>(KEYS.plan, null);
}

export function savePlan(plan: PlanData): void {
  localStorage.setItem(KEYS.plan, JSON.stringify(plan));
}

export function clearPlan(): void {
  localStorage.removeItem(KEYS.plan);
}

export function loadLanguage(): Language {
  const v = localStorage.getItem(KEYS.lang);
  return v === 'hi' ? 'hi' : 'en';
}

export function saveLanguage(lang: Language): void {
  localStorage.setItem(KEYS.lang, lang);
}

export function loadToggles(): ImpactToggles {
  return readJson(KEYS.toggles, DEFAULT_TOGGLES);
}

export function saveToggles(toggles: ImpactToggles): void {
  localStorage.setItem(KEYS.toggles, JSON.stringify(toggles));
}
