import Dialog from "@/components/common/Dialog";
import { useUnfollowUser } from "@/hooks/profile/ProfileInfo/queries/useProfileProfileInfoQueries";
import { FETCH_USER_PROFILE } from "@/services/api/Profile/ProfileInfo";
import { handleError } from "@/utils/errorHandler";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import FollowListDialogSkeleton from "../skeleton/FollowListDialogSkeleton";
import { FollowList } from "../type";
import ProfileAvatar from "./ProfileAvatar";

interface FollowListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  followers: FollowList[];
  isLoading: boolean;
  isRefetching: boolean;
  isCurrentUser: boolean;
}

const FollowListDialog = ({
  isOpen,
  onClose,
  title,
  followers,
  isLoading,
  isRefetching,
  isCurrentUser,
}: FollowListDialogProps) => {
  const navigate = useNavigate();
  const { mutate: unfollowUser } = useUnfollowUser();
  const { id } = useParams();

  // 取消追蹤
  const handleUnfollow = async (followerId: string) => {
    if (title === "粉絲") {
      try {
        await FETCH_USER_PROFILE.UnfollowFollower(id || "", followerId);
      } catch (error) {
        handleError(error, "取消粉絲失敗");
      } finally {
        onClose();
      }
    }

    if (title === "追蹤中") {
      unfollowUser(followerId);
      onClose();
    }
  };

  // 跳轉到用戶頁面
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      {isLoading || isRefetching ? (
        <FollowListDialogSkeleton />
      ) : followers.length > 0 ? (
        <div className="space-y-4">
          {followers.map((follower) => (
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
                {title === "粉絲" && isCurrentUser && "取消粉絲"}
                {title === "追蹤中" && "取消追蹤"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <IoPersonOutline className="text-4xl mb-2" />
          <p>目前還沒有{title}</p>
        </div>
      )}
    </Dialog>
  );
};

export default FollowListDialog;
