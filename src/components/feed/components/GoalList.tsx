import Goal from "@/components/Profile/ProfileGoals/components/Goal";
import GoalSkeleton from "@/components/Profile/ProfileGoals/skeleton/GoalSkeleton";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useGetFeed } from "@/hooks/feed/useFeedQueries";
import { DEFAULT_GOALS_PARAMS } from "@/services/api/Profile/ProfileGoals/constants";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FiClipboard } from "react-icons/fi";

const GoalList = ({ searchKeyword }: { searchKeyword: string }) => {
  // 多語系
  const { t } = useTranslation(["profileGoals"]);

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
    <div className="flex flex-col gap-[20px] ">
      {isLoading ? (
        <GoalSkeleton />
      ) : goals.length > 0 ? (
        <>
          {goals.map((goal) => (
            <Fragment key={goal._id}>
              <Goal goal={goal} />
            </Fragment>
          ))}
          {isFetchingNextPage && (
            <div className="py-4">
              <GoalSkeleton />
            </div>
          )}
          {!hasNextPage && goals.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              {t("profileGoals:goalListEnd")}
            </div>
          )}
        </>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center py-8 text-gray-500 md:min-h-[550px]">
          <FiClipboard className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium">
            {searchKeyword
              ? t("profileGoals:goalListEmpty")
              : t("profileGoals:goalListEmptyTip")}
          </p>
        </div>
      )}
    </div>
  );
};

GoalList.displayName = "GoalList";

export default GoalList;
