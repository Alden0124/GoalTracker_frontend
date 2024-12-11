import { FETCH_CHATROOM } from "@/services/api/ChatRoom";
import { useQuery } from "@tanstack/react-query";
import { queryKeys as chatRoomQueryKeys } from "./queryKeys";

export const useChatRecord = () => {
  return useQuery({
    queryKey: chatRoomQueryKeys.chatRoom.record,
    queryFn: () => FETCH_CHATROOM.GetChatRecord(),
  });
};  

