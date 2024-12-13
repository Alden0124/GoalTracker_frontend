import GoogleLoginButton from "@/components/auth/OAuth/GoogleLoginButton";
import LineLoginButton from "@/components/auth/OAuth/LineLoginButton";
import Input from "@/components/ui/Input";
import { useSignInHandler } from "@/hooks/auth/useSignIn";
import { signInSchema, type SignInFormDataType } from "@/schemas/authSchema";
import { FETCH_AUTH } from "@/services/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

const SignIn = () => {
  const [searchParam] = useSearchParams();
  const { handelSignInSucess, handleSignInError } = useSignInHandler();


  const code = searchParam.get("code");
  const isLineLoginProcessed = useRef(false);

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
          isLineLoginProcessed.current = true;
          const resp = await FETCH_AUTH.LineLogin({ code });
          handelSignInSucess(resp);
        } catch (err: unknown) {
          console.log('Line登入錯誤:', err);
          handleSignInError(err);
        }
      };
      
      handleLineLogin();
    }
  }, [code, handelSignInSucess, handleSignInError]);

  // 非第三方用戶登入
  const handleSignIn = async (signInFormData: SignInFormDataType) => {
    try {
      console.log(signInFormData)
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
          登入 GoalTracker
        </h1>
        <p
          className={`text-sm text-foreground-light/40 dark:text-foreground-dark mt-[10px]`}
        >
          登入或建立帳號以開始使用
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
            label="電子信箱"
            placeholder="電子郵件"
            autoComplete="email"
            error={errors.email?.message}
          />

          <Input
            {...register("password")}
            id="password"
            type="password"
            label="密碼"
            placeholder="密碼"
            autoComplete="current-password"
            error={errors.password?.message}
          />

          <button type="submit" className="btn-primary w-full hover:opacity-90">
            登入
          </button>

          <div className={`w-full flex items-center justify-center`}>
            <div className="border-b w-[50%]"></div>
            <p
              className={`text-sm break-keep text-foreground-light/50 dark:text-foreground-dark`}
            >
              或
            </p>
            <div className={`border-b w-[50%]`}></div>
          </div>
          <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        onScriptLoadError={() => {
          console.log("Google Script 載入失敗");
        }}
      >

          <GoogleLoginButton />
      </GoogleOAuthProvider>
          <LineLoginButton />

          <Link
            to={"/auth/forget"}
            className={`block text-center text-[blue]/60 dark:text-[#58c4dc]`}
          >
            忘記密碼?
          </Link>

          <div>
            <p
              className={`text-center text-foreground-light/50 dark:text-foreground-dark`}
            >
              還沒有帳號?
              <Link
                to={"/auth/signUp"}
                className={`pl-[4px] text-[blue]/60 dark:text-[#58c4dc]`}
              >
                立即註冊
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
