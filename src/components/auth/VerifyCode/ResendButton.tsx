import { useEmail } from "@/hooks/auth/useEmail";
import { useCountdown } from "@/hooks/common/useCountdown";
import { useTranslation } from "react-i18next";

interface ResendButtonProps {
  email: string;
  className?: string;
}

const ResendButton = ({ email, className = "" }: ResendButtonProps) => {
  const { countdown, startCountdown, isActive } = useCountdown();
  const { handleSendVerificationCode } = useEmail();
  const { t } = useTranslation();
  const handleResend = async () => {
    if (isActive) return;
    await handleSendVerificationCode(email);
    startCountdown(60);
  };

  return (
    <button
      onClick={handleResend}
      type="button"
      disabled={isActive}
      className={`btn-secondary block w-full text-center
        ${isActive ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
        ${className}`}
    >
      {isActive
        ? `${t("auth:resendVerificationCode")} (${countdown} ${t(
            "auth:seconds"
          )})`
        : t("auth:resendVerificationCode")}
    </button>
  );
};

export default ResendButton;
