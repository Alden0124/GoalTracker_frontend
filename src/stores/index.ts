import chatReducer from "@/stores/slice/chatReducer";
import loadingReducer from "@/stores/slice/loadingReducer";
import socketReducer from "@/stores/slice/socketSlice";
import userReducer from "@/stores/slice/userReducer";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    chat: chatReducer,
    socket: socketReducer,
  },
});

// 導出 RootState 和 AppDispatch 類型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
