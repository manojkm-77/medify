
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Logo from '../components/ui/Logo';

type Locale = 'en' | 'hi';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    return (savedLocale === 'en' || savedLocale === 'hi') ? savedLocale : 'en';
  });
  
  const [translations, setTranslations] = useState<any | null>(null);
  const [fallbackTranslations, setFallbackTranslations] = useState<any | null>(null);

  useEffect(() => {
    // Always load English as a fallback
    fetch(`/i18n/locales/en.json`)
      .then(response => response.json())
      .then(data => setFallbackTranslations(data))
      .catch(error => console.error('Failed to load fallback translations:', error));
  }, []);

  useEffect(() => {
    setTranslations(null); // Clear previous translations
    fetch(`/i18n/locales/${locale}.json`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => setTranslations(data))
      .catch(error => console.error(`Failed to load translations for ${locale}:`, error));
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
  };

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    if (!translations || !fallbackTranslations) return ''; // Return empty string during load

    const keys = key.split('.');
    
    let result = keys.reduce((acc, currentKey) => acc?.[currentKey], translations);

    if (result === undefined) {
      result = keys.reduce((acc, currentKey) => acc?.[currentKey], fallbackTranslations);
    }
    
    if (result === undefined) {
      return key;
    }

    let resultString = String(result);

    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            resultString = resultString.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }

    return resultString;
  }, [translations, fallbackTranslations]);

  if (!translations || !fallbackTranslations) {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
            <div className="animate-pulse">
              <Logo textClassName="text-4xl text-slate-800" iconClassName="w-12 h-12" />
            </div>
        </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};