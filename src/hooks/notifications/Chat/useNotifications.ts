import { GetNotificationsQuery } from "@/services/api/Notifications/type";
import { useInfiniteQuery } from "@tanstack/react-query";

import { FETCH_NOTIFICATIONS } from "@/services/api/Notifications";

import { queryKeys as notificationsQueryKeys } from "./queryKeys";

// 獲取通知
export const useGetNotifications = (query: GetNotificationsQuery) => {
  return useInfiniteQuery({
    queryKey: notificationsQueryKeys.notifications.notifications(query),
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
