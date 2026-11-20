import { en, type Dictionary } from './en';
import { hi } from './hi';
import type { Language } from '../types';

const dictionaries: Record<Language, Dictionary> = { en, hi };

export function t(lang: Language): Dictionary {
  return dictionaries[lang] ?? en;
}

export type { Dictionary };
export { en, hi };
