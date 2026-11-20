import { Router, type Request, type Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPlanPrompt, type PlanRequest } from '../lib/prompt.js';

const router = Router();

type Tip = { tip: string; why: string };
type PlanJson = {
  summary: string;
  sections: {
    lowEmissionRoutine: Tip[];
    indoorHacks: Tip[];
    sustainableAlternatives: Tip[];
  };
  homeCards: { title: string; subtitle: string }[];
};

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence?.[1]) {
      return JSON.parse(fence[1].trim());
    }
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error('No JSON object found in model response');
  }
}

function isTip(x: unknown): x is Tip {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as Tip).tip === 'string' &&
    typeof (x as Tip).why === 'string'
  );
}

function validatePlan(data: unknown): PlanJson {
  if (!data || typeof data !== 'object') {
    throw new Error('Plan root must be an object');
  }
  const d = data as Record<string, unknown>;
  if (typeof d.summary !== 'string') {
    throw new Error('Missing summary');
  }
  const sections = d.sections as Record<string, unknown> | undefined;
  if (!sections || typeof sections !== 'object') {
    throw new Error('Missing sections');
  }
  for (const key of [
    'lowEmissionRoutine',
    'indoorHacks',
    'sustainableAlternatives',
  ] as const) {
    const arr = sections[key];
    if (!Array.isArray(arr) || arr.length === 0 || !arr.every(isTip)) {
      throw new Error(`Invalid section: ${key}`);
    }
  }
  const cards = d.homeCards;
  if (
    !Array.isArray(cards) ||
    cards.length < 1 ||
    !cards.every(
      (c) =>
        typeof c === 'object' &&
        c !== null &&
        typeof (c as { title: string }).title === 'string' &&
        typeof (c as { subtitle: string }).subtitle === 'string',
    )
  ) {
    throw new Error('Invalid homeCards');
  }

  return {
    summary: d.summary,
    sections: {
      lowEmissionRoutine: sections.lowEmissionRoutine as Tip[],
      indoorHacks: sections.indoorHacks as Tip[],
      sustainableAlternatives: sections.sustainableAlternatives as Tip[],
    },
    homeCards: cards as { title: string; subtitle: string }[],
  };
}

router.post('/', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY missing',
      message:
        'Add GEMINI_API_KEY to .env (see .env.example), then restart the server.',
      retry: true,
    });
  }

  const body = req.body as Partial<PlanRequest>;
  if (!body?.city || body.aqi == null || body.pm25 == null) {
    return res.status(400).json({
      error: 'Invalid body',
      message: 'Required: city, aqi, pm25, homeType, commute, kids, elderly, language',
      retry: false,
    });
  }

  const planReq: PlanRequest = {
    city: String(body.city),
    aqi: Number(body.aqi),
    pm25: Number(body.pm25),
    homeType: String(body.homeType ?? 'apartment'),
    commute: String(body.commute ?? 'car'),
    kids: Boolean(body.kids),
    elderly: Boolean(body.elderly),
    language: body.language === 'hi' ? 'hi' : 'en',
  };

  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    });

    const prompt = buildPlanPrompt(planReq);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = extractJson(text);
    const plan = validatePlan(parsed);

    return res.json(plan);
  } catch (err) {
    console.error('[plan]', err);
    const message =
      err instanceof Error ? err.message : 'Plan generation failed';
    return res.status(502).json({
      error: 'Plan generation failed',
      message:
        'Could not get a valid plan from Gemini. Please retry in a moment.',
      detail: message,
      retry: true,
    });
  }
});

export default router;
