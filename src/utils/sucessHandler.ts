import { notification } from "./notification";
import { isApiSuccess } from "@/services/axiosInstance/type/typeGuards";

export const handleSuccess = (resp: unknown, title: string) => {
  if (isApiSuccess(resp)) {
    notification.success({
      title: title,
      text: resp.message,
    });
    return null;
  }

  notification.success({
    title: "成功",
  });
};
