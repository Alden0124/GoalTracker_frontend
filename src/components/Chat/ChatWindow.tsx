import { queryKeys as chatQueryKeys } from "@/hooks/Chat/queryKeys";
import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import { sendPrivateMessage } from "@/stores/slice/socketSlice";
import { useQueryClient } from "@tanstack/react-query";
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
  const dispatch = useAppDispatch();
  // 查詢快取
  const queryClient = useQueryClient();
  // 發送訊息
  const handleSend = async (inputMessage: string) => {
    if (!inputMessage.trim()) return;

    try {
      // 發送訊息
      dispatch(sendPrivateMessage({ recipientId, content: inputMessage }));

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
        className="bg-background-secondaryLight border shadow-lg"
      />

      {/* 輸入區域 */}
      <MessageInput handleSend={handleSend} />
    </div>
  );
};
