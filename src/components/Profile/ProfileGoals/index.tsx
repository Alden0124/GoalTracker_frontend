import Wrapper from "@/components/common/Wrapper";
import GoalFormDialog from "@/components/Profile/ProfileGoals/components/GoalFormDialog";
import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import {
  useCreateGoal,
  useGetUserGoals,
} from "@/hooks/profile/ProfileGoals/queries/useProfileGoalsQueries";
import { GoalFormData } from "@/schemas/goalSchema";
import { DEFAULT_GOALS_PARAMS } from "@/services/api/Profile/ProfileGoals/constants";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import GoalList from "./components/GoalList";
import GoalSkeleton from "./skeleton/GoalSkeleton";



const ProfileGoals = () => {
  // 獲取 url 中的用戶 id
  const { id: urlUserId } = useParams();
  // 獲取當前用戶數據
  const currentUserProfile = useAppSelector(selectUserProFile);
  // 判斷是否為當前用戶的個人頁面
  const isCurrentUser = urlUserId === currentUserProfile.id;
  // 控制新增目標對話框的顯示
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  
  // 新增目標
  const { mutate: createGoal, isPending: isCreatePending } = useCreateGoal(
    currentUserProfile.id
  );

  // 使用 infinite query 獲取目標列表
  const {
    data: userGoalsPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetUserGoals(urlUserId || "", {
    ...DEFAULT_GOALS_PARAMS,
    limit: 2,
  });

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

  // 處理新增目標
  const handleSubmit = (data: GoalFormData) => {
    createGoal(data);
    setShowGoalDialog(false);
  };

  return (
    <Wrapper className="!shadow-none md:w-[60%] lg:w-[70%] dark:bg-transparent !p-0 border-none md:!min-h-[600px]">
      <div className="h-full flex flex-col gap-4">
        {/* 標題區域 */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-foreground-light dark:text-foreground-dark font-bold">
            目標列表
          </h2>
          {isCurrentUser && (
            <button
              className="btn-primary"
              onClick={() => setShowGoalDialog(true)}
            >
              新增目標
            </button>
          )}
        </div>

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
              {isCurrentUser && (
                <p className="mt-2">
                  點擊上方「新增目標」按鈕開始設定你的目標吧！
                </p>
              )}
            </div>
          )}
        </div>

        {/* 新增目標對話框 */}
        <GoalFormDialog
          isOpen={showGoalDialog}
          isPending={isCreatePending}
          onClose={() => setShowGoalDialog(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </Wrapper>
  );
};

export default ProfileGoals;
