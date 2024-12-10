import Wrapper from "@/components/common/Wrapper";
import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { useGetFollowers, useGetFollowing } from "@/hooks/feed/useFeedQueries";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { memo, useState } from "react";
import FollowerList from "./FollowerList";

interface FollowingProps {
  className?: string;
}

const Following = memo(({ className }: FollowingProps) => {
  // 粉絲/追蹤中切換
  const [activeTab, setActiveTab] = useState("followers");
  // 使用者資料
  const userData = useAppSelector(selectUserProFile);

  // 粉絲列表
  const {
    data: followersList,
    isLoading: isLoadingFollowers,
    isFetching: isFetchingFollowers, // 添加 isFetching 狀態
  } = useGetFollowers(userData.id || "", activeTab === "followers");

  // 追蹤中列表
  const {
    data: followingList,
    isLoading: isLoadingFollowing,
    isFetching: isFetchingFollowing, // 添加 isFetching 狀態
  } = useGetFollowing(userData.id || "", activeTab === "following");

  return (
    <Wrapper className={`flex flex-col gap-4 ${className}`}>
      {/* Tab 切換 */}
      <div className="flex justify-around border-b dark:border-gray-700">
        <button
          className={`py-2 px-4 text-foreground-light dark:text-foreground-dark
            ${
              activeTab === "followers"
                ? "border-b-2 border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark"
                : "hover:text-primary-light dark:hover:text-primary-dark"
            }`}
          onClick={() => setActiveTab("followers")}
        >
          粉絲
        </button>
        <button
          className={`py-2 px-4 text-foreground-light dark:text-foreground-dark
            ${
              activeTab === "following"
                ? "border-b-2 border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark"
                : "hover:text-primary-light dark:hover:text-primary-dark"
            }`}
          onClick={() => setActiveTab("following")}
        >
          追蹤中
        </button>
      </div>

      {/* 根據選中的標籤顯示內容 */}
      <div className="text-foreground-light dark:text-foreground-dark">
        <FollowerList
          title={activeTab === "followers" ? "粉絲" : "追蹤中"}
          followers={
            activeTab === "followers"
              ? followersList || []
              : followingList || []
          }
          isLoading={
            activeTab === "followers" ? isLoadingFollowers : isLoadingFollowing
          }
          isFetching={
            activeTab === "followers" ? isFetchingFollowers : isFetchingFollowing
          }
        />
      </div>
    </Wrapper>
  );
});

Following.displayName = "Following";

export default Following;
