export type PlanRequest = {
  city: string;
  aqi: number;
  pm25: number;
  homeType: string;
  commute: 'bike' | 'car' | 'metro' | 'walk' | string;
  kids: boolean;
  elderly: boolean;
  language: 'en' | 'hi' | string;
};

export function buildPlanPrompt(body: PlanRequest): string {
  const lang =
    body.language === 'hi'
      ? 'Hindi (Devanagari script)'
      : 'English';

  return `You are AirWise ("Apne Parivaar Ka Smog Saathi"), a practical winter-smog family coach for India.

Return STRICT JSON ONLY — no markdown, no code fences, no commentary.

Schema (exact keys):
{
  "summary": "string — 1-2 sentence overview for the family",
  "sections": {
    "lowEmissionRoutine": [{ "tip": "string", "why": "string — one short line" }],
    "indoorHacks": [{ "tip": "string", "why": "string — one short line" }],
    "sustainableAlternatives": [{ "tip": "string", "why": "string — one short line" }]
  },
  "homeCards": [
    { "title": "string", "subtitle": "string" },
    { "title": "string", "subtitle": "string" },
    { "title": "string", "subtitle": "string" }
  ]
}

Rules:
- Exactly 3 tips per section (3 arrays × 3 items).
- Every tip MUST include both "tip" and "why".
- Exactly 3 homeCards (short action titles for the Home screen).
- Language of ALL user-facing strings: ${lang}.
- Be concrete for Indian winter haze / NCR-style smog; avoid vague advice.
- Tailor to the profile below (home type, commute, kids/elderly).

Profile:
- City: ${body.city}
- AQI: ${body.aqi}
- PM2.5: ${body.pm25}
- Home type: ${body.homeType}
- Commute: ${body.commute}
- Kids at home: ${body.kids ? 'yes' : 'no'}
- Elderly at home: ${body.elderly ? 'yes' : 'no'}
`;
}
