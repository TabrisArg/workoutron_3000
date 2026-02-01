import { en } from './i18n/en';
import { es } from './i18n/es';
import { fr } from './i18n/fr';
import { de } from './i18n/de';
import { pt } from './i18n/pt';
import { ru } from './i18n/ru';
import { hi } from './i18n/hi';
import { ar } from './i18n/ar';
import { TranslationSchema } from './i18n/types';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'hi' | 'ar';

const locales: Record<LanguageCode, TranslationSchema> = {
  en,
  es,
  fr,
  de,
  pt,
  ru,
  hi,
  ar
};

/**
 * Returns the translation schema for the specified language.
 * Defaults to English if the language code is unrecognized.
 */
export const getStringsByLanguage = (lang: LanguageCode): TranslationSchema => {
  return locales[lang] || en;
};