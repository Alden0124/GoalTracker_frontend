import ProfileAvatar from "@/components/Profile/ProfileInfo/components/ProfileAvatar";
import FollowListDialogSkeleton from "@/components/Profile/ProfileInfo/skeleton/FollowListDialogSkeleton";
import { FollowList } from "@/components/Profile/ProfileInfo/type";
import { useSelectUser } from "@/hooks/Chat/useSelectUser";
import { useTranslation } from "react-i18next";
import { IoPersonOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

interface FollowerListProps {
  followers: FollowList[];
  isLoading: boolean;
  title: string;
  isFetching: boolean;
}

const FollowerList = ({
  followers,
  isLoading,
  isFetching,
}: FollowerListProps) => {
  // 多語系
  const { t } = useTranslation(["feed"]);

  // 選擇聊天對象
  const { handleSelectUser } = useSelectUser();

  return (
    <>
      {isLoading || isFetching ? (
        <FollowListDialogSkeleton />
      ) : followers.length > 0 ? (
        <div className="space-y-4">
          {followers.map((follower) => (
            <div
              key={follower.id}
              className="flex items-center justify-between"
            >
              <Link
                to={`/profile/${follower.id}`}
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
              </Link>
              <button
                onClick={() =>
                  handleSelectUser(
                    follower.id,
                    follower.username,
                    follower.avatar,
                    1
                  )
                }
                className="text-blue-500 hover:text-blue-600 break-keep"
              >
                {t("feed:sendMessage")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <IoPersonOutline className="text-4xl mb-2" />
          <p>{t("feed:noFollowers")}</p>
        </div>
      )}
    </>
  );
};

export default FollowerList;
