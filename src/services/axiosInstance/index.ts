import { store } from "@/stores";
import { finishLoading, startLoading } from "@/stores/slice/loadingReducer";
import { signOut } from "@/stores/slice/userReducer";
import { EXISTS_COOKIE, GET_COOKIE, SET_COOKIE } from "@/utils/cookies";
import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { FETCH_AUTH } from "../api/auth";
import { ApiError } from "./type";

const isProd = import.meta.env.PROD;

// 根據環境設置 baseURL
const baseURL = isProd
  ? "https://goaltracker-admin.onrender.com/api"
  : import.meta.env.VITE_API_URL;

// 創建 axios 實例
const instance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    ...(isProd && {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }),
  },
});

// 追蹤請求數量
let pendingRequests = 0;

const handleStartLoading = () => {
  pendingRequests++;

  // 如果是第一個請求，才觸發 loading
  if (pendingRequests === 1) {
    store.dispatch(startLoading());
  }
};

const handleStopLoading = () => {
  pendingRequests = Math.max(0, pendingRequests - 1);

  // 只有當所有請求都完成時，才關閉 loading
  if (pendingRequests === 0) {
    store.dispatch(finishLoading());
  }
};

// 請求攔截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers?.["skip-loading"] !== "true") {
      handleStartLoading();
    }

    const currentLang = localStorage.getItem("language") || "zh-TW";

    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    config.headers.set("Accept-Language", currentLang);

    if (!config.headers.get("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }

    const token = GET_COOKIE() || false;
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    handleStopLoading();
    console.error("請求攔截器錯誤:", error);
    return Promise.reject(error);
  }
);

// 響應攔截器
instance.interceptors.response.use(
  (response) => {
    if (response.config.headers?.["skip-loading"] !== "true") {
      handleStopLoading();
    }
    return response.data;
  },
  async (error) => {
    if (error.config?.headers?.["skip-loading"] !== "true") {
      handleStopLoading();
    }
    if (error.response) {
      console.error("完整錯誤信息:", {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });

      switch (error.response.status) {
        case 401:
          // 檢查是否存在 refreshToken，如果不存在直接登出
          if (!EXISTS_COOKIE("refreshToken")) {
            store.dispatch(signOut());
            window.location.href = "/auth/signIn";
            break;
          }

          try {
            const resp = await FETCH_AUTH.RefreshToken();
            SET_COOKIE(resp.accessToken);
            // 重試原始請求
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${resp.accessToken}`;
            return instance(originalRequest);
          } catch (error) {
            console.log("catch");
            store.dispatch(signOut());
            window.location.href = "/auth/signIn";
          }
          break;
        // ... 其他錯誤處理 ...
      }
    }
    return Promise.reject<ApiError>({
      respData: error.response?.data,
      errorMessage: error.response?.data?.message,
      status: error.response?.status,
    });
  }
);

export default instance;
