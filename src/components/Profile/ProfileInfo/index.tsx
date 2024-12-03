import Wrapper from "@/components/common/Wrapper";
import ProfileAvatar from "@/components/Profile/ProfileInfo/components/ProfileAvatar";
import ProfileEditDialog from "@/components/Profile/ProfileInfo/components/ProfileEditDialog";
import {
  useFollowUser,
  useGetFollowers,
  useGetFollowing,
  useUnfollowUser,
} from "@/hooks/profile/ProfileInfo/queries/useProfileProfileInfoQueries";
import { UserProfileResponse } from "@/services/api/Profile/ProfileInfo/type";
import { GET_COOKIE } from "@/utils/cookies";
import { Fragment, useState } from "react";
import { IoLocationOutline, IoSchoolOutline } from "react-icons/io5";
import { MdOutlineWork } from "react-icons/md";
import { useParams } from "react-router-dom";
import FollowListDialog from "./components/FollowListDialog";
import renderInfoItem from "./components/renderInfoItem";

interface ProfileInfoProps {
  isCurrentUser: boolean;
  userData: UserProfileResponse["user"];
}

type DialogType = "followers" | "following" | null;

const ProfileInfo = ({ isCurrentUser, userData }: ProfileInfoProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const { id: userId } = useParams();
  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();
  const {
    data: followersList,
    isLoading: isLoadingFollowers,
    isRefetching: isRefetchingFollowers,
  } = useGetFollowers(userId || "", dialogType === "followers");
  const {
    data: followingList,
    isLoading: isLoadingFollowing,
    isRefetching: isRefetchingFollowing,
  } = useGetFollowing(userId || "", dialogType === "following");
  const { avatar, username, occupation, location, education } = userData;
  const token = GET_COOKIE();
  const canEdit = isCurrentUser && Boolean(token);

  const userInfoItems = [
    {
      id: 1,
      icon: <IoLocationOutline className="text-xl" />,
      value: location,
      placeholder: "新增居住地",
    },
    {
      id: 2,
      icon: <MdOutlineWork className="text-xl" />,
      value: occupation,
      placeholder: "新增職稱",
    },
    {
      id: 3,
      icon: <IoSchoolOutline className="text-xl" />,
      value: education,
      placeholder: "新增學歷",
    },
  ];

  // 追蹤/取消追蹤用戶
  const handleFollowUser = (userId: string) => {
    if (userData.isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <Wrapper className="md:px-[50px] md:w-[35%] md:min-h-[600px] md:sticky md:top-[64px] z-0">
      {/* 頭像和用戶名區域 */}
      <div className="flex flex-col items-center pb-6">
        <ProfileAvatar avatar={avatar} size={120} />
        <h2 className="mt-4 text-xl font-bold text-foreground-light dark:text-foreground-dark">
          {username}
        </h2>
      </div>

      {/* 操作按鈕區域 */}
      {!isCurrentUser && (
        <div className="flex gap-2 py-4">
          <button
            onClick={() => handleFollowUser(userId || "")}
            className="flex-1 btn-primary"
          >
            {userData.isFollowing ? "取消追蹤" : "關注"}
          </button>
          <button className="flex-1 btn-secondary">發送訊息</button>
        </div>
      )}

      {/* 編輯按鈕 */}
      {canEdit && (
        <div className="flex justify-center">
          <button
            className="w-[200px] btn-secondary"
            onClick={() => setShowEditDialog(true)}
          >
            編輯個人資料
          </button>
        </div>
      )}

      {/* 用戶資訊區域 */}
      <div className="py-10 space-y-5 border-b border-gray-200 dark:border-gray-600">
        {userInfoItems.map((item) => (
          <Fragment key={item.id}>
            {renderInfoItem(
              item.icon,
              item.value,
              item.placeholder,
              canEdit,
              setShowEditDialog
            )}
          </Fragment>
        ))}
      </div>

      {/* 統計數據區域 */}
      <div className="flex justify-around py-4">
        <div
          className="text-center cursor-pointer hover:opacity-80"
          onClick={() => {
            setDialogType("followers");
          }}
        >
          <div className="text-[30px] font-bold text-foreground-light dark:text-foreground-dark">
            {userData.followersCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">粉絲數</div>
        </div>
        <div
          className="text-center cursor-pointer hover:opacity-80"
          onClick={() => {
            setDialogType("following");
          }}
        >
          <div className="text-[30px] font-bold text-foreground-light dark:text-foreground-dark">
            {userData.followingCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">追蹤中</div>
        </div>
      </div>

      {/* 粉絲/追蹤列表彈窗 */}
      <FollowListDialog
        isOpen={dialogType !== null}
        isCurrentUser={isCurrentUser}
        onClose={() => setDialogType(null)}
        title={dialogType === "followers" ? "粉絲" : "追蹤中"}
        isLoading={
          dialogType === "followers" ? isLoadingFollowers : isLoadingFollowing
        }
        isRefetching={
          dialogType === "followers"
            ? isRefetchingFollowers
            : isRefetchingFollowing
        }
        followers={
          dialogType === "followers" ? followersList || [] : followingList || []
        }
      />

      {/* 編輯個人資料彈窗 */}
      {canEdit && (
        <ProfileEditDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          initialData={userData}
        />
      )}
    </Wrapper>
  );
};

export default ProfileInfo;
