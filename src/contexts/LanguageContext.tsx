'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, Currency } from '@/types';
import { translations, TranslationKey } from '@/lib/i18n';
import { getExchangeRates, FALLBACK_RATES, ExchangeRates } from '@/lib/currency';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: ExchangeRates;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// getExchangeRates() only hits the API once its own 24h cache expires, so checking
// hourly just picks up that refresh promptly without hammering the API.
const RATES_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ru');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      getExchangeRates().then(r => { if (!cancelled) setRates(r); });
    };
    refresh();
    const interval = setInterval(refresh, RATES_CHECK_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const t = (key: TranslationKey): string => {
    return translations[locale][key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, currency, setCurrency, rates, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
