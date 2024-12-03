import { useNavigate } from "react-router-dom";
import { FETCH_AUTH } from "@/services/api/auth";
import { notification } from "@/utils/notification";
import { handleError } from "@/utils/errorHandler";
import { useCallback } from "react";

export const useEmail = () => {
  const navigate = useNavigate();

  const handleSendVerificationCode = useCallback(
    async (email: string) => {
      try {
        const resp = await FETCH_AUTH["send-verification-code"]({ email });
        navigate(`/auth/verifyCode?email=${email}`);
        notification.success({ title: "發送成功", text: resp.message });
      } catch (error: unknown) {
        const redirectPath = handleError(error, "驗證碼發送失敗");
        if (redirectPath) navigate(redirectPath);
      }
    },
    [navigate]
  );

  const handleVerifyCode = useCallback(
    async (email: string, code: string) => {
      try {
        await FETCH_AUTH.VerifyCode({ email, code });
        notification.success({
          title: "驗證成功",
          text: "請再次登入",
        });
        navigate("/auth/signIn");
      } catch (error: unknown) {
        const redirectPath = handleError(error, "驗證失敗");
        if (redirectPath) navigate(redirectPath);
      }
    },
    [navigate]
  );

  return {
    handleSendVerificationCode,
    handleVerifyCode,
  };
};
