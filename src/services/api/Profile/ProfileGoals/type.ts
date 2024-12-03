// 獲取用戶目標列表參數
export interface GetUserGoalsParams {
  page: number;
  limit: number;
  status?: string;
  sort?: string;
}

// 獲取用戶目標列表響應
export interface GetUserGoalsResponse {
  goals: Goal[];
  pagination: {
    current: number;
    size: number;
    total: number;
  };
  message: string;
}

// 目標
export interface Goal {
  _id: string;
  title: string;
  description: string;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  likeCount: number;
  progressCommentCount: number;
  commentCount: number;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}

// 目標狀態
export enum GoalStatus {
  IN_PROGRESS = "進行中",
  COMPLETED = "已完成",
  ABANDONED = "未完成",
}

// 創建留言或回覆參數
export interface CreateCommentParams {
  content: string;
  parentId?: string;
  type: "comment" | "progress";
}

// 獲取留言或回覆列表參數
export interface GetCommentsQuery {
  page?: number;
  limit?: number;
  parentId?: string;
  type?: "comment" | "progress";
}

// 獲取留言或回覆列表響應
export interface GetCommentsResponse {
  comments: Comment[];
  pagination: {
    current: number;
    size: number;
    total: number;
  };
  message: string;
}

// 留言或回覆
export interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  goal: string;
  content: string;
  parentId: {
    content: string;
    user: string;
    _id: string;
  };
  replyCount: number;
  type: "comment" | "progress";
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  likeCount: number;
  __v: number;
}
