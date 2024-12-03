import { useCountdown } from "@/hooks/common/useCountdown";
import { useEmail } from "@/hooks/auth/useEmail";

interface ResendButtonProps {
  email: string;
  className?: string;
}

const ResendButton = ({ email, className = "" }: ResendButtonProps) => {
  const { countdown, startCountdown, isActive } = useCountdown();
  const { handleSendVerificationCode } = useEmail();

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
      {isActive ? `重新發送 (${countdown}秒)` : "重新寄送驗證碼"}
    </button>
  );
};

export default ResendButton;
