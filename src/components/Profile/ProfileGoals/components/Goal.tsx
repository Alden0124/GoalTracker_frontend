import Wrapper from "@/components/common/Wrapper";
import { useAppSelector } from "@/hooks/common/useAppReduxs";
import {
  useDeleteGoal,
  useLikeGoal,
  useUpdateGoal,
} from "@/hooks/profile/ProfileGoals/queries/useProfileGoalsQueries";
import { GoalFormData } from "@/schemas/goalSchema";
import {
  GoalStatus,
  Goal as GoalType,
} from "@/services/api/Profile/ProfileGoals/type";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { formatDate } from "@/utils/dateFormat";
import { debounce } from "@/utils/debounce";
import { notification } from "@/utils/notification";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BsCalendarCheck,
  BsCalendarPlus,
  BsCheckCircle,
  BsPlayCircle,
  BsThreeDots,
  BsXCircle,
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import CommentAvater from "../../ProfileInfo/components/CommentAvater";
import GoalDetailsDialog from "./GoalDetailsDialog";
import GoalFormDialog from "./GoalFormDialog";

interface GoalProps {
  goal: GoalType;
}

// 將 getStatusConfig 移到組件外部
const getStatusConfig = (status: GoalStatus) => {
  switch (status) {
    case GoalStatus.IN_PROGRESS:
      return {
        icon: <BsPlayCircle className="text-blue-500" />,
        textColor: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
      };
    case GoalStatus.COMPLETED:
      return {
        icon: <BsCheckCircle className="text-green-500" />,
        textColor: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
      };
    case GoalStatus.ABANDONED:
      return {
        icon: <BsXCircle className="text-red-500" />,
        textColor: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
      };
  }
};

const Goal = ({ goal }: GoalProps) => {
  // 獲取語言
  const { t } = useTranslation(["profileGoals"]);
  // 使用者資料
  const userInfo = useAppSelector(selectUserProFile);
  // 是否為當前用戶
  const isCurrentUser = userInfo.id === goal.user._id;
  // 目前選擇的Tab
  const [activeTab, setActiveTab] = useState<"progress" | "comment">(
    "progress"
  );
  // 編輯目標Dialog
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  // 詳細資訊Dialog
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  // 下拉選單
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // 對此目標的點讚總數
  const [localLikeCount, setLocalLikeCount] = useState(goal.likeCount);
  // 此使用者是否已對此目標點讚
  const [isLiked, setIsLiked] = useState(goal.isLiked);
  // 刪除目標query
  const { mutate: deleteGoal } = useDeleteGoal(userInfo);
  // 更新目標query
  const { mutate: updateGoal, isPending: isUpdatePending } =
    useUpdateGoal(userInfo);
  // 點讚目標query
  const { mutate: likeGoal } = useLikeGoal(userInfo);
  // 狀態配置
  const statusConfig = getStatusConfig(goal.status);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  // 刪除目標
  const handleDeleteGoal = async () => {
    const isConfirmed = await notification.confirm({
      text: "刪除後將無法恢復！",
    });

    if (isConfirmed) {
      deleteGoal(goal._id);
      setShowMenu(false);
    }
  };

  // 更新目標狀態
  const handleUpdateStatus = async (status?: GoalStatus) => {
    updateGoal({
      goalId: goal._id,
      data: { ...goal, status: status || goal.status },
    });
    // 處理完成狀態
    setShowMenu(false);
  };

  // 更新目標
  const handleUpdateGoal = async (data: GoalFormData) => {
    updateGoal({
      goalId: goal._id,
      data,
    });
    setShowUpdateDialog(false);
    setShowMenu(false);
  };

  // 確保 debounce 函數只創建一次
  const debouncedLike = useMemo(
    () =>
      debounce((goalId: string, isLiked: boolean) => {
        likeGoal({ goalId, isLiked });
      }, 3000),
    [likeGoal]
  );

  // 點讚目標
  const handleLikeGoal = (goalId: string) => {
    const newIsLiked = !isLiked;

    // 批量更新狀態
    setIsLiked(newIsLiked);
    setLocalLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    // 執行新的 debounce
    debouncedLike(goalId, newIsLiked);
  };

  return (
    <>
      <Wrapper
        key={goal._id}
        className="bg-white dark:bg-background-dark rounded-lg p-5 space-y-4 border"
      >
        {/* 新增的使用者資訊 */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
              <CommentAvater
                userId={goal.user._id}
                avatar={goal.user.avatar}
                size={40}
              />
            <div>
              <h4 className="text-sm font-medium text-foreground-light dark:text-foreground-dark">
                {goal.user.username}
              </h4>
              <span className="text-xs text-gray-500">
                {formatDate(goal.createdAt)}
              </span>
            </div>
          </div>
          {isCurrentUser && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <BsThreeDots className="text-xl text-gray-500" />
              </button>

              {/* 下拉選單 */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground-light dark:text-foreground-dark"
                      onClick={() => handleUpdateStatus(GoalStatus.COMPLETED)}
                    >
                      {t("profileGoals:markAsCompleted")}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground-light dark:text-foreground-dark"
                      onClick={() => handleUpdateStatus(GoalStatus.ABANDONED)}
                    >
                      {t("profileGoals:markAsUncompleted")}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground-light dark:text-foreground-dark"
                      onClick={() => handleUpdateStatus(GoalStatus.IN_PROGRESS)}
                    >
                      {t("profileGoals:markAsInProgress")}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground-light dark:text-foreground-dark"
                      onClick={() => setShowUpdateDialog(true)}
                    >
                      {t("profileGoals:editGoal")}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                      onClick={handleDeleteGoal}
                    >
                      {t("profileGoals:deleteGoal")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 標題和描述 */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-foreground-light dark:text-foreground-dark">
              {goal.title}
            </h3>
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.textColor} ${statusConfig.bgColor}`}
            >
              {statusConfig.icon}
              {goal.status}
            </span>
          </div>
          <p className="text-sm text-gray-500">{goal.description}</p>
          <div className="flex items-center gap-1 mt-1">
            <BsCalendarPlus className="text-gray-500 text-sm" />
            <span className="text-sm text-gray-500">
              {t("profileGoals:goalStartDate")}：{formatDate(goal.startDate)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <BsCalendarCheck className="text-gray-500 text-sm" />
            <span className="text-sm text-gray-500">
              {t("profileGoals:goalEndDate")}：{formatDate(goal.endDate)}
            </span>
          </div>
        </div>

        {/* 在非 Dialog 時只顯示 Tab */}
        <div className="flex bg-gray-50 dark:bg-gray-800 rounded-lg">
          {/* 進度記錄 */}
          <button
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === "progress"
                ? "bg-blue-500 text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("progress")}
          >
            {t("profileGoals:goalProgress")}
          </button>
          {/* 留言 */}
          <button
            className={`flex-1 py-2 text-center rounded-lg ${
              activeTab === "comment"
                ? "bg-blue-500 text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("comment")}
          >
            {t("profileGoals:goalComment")}
          </button>
        </div>

        {/* 底部操作欄 */}
        <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
          <div className="flex gap-6">
            <button
              onClick={() => handleLikeGoal(goal._id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
            >
              <FiHeart
                className={`text-lg ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "fill-none hover:text-red-500"
                }`}
              />
              <span>{localLikeCount}</span>
            </button>
            <button
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
              onClick={() => setShowDetailsDialog(true)}
            >
              <FaRegComment className="text-lg" />
              <span>
                {activeTab === "comment"
                  ? goal.commentCount
                  : goal.progressCommentCount}
              </span>
            </button>
          </div>
        </div>
      </Wrapper>

      {/* 更新目標 */}
      <GoalFormDialog
        isOpen={showUpdateDialog}
        isPending={isUpdatePending}
        onClose={() => setShowUpdateDialog(false)}
        onSubmit={handleUpdateGoal}
        goal={goal}
      />

      {/* 詳細資訊 */}
      {showDetailsDialog && (
        <GoalDetailsDialog
          goalId={goal._id}
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          activeTab={activeTab}
          isCurrentUser={isCurrentUser}
        />
      )}
    </>
  );
};

export default Goal;
