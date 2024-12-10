export interface GetChatRecordResponse {
  conversations: GetChatRecordConversation[];
}

export interface GetChatRecordConversation {
  userId: string;
  username: string;
  avatar: string;
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
}
