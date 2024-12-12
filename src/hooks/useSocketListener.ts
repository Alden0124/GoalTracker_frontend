import { socketService } from "@/services/api/SocketService";
import type { ReceiveMessage } from "@/services/api/SocketService/type";
import { selectIsAuthenticated } from "@/stores/slice/userReducer";
import { GET_COOKIE } from "@/utils/cookies";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryKeys as chatQueryKeys } from "./Chat/queryKeys";
import { queryKeys as chatRoomQueryKeys } from "./ChatRoom/queryKeys";
import { useAppSelector } from "./common/useAppReduxs";

export const useSocketListener = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = GET_COOKIE();

  useEffect(() => {
    // 確保用戶已登入且有 token 才建立連接
    if (!isAuthenticated || !token) {
      return;
    }

    // 確保 socket 連接
    socketService.connect(token);

    const handleNewMessage = async (message: ReceiveMessage) => {
      console.log("收到新訊息:", message);
      // 使該聊天室的快取失效
      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.chat.messages(message.sender.id),
      });

      // 使該聊天室用戶列表的快取失效，觸發重新獲取
      await queryClient.invalidateQueries({
        queryKey: chatRoomQueryKeys.chatRoom.record,
      });
    };

    const handleError = (error: unknown) => {
      console.error("Socket error:", error);
    };

    // 連接成功的處理
    const handleConnect = () => {
      console.log("Socket 連接成功");
    };

    // 連接斷開的處理
    const handleDisconnect = () => {
      console.log("Socket 連接斷開");
    };

    // 註冊所有監聽器
    socketService.onConnect(handleConnect);
    socketService.onDisconnect(handleDisconnect);
    socketService.onNewMessage(handleNewMessage);
    socketService.onError(handleError);

    // 清理函數
    return () => {
      socketService.offConnect(handleConnect);
      socketService.offDisconnect(handleDisconnect);
      socketService.offNewMessage(handleNewMessage);
      socketService.onError(handleError);
      socketService.disconnect();
    };
  }, [queryClient, isAuthenticated, token]);
};
