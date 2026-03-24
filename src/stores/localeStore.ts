import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "zh" | "en";

type LocaleState = {
  locale: Locale;
  toggleLocale(): void;
  setLocale(locale: Locale): void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "zh",
      toggleLocale: () => set((s) => ({ locale: s.locale === "zh" ? "en" : "zh" })),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "classic_strategy_locale_v1",
      version: 1,
    },
  ),
);

