import { Slide, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  title?: string;
  text?: string;
  timer?: number;
  showConfirmButton?: boolean;
  target?: string;
}

const defaultOptions: ToastOptions = {
  position: "top-right",
  hideProgressBar: true,
  draggable: false,
  theme: "light",
  closeOnClick: false,
  closeButton: false,
  transition: Slide,
};

export const notification = {
  // 基礎提示
  base: (type: NotificationType, options: NotificationOptions) => {
    const message = options.text || options.title;
    const toastOptions = {
      ...defaultOptions,
      autoClose: options.timer || 1000,
    };

    switch (type) {
      case "success":
        return toast.success(message, toastOptions);
      case "error":
        return toast.error(message, toastOptions);
      case "warning":
        return toast.warning(message, toastOptions);
      case "info":
        return toast.info(message, toastOptions);
      default:
        return toast(message, toastOptions);
    }
  },

  // 成功提示
  success: (options: NotificationOptions) => {
    return notification.base("success", {
      showConfirmButton: false,
      ...options,
    });
  },

  // 錯誤提示
  error: (options: NotificationOptions) => {
    return notification.base("error", {
      title: options.title || "錯誤",
      text: options.text || "發生未知錯誤，請稍後再試",
      ...options,
    });
  },

  // 警告提示
  warning: (options: NotificationOptions) => {
    return notification.base("warning", {
      ...options,
    });
  },

  // 確認對話框
  confirm: (options: NotificationOptions) => {
    toast.dismiss();

    return new Promise((resolve) => {
      const content = (
        <div className="confirm-dialog">
          {options.title && <h4>{options.title}</h4>}
          {options.text && <p>{options.text}</p>}
          <div className="button-group">
            <button
              className="confirm-button"
              onClick={() => {
                resolve(true);
                toast.dismiss();
              }}
            >
              確定
            </button>
            <button
              className="cancel-button"
              onClick={() => {
                resolve(false);
                toast.dismiss();
              }}
            >
              取消
            </button>
          </div>
        </div>
      );

      toast.info(content, {
        ...defaultOptions,
        autoClose: false,
        closeOnClick: false,
      });
    });
  },
};
