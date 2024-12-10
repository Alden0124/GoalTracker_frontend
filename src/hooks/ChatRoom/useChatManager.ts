import { FETCH_CHATROOM } from "@/services/api/ChatRoom";
import { useQuery } from "@tanstack/react-query";
import { queryKeys as chatQueryKeys } from "./queryKeys";

export const useChatRecord = () => {
  return useQuery({
    queryKey: chatQueryKeys.chatRoom.record,
    queryFn: () => FETCH_CHATROOM.GetChatRecord(),
  });
};  

