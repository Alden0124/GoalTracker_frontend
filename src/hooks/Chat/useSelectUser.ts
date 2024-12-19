import { useAppDispatch, useAppSelector } from "@/hooks/common/useAppReduxs";
import {
  openChatRoom,
  openChatWindow,
  selectChatRoomActiveChats,
  selectChatWindowActiveChats,
} from "@/stores/slice/chatReducer";
import { useNavigate } from "react-router-dom";
import { useUpdateMessageReadStatus } from "../ChatRoom/useChatManager";

// 選擇聊天對象
export const useSelectUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 取得聊天視窗開啟的聊天對象
  const windowActiveChats = useAppSelector(selectChatWindowActiveChats);

  // 取得聊天室開啟的聊天對象
  const roomActiveChats = useAppSelector(selectChatRoomActiveChats);

  // 更新未讀訊息已讀狀態
  const { mutate: updateMessageReadStatus } = useUpdateMessageReadStatus();

  // 選擇聊天對象
  const handleSelectUser = (
    userId: string,
    username: string,
    avatar: string,
    unreadCount: number
  ) => {
    // 如果聊天視窗已經開啟，則不開啟聊天視窗
    const isChatWindowOpen = windowActiveChats?.some(
      (chat) => chat.recipientId === userId
    );

    // 如果聊天室已經開啟，則不開啟聊天室
    const isChatRoomOpen = roomActiveChats?.recipientId === userId;

    // 如果未讀訊息數量 > 0，更新未讀訊息已讀狀態
    if (!isChatWindowOpen && !isChatRoomOpen && unreadCount > 0) {
      // 更新未讀訊息已讀狀態
      updateMessageReadStatus(userId);
    }

    // 取得目前視窗框度
    const currentWindowWidth = window.innerWidth;

    if (currentWindowWidth > 1024) {
      // 開啟小對話框聊天視窗
      dispatch(
        openChatWindow({
          recipientId: userId,
          recipientName: username,
        })
      );
    } else {
      // 開啟聊天室
      dispatch(
        openChatRoom({
          recipientId: userId,
          recipientName: username,
          avatar: avatar,
        })
      );
      navigate(`/chatRoom/${userId}`);
    }
  };

  return {
    handleSelectUser,
  };
};
