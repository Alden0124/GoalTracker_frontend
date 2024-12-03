import enUS from "@/locales/en-US/translation.json";
import zhTW from "@/locales/zh-TW/translation.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    "zh-TW": {
      translation: zhTW,
    },
    "en-US": {
      translation: enUS,
    },
  },
  lng: localStorage.getItem("language") || "zh-TW",
  fallbackLng: "zh-TW",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
