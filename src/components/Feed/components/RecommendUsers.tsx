import LazyImage from "@/components/common/LazyImage";
import Wrapper from "@/components/common/Wrapper";
import FollowListDialogSkeleton from "@/components/Profile/ProfileInfo/skeleton/FollowListDialogSkeleton";
import {
  useFollowUser,
  useGetRecommendUsers,
} from "@/hooks/feed/useFeedQueries";
import { DEFAULT_RECOMMENDED_USERS_QUERY } from "@/services/api/Feed/constants";
import { Link } from "react-router-dom";

const RecommendUsers = () => {
  // 獲取推薦用戶數據
  const {
    data: recommendedUsers,
    isLoading,
    isFetching,
  } = useGetRecommendUsers(DEFAULT_RECOMMENDED_USERS_QUERY);

  // 關注用戶
  const followUserMutation = useFollowUser();

  // 處理關注按鈕點擊
  const handleFollow = (userId: string) => {
    followUserMutation.mutate(userId);
  };

  return (
    <Wrapper>
      <>
        <h3 className="text-lg font-medium mb-4 dark:text-gray-100">
          推薦用戶
        </h3>
        <div className="space-y-4">
          {isLoading || isFetching ? (
            <FollowListDialogSkeleton />
          ) : (
            recommendedUsers?.users.map((recommendedUser) => (
              <div
                key={recommendedUser._id}
                className="flex items-center justify-between"
              >
                <Link
                  to={`/profile/${recommendedUser._id}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <LazyImage
                      src={
                        recommendedUser.avatar || "/images/default-avatar.png"
                      }
                      alt={recommendedUser.username}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      fallbackSrc="/images/default-avatar.png"
                    />
                  </div>
                  <div>
                    <p className="font-medium dark:text-gray-100">
                      {recommendedUser.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {recommendedUser.goalCount} 個進行中的目標
                    </p>
                  </div>
                </Link>
                {!recommendedUser.isFollowing && (
                  <button
                    className="px-4 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-100"
                    onClick={() => handleFollow(recommendedUser._id)}
                  >
                    關注
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </>
    </Wrapper>
  );
};

export default RecommendUsers;
