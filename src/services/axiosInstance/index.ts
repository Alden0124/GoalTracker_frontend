import { store } from "@/stores";
import { signOut } from "@/stores/slice/userReducer";
import { GET_COOKIE, SET_COOKIE } from "@/utils/cookies";
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

// 請求攔截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 取得目前語言
    const currentLang = localStorage.getItem("language") || "zh-TW";

    // 設定 headers
    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    // 設定語言
    config.headers.set("Accept-Language", currentLang);

    // 設定 content-type
    if (!config.headers.get("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }

    // 設定 token
    const token = GET_COOKIE() || false;

    // 設定 token
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    console.error("請求攔截器錯誤:", error);
    return Promise.reject(error);
  }
);

// 響應攔截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          try {
            const resp = await FETCH_AUTH.RefreshToken();
            SET_COOKIE(resp.accessToken);
            // 重試原始請求
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${resp.accessToken}`;
            return instance(originalRequest);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            store.dispatch(signOut());
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
