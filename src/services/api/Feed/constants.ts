import {
  GetFeedQuery,
  GetRecommendedUsersQuery,
  SearchGoalAutocompleteQuery,
} from "./type";

// 獲取動態預設參數
export const DEFAULT_FEED_PARAMS: GetFeedQuery = {
  page: 1,
  limit: 10,
  status: "",
  q: "",
};

// 獲取推薦用戶預設參數
export const DEFAULT_RECOMMENDED_USERS_QUERY: GetRecommendedUsersQuery = {
  page: 1,
  limit: 10,
  excludeFollowing: false,
};

// 獲取自動完成預設參數
export const DEFAULT_SEARCH_GOAL_AUTOCOMPLETE_QUERY: SearchGoalAutocompleteQuery =
  {
    q: "",
    limit: 10,
    type: "all",
  };
