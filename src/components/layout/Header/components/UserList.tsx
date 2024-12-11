import UserListSkeleton from "@/components/layout/Header/skeleton/UserListSkeleton";
import { useChatRecord } from "@/hooks/ChatRoom/useChatManager";
import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import { socketService } from "@/services/api/SocketService";
import { openChatRoom, openChatWindow } from "@/stores/slice/chatReducer";
import { GET_COOKIE } from "@/utils/cookies";
import { useNavigate } from "react-router-dom";

interface UserListProps {
  setShowChatList: (show: boolean) => void;
  className?: string;
}

const UserList = ({ setShowChatList, className }: UserListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: chatRecord, isLoading } = useChatRecord();

  // 選擇聊天對象
  const handleSelectUser = (userId: string, username: string, avatar: string) => {
    const token = GET_COOKIE();
    if (token) {
      setShowChatList(false);
      
      // 取得目前視窗框度
      const currentWindowWidth = window.innerWidth;

      // 建立 WebSocket 連線
      socketService.connect(token);

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
    }
  };

  // 如果正在加載，顯示加載中
  if (isLoading) return <UserListSkeleton />;

  // 如果沒有聊天記錄，顯示暫無聊天記錄
  if (!chatRecord?.conversations?.length) {
    return (
      <div className={`w-full h-[calc(100vh-64px)] md:h-[400px] md:w-80 bg-background-light dark:bg-background-dark border p-4 ${className}`}>
        <h2 className=" text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">聊天列表</h2>
        <div className="flex flex-col items-center justify-center h-[80%]">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="mt-4 text-gray-500">暫無聊天記錄</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full md:w-80 bg-background-light dark:bg-background-dark border-r border-light-border dark:border-dark-border p-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark  ">聊天列表</h2>
      <div className="space-y-2">
        {chatRecord.conversations.map((conversation) => (
          <div
            key={conversation.userId}
            onClick={() => handleSelectUser(conversation.userId, conversation.username, conversation.avatar)}
            className="p-3 md:px-0 md:py-2 lg:p-3 rounded-lg cursor-pointer md:hover:bg-[#f0f0f0] md:hover:dark:bg-[#202020]/50 text-foreground-light dark:text-foreground-dark"
          >
            <div className="flex items-center justify-center space-x-3">
              {/* 頭像部分 */}
              {conversation.avatar ? (
                <img
                  src={conversation.avatar}
                  alt={conversation.username}
                  className=" w-10 h-10 rounded-full  "
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background-secondaryLight dark:bg-background-secondaryDark border border-light-border dark:border-dark-border">
                  <span className="text-light-avatar-text dark:text-dark-avatar-text">
                    {conversation.username[0]}
                  </span>
                </div>
              )}
              
              {/* 用戶信息部分 - 在大屏幕和超大屏幕顯示 */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-light-text dark:text-dark-text">
                    {conversation.username}
                  </span>
                  <span className="text-xs text-light-subtext dark:text-dark-subtext">
                    {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-light-subtext dark:text-dark-subtext truncate">
                    {conversation.lastMessage.content}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
