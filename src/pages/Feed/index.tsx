import Wrapper from "@/components/common/Wrapper";
import GoalList from "@/components/Feed/components/GoalList";
import GoalSkeleton from "@/components/Profile/ProfileGoals/skeleton/GoalSkeleton";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useGetFeed } from "@/hooks/feed/useFeedQueries";
import { DEFAULT_GOALS_PARAMS } from "@/services/api/Profile/ProfileGoals/constants";
import { useMemo, useState } from "react";

const Feed = () => {
  // 新增狀態來管理當前選中的標籤
  const [activeTab, setActiveTab] = useState("followers");

  // 使用 infinite query 獲取目標列表
  const {
    data: userGoalsPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetFeed(DEFAULT_GOALS_PARAMS);

  // // 使用無限捲動 hook
  useInfiniteScroll({
    hasNextPage: !!hasNextPage, // 是否還有下一頁
    isFetchingNextPage, // 是否正在加載下一頁
    fetchNextPage, // 加載下一頁
    threshold: 0.5, // 可選：自定義閾值
    throttleDelay: 500, // 可選：自定義節流延遲
  });

  // 合併所有頁面的目標數據
  const goals = useMemo(() => {
    return userGoalsPages?.pages.flatMap((page) => page.goals) ?? [];
  }, [userGoalsPages]);

  return (
    <div className="flex w-[90%] flex-col  items-center py-[20px] px-[10px] gap-[30px] max-w-[1440px] md:flex-row m-[0_auto] md:items-start">
      <div className={`flex flex-col w-[30%] gap-4 sticky top-[64px]`}>
        {/* 粉絲、追蹤者、推薦用戶 */}
        <Wrapper className="flex flex-col gap-4">
          {/* Tab 切換 */}
          <div className="flex justify-around border-b">
            <button
              className={`py-2 px-4 ${
                activeTab === "followers" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("followers")}
            >
              粉絲
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "following" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("following")}
            >
              追蹤中
            </button>
          </div>
          {/* 根據選中的標籤顯示內容 */}
          <div>
            {activeTab === "followers" ? (
              <div>粉絲列表</div>
            ) : (
              <div>追蹤中列表</div>
            )}
          </div>
        </Wrapper>

        {/* 推薦用戶 */}
        <Wrapper>推薦用戶</Wrapper>
      </div>

      {/* 目標列表區域 */}
      <div className="w-[80%] flex  flex-col gap-4">
        {/* 目標列表區域 */}
        <div className="space-y-4">
          {isLoading ? (
            <GoalSkeleton />
          ) : goals.length > 0 ? (
            <>
              <GoalList goals={goals} />
              {/* 加載更多的提示 */}
              {isFetchingNextPage && (
                <div className="py-4">
                  <GoalSkeleton />
                </div>
              )}
              {/* 全部加載完成的提示 */}
              {!hasNextPage && goals.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                  已經到底了 ~
                </div>
              )}
            </>
          ) : (
            // 空狀態
            <div className="min-h-[300px] flex flex-col items-center justify-center py-8 text-gray-500 md:min-h-[550px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-lg font-medium">目前還沒有設定任何目標</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
