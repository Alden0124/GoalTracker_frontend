import { useChatRecord } from "@/hooks/ChatRoom/useChatManager";
import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import { openChat } from "@/stores/slice/chatReducer";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: chatRecord, isLoading } = useChatRecord();

  const handleSelectUser = (userId: string, username: string) => {
    dispatch(openChat({
      recipientId: userId,
      recipientName: username
    }));
    navigate(`/chatRoom/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!chatRecord?.conversations?.length) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">聊天列表</h2>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
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
    <div className="w-80 bg-white border-r border-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">聊天列表</h2>
      <div className="space-y-2">
        {chatRecord.conversations.map((conversation) => (
          <div
            key={conversation.userId}
            onClick={() => handleSelectUser(conversation.userId, conversation.username)}
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center space-x-3">
              {conversation.avatar ? (
                <img
                  src={conversation.avatar}
                  alt={conversation.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{conversation.username[0]}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{conversation.username}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate">
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
