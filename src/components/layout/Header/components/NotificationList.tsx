import { useGetNotifications, useMarkNotificationAsRead } from "@/hooks/notifications/Chat/useNotifications";
import { Notification } from "@/services/api/Notifications/type";
import { handleError } from "@/utils/errorHandler";
import { throttle } from "@/utils/throttle";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

interface NotificationListProps {
  setShowNotificationList: (show: boolean) => void;
  className?: string;
}

const NotificationList = ({
  setShowNotificationList,
  className = "",
}: NotificationListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // 標記通知為已讀
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();

  // 獲取通知列表
  const {
    data: notificationsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useGetNotifications({
    page: 1,
    limit: 10,
  });

  // 使用節流的滾動處理函數
  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const container = scrollContainerRef.current;
        if (!container || !hasNextPage || isFetchingNextPage) return;

        // 獲取容器滾動位置、容器高度、容器總高度
        const { scrollTop, clientHeight, scrollHeight } = container;
        // 設定滾動閾值
        const threshold = 0.8;
        // 剩餘空間
        const remainingSpace = scrollHeight - scrollTop - clientHeight;
        // 計算滾動閾值
        const scrollThreshold = clientHeight * threshold;

        if (remainingSpace <= scrollThreshold) {
          fetchNextPage();
        }
      }, 200), // 200ms 的節流延遲
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // 清理時要記得取消節流函數
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  // 獲取通知列表
  const notificationList =
    notificationsData?.pages.flatMap((page) => page.notifications) || [];

  // 加載中
  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="p-4 border-b">
          <h3 className="font-medium">{t("notifications")}</h3>
        </div>
        <div className="p-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="mb-4">
              <Skeleton height={20} className="mb-2" />
              <Skeleton height={15} width={100} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 沒有通知
  if (notificationList.length === 0) {
    return <div className="p-4">{t("noNotifications")}</div>;
  }

  // 點擊通知
  const handleNotificationClick = async (notification: Notification) => {
    setShowNotificationList(false);
    console.log(notification)
    if(!notification.read){ 
      // 標記通知為已讀
      try {
        markNotificationAsRead(notification.id);
      } catch (error) {
        handleError(error, "標記通知為已讀失敗");
      }
    }
    navigate(`/profile/${notification.sender.id}`);
  };

  return (
    <div className={`   w-full ${className}`}>
      <div className="p-4 border-b">
        <h3 className="font-medium">{t("notifications")}</h3>
      </div>

      <div
        ref={scrollContainerRef}
        className="custom-scrollbar overflow-y-auto max-h-[400px]"
      >
        {notificationList.map((notification) => (
          <button
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`
             w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b
           `}
          >
            <div className="flex gap-2 text-sm">
              <div className="relative">
                <img
                  src={notification.sender.avatar}
                  alt={notification.sender.username}
                  className="w-12 h-12 rounded-full"
                />
                {!notification.read && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                )}
              </div>
              <div className="w-fit">
                <p
                  className={`text-start ${
                    !notification.read ? "font-medium" : ""
                  }`}
                >
                  {notification.content}
                </p>
                <p className="text-gray-500 w-fit">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </button>
        ))}

        {isFetchingNextPage && (
          <div className="p-4 text-center text-gray-500">
            {t("common:loading")}...
          </div>
        )}

        {!hasNextPage && (
          <div className="p-4 text-center text-gray-500">
            {t("common:noMoreNotifications")}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
