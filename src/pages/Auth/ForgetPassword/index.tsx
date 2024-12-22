import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// 欄位驗證
import { ForgetFormData, getForgetSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// 組件
import Input from "@/components/ui/input";
// icon
import { FaArrowLeft } from "react-icons/fa";
// API
import { FETCH_AUTH } from "@/services/api/auth";
// type
import { handleError } from "@/utils/errorHandler";
// alert
import { notification } from "@/utils/notification";
// 多國語言
import { useTranslation } from "react-i18next";

const Forget = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // 取得忘記密碼表單驗證
  const forgetSchema = useMemo(() => getForgetSchema(), []);
  // 是否正在提交
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetFormData>({
    resolver: zodResolver(forgetSchema),
    mode: "onSubmit",
  });

  const handleForgotPassword = async (email: string) => {
    try {
      setIsSubmitting(true); // 開始發送時設置為 true
      const resp = await FETCH_AUTH["Forgot-password"]({ email });
      console.log(resp);
      notification.success({
        title: t("auth:success"),
        text: resp.message,
      });
      navigate(`/auth/resetPassword?email=${email}`);
    } catch (err: unknown) {
      handleError(err, t("auth:error"));
    } finally {
      setIsSubmitting(false); // 無論成功或失敗都設置為 false
    }
  };

  const onSubmit = (data: ForgetFormData) => {
    // 處理登入邏輯
    handleForgotPassword(data.email);
  };

  const onError = (errors: unknown) => {
    console.log("表單錯誤:", errors);
    // 錯誤會自動顯示在對應的 Input 元件下方
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
      <h1 className="text-center  text-2xl dark:text-foreground-dark">
        {t("auth:forgotPassword")}
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

        <button
          type="submit"
          className={`btn-primary w-full  ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("auth:sendingVerificationCode")
            : t("auth:sendEmailVerificationCode")}
        </button>

        <div className={`w-full flex items-center justify-center`}>
          <div className="border-b w-[50%]"></div>
          <p
            className={`text-sm break-keep text-foreground-light/50 dark:text-foreground-dark`}
          >
            {t("auth:or")}
          </p>
          <div className={`border-b w-[50%]`}></div>
        </div>

        <div>
          <button
            onClick={() => navigate("/auth/signIn")}
            type="button"
            disabled={isSubmitting}
            className={`group w-full text-center text-foreground-light/50 dark:text-foreground-dark  flex items-center justify-center gap-2 ${
              isSubmitting
                ? "cursor-not-allowed "
                : "hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <FaArrowLeft
              size={14}
              className={` transition-transform duration-300 ${
                isSubmitting
                  ? "cursor-not-allowed"
                  : " group-hover:-translate-x-[4px]"
              }`}
            />
            {t("auth:backToSignIn")}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Forget;
