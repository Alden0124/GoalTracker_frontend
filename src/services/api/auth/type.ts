// 定義 API 響應的基本數據結構
export interface AuthResponse {
  message: string;
}

export interface SignInResponse extends AuthResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email?: string;
    avatar?: string;
    isEmailVerified: boolean;
    providers?: Array<"google" | "line">;
  };
}
