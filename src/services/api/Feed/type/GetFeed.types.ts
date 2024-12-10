import { Goal, GoalStatus } from "../../Profile/ProfileGoals/type";

// 獲取動態響應
export interface GetFeedResponse {
  goals: Goal[];
  pagination: {
    current: number;
    size: number;
    total: number;
  };
  message: string;
}

// 獲取動態參數
export interface GetFeedQuery {
  page: number;
  limit: number;
  status?: GoalStatus | string;
  q?: string;
}
