import { queryKeys as ProfileQueryKeys } from "@/hooks/profile/ProfileInfo/queries/queryKeys";
import { GoalFormData } from "@/schemas/goalSchema";
import { FETCH_FEED } from "@/services/api/Feed";
import {
  GetFeedQuery,
  GetRecommendedUsersQuery,
} from "@/services/api/Feed/type";
import { FETCH_GOAL } from "@/services/api/Profile/ProfileGoals";
import {
  Comment,
  CreateCommentParams,
  GetCommentsQuery,
  GetCommentsResponse,
  GoalStatus,
} from "@/services/api/Profile/ProfileGoals/type";
import { FETCH_USER_PROFILE } from "@/services/api/Profile/ProfileInfo";
import { UserInfoType } from "@/stores/slice/userReducer";
import { handleError } from "@/utils/errorHandler";
import { notification } from "@/utils/notification";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys as FeedQueryKeys } from "./queryKeys";

interface UpdateGoalData extends GoalFormData {
  status?: GoalStatus;
}

// 獲取Feed
export const useGetFeed = (query: GetFeedQuery) => {
  return useInfiniteQuery({
    queryKey: FeedQueryKeys.feed.GetFeed(query),
    queryFn: ({ pageParam = 1 }) =>
      FETCH_FEED.GetFeed({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // 從 lastPage 中獲取分頁信息
      const { current, total, size } = lastPage.pagination;
      const totalPages = Math.ceil(total / size);

      // 如果還有下一頁，返回下一頁的頁碼，否則返回 undefined
      return current < totalPages ? current + 1 : undefined;
    },
  });
};

// 更新目標
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: UpdateGoalData }) =>
      FETCH_GOAL.UpdateGoal(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.feed.reacquireFeed(),
      });
      notification.success({ title: "目標更新成功" });
    },
  });
};

// 刪除目標
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) => FETCH_GOAL.DeleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.feed.reacquireFeed(),
      });
      notification.success({ title: "目標刪除成功" });
    },
    onError: (error: unknown) => {
      handleError(error, "刪除目標失敗");
    },
  });
};

// 點讚目標
export const useLikeGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, isLiked }: { goalId: string; isLiked: boolean }) =>
      FETCH_GOAL.LikeGoal(goalId, isLiked),

    onSuccess: () => {
      // 重新獲取最新資料，確保與後端同步
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.feed.reacquireFeed(),
      });
    },
  });
};

// 創建留言或回覆
export const useCreateComment = (
  goalId: string,
  userInfo: UserInfoType,
  query: GetCommentsQuery
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCommentParams) =>
      FETCH_GOAL.CreateComment(goalId, params),

    onMutate: async (newComment) => {
      // 取消正在進行的查詢
      if (newComment.parentId) {
        await queryClient.cancelQueries({
          queryKey: FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: newComment.parentId,
          }),
        });
      } else {
        await queryClient.cancelQueries({
          queryKey: FeedQueryKeys.goals.getComments(goalId, query),
        });
      }

      // 獲取之前的數據
      const previousData = newComment.parentId
        ? queryClient.getQueryData(
            FeedQueryKeys.goals.getReplies(goalId, {
              ...query,
              parentId: newComment.parentId,
            })
          )
        : queryClient.getQueryData(
            FeedQueryKeys.goals.getComments(goalId, query)
          );

      // 樂觀更新
      const optimisticComment = {
        _id: "temp-id-" + Date.now(),
        content: newComment.content,
        createdAt: new Date().toISOString(),
        user: {
          _id: userInfo.id,
          avatar: userInfo.avatar,
        },
        parentId: newComment.parentId || null,
        replyCount: 0,
        likeCount: 0,
        isLiked: false,
      };

      // 更新對應的查詢數據
      if (newComment.parentId) {
        queryClient.setQueryData(
          FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: newComment.parentId,
          }),
          (old: GetCommentsResponse) => {
            console.log("old", old);
            return {
              ...old,
              comments: [...(old?.comments || []), optimisticComment],
            };
          }
        );
      } else {
        queryClient.setQueryData(
          FeedQueryKeys.goals.getComments(goalId, query),
          (old: GetCommentsResponse) => ({
            ...old,
            comments: [...(old?.comments || []), optimisticComment],
          })
        );
      }

      return { previousData };
    },

    onError: (_err, newComment, context) => {
      // 發生錯誤時回滾到之前的狀態
      if (newComment.parentId) {
        queryClient.setQueryData(
          FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: newComment.parentId,
          }),
          context?.previousData
        );
      } else {
        queryClient.setQueryData(
          FeedQueryKeys.goals.getComments(goalId, query),
          context?.previousData
        );
      }
      // 顯示錯誤消息
      notification.error({
        title: "評論失敗",
        text: "请稍后再试",
      });
    },

    onSettled: (_, __, variables) => {
      console.log("variables", variables);
      console.log("userInfo", userInfo);
      // 重新獲取最新數據
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.goals.getComments(goalId, query),
      });
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.feed.reacquireFeed(),
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: variables.parentId,
          }),
        });
      }
    },
  });
};

// 獲取留言列表
export const useGetComments = (goalId: string, query: GetCommentsQuery) => {
  return useQuery({
    queryKey: FeedQueryKeys.goals.getComments(goalId, query),
    queryFn: () => FETCH_GOAL.GetComments(goalId, query),
    enabled: !!goalId,
    staleTime: 0, // 立即將數據標記為過期
  });
};

// 獲取回覆列表
export const useGetReplies = (
  goalId: string,
  query: GetCommentsQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: FeedQueryKeys.goals.getReplies(goalId, query),
    queryFn: () => FETCH_GOAL.GetComments(goalId, query),
    enabled: !!goalId && (options?.enabled ?? false), // 默認為 false，除非明確啟用
    staleTime: 0, // 立即將數據標記為過期
  });
};

// 更新留言或回覆
export const useUpdateComment = (goalId: string, query: GetCommentsQuery) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => FETCH_GOAL.UpdateComment(commentId, content),
    onSuccess: (data: { comment: Comment; message: string }) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.goals.getComments(goalId, query),
      });
      if (data.comment?.parentId._id) {
        queryClient.invalidateQueries({
          queryKey: FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: data.comment.parentId._id,
          }),
        });
      }
    },
    onError: (error: unknown) => {
      handleError(error, "留言或回覆更新失敗");
    },
  });
};

// 刪除留言或回覆
export const useDeleteComment = (goalId: string, query: GetCommentsQuery) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; parentId?: string }) =>
      FETCH_GOAL.DeleteComment(commentId),
    onSuccess: (_, variables) => {
      // 重新獲取用戶的目標列表
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.feed.reacquireFeed(),
      });

      // 重新獲取主留言列表
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.goals.getComments(goalId, query),
      });

      // 如果是回覆，重新獲取特定父留言的回覆列表
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: variables.parentId,
          }),
        });
      }
    },
    onError: (error: unknown) => {
      handleError(error, "留言或回覆刪除失敗");
    },
  });
};

// 點讚留言或回覆
export const useLikeComment = (
  goalId: string,
  query: GetCommentsQuery,
  comment: Comment
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      isLiked,
    }: {
      commentId: string;
      isLiked: boolean;
    }) => FETCH_GOAL.LikeComment(commentId, isLiked),

    onMutate: async ({ commentId, isLiked }) => {
      // 取消正在進行的查詢
      if (comment.parentId?._id) {
        await queryClient.cancelQueries({
          queryKey: FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: comment.parentId._id,
          }),
        });
      }
      await queryClient.cancelQueries({
        queryKey: FeedQueryKeys.goals.getComments(goalId, query),
      });

      // 獲取之前的數據
      const previousData = {
        comments: comment.parentId?._id
          ? queryClient.getQueryData<GetCommentsResponse>(
              FeedQueryKeys.goals.getReplies(goalId, {
                ...query,
                parentId: comment.parentId._id,
              })
            )
          : queryClient.getQueryData<GetCommentsResponse>(
              FeedQueryKeys.goals.getComments(goalId, query)
            ),
      };

      // 更新評論的點讚狀態
      const updateComments = (comments: Comment[]) =>
        comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                isLiked,
                likeCount: isLiked ? c.likeCount + 1 : c.likeCount - 1,
              }
            : c
        );

      // 樂觀更新
      if (comment.parentId?._id) {
        queryClient.setQueryData(
          FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: comment.parentId._id,
          }),
          (old: GetCommentsResponse | undefined) =>
            old ? { ...old, comments: updateComments(old.comments) } : undefined
        );
      }

      queryClient.setQueryData(
        FeedQueryKeys.goals.getComments(goalId, query),
        (old: GetCommentsResponse | undefined) =>
          old ? { ...old, comments: updateComments(old.comments) } : undefined
      );

      return { previousData };
    },

    onError: (_, __, context) => {
      // 發生錯誤時回滾到之前的狀態
      if (comment.parentId?._id) {
        queryClient.setQueryData(
          FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: comment.parentId._id,
          }),
          context?.previousData.comments
        );
      }
      queryClient.setQueryData(
        FeedQueryKeys.goals.getComments(goalId, query),
        context?.previousData.comments
      );
    },

    onSettled: () => {
      // 重新獲取最新數據
      if (comment.parentId?._id) {
        queryClient.invalidateQueries({
          queryKey: FeedQueryKeys.goals.getReplies(goalId, {
            ...query,
            parentId: comment.parentId._id,
          }),
        });
      }
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.goals.getComments(goalId, query),
      });
    },
  });
};

// 追蹤用戶
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (FollowUserId: string) => FETCH_USER_PROFILE.FollowUser(FollowUserId),
    onSuccess: (_, FollowUserId) => {
      // 更新粉絲列表
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.users.following(),
      });
      // 更新當前用戶資料
      queryClient.invalidateQueries({
        queryKey: ProfileQueryKeys.users.profile(),
      });
      // 更新目標用戶的公開資料
      queryClient.invalidateQueries({
        queryKey: ProfileQueryKeys.users.publicProfile(FollowUserId),
      });
    },
    onError: (error: unknown) => {
      handleError(error, "追蹤失敗");
    },
  });
};

// 獲取粉絲列表，每次調用時都會重新獲取數據
export const useGetFollowers = (
  userId: string,
  isOpen: boolean,
  options = {}
) => {
  return useQuery({
    queryKey: FeedQueryKeys.users.followers(),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await FETCH_USER_PROFILE.GetFollowers(userId);
      return response.followers;
    },
    enabled: !!userId && isOpen,
    gcTime: 1000 * 60 * 5,
    ...options,
  });
};

// 獲取追蹤列表，每次調用時會重新獲取數據
export const useGetFollowing = (
  userId: string,
  isOpen: boolean,
  options = {}
) => {
  return useQuery({
    queryKey: FeedQueryKeys.users.following(),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await FETCH_USER_PROFILE.GetFollowing(userId);
      return response.following;
    },
    enabled: !!userId && isOpen,
    gcTime: 1000 * 60 * 5,
    ...options,
  });
};

// 取消追蹤用戶
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followerId: string) =>
      FETCH_USER_PROFILE.UnfollowUser(followerId),
    onSuccess: (_, variables) => {
      // 更新粉絲列表
      queryClient.invalidateQueries({
        queryKey: FeedQueryKeys.users.following(),
      });
      // 更新當前用戶資料
      queryClient.invalidateQueries({
        queryKey: ProfileQueryKeys.users.profile(),
      });
      // 更新目標用戶的公開資料
      queryClient.invalidateQueries({
        queryKey: ProfileQueryKeys.users.publicProfile(variables),
      });
    },
    onError: () => {
      notification.error({ title: "取消追蹤失敗", text: "請稍後再試" });
    },
  });
};

// 獲取推薦用戶
export const useGetRecommendUsers = (query: GetRecommendedUsersQuery) => {
  return useQuery({
    queryKey: FeedQueryKeys.users.recommend(),
    queryFn: () => FETCH_FEED.GetRecommendedUsers(query),
  });
};

// 搜尋目標自動完成
export const useSearchGoalAutocomplete = (
  query: SearchGoalAutocompleteQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: FeedQueryKeys.feed.searchAutocomplete(query),
    queryFn: () => FETCH_FEED.SearchGoalAutocomplete(query),
    enabled: options?.enabled ?? true,
  });
};
