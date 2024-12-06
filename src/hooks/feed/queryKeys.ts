import { GetFeedQuery, SearchGoalAutocompleteQuery } from "@/services/api/Feed/type";
import { GetCommentsQuery } from "@/services/api/Profile/ProfileGoals/type";

export const queryKeys = {
  feed: {
    GetFeed: (query: GetFeedQuery) => ["feed", "list", query],
    reacquireFeed: () => ["feed", "list"],
    searchAutocomplete: (query: SearchGoalAutocompleteQuery) => 
      ['feed', 'search', 'autocomplete', query] as const,
  },
  users: {
    followers: () => ["users", "followers"],
    following: () => ["users", "following"],
    recommend: () => ["users", "recommend"],
  },
  goals: {
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
};
