import { useSignInHandler } from "@/hooks/auth/useSignIn";
import { FETCH_AUTH } from "@/services/api/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const { handelSignInSucess, handleSignInError } = useSignInHandler();
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      const resp = await FETCH_AUTH.GoogleLogin({
        token: credentialResponse.access_token,
      });
      handelSignInSucess(resp);
    },
    onError: (error) => {
      handleSignInError(error);
    },
  });

  return (
    <>
      {/* 自定義按鈕 */}
      <button
        type="button"
        onClick={() => login()}
        className="w-full border text-center text-[16px] rounded-[5px] hover:bg-[gray]/10 dark:text-foreground-dark dark:border-gray-600 p-[6px] flex items-center justify-center gap-2"
      >
        <FcGoogle size={24} />
        使用 Google 登入
      </button>
    </>
  );
};

export default GoogleLoginButton;
