import { FETCH_CHATROOM } from "@/services/api/ChatRoom";
import {
  GetChatRecordConversation,
  GetChatRecordResponse,
} from "@/services/api/ChatRoom/type/getChatRecord.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys as chatRoomQueryKeys } from "./queryKeys";

// 獲取聊天用戶紀錄列表
export const useChatRecord = () => {
  return useQuery({
    queryKey: chatRoomQueryKeys.chatRoom.record,
    queryFn: () => FETCH_CHATROOM.GetChatRecord(),
    staleTime: 1000 * 60 * 5,
  });
};

// 獲取未讀聊天訊息數量
export const useUnreadMessageCount = () => {
  return useQuery({
    queryKey: chatRoomQueryKeys.chatRoom.unreadMessageCount,
    queryFn: () => FETCH_CHATROOM.GetUnreadMessageCount(),
    staleTime: 1000 * 60 * 5,
  });
};

// 更新聊天訊息已讀狀態
export const useUpdateMessageReadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: string) =>
      FETCH_CHATROOM.updateMessageReadStatus(receiverId),
    onSuccess: (_, receiverId) => {
      // 樂觀更新聊天用戶紀錄列表
      queryClient.setQueryData(
        chatRoomQueryKeys.chatRoom.record,
        (oldData: GetChatRecordResponse) => {
          return {
            conversations: oldData.conversations.map(
              (conversation: GetChatRecordConversation) => ({
                ...conversation,
                unreadCount:
                  conversation.userId === receiverId
                    ? 0
                    : conversation.unreadCount,
              })
            ),
          };
        }
      );

      // 獲取未讀聊天訊息數量快取失效
      queryClient.invalidateQueries({
        queryKey: chatRoomQueryKeys.chatRoom.unreadMessageCount,
      });
    },
  });
};
