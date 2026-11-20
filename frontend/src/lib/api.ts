import type { AqiData, Language, PlanData, Profile } from '../types';

export class ApiError extends Error {
  status: number;
  retry: boolean;

  constructor(message: string, status: number, retry = true) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.retry = retry;
  }
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as {
      message?: string;
      error?: string;
      retry?: boolean;
    };
    return new ApiError(
      body.message || body.error || `Request failed (${res.status})`,
      res.status,
      body.retry !== false,
    );
  } catch {
    return new ApiError(`Request failed (${res.status})`, res.status, true);
  }
}

export async function fetchAqi(
  city: string,
  coords?: { lat?: number | null; lon?: number | null },
): Promise<AqiData> {
  const params = new URLSearchParams();
  params.set('city', (city.trim() || 'Delhi'));
  if (
    coords?.lat != null &&
    coords?.lon != null &&
    Number.isFinite(coords.lat) &&
    Number.isFinite(coords.lon)
  ) {
    params.set('lat', String(coords.lat));
    params.set('lon', String(coords.lon));
  }
  const res = await fetch(`/api/aqi?${params.toString()}`);
  if (!res.ok) throw await parseError(res);
  const data = (await res.json()) as AqiData;
  return {
    ...data,
    isSample: Boolean(data.isSample || data.source === 'sample'),
  };
}

export async function fetchPlan(
  profile: Profile,
  aqi: Pick<AqiData, 'aqi' | 'pm25' | 'city'>,
  language: Language,
): Promise<PlanData> {
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      city: aqi.city || profile.city,
      aqi: aqi.aqi,
      pm25: aqi.pm25,
      homeType: profile.homeType,
      commute: profile.commute,
      kids: profile.kids,
      elderly: profile.elderly,
      language,
    }),
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as PlanData;
}
