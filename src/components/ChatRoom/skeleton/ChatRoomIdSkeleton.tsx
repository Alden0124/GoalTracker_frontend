import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChatRoomIdSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-light-border dark:border-dark-border flex items-center px-6 bg-background-light dark:bg-background-dark">
        <div className="flex items-center space-x-3">
          <Skeleton circle width={32} height={32} />
          <Skeleton width={100} height={20} />
        </div>
      </div>

      {/* Message List Skeleton */}
      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-end">
          <Skeleton width={120} height={36} className="rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton width={150} height={36} className="rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton width={100} height={36} className="rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton width={130} height={36} className="rounded-lg" />
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="border-t border-gray-20 p-4 bg-background-light dark:bg-background-dark">
        <Skeleton height={40} className="rounded-full" />
      </div>
    </div>
  );
};

export default ChatRoomIdSkeleton;
