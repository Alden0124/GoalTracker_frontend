import {
  GetFeedQuery,
  GetFeedResponse,
  GetRecommendedUsersQuery,
  RecommendedUserResponse,
  SearchGoalAutocompleteQuery,
  SearchGoalAutocompleteResponse,
} from "@/services/api/Feed/type";
import axiosInstance from "@/services/axiosInstance";

export const FETCH_FEED = {
  // 獲取動態
  GetFeed: (query: GetFeedQuery): Promise<GetFeedResponse> =>
    axiosInstance.get("/feeds/getFeeds", { params: query }),

  // 獲取推薦用戶
  GetRecommendedUsers: (
    query: GetRecommendedUsersQuery
  ): Promise<RecommendedUserResponse> =>
    axiosInstance.get("/feeds/recommended-users", { params: query }),

  // 動態自動完成
  SearchGoalAutocomplete: (
    query: SearchGoalAutocompleteQuery
  ): Promise<SearchGoalAutocompleteResponse> =>
    axiosInstance.get("/feeds/search/autocomplete", { params: query }),
};
