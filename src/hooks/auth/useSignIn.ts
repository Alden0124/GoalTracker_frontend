import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
// 型別
import { SignInResponse } from "@/services/api/auth/type";
// cookie
import { SET_COOKIE } from "@/utils/cookies";
// alert
import { notification } from "@/utils/notification";
// redux
import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import { setUserInfo } from "@/stores/slice/userReducer";
// 自定義hook
import { useEmail } from "./useEmail";
// 欄位驗證
import { SignInFormDataType } from "@/schemas/authSchema";
// type
import { isApiError } from "@/services/axiosInstance/type/typeGuards";

export const useSignInHandler = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleSendVerificationCode } = useEmail();

  const handelSignInSucess = useCallback(
    (response: SignInResponse) => {
      const { message, accessToken, user } = response;
      const { id, email, avatar, isEmailVerified, providers = [] } = user;
      // 1. 保存cookie
      SET_COOKIE(accessToken);

      // 2. 使用者資料存進redux
      dispatch(
        setUserInfo({
          accessToken: accessToken,
          userInfo: { id, email, avatar, isEmailVerified, providers },
        })
      );

      // 3. 顯示成功訊息
      notification.success({
        title: message,
      });

      // 4. 導航到指定頁面
      navigate("/feed");
    },
    [dispatch, navigate]
  );

  const handleSignInError = useCallback(
    async (err: unknown, signInFormData?: SignInFormDataType) => {
      if (isApiError(err)) {
        const { errorMessage, respData } = err;
        console.log(err);
        // 尚未驗證信箱
        if (respData?.needVerification && signInFormData?.email) {
          notification.error({
            title: "登入失敗",
            text: `${errorMessage}，請至信箱收取驗整碼，即將導向驗證頁面`,
          });
          await handleSendVerificationCode(signInFormData.email);
          return;
        }

        notification.error({
          title: "登入失敗",
          text: errorMessage,
        });
        // navigate("/auth/signIn");
      }
    },
    [handleSendVerificationCode]
  );

  return { handelSignInSucess, handleSignInError };
};
