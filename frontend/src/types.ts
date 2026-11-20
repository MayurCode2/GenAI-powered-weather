export type Language = 'en' | 'hi';

export type Commute = 'bike' | 'car' | 'metro' | 'walk';

export type Profile = {
  city: string;
  homeType: string;
  commute: Commute;
  kids: boolean;
  elderly: boolean;
  /** When set, AQI uses GPS coords instead of city name alone. */
  lat?: number | null;
  lon?: number | null;
  locationLabel?: string | null;
};

export type AqiData = {
  city: string;
  aqi: number;
  pm25: number;
  source: string;
  label: string;
  category: string;
  isSample: boolean;
  observedAt?: string | null;
  lat?: number | null;
  lon?: number | null;
};

export type Tip = {
  tip: string;
  why: string;
};

export type PlanData = {
  summary: string;
  sections: {
    lowEmissionRoutine: Tip[];
    indoorHacks: Tip[];
    sustainableAlternatives: Tip[];
  };
  homeCards: { title: string; subtitle: string }[];
};

export type ImpactToggles = {
  metro: boolean;
  windowsClosedMorning: boolean;
  purifier: boolean;
};

export type Screen = 'home' | 'plan' | 'impact' | 'community' | 'profile';

export const DEFAULT_PROFILE: Profile = {
  city: 'Delhi',
  homeType: 'apartment',
  commute: 'car',
  kids: false,
  elderly: false,
};

export const DELHI_FAMILY_SEED: Profile = {
  city: 'Delhi',
  homeType: 'apartment',
  commute: 'car',
  kids: true,
  elderly: true,
};

export const DEFAULT_TOGGLES: ImpactToggles = {
  metro: false,
  windowsClosedMorning: false,
  purifier: false,
};
