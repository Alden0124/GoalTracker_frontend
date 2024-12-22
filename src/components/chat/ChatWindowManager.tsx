import { ChatWindow } from "@/components/chat/ChatWindow";
import { useAppDispatch, useAppSelector } from "@/hooks/common/useAppReduxs";
import {
  closeAllChatWindow,
  closeChatWindow,
  selectChatWindowActiveChats,
} from "@/stores/slice/chatReducer";
import { throttle } from "@/utils/throttle";
import { useEffect, useState } from "react";

export const ChatWindowManager = () => {
  const dispatch = useAppDispatch();
  // 目前聊天室開啟中的人員列表
  const chatWindowActiveChats = useAppSelector(selectChatWindowActiveChats);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = throttle(() => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);

      // 當切換到手機版時，關閉所有聊天視窗
      if (!newIsDesktop && chatWindowActiveChats.length > 0) {
        dispatch(closeAllChatWindow());
      }
    }, 500); // 設定 200ms 的節流時間

    window.addEventListener("resize", handleResize);
    return () => {
      handleResize.cancel(); // 清除可能等待中的節流函數
      window.removeEventListener("resize", handleResize);
    };
  }, [chatWindowActiveChats, dispatch]);

  const handleClose = (recipientId: string) => {
    dispatch(closeChatWindow(recipientId));
  };

  if (!isDesktop) return null;

  return (
    <div className="fixed bottom-0 right-5 gap-3 z-50 flex">
      {chatWindowActiveChats.map((chat) => (
        <ChatWindow
          key={chat.recipientId}
          recipientId={chat.recipientId}
          recipientName={chat.recipientName}
          onClose={() => handleClose(chat.recipientId)}
        />
      ))}
    </div>
  );
};
