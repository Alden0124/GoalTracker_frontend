import { queryKeys as chatQueryKeys } from "@/hooks/Chat/queryKeys";
import { socketService } from "@/services/api/SocketService";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
  onClose: () => void;
}


export const ChatWindow = ({
  recipientId,
  recipientName,
  onClose,
}: ChatWindowProps) => {
  // 查詢快取
  const queryClient = useQueryClient();
  // 使用者資料
  // const userInfo = useAppSelector(selectUserProFile);

  // 監聽新訊息
  useEffect(() => {
    const handleNewMessage = async () => {
      // 使該聊天室的快取失效，觸發重新獲取
      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.chat.messages(recipientId),
      });
    };

    socketService.onNewMessage(handleNewMessage);

    return () => {
        socketService.offNewMessage(handleNewMessage);
    };
  }, [queryClient, recipientId]);

  // 發送訊息
  const handleSend = async (inputMessage: string) => {
    if (!inputMessage.trim()) return;

    try {
      // 發送訊息
      socketService.sendPrivateMessage(recipientId, inputMessage);

      // 使該聊天室的快取失效，觸發重新獲取
      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.chat.messages(recipientId),
      });
    } catch (error) {
      console.error("發送訊息失敗:", error);
    }
  };

  return (
    <div className="w-[320px] h-[450px] bg-white rounded-t-lg shadow-lg flex flex-col">
      {/* 聊天窗標題 */}
      <ChatHeader recipientName={recipientName} onClose={onClose} />

      {/* 訊息區域 */}
      <MessageList
        recipientName={recipientName}
        recipientId={recipientId}
      />

      {/* 輸入區域 */}
      <MessageInput handleSend={handleSend} />
    </div>
  );
};
