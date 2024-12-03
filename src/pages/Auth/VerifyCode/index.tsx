// 欄位驗證
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyCodeSchema,
  type VerifyCodeFormData,
} from "@/schemas/authSchema";
// 組件
import Input from "@/components/ui/Input";
import { useEffect } from "react";
import ResendButton from "@/components/auth/VerifyCode/ResendButton";
// alert
import { notification } from "@/utils/notification";
// 自定義hook
import { useEmail } from "@/hooks/auth/useEmail";

const VerifyCode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const { handleVerifyCode } = useEmail();

  // 將 useEffect 移到頂層
  useEffect(() => {
    if (!email) {
      notification.error({
        title: "錯誤",
        text: "缺少必要的 email 參數",
      });
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
    await handleVerifyCode(email, data.code);
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center dark:bg-background-dark">
      <h1 className="text-center  text-2xl dark:text-foreground-dark">
        輸入驗證碼
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
          error={errors.code?.message}
        />

        <button type="submit" className="btn-primary w-full hover:opacity-90">
          確認
        </button>

        <ResendButton email={email} />
      </form>
    </main>
  );
};

export default VerifyCode;
