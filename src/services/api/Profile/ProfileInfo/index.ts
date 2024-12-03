import axiosInstance from "@/services/axiosInstance";
import { UserProfileResponse } from "./type";

export const FETCH_USER_PROFILE = {
  // 用戶資料管理
  GetUserProfile: (): Promise<UserProfileResponse> =>
    axiosInstance.get(`/users/profile`),

  // 公開用戶資料
  GetPublicUserProfile: (userId: string): Promise<UserProfileResponse> =>
    axiosInstance.get(`/users/profile/${userId}`),

  // 更新用戶資料
  UpdateProfile: async (formData: FormData) => {
    const { data } = await axiosInstance.patch<UserProfileResponse>(
      "/users/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // 追蹤相關
  FollowUser: (userId: string): Promise<UserProfileResponse> =>
    axiosInstance.post(`/users/follow/${userId}`),

  // 取消追蹤
  UnfollowUser: (userId: string): Promise<UserProfileResponse> =>
    axiosInstance.delete(`/users/follow/${userId}`),

  // 取消粉絲
  UnfollowFollower: (
    userId: string,
    followerId: string
  ): Promise<UserProfileResponse> =>
    axiosInstance.delete(`/users/followers/${userId}/${followerId}`),

  // 粉絲列表
  GetFollowers: (userId: string): Promise<UserProfileResponse> =>
    axiosInstance.get(`/users/followers/${userId}`),

  // 追蹤者列表
  GetFollowing: (userId: string): Promise<UserProfileResponse> =>
    axiosInstance.get(`/users/following/${userId}`),
};
