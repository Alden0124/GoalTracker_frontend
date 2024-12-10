import { FETCH_AUTH } from "@/services/api/auth";
import { notification } from "@/utils/notification";
import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";
// 自定義hook
import { useSignInHandler } from "@/hooks/auth/useSignIn";

const GoogleLoginButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { handelSignInSucess, handleSignInError } = useSignInHandler();

  // const handleCustomButtonClick = () => {
  //   // 程式觸發隱藏的 Google 按鈕點擊
  //   const googleButton = buttonRef.current?.querySelector('div[role="button"]');
  //   if (googleButton) {
  //     (googleButton as HTMLElement).click();
  //   }
  // };

  const handleSucess = async (credential: string) => {
    try {
      if (credential) {
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
    <div className="w-full">
      {/* 隱藏的 Google 登入按鈕 */}
      <div ref={buttonRef} >
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
          useOneTap={false}
          locale="zh_TW"
          type="standard"  // 新增這行
          theme="outline"  // 新增這行
          size="large"     // 新增這行
          width="100%"    // 新增這行
          text="signin_with"  // 新增這行
        />
      </div>

      {/* 自定義按鈕 */}
      {/* <button
        type="button"
        onClick={handleCustomButtonClick}
        className="w-full border text-center text-[16px] rounded-[5px] hover:bg-[gray]/10 dark:text-foreground-dark dark:border-gray-600 p-[6px] flex items-center justify-center gap-2"
      >
        <FcGoogle size={24} />
        使用 Google 登入
      </button> */}
    </div>
  );
};

export default GoogleLoginButton;
