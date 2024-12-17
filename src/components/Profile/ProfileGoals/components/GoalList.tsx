import GoalSkeleton from "@/components/Feed/skeleton/GoalSkeleton";
import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useGetUserGoals } from "@/hooks/profile/ProfileGoals/queries/useProfileGoalsQueries";
import { DEFAULT_GOALS_PARAMS } from "@/services/api/Profile/ProfileGoals/constants";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Goal from "./Goal";

const GoalList = () => {
  // 使用 i18n 翻譯
  const { t } = useTranslation(["profileGoals"]);
  // 獲取 url 中的用戶 id
  const { id: urlUserId } = useParams();
  // 獲取當前用戶數據
  const currentUserProfile = useAppSelector(selectUserProFile);
  // 判斷是否為當前用戶的個人頁面
  const isCurrentUser = urlUserId === currentUserProfile.id;

  // 使用 infinite query 獲取目標列表
  const {
    data: userGoalsPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetUserGoals(urlUserId || "", {
    ...DEFAULT_GOALS_PARAMS,
    limit: 10,
  });

  // // 使用無限捲動 hook
  useInfiniteScroll({
    hasNextPage: !!hasNextPage, // 是否還有下一頁
    isFetchingNextPage, // 是否正在加載下一頁
    fetchNextPage, // 加載下一頁
    threshold: 0.3, // 可選：自定義閾值
    throttleDelay: 500, // 可選：自定義節流延遲
  });

  // 合併所有頁面的目標數據
  const goals = useMemo(() => {
    return userGoalsPages?.pages.flatMap((page) => page.goals) ?? [];
  }, [userGoalsPages]);

  return (
    <div className="flex flex-col gap-[20px] ">
      {isLoading ? (
        <GoalSkeleton />
      ) : goals.length > 0 ? (
        goals.map((goal) => (
          <Fragment key={goal._id}>
            <Goal goal={goal} />
          </Fragment>
        ))
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
          <p className="text-lg font-medium">
            {t("profileGoals:goalListEmpty")}
          </p>
          {isCurrentUser && (
            <p className="mt-2">{t("profileGoals:goalListEmptyTip")}</p>
          )}
        </div>
      )}

      {/* 加載更多的提示 */}
      {isFetchingNextPage && (
        <div className="py-4">
          <GoalSkeleton />
        </div>
      )}
      {/* 全部加載完成的提示 */}
      {!hasNextPage && goals.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          {t("profileGoals:goalListEnd")}
        </div>
      )}
    </div>
  );
};

export default GoalList;
