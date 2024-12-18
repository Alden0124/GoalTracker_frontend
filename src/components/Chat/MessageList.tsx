import { useChatMessages } from "@/hooks/Chat/useChatManager";
import { DEFAULT_CHAT_PARAMS } from "@/services/api/Chat/constants";
import { formatTime } from "@/utils/dateFormat";
import { useEffect, useMemo, useRef } from "react";

interface MessageListProps {
  recipientName: string;
  recipientId: string;
  className?: string;
}

// 添加日期格式化工具函數
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "今天";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "昨天";
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

export const MessageList = ({
  recipientName,
  recipientId,
  className,
}: MessageListProps) => {
  // 訊息結束元素位置
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // 頂部滾動觸發點元素
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  // 消息容器元素
  const messageContainerRef = useRef<HTMLDivElement>(null);
  // 初始化訊息位置設定狀態
  const initialScrollPosition = useRef(false);

  // 獲取歷史訊息
  const {
    // 歷史訊息
    data: historyMessagesData,
    // 加載下一頁
    fetchNextPage,
    // 是否還有下一頁
    hasNextPage,
    // 是否正在加載下一頁
    isFetchingNextPage,
    // 當前頁碼
    currentPage,
  } = useChatMessages(recipientId, {
    ...DEFAULT_CHAT_PARAMS,
    limit: 10,
  });

  // 合併所有頁面的目標數據
  const historyMessages = useMemo(() => {
    const reversedPages = [...(historyMessagesData?.pages || [])].reverse();
    const messages = reversedPages.flatMap((page) => page.messages);

    // 使用 Set 去重
    const uniqueMessages = Array.from(
      new Map(messages.map((msg) => [msg.id, msg])).values()
    );

    return uniqueMessages;
  }, [historyMessagesData?.pages]);

  // 按日期對消息進行分組
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: typeof historyMessages } = {};

    historyMessages.forEach((msg) => {
      const date = new Date(msg.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  }, [historyMessages]);

  // 滾動到最新消息
  useEffect(() => {
    // 如果訊息結束元素存在，且有訊息，且是第一頁，則滾動到訊息結束元素
    if (
      messagesEndRef.current &&
      historyMessages.length > 0 &&
      currentPage === 1 &&
      !initialScrollPosition.current
    ) {
      messagesEndRef.current.scrollIntoView(); // 平滑滾動到指定元素
      setTimeout(() => {
        // 設定初始化訊息位置設定狀態
        initialScrollPosition.current = true;
      }, 300);
    } else if (historyMessages[historyMessages.length - 1]?.isCurrentUser) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [currentPage, historyMessages]);

  // 修改 Intersection Observer 邏輯
  useEffect(() => {
    const currentTrigger = loadTriggerRef.current;
    // 創建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // 如果元素不可見或已經沒有更多數據或正在加載中，則直接返回
        if (
          !entry.isIntersecting ||
          !hasNextPage ||
          isFetchingNextPage ||
          !initialScrollPosition.current
        ) {
          return;
        }

        // 保存當前滾動位置
        const oldScrollHeight = messageContainerRef.current?.scrollHeight;

        fetchNextPage().then(() => {
          requestAnimationFrame(() => {
            if (messageContainerRef.current && oldScrollHeight) {
              const newScrollHeight = messageContainerRef.current.scrollHeight;
              messageContainerRef.current.scrollTop =
                newScrollHeight - oldScrollHeight;
            }
          });
        });
      },
      {
        // 設置觀察閾值
        threshold: 0.1,
        // 設置觀察元素的邊界
        rootMargin: "100px 0px 0px 0px",
      }
    );
    // 如果觀察到的元素存在，則開始觀察
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    // 返回清理函數
    return () => {
      // 斷開 Intersection Observer
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
      // 斷開 Intersection Observer
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div
      ref={messageContainerRef}
      className={`custom-scrollbar flex-1 overflow-y-auto p-4 space-y-3 bg-background-light dark:bg-background-dark ${className}`}
    >
      <div ref={loadTriggerRef} className="h-4">
        {isFetchingNextPage && (
          <div className="text-center text-foreground-light dark:text-foreground-dark text-sm">
            加載更多...
          </div>
        )}
      </div>
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="bg-light-divider dark:bg-dark-divider px-3 py-1 rounded-full">
              <span className="text-xs text-foreground-light dark:text-foreground-dark">
                {formatDate(messages[0].timestamp)}
              </span>
            </div>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.isCurrentUser ? "justify-end" : "justify-start"
              } items-end gap-2`}
            >
              {!msg.isCurrentUser && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  {msg.sender.avatar ? (
                    <img
                      src={msg.sender.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-light-avatar dark:bg-dark-avatar flex items-center justify-center">
                      <span className="text-light-avatar-text dark:text-dark-avatar-text text-sm">
                        {recipientName[0]}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`px-4 py-2 rounded-lg ${
                    !msg.isCurrentUser
                      ? "!bg-background-secondaryLight !dark:bg-background-secondaryDark !text-foreground-light !dark:text-foreground-dark"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-foreground-light dark:text-foreground-dark mt-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

MessageList.displayName = "MessageList";
