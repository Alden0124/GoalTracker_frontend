import { FETCH_CHAT } from "@/services/api/Chat";
import { GetChatHistoryQuery } from "@/services/api/Chat/type/getChatHistory.type";
import { useQuery } from "@tanstack/react-query";
import { queryKeys as chatQueryKeys } from "./queryKeys";

export const useChatMessages = (
  recipientId: string,
  query?: GetChatHistoryQuery
) => {
  return useQuery({
    queryKey: chatQueryKeys.chat.messages(recipientId),
    queryFn: () => FETCH_CHAT.GetChatHistory(recipientId, query),
    staleTime: 5 * 60 * 1000,
  });
};
