import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// redux
import { useAppDispatch, useAppSelector } from "@/hooks/common/useAppReduxs";
import { selectIsAuthenticated, signOut } from "@/stores/slice/userReducer";
// alert
import { notification } from "@/utils/notification";
// hooks
import { useCurrentUser } from "@/hooks/profile/ProfileInfo/queries/useProfileProfileInfoQueries";
// cookies
import { GET_COOKIE } from "@/utils/cookies";
// react query
import { useQueryClient } from "@tanstack/react-query";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isError, isLoading } = useCurrentUser();

  useEffect(() => {
    const token = GET_COOKIE();

    if (!token) {
      // 清空所有快取
      queryClient.clear();
      dispatch(signOut());
    }

    // 如果正在全局加載中，先不做任何路由判斷
    if (isLoading) return;

    // 已登入不可訪問的頁面列表
    const authOnlyPaths = [
      "/auth/signIn",
      "/auth/signUp",
      "/auth/forget",
      "/auth/sendCode",
      "/auth/verifyCode",
      "/auth/resetPassword",
      "/home",
    ];

    // 有登入沒登入都可以訪問的頁面列表
    // const publicPaths = ["/"];

    // 只有登入才能訪問的頁面列表
    const protectedPaths = ["/feed", "/profile", "/chatRoom"];

    // 判斷已登入不可訪問的頁面(登入註冊相關頁面)
    const isAuthOnlyPath = authOnlyPaths.some(
      (path) => location.pathname.toLowerCase() === path.toLowerCase()
    );

    // 判斷只有登入才能訪問的頁面
    const isProtectedPath = protectedPaths.some(
      (path) => location.pathname.toLowerCase().startsWith(path.toLowerCase()) // 修改這裡
    );

    // 有 token 但獲取用戶資料失敗
    if (token && isError) {
      notification.error({
        title: "請重新登入",
      });
      // 清空所有快取
      queryClient.clear();
      navigate("/auth/signIn", { replace: true });
      return;
    }

    // 已登入用戶訪問 auth 頁面，重定向到首頁
    if (isAuthenticated && isAuthOnlyPath) {
      navigate("/feed", { replace: true });
      return;
    }

    // 未登入用戶訪問需要會員權限的頁面
    if (!isAuthenticated && isProtectedPath) {
      // 清空所有快取
      queryClient.clear();
      // 重定向到登入頁面
      navigate("/auth/signIn", {
        // state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // 如果路徑不屬於任何已定義的類型，可以選擇重定向到首頁或顯示 404
    if (!isAuthOnlyPath && !isProtectedPath) {
      navigate("/feed", { replace: true });
    }
  }, [
    dispatch,
    isAuthenticated,
    isError,
    isLoading,
    location.pathname,
    navigate,
    queryClient,
  ]);

  // 使用全局 loading 狀態
  if (isLoading) {
    return null; // 或者返回一個全局 loading 組件
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
