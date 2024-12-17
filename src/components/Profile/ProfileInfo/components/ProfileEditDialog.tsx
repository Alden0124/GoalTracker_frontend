import Dialog from "@/components/common/Dialog";
import ProfileAvatarUpload from "@/components/Profile/ProfileInfo/components/ProfileAvatarUpload";
import Input from "@/components/ui/Input";
import { useUpdateProfile } from "@/hooks/profile/ProfileInfo/queries/useProfileProfileInfoQueries";
import {
  getProfileSchema,
  type ProfileFormData,
} from "@/schemas/profileSchema";
import { GetUserProfileResponse } from "@/services/api/Profile/ProfileInfo/type/GetUserProfile.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(["profile"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(getProfileSchema()),
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

        // console.log("Avatar file details:", {
        //   name: avatarFile.name,
        //   type: avatarFile.type,
        //   size: avatarFile.size,
        //   lastModified: avatarFile.lastModified,
        // });
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
    <Dialog
      isOpen={isOpen}
      onClose={updateProfile.isPending ? () => {} : onClose}
      title={t("profileInfo:editProfile")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 頭像上傳區域 */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <ProfileAvatarUpload
            currentAvatar={initialData.avatar}
            onFileSelect={setAvatarFile}
          />
          <span className="text-sm text-gray-500">
            {t("profileInfo:clickToChangeAvatar")}
          </span>
        </div>

        <Input
          {...register("username")}
          label={t("profileInfo:username")}
          error={errors.username?.message}
        />

        <Input
          {...register("location")}
          label={t("profileInfo:location")}
          error={errors.location?.message}
        />

        <Input
          {...register("occupation")}
          label={t("profileInfo:occupation")}
          error={errors.occupation?.message}
        />

        <Input
          {...register("education")}
          label={t("profileInfo:education")}
          error={errors.education?.message}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={updateProfile.isPending}
            className={` ${
              updateProfile.isPending ? "btn-loading" : "btn-secondary"
            }`}
          >
            {t("profileInfo:cancel")}
          </button>
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className={` ${
              updateProfile.isPending ? "btn-loading" : "btn-primary"
            }`}
          >
            {updateProfile.isPending
              ? t("profileInfo:updating")
              : t("profileInfo:save")}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default ProfileEditDialog;
