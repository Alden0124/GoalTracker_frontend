import axiosInstance from "@/services/axiosInstance";
import { GetChatRecordResponse, updateMessageReadStatusResponse } from "./type";

export const FETCH_CHATROOM = {
  // 獲取聊天用戶紀錄列表
  GetChatRecord: (): Promise<GetChatRecordResponse> =>
    axiosInstance.get(`/chat/conversations`),

  // 獲取未讀聊天訊息數量
  GetUnreadMessageCount: (): Promise<{ unreadMessageCount: number }> =>
    axiosInstance.get(`/chat/unread-count`),

  // 更新聊天訊息已讀狀態
  updateMessageReadStatus: (
    receiverId: string
  ): Promise<updateMessageReadStatusResponse> =>
    axiosInstance.put(`/chat/read/${receiverId}`),
};

