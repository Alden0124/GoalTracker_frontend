// 推薦用戶
export interface RecommendedUserResponse {
  users: RecommendedUser[];
  pagination: {
    current: number;
    size: number;
    total: number;
  };
  message: string;
}

export interface RecommendedUser {
  avatar: string;
  followerCount: number;
  followingCount: number;
  goalCount: number;
  score: number;
  username: string;
  _id: string;
  isFollowing: boolean;
}


export interface GetRecommendedUsersQuery {
  page: number;
  limit: number;
  excludeFollowing?: boolean;
}