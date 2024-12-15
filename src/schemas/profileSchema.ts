import i18n from "@/plugin/i18n";
import { z } from "zod";

// 動態獲取驗證消息
const getValidationMessages = () =>
  i18n.getResourceBundle(i18n.language, "validate");

// 共用的表單驗證規則
const getFormRules = () => {
  const validationMessages = getValidationMessages();
  return {
    username: z
      .string()
      .min(2, validationMessages.username.min)
      .max(20, validationMessages.username.max)
      .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, validationMessages.username.regex),
  };
};

// 個人資料表單驗證
export const getProfileSchema = () => {
  const formRules = getFormRules();
  return z.object({
    username: formRules.username,
    location: z.string().optional(),
    occupation: z.string().optional(),
    education: z.string().optional(),
  });
};

export type ProfileFormData = z.infer<ReturnType<typeof getProfileSchema>>;
