import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import aqiRouter from './routes/aqi.js';
import planRouter from './routes/plan.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });


const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'airwise',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
  });
});

app.use('/api/aqi', aqiRouter);
app.use('/api/plan', planRouter);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('[server]', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong. Please retry.',
      retry: true,
    });
  },
);

app.listen(PORT, () => {
  console.log(`AirWise API listening on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.warn(
      '[warn] GEMINI_API_KEY not set — POST /api/plan will return 503 until you add it to .env',
    );
  }
});
