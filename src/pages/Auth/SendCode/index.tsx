import { useMemo } from "react";
// 欄位驗證
import { ForgetFormData, getForgetSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// 組件
import Input from "@/components/ui/Input";
import { useTranslation } from "react-i18next";
const SendCode = () => {
  const { t } = useTranslation();
  // 取得忘記密碼表單驗證
  const forgetSchema = useMemo(() => getForgetSchema(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetFormData>({
    resolver: zodResolver(forgetSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: ForgetFormData) => {
    console.log(data);
    // 處理登入邏輯
  };

  const onError = (errors: unknown) => {
    console.log("表單錯誤:", errors);
    // 錯誤會自動顯示在對應的 Input 元件下方
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
      <h1 className="text-center  text-2xl dark:text-foreground-dark">
        {t("auth:sendEmailVerificationCode")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="w-full max-w-sm mt-8 space-y-4 px-4"
        noValidate
      >
        <Input
          {...register("email")}
          id="email"
          type="email"
          label={t("auth:email")}
          placeholder={t("auth:email")}
          autoComplete="email"
          error={errors.email?.message}
        />

        <button type="submit" className="btn-primary w-full hover:opacity-90">
          {t("auth:confirm")}
        </button>
      </form>
    </main>
  );
};

export default SendCode;
