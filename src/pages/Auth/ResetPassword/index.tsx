import { useNavigate, useSearchParams } from "react-router-dom";
// 欄位驗證
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  restPasswordSchema,
  type restPasswordFormData,
} from "@/schemas/authSchema";
// 組件
import Input from "@/components/ui/Input";
// api
import { FETCH_AUTH } from "@/services/api/auth";
// type
import { handleError } from "@/utils/errorHandler";
// alert
import { notification } from "@/utils/notification";
import { useEffect } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<restPasswordFormData>({
    resolver: zodResolver(restPasswordSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!email) {
      notification.error({
        title: "錯誤",
        text: "缺少必要的 email 參數",
      });
      navigate("/auth/signIn");
    }
  }, [email, navigate]);

  if (!email) return null;

  const handleResetPassword = async (data: restPasswordFormData) => {
    try {
      const resp = await FETCH_AUTH.ResetPassword({
        email,
        code: data.code,
        newPassword: data.password,
      });
      notification.success({
        title: "重設密碼成功",
        text: resp.message,
      });
      navigate("/auth/signIn");
    } catch (error: unknown) {
      handleError(error, "密碼變更失敗");
    }
  };

  const onSubmit = (data: restPasswordFormData) => {
    console.log(data);
    handleResetPassword(data);
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
      <h1 className="text-center  text-2xl dark:text-foreground-dark">
        變更密碼
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm mt-8 space-y-4 px-4"
        noValidate
      >
        <Input
          {...register("code")}
          id="code"
          label="驗證碼"
          placeholder="請輸入驗證碼"
          error={errors?.code?.message}
        />

        <Input
          {...register("password")}
          id="newPassword"
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
          確定變更密碼
        </button>
      </form>
    </main>
  );
};

export default ResetPassword;
