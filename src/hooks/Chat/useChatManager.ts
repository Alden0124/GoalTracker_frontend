import { FETCH_CHAT } from "@/services/api/Chat";
import {
  GetChatHistoryQuery,
  GetChatHistoryResponse,
} from "@/services/api/Chat/type/getChatHistory.type";
import { socketService } from "@/services/api/SocketService";
import { ReceiveMessage } from "@/services/api/SocketService/type";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { notification } from "@/utils/notification";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../common/useAppReduxs";
import { queryKeys as chatQueryKeys } from "./queryKeys";

// 獲取聊天訊息
export const useChatMessages = (
  recipientId: string,
  query?: GetChatHistoryQuery
) => {
  const result = useInfiniteQuery({
    queryKey: chatQueryKeys.chat.messages(recipientId),
    queryFn: ({ pageParam = 1 }) =>
      FETCH_CHAT.GetChatHistory(recipientId, {
        ...query,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 1000 * 10, // 5分钟
  });

  // 獲取當前頁碼
  const currentPage =
    result.data?.pages[result.data.pages.length - 1]?.pagination.currentPage;

  return {
    ...result,
    currentPage, // 添加當前頁碼到返回值
  };
};

// 發送訊息
export const useSendMessage = () => {
  // 獲取當前用戶資料
  const userInfo = useAppSelector(selectUserProFile);

  // 獲取查詢客戶端
  const queryClient = useQueryClient();

  // 發送訊息
  const sendMessage = (recipientId: string, inputMessage: string) => {
    // 生成臨時消息ID
    const tempMessageId = uuidv4();

    // 保存之前的数据用于回滾
    const previousData = queryClient.getQueryData(
      chatQueryKeys.chat.messages(recipientId)
    );

    // 樂觀更新
    const updateCache = () => {
      queryClient.setQueryData(
        chatQueryKeys.chat.messages(recipientId),
        (oldData: {
          pageParams: number[];
          pages: GetChatHistoryResponse[];
        }) => {
          if (!oldData) return oldData;
          const newMessage = {
            id: tempMessageId,
            content: inputMessage,
            timestamp: new Date().toISOString(),
            isCurrentUser: true,
            sender: {
              id: userInfo.id,
              username: userInfo.username,
              avatar: userInfo.avatar,
            },
            status: "pending", // 添加消息状态
          };

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  messages: [...page.messages, newMessage],
                };
              }
              return page;
            }),
          };
        }
      );
    };

    // 回滾函數
    const rollback = () => {
      queryClient.setQueryData(
        chatQueryKeys.chat.messages(recipientId),
        previousData
      );
    };

    // 更新消息狀態
    // const updateMessageStatus = (status: "success" | "error") => {
    //   queryClient.setQueryData(
    //     chatQueryKeys.chat.messages(recipientId),
    //     (oldData: {
    //       pageParams: number[];
    //       pages: GetChatHistoryResponse[];
    //     }) => {
    //       if (!oldData) return oldData;
    //       return {
    //         ...oldData,
    //         pages: oldData.pages.map((page) => ({
    //           ...page,
    //           messages: page.messages.map((msg) =>
    //             msg.id === tempMessageId ? { ...msg, status } : msg
    //           ),
    //         })),
    //       };
    //     }
    //   );
    // };

    try {
      // 先執行樂觀更新
      updateCache();

      // 發送消息
      socketService.sendPrivateMessage(recipientId, inputMessage);

      // 設置消息發送監聽器
      // socketService.onMessageSent((message: { status: "success" }) => {
      //   if (message.status === "success") {
      //     updateMessageStatus("success");
      //   }
      // });

      socketService.onError(() => {
        // updateMessageStatus("error");
        notification.error({
          title: "發送訊息失敗",
          text: "請稍後再試",
        });
        // 回滾至舊狀態
        rollback();
      });
    } catch (error) {
      // 發生錯誤時回滾至舊狀態
      rollback();
      throw error;
    }
  };

  return { sendMessage };
};

// 接收訊息
export const useReceiveMessage = () => {
  const queryClient = useQueryClient();

  // 收到新訊息
  const handleReceiveMessageToUpdateCache = async (message: ReceiveMessage) => {
    // 樂觀更新聊天用戶紀錄列表
    queryClient.setQueryData(
      chatQueryKeys.chat.messages(message.sender.id),
      (oldData: { pageParams: number[]; pages: GetChatHistoryResponse[] }) => {
        if (!oldData) return oldData;
        const newMessage = {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          isCurrentUser: false,
          sender: {
            id: message.sender.id,
            username: message.sender.username,
            avatar: message.sender.avatar,
          },
          status: "success", // 添加消息状态
        };

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                messages: [...page.messages, newMessage],
              };
            }
            return page;
          }),
        };
      }
    );
  };

  return { handleReceiveMessageToUpdateCache };
};
