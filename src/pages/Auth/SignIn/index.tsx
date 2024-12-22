import GoogleLoginButton from "@/components/auth/OAuth/GoogleLoginButton";
import LineLoginButton from "@/components/auth/OAuth/LineLoginButton";
import Input from "@/components/ui/input";
import { useSignInHandler } from "@/hooks/auth/useSignIn";
import { getSignInSchema, SignInFormDataType } from "@/schemas/authSchema";
import { FETCH_AUTH } from "@/services/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

const SignIn = () => {
  const [searchParam] = useSearchParams();
  const { handelSignInSucess, handleSignInError } = useSignInHandler();
  const { t } = useTranslation(["auth"]);
  const code = searchParam.get("code");
  const isLineLoginProcessed = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 取得登入表單驗證
  const signInSchema = useMemo(() => getSignInSchema(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormDataType>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    // line登入
    if (code && !isLineLoginProcessed.current) {
      const handleLineLogin = async () => {
        try {
          setIsSubmitting(true);
          isLineLoginProcessed.current = true;
          const resp = await FETCH_AUTH.LineLogin({ code });
          handelSignInSucess(resp);
        } catch (err: unknown) {
          console.log("Line登入錯誤:", err);
          handleSignInError(err);
        } finally {
          setIsSubmitting(false);
        }
      };

      handleLineLogin();
    }
  }, [code, handelSignInSucess, handleSignInError]);

  // 非第三方用戶登入
  const handleSignIn = async (signInFormData: SignInFormDataType) => {
    try {
      const resp = await FETCH_AUTH.SingIn(signInFormData);
      handelSignInSucess(resp);
    } catch (err: unknown) {
      handleSignInError(err, signInFormData);
    }
  };

  const onSubmit = (data: SignInFormDataType) => {
    handleSignIn(data);
  };

  const onError = (errors: unknown) => {
    console.log("表單錯誤:", errors);
    // 錯誤會自動顯示在對應的 Input 元件下方
  };

  return (
    <div>
      <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
        <h1 className="text-center  text-2xl dark:text-foreground-dark">
          {t("auth:login")}
        </h1>
        <p
          className={`text-sm text-foreground-light/40 dark:text-foreground-dark mt-[10px]`}
        >
          {t("auth:loginOrCreateAccountToStartUsing")}
        </p>

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

          <Input
            {...register("password")}
            id="password"
            type="password"
            label={t("password")}
            placeholder={t("password")}
            autoComplete="current-password"
            error={errors.password?.message}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full  ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "btn-primary hover:opacity-90"
            }`}
          >
            {t("signIn")}
          </button>

          <div className={`w-full flex items-center justify-center`}>
            <div className="border-b w-[50%]"></div>
            <p
              className={`text-sm break-keep text-foreground-light/50 dark:text-foreground-dark`}
            >
              {t("or")}
            </p>
            <div className={`border-b w-[50%]`}></div>
          </div>
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            onScriptLoadError={() => {
              console.log("Google Script 載入失敗");
            }}
          >
            <GoogleLoginButton
              className={`${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[gray]/10 dark:text-foreground-dark"
              }`}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
            />
          </GoogleOAuthProvider>
          <LineLoginButton
            className={`${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[gray]/10"
            }`}
          />

          <Link
            to={"/auth/forget"}
            className={`block text-[14px] text-center   ${
              isSubmitting
                ? " cursor-not-allowed text-foreground-light/50 dark:text-foreground-dark"
                : "text-[blue]/60 dark:text-[#58c4dc] hover:text-[blue]/80 dark:hover:text-[#58c4dc]/80"
            }`}
          >
            {t("forgotPassword")}
          </Link>

          <div>
            <p
              className={`text-center text-[14px] text-foreground-light/50 dark:text-foreground-dark`}
            >
              {t("noAccount")}
              <Link
                to={"/auth/signUp"}
                className={`pl-[4px]   ${
                  isSubmitting
                    ? "cursor-not-allowed text-foreground-light/50 dark:text-foreground-dark"
                    : "text-[blue]/60 dark:text-[#58c4dc] hover:text-[blue]/80 dark:hover:text-[#58c4dc]/80"
                }`}
              >
                {t("signUp")}
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
