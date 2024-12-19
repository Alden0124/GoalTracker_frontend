import Skeleton from "react-loading-skeleton";

 const UserListSkeleton = () => {
  return (
     <div className=" w-full h-[calc(100vh-64px)] md:h-auto md:w-80 bg-background-light dark:bg-background-dark border-r border-light-border dark:border-dark-border p-4">
        {/* 標題 skeleton */}
        <div className="mb-4">
          <Skeleton width={100} height={24} />
        </div>

        {/* 聊天列表 skeleton */}
        {Array(2).fill(0).map((_, index) => (
          <div key={index} className="p-3">
            <div className="flex items-center space-x-3">
              {/* 頭像 skeleton */}
              <Skeleton circle width={40} height={40} />
              
              <div className="flex-1">
                {/* 用戶名和時間 */}
                <div className="flex justify-between items-center">
                  <Skeleton width={80} />
                  <Skeleton width={60} />
                </div>
                
                {/* 最後訊息 */}
                <div className="mt-2">
                  <Skeleton width="80%" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default UserListSkeleton