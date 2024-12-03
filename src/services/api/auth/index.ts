import { AuthResponse, SignInResponse } from "@/services/api/auth/type";
import axiosInstance from "@/services/axiosInstance";

export const FETCH_AUTH = {
  /**
   * 用戶登入 API
   * @param {object} data - 登入所需數據
   * @param {string} data.email - 用戶郵箱
   * @param {string} data.password - 用戶密碼
   * @returns {Promise<AuthResponse>} 返回登入結果
   */
  SingIn: (data: object): Promise<SignInResponse> =>
    axiosInstance.post("/auth/signIn", data),

  /**
   * 用戶註冊 API
   * @param {object} data - 註冊所需數據
   * @param {string} data.email - 用戶郵箱地址
   * @param {string} data.password - 用戶密碼
   * @returns {Promise<AuthResponse>} 返回註冊結果
   */
  SignUp: (data: object) => axiosInstance.post("/auth/signUp", data),

  signOut: (): Promise<AuthResponse> => axiosInstance.post("/auth/signout"),

  GoogleLogin: (data: { token: string }): Promise<SignInResponse> =>
    axiosInstance.post("/auth/signIn/google", data),

  LineLogin: (data: object): Promise<SignInResponse> =>
    axiosInstance.post("/auth/signIn/line", data),

  /**
   * 忘記密碼 API
   * @param {object} data - 請求數據
   * @param {string} data.email - 用戶郵箱
   * @returns {Promise<AuthResponse>} 返回重置密碼郵件發送結果
   */
  "Forgot-password": (data: { email: string }): Promise<AuthResponse> =>
    axiosInstance.post("/verification/forgot-password", data),

  /**
   * 重設密碼 API
   * @param {object} data - 請求數據
   * @param {string} data.email - 用戶郵箱
   * @param {string} data.code - 驗證碼
   * @param {string} data.newPassword - 密碼
   * @returns {Promise<AuthResponse>} 返回重置密碼郵件發送結果
   */
  ResetPassword: (data: object): Promise<AuthResponse> =>
    axiosInstance.post("/verification/reset-password", data),

  /**
   * 發送郵箱驗證碼 API
   * @param {object} data - 請求數據
   * @param {string} data.email - 需要發送驗證碼的目標郵箱
   * @returns {Promise<AuthResponse>} 返回發送結果
   */
  "send-verification-code": (data: { email: string }): Promise<AuthResponse> =>
    axiosInstance.post("/verification/send-code", data),

  /**
   * 驗證郵箱驗證碼 API
   * @param {object} data - 驗證所需數據
   * @param {string} data.email - 用戶郵箱
   * @param {string} data.code - 驗證碼
   * @returns {Promise<AuthResponse>} 返回驗證結果
   */
  VerifyCode: (data: object) =>
    axiosInstance.post("/verification/verify", data),

  /**
   * 刷新 Token API
   * @returns {Promise<{accessToken: string}>} 返回刷新後的 Token
   */
  RefreshToken: (): Promise<{ accessToken: string }> =>
    axiosInstance.post("/auth/refresh-token"),
};
