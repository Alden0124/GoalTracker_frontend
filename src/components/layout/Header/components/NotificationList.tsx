import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useGetNotifications } from "@/hooks/notifications/Chat/useNotifications";
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

  // 使用自定義的無限捲動 hook
  useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 0.8, // 距離底部 80% 時加載
    enabled: true,
  });

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

  const handleNotificationClick = (notificationId: string) => {
    console.log(notificationId);
    setShowNotificationList(false);
    navigate(`/profile/${notificationId}`);
  };

  return (
    <div className={`   w-full ${className}`}>
      <div className="p-4 border-b">
        <h3 className="font-medium">{t("notifications")}</h3>
      </div>

      <div className="custom-scrollbar overflow-y-auto max-h-[400px]">
        {notificationList.map((notification) => (
          <button
            key={notification._id}
            onClick={() => handleNotificationClick(notification.sender._id)}
            className=" w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b"
          >
            <div className="flex gap-2 text-sm">
              <img
                src={notification.sender.avatar}
                alt={notification.sender.username}
                className="w-12 h-12 rounded-full"
              />
              <div className="w-fit">
                <p className="text-start">{notification.content}</p>
                <p className="text-gray-500 w-fit">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </button>
        ))}

        {isFetchingNextPage && (
          <div className="p-4 text-center text-gray-500">{t("loading")}...</div>
        )}

        {!hasNextPage && (
          <div className="p-4 text-center text-gray-500">
            {t("noMoreNotifications")}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
