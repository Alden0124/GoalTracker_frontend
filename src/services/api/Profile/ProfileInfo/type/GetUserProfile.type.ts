export type GetUserProfileResponse = {
  user: {
    id: string;
    username: string;
    avatar: string;
    location: string;
    occupation: string;
    education: string;
    thirdPartyAvatar: string;
    email: string;
    providers?: Array<"line" | "google">;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
  };
};

export type GetPublicUserProfileResponse = {
  user: {
    id: string;
    username: string;
    avatar: string;
    location: string;
    occupation: string;
    education: string;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
  };
};
