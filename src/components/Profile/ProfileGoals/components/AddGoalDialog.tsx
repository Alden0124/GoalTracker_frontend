import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema } from "@/schemas/goalSchema";
import type { GoalFormData } from "@/schemas/goalSchema";
import Input from "@/components/ui/Input";
import Dialog from "@/components/common/Dialog";


interface AddGoalDialogProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
}

const AddGoalDialog = ({ isOpen, isPending, onClose, onSubmit }: AddGoalDialogProps) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  });

  // 提交表單
  const handleFormSubmit = async (data: GoalFormData) => {
    console.log('提交的表單數據:', data);
    onSubmit(data);
    reset();
    onClose();
  };



  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="新增目標">
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
          <label
            className="text-black/70 dark:text-foreground-dark"
            htmlFor="isPublic"
          >
            公開
          </label>
          <input
            type="checkbox"
            defaultChecked={true}
            {...register("isPublic")}
          />
          {errors.isPublic && (
            <p className="text-red-500 text-sm mt-1">
              {errors.isPublic?.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            取消
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "新增中..." : "確認新增"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddGoalDialog;
