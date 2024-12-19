import axiosInstance from "@/services/axiosInstance";

import { DEFAULT_NOTIFICATIONS_PARAMS } from "./constants";
import { GetNotificationsQuery, GetNotificationsResponse } from "./type";

export const FETCH_NOTIFICATIONS = {
  // 獲取通知
  GetNotifications: (
    query?: GetNotificationsQuery
  ): Promise<GetNotificationsResponse> =>
    axiosInstance.get(`/notifications`, {
      params: { ...DEFAULT_NOTIFICATIONS_PARAMS, ...query },
    }),

  // 標記通知為已讀
  MarkNotificationAsRead: (notificationId: string) =>
    axiosInstance.put(`/notifications/read/${notificationId}`),

  // 獲取未讀通知數量
  GetUnreadNotificationCount: (): Promise<{ unreadCount: number }> =>
    axiosInstance.get(`/notifications/unread-count`), 
};

