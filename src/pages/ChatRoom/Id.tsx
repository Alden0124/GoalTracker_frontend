import { MessageInput } from "@/components/Chat/MessageInput";
import { MessageList } from "@/components/Chat/MessageList";
import ChatRoomIdSkeleton from "@/components/ChatRoom/skeleton/ChatRoomIdSkeleton";
import NoUserIdskeleton from "@/components/ChatRoom/skeleton/NoUserIdskeleton";
import { queryKeys as chatQueryKeys } from "@/hooks/Chat/queryKeys";
import { queryKeys as chatRoomQueryKeys } from "@/hooks/ChatRoom/queryKeys";
import { usePublicUserProfile } from "@/hooks/profile/ProfileInfo/queries/useProfileProfileInfoQueries";
import { socketService } from "@/services/api/SocketService";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const ChatRoomId = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // 獲取聊天對象id
  const { id: recipientId } = useParams();
  // 獲取聊天對象資料
  const { data: currentChat, isLoading: isLoadingCurrentChat } =
    usePublicUserProfile(recipientId ? recipientId : null);

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

      // 使該聊天室用戶列表的快取失效，觸發重新獲取
      await queryClient.invalidateQueries({
        queryKey: chatRoomQueryKeys.chatRoom.record,
      });
    } catch (error) {
      console.error("發送訊息失敗:", error);
    }
  };

  // 如果正在載入聊天對象資料，顯示聊天對象資料載入中
  if (isLoadingCurrentChat) return <ChatRoomIdSkeleton />;

  // 如果沒有選擇聊天對象，顯示請選擇一個聊天對象開始對話
  if (!currentChat) return <NoUserIdskeleton />;

  return (
    <div className="flex-1 flex flex-col">
      {/* 聊天標題 */}
      <div className="h-16 border-b border-light-border dark:border-dark-border flex items-center justify-between px-6 bg-background-light dark:bg-background-dark">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/chatRoom")}
            className="md:hidden mr-2 text-foreground-light dark:text-foreground-dark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {currentChat.user.avatar ? (
            <img
              src={currentChat.user.avatar}
              alt={currentChat.user.username}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-background-secondaryLight dark:bg-background-secondaryDark flex items-center justify-center border border-light-border dark:border-dark-border">
              <span className="text-foreground-light dark:text-foreground-dark">
                {currentChat.user.username[0]}
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">
            {currentChat.user.username}
          </h3>
        </div>
      </div>

      {/* 訊息列表 */}
      <MessageList
        recipientId={currentChat.user.id}
        recipientName={currentChat.user.username}
      />

      {/* 輸入區域 */}
      <div className="border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <MessageInput handleSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatRoomId;
