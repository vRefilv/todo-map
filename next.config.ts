// next.config.js
import { getSupportedLocales } from "@/utils/getLocales";

const locales = getSupportedLocales();

module.exports = {
  reactStrictMode: true,
  i18n: {
    locales,
    defaultLocale: "en", // Set your default locale
  },
  // Other Next.js configurations...
};
