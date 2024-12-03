import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(2, "用戶名稱至少需要2個字"),
  location: z.string().optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
