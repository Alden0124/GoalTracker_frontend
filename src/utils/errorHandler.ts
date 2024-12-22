import { isApiError } from "@/services/axiosInstance/type/typeGuards";
import { notification } from "./notification";

export const handleError = (error: unknown, title: string) => {
  // 判斷是否為 ApiError
  if (isApiError(error)) {
    const { errorMessage } = error;

    if (errorMessage === "此郵箱已驗證過") {
      notification.error({
        title,
        text: `${errorMessage}，請直接登入會員`,
      });
      return "/signIn";
    }

    notification.error({
      title,
      text: errorMessage,
    });
    return null;
  }

  // 處理非 ApiError 的情況
  notification.error({
    title: "系統錯誤",
    text: "發生未預期的錯誤，請稍後再試",
  });
  console.error("Unexpected error:", error);
  return null;
};
