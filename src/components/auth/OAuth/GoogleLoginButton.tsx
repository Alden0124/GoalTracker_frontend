import { useSignInHandler } from "@/hooks/auth/useSignIn";
import { FETCH_AUTH } from "@/services/api/auth";
import { notification } from "@/utils/notification";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRef } from "react";
import { FcGoogle } from "react-icons/fc";
const GoogleLoginButton = () => {
  const { handelSignInSucess, handleSignInError } = useSignInHandler();
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleCustomButtonClick = () => {
    // 程式觸發隱藏的 Google 按鈕點擊
    const googleButton = buttonRef.current?.querySelector('div[role="button"]');
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };

  const handleSucess = async (credential: string) => {
    try {
      if (credential) {
        console.log("credential", credential);
        const resp = await FETCH_AUTH.GoogleLogin({
          token: credential,
        });
        handelSignInSucess(resp);
      }
    } catch (err: unknown) {
      handleSignInError(err);
    }
  };

  return (
    <>
    
    <div className="w-full hidden" ref={buttonRef}>
      {/* 隱藏的 Google 登入按鈕 */}
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        onScriptLoadError={() => {
          console.log("Google Script 載入失敗");
        }}
      >
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              handleSucess(credentialResponse.credential);
            }
          }}
          onError={() => {
            notification.error({
              title: "Google 登入失敗",
              text: "請稍後再試",
            });
          }}
          locale="zh_TW"
          ux_mode="redirect"
        />
      </GoogleOAuthProvider>
    </div>
           {/* 自定義按鈕 */}
      <button
        type="button"
        onClick={handleCustomButtonClick}
        className="w-full border text-center text-[16px] rounded-[5px] hover:bg-[gray]/10 dark:text-foreground-dark dark:border-gray-600 p-[6px] flex items-center justify-center gap-2"
      >
        <FcGoogle size={24} />
        使用 Google 登入
      </button>
    </>
  );
};

export default GoogleLoginButton;
