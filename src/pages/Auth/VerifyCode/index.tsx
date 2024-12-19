import { useEffect, useMemo, useState } from "react";
// 欄位驗證
import { getVerifyCodeSchema, VerifyCodeFormData } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
// 組件
import ResendButton from "@/components/auth/VerifyCode/ResendButton";
import Input from "@/components/ui/Input";
// alert
// 自定義hook
import { useEmail } from "@/hooks/auth/useEmail";
import { useTranslation } from "react-i18next";
const VerifyCode = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const { handleVerifyCode } = useEmail();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 取得驗證碼表單驗證
  const verifyCodeSchema = useMemo(() => getVerifyCodeSchema(), []);

  // 將 useEffect 移到頂層
  useEffect(() => {
    if (!email) {
      navigate("/auth/signIn");
    }
  }, [email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    mode: "onSubmit",
  });

  // 如果沒有 email，直接返回 null
  if (!email) {
    return null;
  }

  const onSubmit = async (data: VerifyCodeFormData) => {
    setIsSubmitting(true);
    await handleVerifyCode(email, data.code);
    setIsSubmitting(false);
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
      <h1 className="text-center  text-2xl dark:text-foreground-dark">
        {t("auth:verifyCode")}
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
          error={errors.code?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={` w-full ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "btn-primary  hover:opacity-90"
          }`}
        >
          {isSubmitting ? t("auth:confirm") : t("auth:confirm")}
        </button>

        <ResendButton email={email} />
      </form>
    </main>
  );
};

export default VerifyCode;
