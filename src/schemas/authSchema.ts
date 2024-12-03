import { z } from "zod";

// 共用的表單驗證規則
const formRules = {
  email: z.string().min(1, "電子郵件為必填").email("請輸入有效的電子郵件格式"),
  Password: z
    .string()
    .min(8, "密碼至少需要8個字元")
    .max(12, "密碼不能超過12個字元")
    .regex(/[A-Z]/, "密碼必須包含至少一個大寫字母")
    .regex(/[a-z]/, "密碼必須包含至少一個小寫字母"),
  username: z
    .string()
    .min(2, "用戶名稱至少需要2個字元")
    .max(20, "用戶名稱不能超過20個字元")
    .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, "用戶名稱只能包含中文、英文、數字和底線"),
} as const;

// 登入表單驗證
export const signInSchema = z.object({
  email: formRules.email,
  password: formRules.Password,
});

// 註冊表單驗證
export const signUpSchema = z
  .object({
    email: formRules.email,
    username: formRules.username,
    password: formRules.Password,
    confirmPassword: z.string().min(1, "請確認密碼"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

// 忘記密碼表單驗證
export const forgetSchema = z.object({
  email: formRules.email,
});

// 重設密碼驗證表
export const restPasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, "驗證碼為必填")
      .length(6, "驗證碼必須為6位數字")
      .regex(/^\d+$/, "驗證碼只能包含數字"),
    password: formRules.Password,
    confirmPassword: z.string().min(1, "請確認密碼"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

// 驗證碼表單驗證
export const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(1, "驗證碼為必填")
    .length(6, "驗證碼必須為6位數字")
    .regex(/^\d+$/, "驗證碼只能包含數字"),
});

export type SignInFormDataType = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgetFormData = z.infer<typeof forgetSchema>;
export type restPasswordFormData = z.infer<typeof restPasswordSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
