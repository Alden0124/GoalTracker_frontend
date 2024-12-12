import type { Socket } from "socket.io-client";
import socketIO from "socket.io-client";
import type { ReceiveMessage } from "./type";


interface SocketServiceType {
  connect: (token: string) => void;
  disconnect: () => void;
  sendPrivateMessage: (recipientId: string, content: string) => void;
  onNewMessage: (callback: (message: ReceiveMessage) => void) => void;
  onMessageSent: (callback: (status: unknown) => void) => void;
  onError: (callback: (error: unknown) => void) => void;
  joinChat: (userId: string, username: string) => void;
  onUserListUpdate: (callback: (users: unknown[]) => void) => void;
  onConnect: (callback: () => void) => void;
  offConnect: (callback: () => void) => void;
  onDisconnect: (callback: () => void) => void;
  offDisconnect: (callback: () => void) => void;
  onConnectError: (callback: (error: Error) => void) => void;
  offConnectError: (callback: (error: Error) => void) => void;
  offNewMessage: (callback: (message: ReceiveMessage) => void) => void;
}

const createSocketService = (): SocketServiceType => {
  let socket: typeof Socket | null = null;
  let connected = false;
  
  // 建立 WebSocket 連線
  const connect = (token: string): void => {
    if (socket) {
      console.log("WebSocket 已經存在，不需要重新連線");
      return;
    }

    // 如果 API URL 未設定，則返回
    if (!import.meta.env.VITE_API_URL) {
      console.error("API URL 未設定");
      return;
    }

    // 開始建立 WebSocket 連線
    console.log("開始建立 WebSocket 連線:", import.meta.env.VITE_API_URL);

    // 建立 WebSocket 連線
    socket = socketIO(import.meta.env.VITE_WS_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    // 監聽 WebSocket 連接成功
    socket.on("connect", () => {
      console.log("WebSocket 連接成功");
      connected = true;
    });

    // 監聽 WebSocket 連接失敗
    socket.on("connect_error", (error: unknown) => {
      console.error("WebSocket 連接失敗:", error);
      connected = false;
    });

    // 監聽 WebSocket 連接斷開
    socket.on("disconnect", () => {
      console.log("WebSocket 連接斷開");
      connected = false;
    });
  };

  // 斷開 WebSocket 連線
  const disconnect = (): void => {
    if (socket) {
      socket.disconnect();
      socket = null;
      connected = false;
    }
  };

  // 發送私人訊息
  const sendPrivateMessage = (recipientId: string, content: string): void => {
    if (!socket || !connected) {
      console.error("WebSocket 未連接，無法發送訊息");
      return;
    }

    console.log("發送私人訊息:", { recipientId, content });

    socket.emit("sendMessage", {
      recipientId,
      content,
      timestamp: new Date().toISOString(),
    });
  };

  // 監聽新訊息
  const onNewMessage = (callback: (message: ReceiveMessage) => void): void => {
    if (!socket) return;
    socket.on("newMessage", callback);
    console.log('監聽新訊息');
  };

  // 取消監聽新訊息
  const offNewMessage = (callback: (message: ReceiveMessage) => void): void => {
    if (!socket) return;
    socket.off("newMessage", callback);
  };

  // 監聽訊息發送
  const onMessageSent = (callback: (status: unknown) => void): void => {
    if (!socket) return;
    socket.on("messageSent", callback);
    console.log('監聽訊息發送');
  };

  // 監聽錯誤
  const onError = (callback: (error: unknown) => void): void => {
    if (!socket) return;
    socket.on("error", callback);
    console.log('監聽錯誤');
  };

  // 加入聊天室
  const joinChat = (userId: string, username: string): void => {
    if (!socket || !connected) {
      console.error("WebSocket 未連接");
      return;
    }
    socket.emit("join", { userId, username });
  };

  // 監聽用戶列表更新
  const onUserListUpdate = (callback: (users: unknown[]) => void): void => {
    if (!socket) return;
    socket.on("userList", callback);
  };

  // 監聽連接成功
  const onConnect = (callback: () => void): void => {
    if (!socket) return;
    socket.on("connect", callback);
  };

  // 取消監聽連接成功
  const offConnect = (callback: () => void): void => {
    if (!socket) return;
    socket.off("connect", callback);
  };

  // 監聽連接斷開
  const onDisconnect = (callback: () => void): void => {
    if (!socket) return;
    socket.on("disconnect", callback);
  };

  // 取消監聽連接斷開
  const offDisconnect = (callback: () => void): void => {
    if (!socket) return;
    socket.off("disconnect", callback);
  };

  // 監聽連接錯誤
  const onConnectError = (callback: (error: Error) => void): void => {
    if (!socket) return;
    socket.on("connect_error", callback);
  };

  // 取消監聽連接錯誤
  const offConnectError = (callback: (error: Error) => void): void => {
    if (!socket) return;
    socket.off("connect_error", callback);
  };


  return {
    connect,
    disconnect,
    sendPrivateMessage,
    onNewMessage,
    onMessageSent,
    onError,
    joinChat,
    onUserListUpdate,
    onConnect,
    offConnect,
    onDisconnect,
    offDisconnect,
    onConnectError,
    offConnectError,
    offNewMessage, // 添加這行
  };
};

export const socketService = createSocketService();
