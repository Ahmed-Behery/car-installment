import React, { createContext, useContext, useMemo } from "react";
import { useRouter } from "next/router";

import en from "../../locales/en";
import ar from "../../locales/ar";

const I18nContext = createContext(null);

const dictionaries = { en, ar };

function getDictionary(locale) {
  return dictionaries[locale] || dictionaries.ar;
}

export function I18nProvider({ children }) {
  const { locale, defaultLocale } = useRouter();

  const currentLocale = locale || defaultLocale || "ar";
  const t = useMemo(() => getDictionary(currentLocale), [currentLocale]);

  const value = useMemo(() => ({ locale: currentLocale, t }), [currentLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider />");
  return ctx;
}
