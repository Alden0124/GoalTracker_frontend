import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { socketService } from "@/services/api/SocketService";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { GET_COOKIE } from "@/utils/cookies";
import { useEffect, useRef, useState } from "react";

interface Message {
  messageId: string;
  sender: {
    id: string;
    username: string;
  };
  recipient: string;
  content: string;
  timestamp: string;
}

interface User {
  id: string; // 確保與後端返回的格式一致
  username: string;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { id: userId, username } = useAppSelector(selectUserProFile);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // 獲取認證信息
        const token = GET_COOKIE(); // 或從其他地方獲取 token

        // 檢查必要認證信息
        if (!token || !userId || !username) {
          console.error("缺少必要的認證信息");
          setConnectionError("請先登入");
          return;
        }

        // 連接 WebSocket
        console.log("開始建立連接...");
        socketService.connect(token);

        // 等待連接成功後再加入聊天
        socketService.onConnect(() => {
          console.log("連接成功，加入聊天室");
          socketService.joinChat(userId, username);
        });
      } catch (error) {
        console.error("WebSocket 連線錯誤:", error);
        setConnectionError("連線錯誤");
      }
    };

    initializeChat();

    // 3. 監聽連線
    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log("WebSocket 已連線");
    };

    // 斷線
    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("WebSocket 已斷線");
    };

    // 連線錯誤
    const handleConnectError = (error: Error) => {
      setIsConnected(false);
      setConnectionError(error.message);
      console.error("WebSocket 連線錯誤:", error);
    };

    // 監聽連線
    socketService.onConnect(handleConnect);
    // 監聽斷線
    socketService.onDisconnect(handleDisconnect);
    // 監聽連線錯誤
    socketService.onConnectError(handleConnectError);

    // 4. 監聽訊息
    socketService.onNewMessage((message: any) => {
      console.log("收到新訊息:", message);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // 5. 監聽用戶列表更新
    socketService.onUserListUpdate((updatedUsers: any) => {
      console.log("用戶列表更新:", updatedUsers);
      setUsers(updatedUsers);
    });

    return () => {
      socketService.offConnect(handleConnect);
      socketService.offDisconnect(handleDisconnect);
      socketService.offConnectError(handleConnectError);
      socketService.disconnect();
    };
  }, [userId, username]);

  // 發送訊息
  const handleSendMessage = () => {
    console.log(selectedUser, newMessage);
    if (!selectedUser || !newMessage.trim()) return;

    socketService.sendPrivateMessage(selectedUser.id, newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 線狀態提示 */}
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          {connectionError ? `連線錯誤: ${connectionError}` : "正在連線中..."}
        </div>
      )}

      {/* 左側用戶列表 */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">在線用戶</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 rounded-lg cursor-pointer transition-colors duration-150
                ${
                  selectedUser?.id === user.id
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右側聊天區域 */}
      <div className="flex-1 flex flex-col">
        {/* 聊天標題 */}
        <div className="h-16 border-b border-gray-200 flex items-center px-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-700">
            {selectedUser
              ? `與 ${selectedUser.username} 聊天中`
              : "請選擇聊天對象"}
          </h3>
        </div>

        {/* 訊息列表 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col">
              <div
                className={`flex items-start space-x-2 max-w-[70%] 
                ${message.sender.id === userId ? "ml-auto" : ""}`}
              >
                <div
                  className={`rounded-lg p-3 
                  ${
                    message.sender.id === userId
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 輸入區域 */}
        <div className="h-24 border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="輸入訊息..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedUser || !newMessage.trim()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-150
                ${
                  !selectedUser || !newMessage.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                }`}
            >
              發送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
