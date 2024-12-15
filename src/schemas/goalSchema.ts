import i18n from "@/plugin/i18n";
import { z } from "zod";

// 動態獲取驗證消息
const getValidationMessages = () =>
  i18n.getResourceBundle(i18n.language, "validate");

export const getGoalSchema = () => {
  const validationMessages = getValidationMessages();
  return z
    .object({
      title: z
        .string()
        .min(1, validationMessages.title.required)
        .max(20, validationMessages.title.max),
      description: z
        .string()
        .min(1, validationMessages.description.required)
        .max(20, validationMessages.description.max),
      startDate: z
        .string()
        .min(1, validationMessages.startDate.required)
        .regex(/^\d{4}-\d{2}-\d{2}$/, validationMessages.startDate.regex),
      endDate: z
        .string()
        .min(1, validationMessages.endDate.required)
        .regex(/^\d{4}-\d{2}-\d{2}$/, validationMessages.endDate.regex),
      isPublic: z.boolean().refine((data) => data === true, {
        message: validationMessages.isPublic.required,
      }),
    })
    .refine(
      (data) => {
        if (data.endDate && data.startDate > data.endDate) {
          return false;
        }
        return true;
      },
      {
        message: validationMessages.endDate.afterStartDate,
        path: ["endDate"],
      }
    );
};

export type GoalFormData = z.infer<ReturnType<typeof getGoalSchema>>;
