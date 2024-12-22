import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { useSendMessage } from "@/hooks/Chat/useChatManager";

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
  const { sendMessage } = useSendMessage();

  // 發送訊息
  const handleSend = (inputMessage: string) => {
    if (!inputMessage.trim()) return;
    try {
      sendMessage(recipientId, inputMessage);
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
