import {
  GetNotificationsQuery,
  GetNotificationsResponse,
} from "@/services/api/Notifications/type";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { FETCH_NOTIFICATIONS } from "@/services/api/Notifications";

import { GET_COOKIE } from "@/utils/cookies";
import { queryKeys as notificationsQueryKeys } from "./queryKeys";

// 獲取通知
export const useGetNotifications = (query: GetNotificationsQuery) => {
  return useInfiniteQuery({
    queryKey: notificationsQueryKeys.notifications.notifications(),
    queryFn: ({ pageParam = 1 }) =>
      FETCH_NOTIFICATIONS.GetNotifications({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // 從 lastPage 中獲取分頁信息
      const { current, total, size } = lastPage.pagination;
      const totalPages = Math.ceil(total / size);

      // 如果還有下一頁，返回下一頁的頁碼，否則返回 undefined
      return current < totalPages ? current + 1 : undefined;
    },
  });
};

// 獲取未讀通知數量
export const useGetUnreadNotificationCount = () => {
  const token = GET_COOKIE()
  return useQuery({
    queryKey: notificationsQueryKeys.notifications.unreadNotificationCount(),
    queryFn: () => FETCH_NOTIFICATIONS.GetUnreadNotificationCount(),
    enabled: !!token,
  });
};

// 標記通知為已讀
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      FETCH_NOTIFICATIONS.MarkNotificationAsRead(notificationId),
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(
        notificationsQueryKeys.notifications.notifications(),
        (oldData: { pages: GetNotificationsResponse[] } | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              notifications: page.notifications.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, read: true }
                  : notification
              ),
            })),
          };
        }
      );
    },
  });
};
