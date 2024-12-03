import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { GET_COOKIE } from "@/utils/cookies";
import { useParams } from "react-router-dom";
import {
  useCurrentUser,
  usePublicUserProfile,
} from "./queries/useProfileProfileInfoQueries";

// 統一處理 Profile 頁面的數據邏輯
export const useProfileData = () => {
  const { id: urlUserId } = useParams();
  const currentUserProfile = useAppSelector(selectUserProFile);
  const token = GET_COOKIE();

  // 判斷是否為當前用戶的個人頁面
  const isCurrentUser = urlUserId === currentUserProfile.id;

  // 獲取當前用戶數據
  const currentUserQuery = useCurrentUser({
    enabled: isCurrentUser && !!token && !!currentUserProfile?.id,
  });

  // 獲取其他用戶數據
  const otherUserQuery = usePublicUserProfile(urlUserId || "", {
    enabled: !isCurrentUser && !!urlUserId && !!token,
  });

  // 如果沒有 token，直接返回錯誤狀態
  if (!token) {
    return {
      isCurrentUser: false,
      isLoading: false,
      error: new Error("Unauthorized"),
      data: null,
      refetch: () => {},
      isFetching: false,
      isSuccess: false,
    };
  }

  return {
    isCurrentUser,
    isLoading: isCurrentUser
      ? currentUserQuery.isLoading
      : otherUserQuery.isLoading,
    error: isCurrentUser ? currentUserQuery.error : otherUserQuery.error,
    data: isCurrentUser ? currentUserQuery.data : otherUserQuery.data,
    refetch: isCurrentUser ? currentUserQuery.refetch : otherUserQuery.refetch,
    isFetching: isCurrentUser
      ? currentUserQuery.isFetching
      : otherUserQuery.isFetching,
    isSuccess: isCurrentUser
      ? currentUserQuery.isSuccess
      : otherUserQuery.isSuccess,
  };
};
