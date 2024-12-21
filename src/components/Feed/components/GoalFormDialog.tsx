import Dialog from "@/components/common/Dialog";
import Input from "@/components/ui/input";
import { getGoalSchema, GoalFormData } from "@/schemas/goalSchema";
import { Goal as GoalType } from "@/services/api/Profile/ProfileGoals/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface GoalFormDialogProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  goal?: GoalType; // 如果有傳入 goal 代表是編輯模式
}

const GoalFormDialog = ({
  isOpen,
  isPending,
  onClose,
  onSubmit,
  goal,
}: GoalFormDialogProps) => {
  const isEditMode = !!goal;

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(getGoalSchema()),
    defaultValues: {
      title: goal?.title,
      description: goal?.description,
      startDate: formatDateForInput(goal?.startDate || ""),
      endDate: formatDateForInput(goal?.endDate || ""),
      isPublic: goal?.isPublic,
    },
  });

  const handleFormSubmit = async (data: GoalFormData) => {
    onSubmit(data);
    if (!isEditMode) {
      reset(); // 只在新增模式下重置表單
    }
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "編輯目標" : "新增目標"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <Input
          {...register("title")}
          label="目標標題"
          error={errors.title?.message}
        />
        <Input
          {...register("description")}
          label="目標描述"
          type="textarea"
          error={errors.description?.message}
        />
        <Input
          {...register("startDate")}
          label="開始日期"
          type="date"
          error={errors.startDate?.message}
        />
        <Input
          {...register("endDate")}
          label="預計完成日期"
          type="date"
          error={errors.endDate?.message}
        />
        <div className="flex flex-col items-start gap-2">
          <label className="text-black/70 dark:text-foreground-dark">
            公開
          </label>
          <input
            type="checkbox"
            defaultChecked={!isEditMode}
            {...register("isPublic")}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            取消
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending
              ? isEditMode
                ? "更新中..."
                : "新增中..."
              : isEditMode
              ? "確認更新"
              : "確認新增"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default GoalFormDialog;
