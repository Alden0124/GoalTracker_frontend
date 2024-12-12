import { socketService } from "@/services/api/SocketService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  error: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  error: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnected: (state: SocketState, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setError: (state: SocketState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    sendPrivateMessage: (
      _state: SocketState,
      action: PayloadAction<{ recipientId: string; content: string }>
    ) => {
      const { recipientId, content } = action.payload;
      socketService.sendPrivateMessage(recipientId, content);
    },
    connectSocket: (_state: SocketState, action: PayloadAction<string>) => {
      socketService.connect(action.payload);
    },
  },
});

export const { setConnected, setError, sendPrivateMessage, connectSocket } =
  socketSlice.actions;
export default socketSlice.reducer;
