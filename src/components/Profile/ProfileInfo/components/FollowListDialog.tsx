import Dialog from "@/components/common/Dialog";
import { useGetFollowers, useGetFollowing, useUnfollowUser } from "@/hooks/profile/ProfileInfo/queries/useProfileProfileInfoQueries";
import { useTranslation } from "react-i18next";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import FollowListDialogSkeleton from "../skeleton/FollowListDialogSkeleton";
import ProfileAvatar from "./ProfileAvatar";

interface FollowListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isCurrentUser: boolean;
}

const FollowListDialog = ({
  isOpen,
  onClose,
  title,
  isCurrentUser,
}: FollowListDialogProps) => {
  // 導航
  const navigate = useNavigate();
  // 取消追蹤
  const { mutate: unfollowUser } = useUnfollowUser();
  // 獲取用戶ID
  const { id: paramsUserId } = useParams();
  // 獲取語言
  const { t } = useTranslation(["profileInfo"]);

  // 獲取粉絲列表
  const {
    data: followersList,
    isLoading: isLoadingFollowers,
    isRefetching: isRefetchingFollowers,
  } = useGetFollowers(paramsUserId || "", title === "followers");

  // 獲取追蹤列表
  const {
    data: followingList,
    isLoading: isLoadingFollowing,
    isRefetching: isRefetchingFollowing,
  } = useGetFollowing(paramsUserId || "", title === "following");

  // 取消追蹤
  const handleUnfollow = async (followerId: string) => {
    if (title === "following") {
      unfollowUser(followerId);
      onClose();
    }
  };

  // 跳轉到用戶頁面
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  // 粉絲/追蹤列表
  const followers = title === "followers" ? followersList : followingList;
  // 粉絲/追蹤列表是否正在加載
  const isLoading =
    title === "followers" ? isLoadingFollowers : isLoadingFollowing;
  // 粉絲/追蹤列表是否正在重新加載
  const isRefetching =
    title === "followers" ? isRefetchingFollowers : isRefetchingFollowing;
  // 如果粉絲/追蹤列表不存在，則返回null
  if (!followers) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        title === "followers"
          ? t("profileInfo:followers")
          : t("profileInfo:following")
      }
    >
      {isLoading || isRefetching ? (
        <FollowListDialogSkeleton />
      ) : followers?.length > 0 ? (
        <div className="space-y-4">
          {followers?.map((follower) => (
            <div
              key={follower.id}
              className="flex items-center justify-between"
            >
              <button
                onClick={() => handleNavigate(`/profile/${follower.id}`)}
                className="w-full flex items-center gap-3"
              >
                {follower.avatar ? (
                  <img
                    src={follower.avatar || "/default-avatar.png"}
                    alt={follower.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <ProfileAvatar avatar={follower.avatar} size={40} />
                )}
                <span className="font-medium text-foreground-light dark:text-foreground-dark">
                  {follower.username}
                </span>
              </button>
              <button
                onClick={() => handleUnfollow(follower.id)}
                className="text-blue-500 hover:text-blue-600 break-keep"
              >
                {title === "following" &&
                  isCurrentUser &&
                  t("profileInfo:unfollow")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <IoPersonOutline className="text-4xl mb-2" />
          <p>
            {t("profileInfo:noFollowers")}
            {title === "followers"
              ? t("profileInfo:followers")
              : t("profileInfo:following")}
          </p>
        </div>
      )}
    </Dialog>
  );
};

export default FollowListDialog;
