export const Locale = {
  DEFAULT: "default",
  JA: "ja",
  EN: "en",
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];

export const DefaultLocale = Locale.DEFAULT;

export const isLocale = (value: string): value is Locale => {
  const locales = Object.values(Locale) as string[];
  return locales.includes(value);
};

export const getTimeZone = (locale: string) => {
  const targets = [Locale.DEFAULT, Locale.JA] as string[];
  if (targets.includes(locale)) {
    return "Asia/Tokyo";
  } else {
    return "UTC";
  }
};

export const getValidLocale = (locale: string) => {
  return isLocale(locale) ? locale : DefaultLocale;
};

export const shouldUseJaLocale = (locale: string) => {
  const targets = [Locale.DEFAULT, Locale.JA] as string[];
  return targets.includes(locale);
};
