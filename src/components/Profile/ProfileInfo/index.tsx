import Wrapper from "@/components/common/Wrapper";
import ProfileAvatar from "@/components/Profile/ProfileInfo/components/ProfileAvatar";
import ProfileEditDialog from "@/components/Profile/ProfileInfo/components/ProfileEditDialog";
import ProfileInfoSkeleton from '@/components/Profile/ProfileInfo/skeleton/ProfileInfoSkeleton';
import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import {
  useFollowUser,
  useUnfollowUser,
} from "@/hooks/profile/ProfileInfo/queries/useProfileProfileInfoQueries";
import { useProfileData } from "@/hooks/profile/ProfileInfo/useProfile";
import { socketService } from "@/services/api/SocketService";
import { openChat } from "@/stores/slice/chatReducer";
import { GET_COOKIE } from "@/utils/cookies";
import { Fragment, useState } from "react";
import { IoLocationOutline, IoSchoolOutline } from "react-icons/io5";
import { MdOutlineWork } from "react-icons/md";
import { useParams } from "react-router-dom";
import FollowListDialog from "./components/FollowListDialog";
import renderInfoItem from "./components/renderInfoItem";

type DialogType = "followers" | "following" | null;

const ProfileInfo = () => {
  const dispatch = useAppDispatch();
  // 獲取用戶ID
  const { id: paramsUserId } = useParams();
  // 獲取token
  const token = GET_COOKIE();
  // 獲取用戶數據
  const { isCurrentUser, isLoading, error, data: userData } = useProfileData();
  // 控制編輯個人資料對話框的顯示
  const [showEditDialog, setShowEditDialog] = useState(false);
  // 控制粉絲/追蹤列表彈窗的顯示
  const [dialogType, setDialogType] = useState<DialogType>(null);
  // 追蹤用戶
  const { mutate: followUser } = useFollowUser();
  // 取消追蹤用戶
  const { mutate: unfollowUser } = useUnfollowUser();

  if (isLoading) return <ProfileInfoSkeleton />;

  if (error || !userData?.user) return null;

  // 獲取用戶數據
  const { avatar, username, occupation, location, education } = userData.user;

  // 判斷是否可以編輯
  const canEdit = isCurrentUser && Boolean(token);

  // 追蹤/取消追蹤用戶
  const handleFollowUser = (paramsUserId: string) => {
    if (userData.user.isFollowing) {
      unfollowUser(paramsUserId);
    } else {
      followUser(paramsUserId);
    }
  };

  // 處理開啟聊天
  const handleOpenChat = () => {
    if (userData?.user) {
      const token = GET_COOKIE();
      if (token) {
        // 建立 WebSocket 連線
        socketService.connect(token);

        // 開啟聊天視窗
        dispatch(
          openChat({
            recipientId: userData.user.id,
            recipientName: userData.user.username,
          })
        );
      }
    }
  };

  // 用戶資訊項目
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

  return (
    <div className="custom-scrollbar w-full md:h-[calc(100vh-64px)] md:overflow-y-auto  md:w-[40%] lg:w-[30%] md:sticky md:top-[64px] ">
      <Wrapper className=" py-[30px] md:px-[10px] md:h-fit lg:px-[30px] z-0">
        {/* 頭像和用戶名區域 */}
        <div className="flex flex-col items-center pb-6 ">
          <ProfileAvatar avatar={avatar} size={120} />
          <h2 className="mt-4 text-xl font-bold text-foreground-light dark:text-foreground-dark">
            {username}
          </h2>
        </div>

        {/* 操作按鈕區域 */}
        {!isCurrentUser && (
          <div className="flex gap-2 py-4">
            <button
              onClick={() => handleFollowUser(paramsUserId || "")}
              className="flex-1 btn-primary"
            >
              {userData.user.isFollowing ? "取消追蹤" : "關注"}
            </button>
            <button onClick={handleOpenChat} className="flex-1 btn-secondary">
              發送訊息
            </button>
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
              {userData.user.followersCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              粉絲數
            </div>
          </div>
          <div
            className="text-center cursor-pointer hover:opacity-80"
            onClick={() => {
              setDialogType("following");
            }}
          >
            <div className="text-[30px] font-bold text-foreground-light dark:text-foreground-dark">
              {userData.user.followingCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              追蹤中
            </div>
          </div>
        </div>

        {/* 粉絲/追蹤列表彈窗 */}
        <FollowListDialog
          isOpen={dialogType !== null}
          isCurrentUser={isCurrentUser}
          onClose={() => setDialogType(null)}
          title={dialogType || ""}
        />

        {/* 編輯個人資料彈窗 */}
        {canEdit && (
          <ProfileEditDialog
            isOpen={showEditDialog}
            onClose={() => setShowEditDialog(false)}
            initialData={userData.user}
          />
        )}
      </Wrapper>
    </div>
  );
};

export default ProfileInfo;
