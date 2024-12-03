// 更新個人資料
export interface UpdateProfileRequest {
  username: string;
  email: string;
}

// 粉絲/追蹤列表
export interface FollowList {
  id: string;
  username: string;
  avatar: string;
}
