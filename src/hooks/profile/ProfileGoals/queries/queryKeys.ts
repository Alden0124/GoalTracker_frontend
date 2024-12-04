import { GetCommentsQuery } from "@/services/api/Profile/ProfileGoals/type";

export const queryKeys = {
  goals: {
    getUserGoals: (userId?: string) =>
      userId ? ["goals", "list", userId] : ["goals", "list"],
    getComments: (goalId: string, query: GetCommentsQuery) => [
      "goals",
      "comments",
      goalId,
      query,
    ],
    getReplies: (goalId: string, query: GetCommentsQuery) => [
      "goals",
      "replies",
      goalId,
      query,
    ],
  },
} as const;
