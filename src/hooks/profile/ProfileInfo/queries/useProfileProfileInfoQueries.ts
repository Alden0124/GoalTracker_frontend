import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import { queryKeys as FeedQueryKeys } from "@/hooks/feed/queryKeys";
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
export const usePublicUserProfile = (userId: string, options = {}) => {
  return useQuery({
    queryKey: profileQueryKeys.users.publicProfile(userId),
    queryFn: async () => {
      const response = await FETCH_USER_PROFILE.GetPublicUserProfile(userId);
      return response;
    },
    enabled: !!userId,
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
    mutationFn: (userId: string) => FETCH_USER_PROFILE.FollowUser(userId),
    onSuccess: (_, userId) => {
      // 更新當前用戶資料
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.users.profile(),
      });
      // 更新目標用戶的公開資料
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.users.publicProfile(userId),
      });
      // 更新追蹤者列表
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.users.following(),
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

  return useMutation({
    mutationFn: (userId: string) => FETCH_USER_PROFILE.UnfollowUser(userId),
    onSuccess: (_, userId) => {
      // 更新當前用戶資料
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.users.profile() });
      // 更新目標用戶的公開資料
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.users.publicProfile(userId),
      });
      notification.success({ title: "取消追蹤成功" });
    },
    onError: () => {
      notification.error({ title: "取消追蹤失敗", text: "請稍後再試" });
    },
  });
};

/**
 * 獲取粉絲列表，每次調用時都會重新獲取數據
 */
export const useGetFollowers = (
  userId: string,
  isOpen: boolean,
  options = {}
) => {
  return useQuery({
    queryKey: [profileQueryKeys.users.followers(userId), isOpen],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await FETCH_USER_PROFILE.GetFollowers(userId);
      return response.followers;
    },
    enabled: !!userId && isOpen,
    retry: 0,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
    ...options,
  });
};

/**
 * 獲取追蹤者列表，每次調用時都會重新獲取數據
 */
export const useGetFollowing = (
  userId: string,
  isOpen: boolean,
  options = {}
) => {
  return useQuery({
    queryKey: [profileQueryKeys.users.following(userId), isOpen],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await FETCH_USER_PROFILE.GetFollowing(userId);
      return response.following;
    },
    enabled: !!userId && isOpen,
    retry: 0,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
    ...options,
  });
};
