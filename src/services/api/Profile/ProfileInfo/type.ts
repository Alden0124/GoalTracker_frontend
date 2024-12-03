import { FollowList } from "@/components/Profile/ProfileInfo/type";
export interface UserProfileResponse {
  followers: FollowList[];
  following: FollowList[];
  message: string;
  user: {
    id: string;
    username?: string;
    email?: string;
    avatar?: string;
    location?: string;
    occupation?: string;
    education?: string;
    isEmailVerified: boolean;
    providers?: Array<"google" | "line">;
    isFollowing?: boolean;
    followersCount?: number;
    followingCount?: number;
  };
}
