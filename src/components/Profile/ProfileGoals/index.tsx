import Wrapper from "@/components/common/Wrapper";
import GoalFormDialog from "@/components/Profile/ProfileGoals/components/GoalFormDialog";
import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { useCreateGoal } from "@/hooks/profile/ProfileGoals/queries/useProfileGoalsQueries";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import GoalList from "./components/GoalList";

const ProfileGoals = () => {
  // 獲取 url 中的用戶 id
  const { id: urlUserId } = useParams();
  // 獲取當前用戶數據
  const currentUserProfile = useAppSelector(selectUserProFile);
  // 判斷是否為當前用戶的個人頁面
  const isCurrentUser = urlUserId === currentUserProfile.id;
  // 控制新增目標對話框的顯示
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  // 獲取語言
  const { t } = useTranslation(["profileGoals"]);

  // 新增目標
  const { mutate: createGoal, isPending: isCreatePending } = useCreateGoal(
    currentUserProfile.id
  );

  return (
    <Wrapper className="!shadow-none md:w-[60%] lg:w-[70%] dark:bg-transparent !p-0 border-none md:!min-h-[600px]">
      <div className="h-full flex flex-col gap-4">
        {/* 標題區域 */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-foreground-light dark:text-foreground-dark font-bold">
            {t("profileGoals:goalList")}
          </h2>
          {isCurrentUser && (
            <button
              className="btn-primary"
              onClick={() => setShowGoalDialog(true)}
            >
              {t("profileGoals:addGoal")}
            </button>
          )}
        </div>

        {/* 目標列表區域 */}
        <GoalList />

        {/* 新增目標對話框 */}
        <GoalFormDialog
          isOpen={showGoalDialog}
          onClose={() => setShowGoalDialog(false)}
          onSubmit={createGoal}
          isPending={isCreatePending}
        />
      </div>
    </Wrapper>
  );
};

export default ProfileGoals;
