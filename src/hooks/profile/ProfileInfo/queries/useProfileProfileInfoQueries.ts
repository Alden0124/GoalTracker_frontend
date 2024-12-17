import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import { queryKeys as profileQueryKeys } from "@/hooks/profile/ProfileInfo/queries/queryKeys";
import { FETCH_USER_PROFILE } from "@/services/api/Profile/ProfileInfo";
import { setUserInfo } from "@/stores/slice/userReducer";
import { GET_COOKIE } from "@/utils/cookies";
import { handleError } from "@/utils/errorHandler";
import { notification } from "@/utils/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 獲取當前用戶資料
export const useCurrentUser = (options = {}) => {
  const dispatch = useAppDispatch();
  const token = GET_COOKIE();
  return useQuery({
    queryKey: profileQueryKeys.users.profile(),
    queryFn: async () => {
      const response = await FETCH_USER_PROFILE.GetUserProfile();

      if (response.user && token) {
        dispatch(
          setUserInfo({
            accessToken: token,
            userInfo: response.user,
          })
        );
      }

      return response;
    },
    enabled: !!token, // 只在有 token 時才執行查詢
    staleTime: 5 * 60 * 1000, // 5分鐘後數據過期
    ...options,
  });
};

// 公開用戶資料
export const usePublicUserProfile = (userId: string | null, options = {}) => {
  return useQuery({
    queryKey: profileQueryKeys.users.publicProfile(userId ? userId : null),
    queryFn: async () => {
      const response = await FETCH_USER_PROFILE.GetPublicUserProfile(userId);
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5分鐘後數據過期
    ...options,
  });
};

// 更新用戶資料
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      FETCH_USER_PROFILE.UpdateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.users.profile(),
      });
      console.log("更新成功");
      queryClient.invalidateQueries({
        queryKey: ["goals"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["feed"],
        exact: false,
      });
      notification.success({ title: "更新成功" });
    },
    onError: () => {
      notification.error({
        title: "更新失敗",
        text: "請稍後再試",
      });
    },
  });
};

// 追蹤用戶
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followUserId: string) =>
      FETCH_USER_PROFILE.FollowUser(followUserId),
    onSuccess: () => {
      // 取消所有用戶緩存資料
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: false,
      });
    },
    onError: (error: unknown) => {
      handleError(error, "追蹤失敗");
    },
  });
};

// 取消追蹤用戶
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  // 獲取當前用戶數據
  // const currentUserProfile = useAppSelector(selectUserProFile);
  return useMutation({
    mutationFn: (cancleFollowUserId: string) =>
      FETCH_USER_PROFILE.UnfollowUser(cancleFollowUserId),
    onSuccess: () => {
      // 取消所有用戶緩存資料
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: false,
      });
      notification.success({ title: "取消追蹤成功" });
    },
    onError: () => {
      notification.error({ title: "取消追蹤失敗", text: "請稍後再試" });
    },
  });
};

// 獲取粉絲列表，每次調用時都會重新獲取數據
export const useGetFollowers = (
  paramsUserId: string,
  isOpen: boolean,
  options = {}
) => {
  return useQuery({
    queryKey: profileQueryKeys.users.followers(paramsUserId),
    queryFn: async () => {
      const response = await FETCH_USER_PROFILE.GetFollowers(paramsUserId);
      return response.followers;
    },
    enabled: !!paramsUserId && isOpen,
    ...options,
  });
};

// 獲取追蹤者列表，每次調用時都會重新獲取數據
export const useGetFollowing = (
  paramsUserId: string,
  isOpen: boolean,
  options = {}
) => {
  return useQuery({
    queryKey: profileQueryKeys.users.following(paramsUserId),
    queryFn: async () => {
      const response = await FETCH_USER_PROFILE.GetFollowing(paramsUserId);
      return response.following;
    },
    enabled: !!paramsUserId && isOpen,
    ...options,
  });
};
