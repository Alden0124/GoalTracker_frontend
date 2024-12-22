import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// 欄位驗證
import {
  getRestPasswordSchema,
  RestPasswordFormData,
} from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// 組件
import Input from "@/components/ui/input";
// api
import { FETCH_AUTH } from "@/services/api/auth";
// type
import { handleError } from "@/utils/errorHandler";
// alert
import { notification } from "@/utils/notification";
// 多國語言
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 取得重設密碼表單驗證
  const restPasswordSchema = useMemo(() => getRestPasswordSchema(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestPasswordFormData>({
    resolver: zodResolver(restPasswordSchema),
    mode: "onSubmit",
  });

  //
  useEffect(() => {
    if (!email) {
      navigate("/auth/signIn");
    }
  }, [email, navigate]);

  // 如果沒有email，返回登入頁
  if (!email) {
    navigate("/auth/signIn");
  }

  // 重設密碼
  const handleResetPassword = async (data: RestPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const resp = await FETCH_AUTH.ResetPassword({
        email,
        code: data.code,
        newPassword: data.password,
      });
      notification.success({
        title: t("auth:resetPasswordSuccess"),
        text: resp.message,
      });
      navigate("/auth/signIn");
    } catch (error: unknown) {
      handleError(error, t("auth:resetPasswordFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 提交表單
  const onSubmit = (data: RestPasswordFormData) => {
    handleResetPassword(data);
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
      <h1 className="text-center  text-2xl dark:text-foreground-dark">
        {t("auth:resetPassword")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm mt-8 space-y-4 px-4"
        noValidate
      >
        <Input
          {...register("code")}
          id="code"
          label={t("auth:verifyCode")}
          placeholder={t("auth:verifyCode")}
          error={errors?.code?.message}
        />

        <Input
          {...register("password")}
          id="newPassword"
          type="password"
          label={t("auth:password")}
          placeholder={t("auth:password")}
          autoComplete="new-password"
          error={errors.password?.message}
        />

        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          label={t("auth:confirmPassword")}
          placeholder={t("auth:confirmPassword")}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={` w-full ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "btn-primary  hover:opacity-90"
          }`}
        >
          {isSubmitting
            ? t("auth:sendingVerificationCode")
            : t("auth:confirmChangePassword")}
        </button>
      </form>
    </main>
  );
};

export default ResetPassword;
