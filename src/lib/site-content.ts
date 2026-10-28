export const SUPPORTED_LOCALES = ["bn", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
