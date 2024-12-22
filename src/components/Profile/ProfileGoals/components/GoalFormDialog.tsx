import Dialog from "@/components/common/Dialog";
import Input from "@/components/ui/input";
import { getGoalSchema, GoalFormData } from "@/schemas/goalSchema";
import { Goal as GoalType } from "@/services/api/Profile/ProfileGoals/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"; // 添加 useEffect
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface GoalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  goal?: GoalType;
  isPending: boolean;
}

const GoalFormDialog = ({
  isOpen,
  onClose,
  goal,
  onSubmit,
  isPending,
}: GoalFormDialogProps) => {
  // 判斷是否為編輯模式
  const isEditMode = !!goal;
  // 獲取語言
  const { t } = useTranslation(["profileGoals"]);


  // 格式化日期為輸入格式
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // 獲取當前日期
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // 在表單的defaultValues中添加initialStartDate
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GoalFormData & { initialStartDate: string }>({
    resolver: zodResolver(getGoalSchema()),
    defaultValues: {
      title: goal?.title,
      description: goal?.description,
      startDate: formatDateForInput(goal?.startDate || ""),
      endDate: formatDateForInput(goal?.endDate || ""),
      isPublic: goal?.isPublic,
      initialStartDate: formatDateForInput(goal?.startDate || ""),
    },
  });

  // 監聽 startDate 的變化
  const startDate = watch("startDate");

  // 保存初始的開始日期值
  useEffect(() => {
    if (isEditMode && goal) {
      const initialStartDate = formatDateForInput(goal.startDate);
      setValue("initialStartDate", initialStartDate);
    }
  }, [isEditMode, goal, setValue]);

  // 當 startDate 改變且與初始值不同時，清空 endDate
  useEffect(() => {
    const initialStartDate = watch("initialStartDate");
    if (isEditMode && startDate !== initialStartDate) {
      setValue("endDate", "");
    } else if (!isEditMode) {
      setValue("endDate", "");
    }
  }, [startDate, setValue, isEditMode, watch]);

  // 提交表單
  const handleFormSubmit = async (data: GoalFormData) => {
    console.log(data);
    onSubmit(data);
    onClose();
    if (!isEditMode) {
      reset();
    }
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode ? t("profileGoals:editGoal") : t("profileGoals:addGoal")
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <Input
          {...register("title")}
          label={t("profileGoals:goalTitle")}
          error={errors.title?.message}
        />
        <Input
          {...register("description")}
          label={t("profileGoals:goalDescription")}
          type="textarea"
          error={errors.description?.message}
        />
        <Input
          {...register("startDate")}
          label={t("profileGoals:goalStartDate")}
          type="date"
          min={getCurrentDate()} // 設置最小日期為當前日期
          error={errors.startDate?.message}
        />
        <Input
          {...register("endDate")}
          label={t("profileGoals:goalEndDate")}
          type="date"
          min={startDate || getCurrentDate()} // 設置最小日期為選擇的開始日期
          disabled={!startDate} // 如果沒有選擇開始日期，則禁用結束日期
          error={errors.endDate?.message}
        />
        <div className="flex flex-col items-start gap-2">
          <label className="text-black/70 dark:text-foreground-dark">
            {t("profileGoals:goalIsPublic")}
          </label>
          <input
            type="checkbox"
            defaultChecked={!isEditMode}
            {...register("isPublic")}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className={`${isPending ? "btn-loading" : "btn-secondary "}`}
          >
            {t("profileGoals:cancel")}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`${isPending ? "btn-loading" : "btn-primary"} `}
          >
            {isPending
              ? isEditMode
                ? t("profileGoals:updating")
                : t("profileGoals:adding")
              : isEditMode
              ? t("profileGoals:confirmUpdate")
              : t("profileGoals:confirmAdd")}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default GoalFormDialog;
