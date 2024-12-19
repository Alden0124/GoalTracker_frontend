export const queryKeys = {
  users: {
    all: ["users"] as const,
    profile: () => [...queryKeys.users.all, "profile"] as const,
    publicProfile: (userId: string | null) =>
      [...queryKeys.users.all, "publicProfile", userId] as const,
    followers: (targetUserId: string) =>
      [...queryKeys.users.all, "followers", targetUserId] as const,
    following: (targetUserId: string) =>
      [...queryKeys.users.all, "following", targetUserId] as const,
  },
};
