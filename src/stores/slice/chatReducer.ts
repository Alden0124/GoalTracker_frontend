import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 定義聊天狀態介面
export interface ChatStateType {
  activeChats: Array<{
    recipientId: string;
    recipientName: string;
  }>;
}

// 初始狀態
const initialState: ChatStateType = {
  activeChats: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // 開啟聊天視窗
    openChat: (
      state,
      action: PayloadAction<{ recipientId: string; recipientName: string }>
    ) => {
      const { recipientId, recipientName } = action.payload;

      if (
        !state.activeChats.find((chat) => chat.recipientId === recipientId)
      ) {
        state.activeChats.push({ recipientId, recipientName });
      }
    },
    // 關閉聊天視窗
    closeChat: (state, action: PayloadAction<string>) => {
      state.activeChats = state.activeChats.filter(
        (chat) => chat.recipientId !== action.payload
      );
    },
  },
});

// 導出 actions
export const { openChat, closeChat } = chatSlice.actions;

// 選擇器（Selectors）
export const selectActiveChats = (state: { chat: ChatStateType }) =>
  state.chat.activeChats;

// 導出 reducer
export default chatSlice.reducer;
