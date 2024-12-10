const ProfileInfoSkeleton = () => {
  return (
    <div className="w-full md:w-[40%] lg:w-[30%] bg-white rounded-lg p-6 space-y-4">
      {/* 頭像和名稱區域 */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* 按鈕區域 */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* 個人資訊區域 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* 追蹤數據區域 */}
      <div className="flex justify-around pt-4">
        <div className="text-center space-y-1">
          <div className="h-6 w-8 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <div className="h-6 w-8 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSkeleton;