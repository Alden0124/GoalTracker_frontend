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
  isSubmitting,
}: GoogleLoginButtonProps) => {
  const { handelSignInSucess, handleSignInError } = useSignInHandler();
  const { t } = useTranslation("auth");

  const handleGoogleLogin = async (accessToken: string) => {
    try {
      setIsSubmitting?.(true);
      const resp = await FETCH_AUTH.GoogleLogin({ token: accessToken });
      handelSignInSucess(resp);
    } catch (error) {
      handleSignInError(error);
    } finally {
      setIsSubmitting?.(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      await handleGoogleLogin(credentialResponse.access_token);
    },
    onError: (error) => {
      handleSignInError(error);
      setIsSubmitting?.(false);
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={isSubmitting}
      data-testid="google-login-button"
      className={`w-full border text-center text-[16px] rounded-[5px] text-foreground-light dark:border-gray-600 dark:text-foreground-dark p-[6px] flex items-center justify-center gap-2 ${className}`}
    >
      <FcGoogle size={24} />
      {t("auth:googleLogin")}
    </button>
  );
};

export default GoogleLoginButton;
