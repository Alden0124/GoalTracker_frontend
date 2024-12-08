import { useChatMessages } from "@/hooks/Chat/useChatManager";
import { GetChatHistoryMessage } from "@/services/api/Chat/type";
import { formatTime } from "@/utils/dateFormat";
import { useEffect, useRef } from "react";
import { Message } from "./type";


interface MessageListProps {
  messages: Message[];
  recipientName: string;
  recipientId: string;
  setMessages: (messages: Message[]) => void;
}

export const MessageList =
  ({ messages, recipientName, recipientId, setMessages }: MessageListProps) => {

  // 訊息結束參考
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 獲取歷史訊息
  const { data: historyMessagesData } = useChatMessages(recipientId);

  // 初始化歷史訊息
  useEffect(() => {
    if (historyMessagesData?.messages) {
      const formattedMessages: Message[] = historyMessagesData?.messages.map(
        (msg: GetChatHistoryMessage) => ({
          id: msg.id,
          content: msg.content,
          isCurrentUser: msg.sender.id === recipientId,
          sender: {
            id: msg.sender.id,
            avatar: msg.sender.avatar,
          },
          timestamp: msg.timestamp,
        })
      );
      setMessages(formattedMessages);
    }
  }, [historyMessagesData, recipientId, setMessages]);

  // 自動滾動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => (
        <div
          key={index}
            className={`flex ${
              msg.isCurrentUser ? "justify-start" : "justify-end"
            } items-end gap-2`}
          >
            {msg.isCurrentUser && (
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              {msg.sender.avatar ? (
                <img
                  src={msg.sender.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">
                      {recipientName[0]}
                    </span>
                  </div>
                )}
            </div>
          )}

          <div className="flex flex-col max-w-[70%]">
              <div
                className={`px-4 py-2 rounded-lg ${
                  msg.isCurrentUser
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-600 text-white"
                }`}
              >
                {msg.content}
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {formatTime(msg.timestamp)}
            </span>
            </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
    );
  }

MessageList.displayName = "MessageList";
