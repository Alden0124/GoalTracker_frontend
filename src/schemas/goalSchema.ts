import { z } from "zod";

export const goalSchema = z.object({
  title: z.string()
    .min(1, "請輸入目標標題")
    .max(100, "標題不能超過 100 個字"),
  description: z.string()
    .min(1, "請輸入目標描述")
    .max(500, "描述不能超過 500 個字"),
  startDate: z.string()
    .min(1, "請選擇開始日期")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式不正確"),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式不正確")
    .optional(),
  isPublic: z.boolean({
    required_error: "請選擇是否公開",
    invalid_type_error: "請選擇是否公開",
  }),
}).refine((data) => {
  if (data.endDate && data.startDate > data.endDate) {
    return false;
  }
  return true;
}, {
  message: "結束日期必須在開始日期之後",
  path: ["endDate"]
});

export type GoalFormData = z.infer<typeof goalSchema>;