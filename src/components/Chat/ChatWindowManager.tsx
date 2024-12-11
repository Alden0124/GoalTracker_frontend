import { useAppDispatch, useAppSelector } from "@/hooks/common/useAppReduxs";
import { closeAllChatWindow, closeChatWindow, selectChatWindowActiveChats } from "@/stores/slice/chatReducer";
import { useEffect, useState } from "react";
import { ChatWindow } from "./ChatWindow";

export const ChatWindowManager = () => {
  const dispatch = useAppDispatch();
  // 目前聊天室開啟中的人員列表
  const chatWindowActiveChats = useAppSelector(selectChatWindowActiveChats);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  
  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      
      // 當切換到手機版時，關閉所有聊天視窗
      if (!newIsDesktop) {
        dispatch(closeAllChatWindow());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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