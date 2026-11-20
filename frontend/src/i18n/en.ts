export const en = {
  brand: 'AirWise',
  tagline: 'Apne Parivaar Ka Smog Saathi',
  pitch:
    'Live AQI, tailored into a daily family plan — with why behind every tip.',

  nav: {
    home: 'Home',
    plan: 'Plan',
    impact: 'Impact',
    community: 'Community',
    profile: 'Profile',
  },

  lang: {
    en: 'EN',
    hi: 'हिं',
    label: 'Language',
  },

  profile: {
    title: 'Your family profile',
    subtitle: 'We tailor AQI tips to your home and commute.',
    city: 'City',
    cityHint: 'Search and select your city.',
    citySearchHint: 'Type to search — then pick from the list.',
    citySearchPlaceholder: 'Search city (e.g. Mumbai, Lucknow)…',
    selectedLocation: 'Selected city',
    useGps: 'Use my current location',
    gpsLoading: 'Detecting location…',
    gpsDenied: 'Location permission denied — pick a city instead.',
    gpsUnsupported: 'GPS not supported in this browser.',
    otherCity: 'Other city (type name)',
    homeType: 'Home type',
    homeTypes: {
      apartment: 'Apartment',
      house: 'Independent house',
      villa: 'Villa / bungalow',
    },
    commute: 'Daily commute',
    commuteOptions: {
      bike: 'Bike / scooter',
      car: 'Car',
      metro: 'Metro',
      walk: 'Walk',
    },
    kids: 'Kids at home',
    elderly: 'Elderly at home',
    save: 'Save profile',
    demoSeed: 'Load Delhi family',
    saved: 'Profile saved',
  },

  home: {
    yourLocation: 'Your location',
    useGps: 'Allow location access',
    gpsLoading: 'Getting your location…',
    gpsDenied: 'Location blocked — allow access in browser, or pick a city in Profile.',
    gpsHint: 'Browser will ask permission once — tap Allow for live AQI near you.',
    aqiLabel: 'Air Quality Index',
    pm25: 'PM2.5',
    sampleBanner: 'SAMPLE DATA — live AQI unavailable. Showing labeled demo values.',
    liveBanner: 'Live AQI via Open-Meteo',
    generatePlan: 'Generate today’s plan',
    generating: 'Generating plan…',
    viewPlan: 'Open plan',
    actionCards: 'Today’s focus',
    retryAqi: 'Retry AQI',
    loadingAqi: 'Fetching AQI…',
    noCards: 'Generate a plan to unlock three action cards for your family.',
  },

  plan: {
    title: 'Your daily smog plan',
    empty: 'No plan yet. Generate one from Home after saving your profile.',
    generate: 'Generate plan',
    regenerating: 'Updating plan…',
    retry: 'Retry',
    cached: 'Showing cached plan',
    sections: {
      lowEmissionRoutine: 'Low-emission daily routine',
      indoorHacks: 'Indoor air quality hacks',
      sustainableAlternatives: 'Sustainable alternatives',
    },
    why: 'Why',
  },

  impact: {
    title: 'What-if Impact Meter',
    subtitle: 'Toggle actions to see approximate exposure drop and CO₂ saved.',
    approx: 'approx.',
    exposureDown: 'Exposure ↓',
    co2Saved: 'CO₂ saved',
    kg: 'kg / day',
    toggles: {
      metro: 'Switch commute to metro',
      windowsClosedMorning: 'Keep windows closed in the morning peak',
      purifier: 'Run an air purifier (peak hours)',
    },
    familyNote: 'Sensitive household (kids / elderly) — impact weighted slightly higher.',
    tip: 'Numbers are deterministic estimates for demo — not lab measurements.',
  },

  community: {
    title: 'Neighbourhood impact',
    subtitle: 'Join a society / mohalla group and track a combined score.',
    groupName: 'Society / group name',
    join: 'Join group',
    leave: 'Leave group',
    yourContribution: 'Your contribution',
    combinedScore: 'Combined group score',
    homes: 'homes',
    seedHint: 'Demo seed: Green Park Society — ~47 homes already reducing exposure.',
    joinedAs: 'You are in',
    notJoined: 'Not in a group yet — join to pool your impact.',
  },

  common: {
    loading: 'Loading…',
    error: 'Something went wrong',
    retry: 'Retry',
    yes: 'Yes',
    no: 'No',
  },
};

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? DeepStringify<T[K]>
      : T[K];
};

export type Dictionary = DeepStringify<typeof en>;
