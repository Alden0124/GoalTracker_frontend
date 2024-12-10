import Dialog from "@/components/common/Dialog";
import ProfileAvatarUpload from "@/components/Profile/ProfileInfo/components/ProfileAvatarUpload";
import Input from "@/components/ui/Input";
import { useUpdateProfile } from "@/hooks/profile/ProfileInfo/queries/useProfileProfileInfoQueries";
import { profileSchema, type ProfileFormData } from "@/schemas/profileSchema";
import { GetUserProfileResponse } from "@/services/api/Profile/ProfileInfo/type/GetUserProfile.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Partial<GetUserProfileResponse["user"]>;
}

const ProfileEditDialog = ({
  isOpen,
  onClose,
  initialData,
}: ProfileEditDialogProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData.username || "",
      location: initialData.location || "",
      occupation: initialData.occupation || "",
      education: initialData.education || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();

      formData.append("username", data.username);
      formData.append("location", data.location || "");
      formData.append("occupation", data.occupation || "");
      formData.append("education", data.education || "");

      if (avatarFile) {
        formData.append("avatar", avatarFile);

        console.log("Avatar file details:", {
          name: avatarFile.name,
          type: avatarFile.type,
          size: avatarFile.size,
          lastModified: avatarFile.lastModified,
        });
      }

      for (const [key, value] of formData.entries()) {
        console.log(`FormData entry - ${key}:`, value);
      }

      await updateProfile.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error("上傳失敗:", error);
      if (error instanceof Error) {
        console.error("錯誤詳情:", error.message);
      }
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="編輯個人資料">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 頭像上傳區域 */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <ProfileAvatarUpload
            currentAvatar={initialData.avatar}
            onFileSelect={setAvatarFile}
          />
          <span className="text-sm text-gray-500">點擊更換頭像</span>
        </div>

        <Input
          {...register("username")}
          label="姓名"
          error={errors.username?.message}
        />

        <Input
          {...register("location")}
          label="居住地"
          error={errors.location?.message}
        />

        <Input
          {...register("occupation")}
          label="職稱"
          error={errors.occupation?.message}
        />

        <Input
          {...register("education")}
          label="學歷"
          error={errors.education?.message}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={updateProfile.isPending}
          >
            取消
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "更新中..." : "保存更改"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default ProfileEditDialog;
