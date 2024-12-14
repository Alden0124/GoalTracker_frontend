import i18n from "i18next";
import { z } from "zod";

// 動態獲取驗證消息
const getValidationMessages = () =>
  i18n.getResourceBundle(i18n.language, "validate");

// 共用的表單驗證規則
const getFormRules = () => {
  const validationMessages = getValidationMessages();
  return {
    email: z
      .string()
      .min(1, validationMessages.email.required)
      .email(validationMessages.email.invalid),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,12}$/,
        validationMessages.password.regex 
      ),
    username: z
      .string()
      .min(2, validationMessages.username.min)
      .max(20, validationMessages.username.max)
      .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, validationMessages.username.regex),
    code: z
      .string()
      .min(1, validationMessages.code.required)
      .length(6, validationMessages.code.length)
      .regex(/^\d+$/, validationMessages.code.regex),
  };
};

// 登入表單驗證
export const getSignInSchema = () => {
  const formRules = getFormRules();
  return z.object({
    email: formRules.email,
    password: formRules.password,
  });
};

// 註冊表單驗證
export const getSignUpSchema = () => {
  const formRules = getFormRules();
  const validationMessages = getValidationMessages();
  return z
    .object({
      email: formRules.email,
      username: formRules.username,
      password: formRules.password,
      confirmPassword: formRules.password,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: validationMessages.password.confirmPassword,
      path: ["confirmPassword"],
    });
};

// 忘記密碼表單驗證
export const getForgetSchema = () => {
  const formRules = getFormRules();
  return z.object({
    email: formRules.email,
  });
};

// 重設密碼驗證表
export const getRestPasswordSchema = () => {
  const formRules = getFormRules();
  const validationMessages = getValidationMessages();
  return z
    .object({
      code: formRules.code,
      password: formRules.password,
      confirmPassword: formRules.password,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: validationMessages.password.confirmPassword,
      path: ["confirmPassword"],
    });
};

// 驗證碼表單驗證
export const getVerifyCodeSchema = () => {
  const formRules = getFormRules();
  return z.object({
    code: formRules.code,
  });
};

// 定義表單數據類型
export type SignInFormDataType = z.infer<ReturnType<typeof getSignInSchema>>;
export type SignUpFormData = z.infer<ReturnType<typeof getSignUpSchema>>;
export type ForgetFormData = z.infer<ReturnType<typeof getForgetSchema>>;
export type RestPasswordFormData = z.infer<
  ReturnType<typeof getRestPasswordSchema>
>;
export type VerifyCodeFormData = z.infer<
  ReturnType<typeof getVerifyCodeSchema>
>;
