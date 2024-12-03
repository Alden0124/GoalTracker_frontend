import { Link } from "react-router-dom";
// 欄位驗證
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/schemas/authSchema";
// 組件
import Input from "@/components/ui/Input";
// 自定義hook
import { useEmail } from "@/hooks/auth/useEmail";
// 提示窗
import { notification } from "@/utils/notification";
// api
import { FETCH_AUTH } from "@/services/api/auth";
// type
import { handleError } from "@/utils/errorHandler";

const SignUp = () => {
  const { handleSendVerificationCode } = useEmail();

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
      const result = await FETCH_AUTH.SignUp({
        email: data.email,
        username: data.username,
        password: data.password,
      });
      if (result) {
        notification.success({
          title: "註冊成功",
          text: "請至信箱收取驗整碼，即將導向驗證頁面",
        });
        await handleSendVerificationCode(data.email);
      }
    } catch (err: unknown) {
      handleError(err, "註冊失敗");
    }
  };

  const onSubmit = (data: SignUpFormData) => {
    handleSignUp(data);
  };

  const onError = () => {
    notification.warning({
      title: "表單驗證失敗",
      text: "請檢查輸入的資料是否正確",
    });
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
      <h1 className="text-center  text-2xl dark:text-foreground-dark">
        註冊 GoalTracker
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
          label="用戶名稱"
          placeholder="請輸入用戶名稱"
          error={errors.username?.message}
        />

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
          autoComplete="new-password"
          error={errors.password?.message}
        />

        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          label="確認密碼"
          placeholder="請再次輸入密碼"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        <button type="submit" className="btn-primary w-full hover:opacity-90">
          創建帳號
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

        <div>
          <p
            className={`text-center text-foreground-light/50 dark:text-foreground-dark`}
          >
            已經有帳號?
            <Link
              to={"/auth/signIn"}
              className={`pl-[4px] text-[blue]/60 dark:text-[#58c4dc]`}
            >
              登入
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default SignUp;
