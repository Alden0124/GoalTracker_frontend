import { z } from "zod";

// 定義評論表單的 schema
export const commentSchema = z.object({
  content: z.string().min(1, "請輸入內容").max(500, "內容不能超過 500 字"),
});

export type CommentFormData = z.infer<typeof commentSchema>;
