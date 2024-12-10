import { MessageInput } from "@/components/Chat/MessageInput";
import { MessageList } from "@/components/Chat/MessageList";
import { queryKeys as chatQueryKeys } from "@/hooks/Chat/queryKeys";
import { useChatRecord } from "@/hooks/ChatRoom/useChatManager";
import { socketService } from "@/services/api/SocketService";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ChatRoomId = () => {
  const { id: recipientId } = useParams();
  const queryClient = useQueryClient();
  const { data: chatRecord } = useChatRecord();

  // 找到當前聊天對象的資訊
  const currentChat = chatRecord?.conversations.find(
    (chat) => chat.userId === recipientId
  );

  // 監聽新訊息
  useEffect(() => {
    if (!recipientId) return;

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
    if (!inputMessage.trim() || !recipientId) return;

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

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-gray-500">找不到該聊天對象</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* 聊天標題 */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center space-x-3">
          {currentChat.avatar ? (
            <img
              src={currentChat.avatar}
              alt={currentChat.username}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">{currentChat.username[0]}</span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-700">
            {currentChat.username}
          </h3>
        </div>
      </div>

      {/* 訊息列表 */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          recipientId={recipientId}
          recipientName={currentChat.username}
        />
      </div>

      {/* 輸入區域 */}
      <div className="border-t border-gray-200 bg-white">
        <MessageInput handleSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatRoomId;