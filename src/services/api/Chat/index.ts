import axiosInstance from "@/services/axiosInstance";
import { DEFAULT_CHAT_PARAMS } from "./constants";
import { GetChatHistoryQuery, GetChatHistoryResponse } from "./type";

export const FETCH_CHAT = {
  // 獲取聊天歷史
  GetChatHistory: (
    recipientId: string,
    query?: GetChatHistoryQuery
  ): Promise<GetChatHistoryResponse> =>
    axiosInstance.get(`/chat/history/${recipientId}`, {
      params: { ...DEFAULT_CHAT_PARAMS, ...query },
    }),
};

