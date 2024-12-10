import { useAppDispatch, useAppSelector } from "@/hooks/common/useAppReduxs";
import { closeChat, selectActiveChats } from "@/stores/slice/chatReducer";
import { useEffect, useState } from "react";
import { ChatWindow } from "./ChatWindow";

export const ChatWindowManager = () => {
  const dispatch = useAppDispatch();
  // 目前聊天室開啟中的人員列表
  const activeChats = useAppSelector(selectActiveChats);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      
      // 當切換到手機版時，關閉所有聊天視窗
      if (!newIsDesktop) {
        activeChats.forEach((chat) => {
          dispatch(closeChat(chat.recipientId));
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeChats, dispatch]);

  const handleClose = (recipientId: string) => {
    dispatch(closeChat(recipientId));
  };

  if (!isDesktop) return null;

  return (
    <div className="fixed bottom-0 right-5 gap-3 z-50 flex">
      {activeChats.map((chat) => (
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