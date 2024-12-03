import Swal from "sweetalert2";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  title?: string;
  text?: string;
  timer?: number;
  showConfirmButton?: boolean;
  target?: string;
}

export const notification = {
  // 基礎提示
  base: (type: NotificationType, options: NotificationOptions) => {
    const targetElement = document.querySelector("#portal-dialog > div")
      ? "#portal-dialog > div"
      : "body";

    return Swal.fire({
      icon: type,
      title: options.title,
      text: options.text,
      timer: options.timer,
      timerProgressBar: Boolean(options.timer),
      showConfirmButton: options.showConfirmButton ?? true,
      confirmButtonText: "確定",
      confirmButtonColor: "#3085d6",
      target: targetElement,
    });
  },

  // 成功提示
  success: (options: NotificationOptions) => {
    return notification.base("success", {
      timer: 2500,
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
    const targetElement = document.querySelector("#portal-dialog > div")
      ? "#portal-dialog > div"
      : "body";

    return Swal.fire({
      title: options.title || "確認操作",
      text: options.text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      target: targetElement,
      customClass: {
        container: "swal2-container-custom", // 添加自定義類名
      },
    });
  },
};
