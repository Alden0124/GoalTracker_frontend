import { useAppDispatch, useAppSelector } from "@/hooks/common/useAppReduxs";
import { closeChat, selectActiveChats } from "@/stores/slice/chatReducer";
import { ChatWindow } from "./ChatWindow";

export const ChatWindowManager = () => {
  const dispatch = useAppDispatch();
  const activeChats = useAppSelector(selectActiveChats);

  const handleClose = (recipientId: string) => {
    dispatch(closeChat(recipientId));
  };

  return (
    <div className="fixed bottom-0 right-5 flex gap-3 z-50">
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