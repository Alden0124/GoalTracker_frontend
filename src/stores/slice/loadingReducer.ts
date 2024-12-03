import { createSlice } from '@reduxjs/toolkit';

// 定義 loading state 的類型
export interface LoadingState {
  isLoading: boolean;
  pendingRequests: number;
}

const initialState: LoadingState = {
  isLoading: false,
  pendingRequests: 0,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.pendingRequests++;
      state.isLoading = true;
    },
    finishLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
      state.isLoading = state.pendingRequests > 0;
    },
  },
});
// 導出 actions
export const { startLoading, finishLoading } = loadingSlice.actions;

// 導出 selector
export const selectIsLoading = (state: {loading: LoadingState}) => state.loading.isLoading;

// 導出 reducer
export default loadingSlice.reducer; 