import { useSignInHandler } from "@/hooks/auth/useSignIn";
import { FETCH_AUTH } from "@/services/api/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";

interface GoogleLoginButtonProps {
  className?: string;
  setIsSubmitting?: (isSubmitting: boolean) => void;
  isSubmitting?: boolean;
}

const GoogleLoginButton = ({
  className = "",
  setIsSubmitting,
}: GoogleLoginButtonProps) => {
  const { handelSignInSucess, handleSignInError } = useSignInHandler();
  const { t } = useTranslation("auth");

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      setIsSubmitting?.(true);
      const resp = await FETCH_AUTH.GoogleLogin({
        token: credentialResponse.access_token,
      });
      handelSignInSucess(resp);
      setIsSubmitting?.(false);
    },
    onError: (error) => {
      handleSignInError(error);
      setIsSubmitting?.(false);
    },
  });

  return (
    <>
      {/* 自定義按鈕 */}
      <button
        type="button"
        onClick={() => login()}
        className={`w-full border text-center text-[16px] rounded-[5px] dark:border-gray-600 p-[6px] flex items-center justify-center gap-2 ${className}`}
      >
        <FcGoogle size={24} />
        {t("auth:googleLogin")}
      </button>
    </>
  );
};

export default GoogleLoginButton;
