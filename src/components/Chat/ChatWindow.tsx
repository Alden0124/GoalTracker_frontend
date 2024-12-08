import { queryKeys as chatQueryKeys } from "@/hooks/Chat/queryKeys";
import { socketService } from "@/services/api/SocketService";
import { ReceiveMessage } from "@/services/api/SocketService/type";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { Message } from "./type";

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
  // 訊息狀態
  const [messages, setMessages] = useState<Message[]>([]);

  // 監聽新訊息
  useEffect(() => {
    const handleNewMessage = (message: ReceiveMessage) => {
      if (message.sender.id === recipientId) {
        setMessages((prev) => [
          ...prev,
          {
            id: message.messageId,
            content: message.content,
            isCurrentUser: message.sender.id === recipientId,
            sender: {
              id: message.sender.id,
              avatar: message.sender.avatar || "",
            },
            timestamp: message.timestamp,
          },
        ]);
      }
    };

    socketService.onNewMessage(handleNewMessage);

    return () => {
      socketService.offNewMessage(handleNewMessage);
    };
  }, [recipientId]);

  // 發送訊息
  const handleSend = async (inputMessage: string) => {
    if (!inputMessage.trim()) return;

    try {
      // 發送訊息
       socketService.sendPrivateMessage(recipientId, inputMessage);

      // 立即更新本地訊息顯示
      setMessages((prev) => [
        ...prev,
        {
          content: inputMessage,
          isCurrentUser: true,
          sender: {
            id: recipientId,
            avatar: "",
          },
          timestamp: new Date().toISOString(),
        },
      ]);

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
        messages={messages}
        setMessages={setMessages}
        recipientName={recipientName}
        recipientId={recipientId}
      />

      {/* 輸入區域 */}
      <MessageInput handleSend={handleSend} />
    </div>
  );
};
