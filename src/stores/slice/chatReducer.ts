import { socketService } from "@/services/api/SocketService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 定義聊天狀態介面
export interface ChatStateType {
  chatWindowActiveChats: Array<{
    recipientId: string;
    recipientName: string;
  }>;
  chatRoomActiveChats: {
    recipientId: string;
    recipientName: string;
    avatar: string;
  } | null;
}

// 初始狀態
const initialState: ChatStateType = {
  chatWindowActiveChats: [],
  chatRoomActiveChats: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // 開啟聊天視窗
    openChatWindow: (
      state,
      action: PayloadAction<{
        recipientId: string;
        recipientName: string;
      }>
    ) => {
      const { recipientId, recipientName } = action.payload;
      // 如果聊天位置是電腦版小視窗，且聊天對象不在聊天列表中，則將聊天對象加入聊天列表
      if (
        !state.chatWindowActiveChats.find(
          (chat) => chat.recipientId === recipientId
        )
      ) {
        // 將聊天對象加入聊天列表
        state.chatWindowActiveChats = [
          ...state.chatWindowActiveChats,
          { recipientId, recipientName },
        ];
        // 進入聊天室
        socketService.enterChat(recipientId);
      }
    },
    // 關閉聊天視窗
    closeChatWindow: (state, action: PayloadAction<string>) => {
      // 將聊天對象從聊天列表中移除
      state.chatWindowActiveChats = state.chatWindowActiveChats.filter(
        (chat) => chat.recipientId !== action.payload
      );
      // 離開聊天室
      socketService.leaveChat(action.payload);
    },

    // 關閉所有聊天視窗
    closeAllChatWindow: (state) => {
      state.chatWindowActiveChats = [];
      // 離開所有聊天室
      socketService.leaveChat();
    },

    // 開啟聊天室
    openChatRoom: (
      state,
      action: PayloadAction<{
        recipientId: string;
        recipientName: string;
        avatar: string;
      }>
    ) => {
      state.chatRoomActiveChats = action.payload;
      // 進入聊天室
      socketService.enterChat(action.payload.recipientId);
    },

    // 關閉聊天室
    closeChatRoom: (state) => {
      state.chatRoomActiveChats = null;
      // 離開聊天室
      socketService.leaveChat();
    },
  },
});

// 導出 actions
export const {
  openChatWindow,
  closeChatWindow,
  closeAllChatWindow,
  openChatRoom,
  closeChatRoom,
} = chatSlice.actions;

// 選擇器（Selectors）
export const selectChatWindowActiveChats = (state: { chat: ChatStateType }) =>
  state.chat.chatWindowActiveChats;

export const selectChatRoomActiveChats = (state: { chat: ChatStateType }) =>
  state.chat.chatRoomActiveChats;

// 導出 reducer
export default chatSlice.reducer;
