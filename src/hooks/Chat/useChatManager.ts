import { FETCH_CHAT } from "@/services/api/Chat";
import { GetChatHistoryQuery } from "@/services/api/Chat/type/getChatHistory.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys as chatQueryKeys } from "./queryKeys";

export const useChatMessages = (
  recipientId: string,
  query?: GetChatHistoryQuery
) => {
  const result = useInfiniteQuery({
    queryKey: chatQueryKeys.chat.messages(recipientId),
    queryFn: ({ pageParam = 1 }) => 
      FETCH_CHAT.GetChatHistory(recipientId, { 
        ...query, 
        page: pageParam 
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  // 獲取當前頁碼
  const currentPage = result.data?.pages[result.data.pages.length - 1]?.pagination.currentPage;

  return {
    ...result,
    currentPage, // 添加當前頁碼到返回值
  };
};
