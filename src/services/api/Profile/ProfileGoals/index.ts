import { GoalFormData } from "@/schemas/goalSchema";
import axiosInstance from "@/services/axiosInstance";
import {
  Comment,
  CreateCommentParams,
  GetCommentsQuery,
  GetCommentsResponse,
  GetUserGoalsParams,
  GetUserGoalsResponse,
} from "./type";

export const FETCH_GOAL = {
  // 創建目標
  CreateGoal: (formData: GoalFormData) =>
    axiosInstance.post(`/goals/createGoal`, formData),

  // 獲取指定用戶的目標列表
  GetUserGoals: (
    userId: string,
    params: GetUserGoalsParams
  ): Promise<GetUserGoalsResponse> =>
    axiosInstance.get(`/goals/user/${userId}`, {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        sort: params.sort,
      },
    }),

  // 更新目標
  UpdateGoal: (goalId: string, formData: GoalFormData) =>
    axiosInstance.put(`/goals/updateGoal/${goalId}`, formData),

  // 點讚目標
  LikeGoal: (goalId: string, isLiked: boolean) =>
    axiosInstance.post(`/goals/likeGoal/${goalId}`, { isLiked }),

  // 點讚留言或回覆
  LikeComment: (commentId: string, isLiked: boolean) =>
    axiosInstance.post(`/goals/likeComment/${commentId}`, { isLiked }),

  // 刪除目標
  DeleteGoal: (goalId: string) =>
    axiosInstance.delete(`/goals/deleteGoal/${goalId}`),

  // 創建留言或回覆
  CreateComment: (goalId: string, data: CreateCommentParams) =>
    axiosInstance.post(`/goals/createComment/${goalId}`, data),

  // 獲取留言或回覆列表
  GetComments: (
    goalId: string,
    query: GetCommentsQuery
  ): Promise<GetCommentsResponse> =>
    axiosInstance.get(`/goals/getComments/${goalId}`, { params: query }),

  // 更新留言或回覆
  UpdateComment: (
    commentId: string,
    content: string
  ): Promise<{ comment: Comment; message: string }> =>
    axiosInstance.put(`/goals/updateComment/${commentId}`, { content }),

  // 刪除留言或回覆
  DeleteComment: (commentId: string) =>
    axiosInstance.delete(`/goals/deleteComment/${commentId}`),
};
