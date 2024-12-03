import { FaLine } from "react-icons/fa";

const LineLoginButton = () => {
  const handleLineLogin = async () => {
    try {
      const lineAuthUrl =
        "https://access.line.me/oauth2/v2.1/authorize" +
        "?response_type=code" +
        `&client_id=${import.meta.env.VITE_LINE_CLIENT_ID}` +
        `&redirect_uri=${import.meta.env.VITE_LINE_REDIRECT_URI}` +
        "&state=456456456" +
        "&scope=openid%20profile%20email";

      // 重定向用户到 LINE 授權页面
      window.location.href = lineAuthUrl;
    } catch (error) {
      console.error("LINE 登陸失敗:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLineLogin}
      className="w-full border text-center text-[16px] rounded-[5px] hover:bg-[gray]/10 dark:text-foreground-dark dark:border-gray-600 p-[6px] flex items-center justify-center gap-2"
    >
      <FaLine size={24} className="text-[#06C755] dark:text-[#00B900]" />
      使用 LINE 登入
    </button>
  );
};

export default LineLoginButton;
