import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import es from '../locales/es.json';
import ca from '../locales/ca.json';
import de from '../locales/de.json';
import pt from '../locales/pt.json';
import ko from '../locales/ko.json';
import zh from '../locales/zh.json';

// Get saved language or browser language
const savedLanguage = localStorage.getItem('i18nextLng');
const browserLanguage = navigator.language.split('-')[0];
const defaultLanguage = savedLanguage || browserLanguage || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      es: es,
      ca: ca,
      de: de,
      pt: pt,
      ko: ko,
      zh: zh,
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    // Persist language selection
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export { default } from 'i18next';
