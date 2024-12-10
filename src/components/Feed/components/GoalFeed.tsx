import GoalList from "@/components/Feed/components/GoalList";
import GoalSkeleton from "@/components/Profile/ProfileGoals/skeleton/GoalSkeleton";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useGetFeed } from "@/hooks/feed/useFeedQueries";
import { DEFAULT_GOALS_PARAMS } from "@/services/api/Profile/ProfileGoals/constants";
import { memo, useMemo } from "react";
import { FiClipboard } from "react-icons/fi";

interface GoalFeedProps {
  searchKeyword: string;
}

const GoalFeed = memo(({ searchKeyword }: GoalFeedProps) => {
  const {
    data: userGoalsPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetFeed({
    ...DEFAULT_GOALS_PARAMS,
    q: searchKeyword,
  });

  // 合併所有頁面的目標數據
  const goals = useMemo(() => {
    return userGoalsPages?.pages.flatMap((page) => page.goals) ?? [];
  }, [userGoalsPages]);

  // 使用無限捲動 hook
  useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 0.5,
    throttleDelay: 500,
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <GoalSkeleton />
      ) : goals.length > 0 ? (
        <>
          <GoalList goals={goals} />
          {isFetchingNextPage && (
            <div className="py-4">
              <GoalSkeleton />
            </div>
          )}
          {!hasNextPage && goals.length > 0 && (
            <div className="text-center py-4 text-gray-500">已經到底了 ~</div>
          )}
        </>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center py-8 text-gray-500 md:min-h-[550px]">
          <FiClipboard className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium">
            {searchKeyword ? "沒有找到相關目標" : "目前還沒有設定任何目標"}
          </p>
        </div>
      )}
    </div>
  );
});

GoalFeed.displayName = "GoalFeed";

export default GoalFeed;
