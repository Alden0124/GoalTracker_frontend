import axiosInstance from "@/services/axiosInstance";
import { GetChatRecordResponse } from "./type";

export const FETCH_CHATROOM = {
  // 獲取聊天用戶紀錄列表
  GetChatRecord: (): Promise<GetChatRecordResponse> =>
    axiosInstance.get(`/chat/conversations`),
};

