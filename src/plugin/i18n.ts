import {
  enUS_Auth,
  enUS_Common,
  enUS_Feed,
  enUS_Home,
  enUS_ProfileGoals,
  enUS_ProfileInfo,
  enUS_Validate,
} from "@/locales/en-US";
import {
  zhTW_Auth,
  zhTW_Common,
  zhTW_Feed,
  zhTW_Home,
  zhTW_ProfileGoals,
  zhTW_ProfileInfo,
  zhTW_Validate,
} from "@/locales/zh-TW";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    "zh-TW": {
      common: zhTW_Common,
      auth: zhTW_Auth,
      validate: zhTW_Validate,
      home: zhTW_Home,
      profileInfo: zhTW_ProfileInfo,
      profileGoals: zhTW_ProfileGoals,
      feed: zhTW_Feed,
    },
    "en-US": {
      common: enUS_Common,
      auth: enUS_Auth,
      validate: enUS_Validate,
      home: enUS_Home,
      profileInfo: enUS_ProfileInfo,
      profileGoals: enUS_ProfileGoals,
      feed: enUS_Feed,
    },
  },
  lng: localStorage.getItem("language") || "zh-TW",
  fallbackLng: "zh-TW",
  defaultNS: "common",
  ns: [
    "common",
    "auth",
    "validate",
    "home",
    "profileInfo",
    "profileGoals",
    "feed",
  ],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
