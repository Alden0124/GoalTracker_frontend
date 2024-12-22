import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// 1. 先定義所有 mock 變量
const mockLogin = vi.fn();
const mockHandleSignInSuccess = vi.fn();
const mockHandleSignInError = vi.fn();
const mockGoogleLoginApi = vi.fn();

// 2. 所有的 mock 必須在任何導入之前
vi.mock("@/services/api/auth", () => ({
  FETCH_AUTH: {
    GoogleLogin: (params: { token: string }) => mockGoogleLoginApi(params),
  },
}));

vi.mock("@react-oauth/google", () => ({
  useGoogleLogin: (options: {
    onSuccess?: (response: { access_token: string }) => void;
  }) => {
    return () => {
      mockLogin();
      // 模擬 Google 登入流程
      return new Promise((resolve) => {
        setTimeout(() => {
          options.onSuccess?.({ access_token: "test-access-token" });
          resolve({ access_token: "test-access-token" });
        }, 0);
      });
    };
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/hooks/auth/useSignIn", () => ({
  useSignInHandler: () => ({
    handelSignInSucess: mockHandleSignInSuccess,
    handleSignInError: mockHandleSignInError,
  }),
}));

// 3. 最後才導入要測試的組件
import GoogleLoginButton from "../GoogleLoginButton";

describe("GoogleLoginButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("應正確渲染按鈕", () => {
    render(<GoogleLoginButton />);

    const button = screen.getByTestId("google-login-button");
    // 直接檢查按鈕內容，不使用 button-text
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("auth:googleLogin");
  });

  it("應該套用自定義 className", () => {
    const customClass = "custom-class";
    render(<GoogleLoginButton className={customClass} />);
    expect(screen.getByTestId("google-login-button")).toHaveClass(customClass);
  });

  it("當 isSubmitting 為 true 時按鈕應該被禁用", () => {
    // 模擬 SignIn 組件傳入的 className
    const submittingClassName = "opacity-50 cursor-not-allowed";

    render(
      <GoogleLoginButton isSubmitting={true} className={submittingClassName} />
    );

    const button = screen.getByTestId("google-login-button");

    // 1. 檢查按鈕是否被禁用
    expect(button).toBeDisabled();

    // 2. 檢查基本樣式和傳入的樣式是否都存在
    expect(button).toHaveClass(
      "w-full border opacity-50 border opacity-50 cursor-not-allowed"
    );
  });

  it("點擊按鈕時應該調用 login", () => {
    render(<GoogleLoginButton />);
    // 觸發登入
    fireEvent.click(screen.getByTestId("google-login-button"));
    // 檢查 mockLogin 是否被調用
    expect(mockLogin).toHaveBeenCalled();
  });

  it("登入成功時應該正確處理整個流程", async () => {
    const mockSetIsSubmitting = vi.fn();
    const mockResponse = { token: "test-token" };
    mockGoogleLoginApi.mockResolvedValueOnce(mockResponse);

    render(<GoogleLoginButton setIsSubmitting={mockSetIsSubmitting} />);
    fireEvent.click(screen.getByTestId("google-login-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
    });

    await waitFor(() => {
      expect(mockGoogleLoginApi).toHaveBeenCalledWith({
        token: "test-access-token", // 確保參數格式正確
      });
    });

    await waitFor(() => {
      expect(mockHandleSignInSuccess).toHaveBeenCalledWith(mockResponse);
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });
  });

  it("登入失敗時應該正確處理錯誤", async () => {
    const mockSetIsSubmitting = vi.fn();
    const mockError = new Error("Login failed");
    mockGoogleLoginApi.mockRejectedValueOnce(mockError);

    render(<GoogleLoginButton setIsSubmitting={mockSetIsSubmitting} />);

    // 觸發登入
    fireEvent.click(screen.getByTestId("google-login-button"));

    // 等待非同步操作完成
    await waitFor(() => {
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
    });

    await waitFor(() => {
      expect(mockHandleSignInError).toHaveBeenCalledWith(mockError);
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });
  });
});
