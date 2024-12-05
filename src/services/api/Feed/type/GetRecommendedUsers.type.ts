// 推薦用戶
export interface RecommendedUserResponse {
  _id: string;
  username: string;
  avatar: string;
  followerCount: number;
  followingCount: number;
  goalCount: number;
  score: number;
  pagination: {
    current: number;
    size: number;
    total: number;
  };
  message: string;
}

export interface GetRecommendedUsersQuery {
  page: number;
  limit: number;
  excludeFollowing?: boolean;
}
