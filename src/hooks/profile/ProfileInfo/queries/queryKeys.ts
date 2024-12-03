export const queryKeys = {
  users: {
    all: ["users"] as const,
    profile: () => [...queryKeys.users.all, "profile"] as const,
    publicProfile: (userId: string) =>
      [...queryKeys.users.all, "publicProfile", userId] as const,
    followers: (userId: string) =>
      [...queryKeys.users.all, "followers", userId] as const,
    following: (userId: string) =>
      [...queryKeys.users.all, "following", userId] as const,
  },
};
