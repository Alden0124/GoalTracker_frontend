export interface GetChatHistoryResponse {
  messages: GetChatHistoryMessage[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface GetChatHistoryMessage {
  id: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
}

export interface GetChatHistoryQuery {
  page?: number;
  limit?: number;
}
