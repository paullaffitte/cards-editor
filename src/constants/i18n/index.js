let i18n = require('i18next');
const { initReactI18next } = require('react-i18next');
const en = require('./en');
const fr = require('./fr');

i18n = (i18n.default ? i18n.default : i18n);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      fr: {
        translation: fr
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.availableLanguages = [ 'en', 'fr' ];

module.exports = i18n;
