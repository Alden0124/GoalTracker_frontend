import Input from "@/components/ui/Input";
import { useEmail } from "@/hooks/auth/useEmail";
import { getSignUpSchema, SignUpFormData } from "@/schemas/authSchema";
import { FETCH_AUTH } from "@/services/api/auth";
import { handleError } from "@/utils/errorHandler";
import { notification } from "@/utils/notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SignUp = () => {
  const { t } = useTranslation();
  const { handleSendVerificationCode } = useEmail();

  // 取得註冊表單驗證
  const signUpSchema = useMemo(() => getSignUpSchema(), []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  });

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setIsSubmitting(true);
      const result = await FETCH_AUTH.SignUp({
        email: data.email,
        username: data.username,
        password: data.password,
      });
      if (result) {
        notification.success({
          title: t("auth:signUpSuccess"),
          text: t("auth:pleaseCheckYourEmailForVerificationCode"),
        });
        await handleSendVerificationCode(data.email);
      }
    } catch (err: unknown) {
      handleError(err, t("auth:signUpFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: SignUpFormData) => {
    handleSignUp(data);
  };

  const onError = (errors: unknown) => {
    console.log("表單錯誤:", errors);
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
      <h1 className="text-center  text-2xl dark:text-foreground-dark">
        {t("auth:signUp")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="w-full max-w-sm mt-8 space-y-4 px-4"
        noValidate
      >
        <Input
          {...register("username")}
          id="username"
          type="text"
          label={t("auth:username")}
          placeholder={t("auth:username")}
          error={errors.username?.message}
          autoComplete="username"
        />

        <Input
          {...register("email")}
          id="email"
          type="email"
          label={t("auth:email")}
          placeholder={t("auth:email")}
          autoComplete="email"
          error={errors.email?.message}
        />

        <Input
          {...register("password")}
          id="password"
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
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 btn-primary"
          }`}
        >
          {isSubmitting ? t("auth:creatingAccount") : t("auth:createAccount")}
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
          <p
            className={`text-center text-foreground-light/50 dark:text-foreground-dark`}
          >
            {t("auth:haveAccount")}
            <Link
              to={"/auth/signIn"}
              className={`pl-[4px]   ${
                isSubmitting
                  ? "cursor-not-allowed text-foreground-light/50 dark:text-foreground-dark"
                  : "text-[blue]/60 dark:text-[#58c4dc]"
              }`}
            >
              {t("auth:signIn")}
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default SignUp;
