import { Router, type Request, type Response } from 'express';

const router = Router();

/** Known city → lat/lon for Open-Meteo (no geocoding key needed). */
const CITY_COORDS: Record<string, { lat: number; lon: number; label: string }> = {
  delhi: { lat: 28.6139, lon: 77.209, label: 'Delhi' },
  'new delhi': { lat: 28.6139, lon: 77.209, label: 'Delhi' },
  noida: { lat: 28.5355, lon: 77.391, label: 'Noida' },
  gurgaon: { lat: 28.4595, lon: 77.0266, label: 'Gurgaon' },
  gurugram: { lat: 28.4595, lon: 77.0266, label: 'Gurgaon' },
  faridabad: { lat: 28.4089, lon: 77.3178, label: 'Faridabad' },
  ghaziabad: { lat: 28.6692, lon: 77.4538, label: 'Ghaziabad' },
  mumbai: { lat: 19.076, lon: 72.8777, label: 'Mumbai' },
  'navi mumbai': { lat: 19.033, lon: 73.0297, label: 'Navi Mumbai' },
  thane: { lat: 19.2183, lon: 72.9781, label: 'Thane' },
  bangalore: { lat: 12.9716, lon: 77.5946, label: 'Bangalore' },
  bengaluru: { lat: 12.9716, lon: 77.5946, label: 'Bangalore' },
  mysore: { lat: 12.2958, lon: 76.6394, label: 'Mysore' },
  kolkata: { lat: 22.5726, lon: 88.3639, label: 'Kolkata' },
  chennai: { lat: 13.0827, lon: 80.2707, label: 'Chennai' },
  hyderabad: { lat: 17.385, lon: 78.4867, label: 'Hyderabad' },
  pune: { lat: 18.5204, lon: 73.8567, label: 'Pune' },
  nagpur: { lat: 21.1458, lon: 79.0882, label: 'Nagpur' },
  lucknow: { lat: 26.8467, lon: 80.9462, label: 'Lucknow' },
  kanpur: { lat: 26.4499, lon: 80.3319, label: 'Kanpur' },
  varanasi: { lat: 25.3176, lon: 82.9739, label: 'Varanasi' },
  agra: { lat: 27.1767, lon: 78.0081, label: 'Agra' },
  jaipur: { lat: 26.9124, lon: 75.7873, label: 'Jaipur' },
  jodhpur: { lat: 26.2389, lon: 73.0243, label: 'Jodhpur' },
  chandigarh: { lat: 30.7333, lon: 76.7794, label: 'Chandigarh' },
  ahmedabad: { lat: 23.0225, lon: 72.5714, label: 'Ahmedabad' },
  surat: { lat: 21.1702, lon: 72.8311, label: 'Surat' },
  indore: { lat: 22.7196, lon: 75.8577, label: 'Indore' },
  bhopal: { lat: 23.2599, lon: 77.4126, label: 'Bhopal' },
  patna: { lat: 25.5941, lon: 85.1376, label: 'Patna' },
  ranchi: { lat: 23.3441, lon: 85.3096, label: 'Ranchi' },
  bhubaneswar: { lat: 20.2961, lon: 85.8245, label: 'Bhubaneswar' },
  guwahati: { lat: 26.1445, lon: 91.7362, label: 'Guwahati' },
  dehradun: { lat: 30.3165, lon: 78.0322, label: 'Dehradun' },
  srinagar: { lat: 34.0837, lon: 74.7973, label: 'Srinagar' },
  kochi: { lat: 9.9312, lon: 76.2673, label: 'Kochi' },
  visakhapatnam: { lat: 17.6868, lon: 83.2185, label: 'Visakhapatnam' },
  raipur: { lat: 21.2514, lon: 81.6296, label: 'Raipur' },
  goa: { lat: 15.2993, lon: 74.124, label: 'Goa' },
  panaji: { lat: 15.4909, lon: 73.8278, label: 'Panaji' },
};

const SAMPLE = {
  city: 'Delhi',
  aqi: 320,
  pm25: 185,
  source: 'sample' as const,
  label: 'SAMPLE DATA — live AQI unavailable',
  category: 'Hazardous',
};

function usAqiFromPm25(pm25: number): number {
  // EPA breakpoints for PM2.5 → US AQI (approx.)
  const breaks: [number, number, number, number][] = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 350.4, 301, 400],
    [350.5, 500.4, 401, 500],
  ];
  for (const [cLow, cHigh, iLow, iHigh] of breaks) {
    if (pm25 >= cLow && pm25 <= cHigh) {
      return Math.round(
        ((iHigh - iLow) / (cHigh - cLow)) * (pm25 - cLow) + iLow,
      );
    }
  }
  if (pm25 > 500.4) return 500;
  return Math.round(pm25);
}

function categoryFromAqi(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

async function geocodeCity(
  city: string,
): Promise<{ lat: number; lon: number; label: string } | null> {
  const key = city.trim().toLowerCase();
  if (CITY_COORDS[key]) return CITY_COORDS[key];

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data = (await res.json()) as {
    results?: { latitude: number; longitude: number; name: string }[];
  };
  const hit = data.results?.[0];
  if (!hit) return null;
  return { lat: hit.latitude, lon: hit.longitude, label: hit.name };
}

function sampleResponse(city?: string) {
  return {
    ...SAMPLE,
    city: city?.trim() || SAMPLE.city,
    isSample: true,
  };
}

/** Nearest known city by haversine — fast offline label when reverse APIs time out. */
function nearestKnownCity(lat: number, lon: number): string {
  let best = 'Your location';
  let bestD = Infinity;
  for (const [name, c] of Object.entries(CITY_COORDS)) {
    // skip aliases that share coords under different keys — use label field
    if (name !== c.label.toLowerCase() && name.includes(' ')) continue;
    const d =
      (lat - c.lat) * (lat - c.lat) + (lon - c.lon) * (lon - c.lon);
    if (d < bestD) {
      bestD = d;
      best = c.label;
    }
  }
  return best;
}

async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | null> {
  // Short timeout so AQI is never blocked by geocoder outages
  const ctrl = AbortController ? new AbortController() : null;
  const timer = setTimeout(() => ctrl?.abort(), 2500);
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('format', 'json');
  url.searchParams.set('zoom', '10');
  url.searchParams.set('addressdetails', '1');
  try {
    const res = await fetch(url.toString(), {
      signal: ctrl?.signal,
      headers: {
        'User-Agent': 'AirWiseHackathon/1.0 (family air-quality demo)',
        Accept: 'application/json',
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        suburb?: string;
        state_district?: string;
        state?: string;
      };
      name?: string;
    };
    const a = data.address;
    if (!a) return data.name || null;
    const place =
      a.city || a.town || a.village || a.suburb || a.state_district || data.name;
    if (!place) return null;
    return a.state && a.state !== place ? `${place}, ${a.state}` : place;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

router.get('/', async (req: Request, res: Response) => {
  const cityQ =
    typeof req.query.city === 'string' && req.query.city.trim()
      ? req.query.city.trim()
      : '';
  const latQ = Number(req.query.lat);
  const lonQ = Number(req.query.lon);
  const hasGps =
    Number.isFinite(latQ) &&
    Number.isFinite(lonQ) &&
    Math.abs(latQ) <= 90 &&
    Math.abs(lonQ) <= 180;

  try {
    let coords: { lat: number; lon: number; label: string } | null = null;

    if (hasGps) {
      // Don't await reverse first — AQI fetch is primary; label can use nearest city fallback
      const reversed = await reverseGeocode(latQ, lonQ);
      const label =
        reversed ||
        (cityQ && !cityQ.startsWith('My location') && cityQ !== 'GPS'
          ? cityQ
          : null) ||
        nearestKnownCity(latQ, lonQ);
      coords = { lat: latQ, lon: lonQ, label };
    } else {
      const city = cityQ || 'Delhi';
      coords = await geocodeCity(city);
      if (!coords) {
        return res.json(sampleResponse(city));
      }
    }

    const aqUrl = new URL(
      'https://air-quality-api.open-meteo.com/v1/air-quality',
    );
    aqUrl.searchParams.set('latitude', String(coords.lat));
    aqUrl.searchParams.set('longitude', String(coords.lon));
    aqUrl.searchParams.set(
      'hourly',
      'pm2_5,us_aqi,european_aqi',
    );
    aqUrl.searchParams.set('timezone', 'auto');

    const aqRes = await fetch(aqUrl.toString());
    if (!aqRes.ok) {
      return res.json({
        ...sampleResponse(coords.label),
        lat: coords.lat,
        lon: coords.lon,
      });
    }

    const aqData = (await aqRes.json()) as {
      hourly?: {
        time?: string[];
        pm2_5?: (number | null)[];
        us_aqi?: (number | null)[];
        european_aqi?: (number | null)[];
      };
    };

    const times = aqData.hourly?.time ?? [];
    const pmArr = aqData.hourly?.pm2_5 ?? [];
    const usArr = aqData.hourly?.us_aqi ?? [];
    let idx = times.length - 1;
    for (let i = times.length - 1; i >= 0; i--) {
      if (pmArr[i] != null || usArr[i] != null) {
        idx = i;
        break;
      }
    }

    const pm25Raw = pmArr[idx];
    const usRaw = usArr[idx];
    if (pm25Raw == null && usRaw == null) {
      return res.json({
        ...sampleResponse(coords.label),
        lat: coords.lat,
        lon: coords.lon,
      });
    }

    const pm25 = Math.round(Number(pm25Raw ?? 0));
    const aqi =
      usRaw != null
        ? Math.round(Number(usRaw))
        : usAqiFromPm25(pm25);

    return res.json({
      city: coords.label,
      aqi,
      pm25,
      lat: coords.lat,
      lon: coords.lon,
      source: hasGps ? 'gps+open-meteo' : 'open-meteo',
      label: hasGps
        ? 'Live AQI for your location'
        : 'Live AQI (Open-Meteo)',
      category: categoryFromAqi(aqi),
      isSample: false,
      observedAt: times[idx] ?? null,
    });
  } catch (err) {
    console.error('[aqi]', err);
    if (hasGps) {
      return res.json({
        ...sampleResponse(
          cityQ || `GPS ${latQ.toFixed(2)}, ${lonQ.toFixed(2)}`,
        ),
        lat: latQ,
        lon: lonQ,
      });
    }
    return res.json(sampleResponse(cityQ || 'Delhi'));
  }
});

export default router;
