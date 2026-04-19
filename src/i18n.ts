import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import uk from './i18n/locales/uk.json'
import en from './i18n/locales/en.json'
import es from './i18n/locales/es.json'
import fr from './i18n/locales/fr.json'
import de from './i18n/locales/de.json'
import it from './i18n/locales/it.json'
import pt from './i18n/locales/pt.json'
import pl from './i18n/locales/pl.json'
import ru from './i18n/locales/ru.json'
import ja from './i18n/locales/ja.json'
import zh from './i18n/locales/zh.json'
import ko from './i18n/locales/ko.json'
import ar from './i18n/locales/ar.json'
import hi from './i18n/locales/hi.json'
import tr from './i18n/locales/tr.json'
import nl from './i18n/locales/nl.json'
import sv from './i18n/locales/sv.json'
import cs from './i18n/locales/cs.json'
import ro from './i18n/locales/ro.json'
import hu from './i18n/locales/hu.json'
import bg from './i18n/locales/bg.json'
import hr from './i18n/locales/hr.json'
import sk from './i18n/locales/sk.json'
import lt from './i18n/locales/lt.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uk: { translation: uk },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      it: { translation: it },
      pt: { translation: pt },
      pl: { translation: pl },
      ru: { translation: ru },
      ja: { translation: ja },
      zh: { translation: zh },
      ko: { translation: ko },
      ar: { translation: ar },
      hi: { translation: hi },
      tr: { translation: tr },
      nl: { translation: nl },
      sv: { translation: sv },
      cs: { translation: cs },
      ro: { translation: ro },
      hu: { translation: hu },
      bg: { translation: bg },
      hr: { translation: hr },
      sk: { translation: sk },
      lt: { translation: lt },
    },
    supportedLngs: [
      'uk', 'en', 'es', 'fr', 'de', 'it', 'pt', 'pl', 'ru',
      'ja', 'zh', 'ko', 'ar', 'hi', 'tr', 'nl', 'sv', 'cs',
      'ro', 'hu', 'bg', 'hr', 'sk', 'lt',
    ],
    fallbackLng: 'uk',
    debug: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  })

export default i18n
