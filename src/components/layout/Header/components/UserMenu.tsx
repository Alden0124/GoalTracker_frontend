import { useAppDispatch, useAppSelector } from "@/hooks/common/useAppReduxs";
import { FETCH_AUTH } from "@/services/api/auth";
import { selectUserProFile, signOut } from "@/stores/slice/userReducer";
import { notification } from "@/utils/notification";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoChevronDownOutline, IoPersonOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const UserMenu = () => {
  const dispatch = useAppDispatch(); // 用於派發 Redux actions
  const useProFile = useAppSelector(selectUserProFile);
  const { t } = useTranslation(["common"]); // 用於國際化翻譯
  const navigate = useNavigate(); // 用於路由導航
  const location = useLocation(); // 獲取當前路徑
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 控制下拉選單的開關狀態
  const menuRef = useRef<HTMLDivElement>(null); // 用於獲取選單 DOM 元素的引用

  // 點擊選單外部時關閉選單的效果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // 只在選單開啟時添加事件監聽器
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // 清理函數
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    try {
      // 先清除 token，避免觸發不必要的請求
      dispatch(signOut());

      // 再執行登出 API
      await FETCH_AUTH.signOut();
      notification.success({
        title: "登出成功",
      });

      // 最後導航到登入頁
      navigate("/auth/signIn");
    } catch (error) {
      console.error("Logout API failed:", error);
      // 如果登出 API 失敗，仍然保持登出狀態
      navigate("/auth/signIn");
    }
  };

  // 修改判斷當前路徑的函數
  const isCurrentPath = (path: string) => {
    // 如果是 profile 頁面，檢查是否匹配 /profile/ 開頭的路徑
    if (path === "/profile") {
      return location.pathname.startsWith("/profile/");
    }
    // 其他頁面保持完全匹配
    return location.pathname === path;
  };

  return (
    <div className="w-12 flex items-center justify-center">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative flex rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 group"
        >
          <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
            {useProFile?.avatar !== "" ? (
              <img
                src={useProFile.avatar}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <IoPersonOutline className="h-6 w-6" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-gray-200 dark:bg-gray-700 rounded-full p-[2px] transform translate-x-1 translate-y-1">
            <IoChevronDownOutline
              className={`h-3 w-3 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background-light dark:bg-background-dark py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            {/* 登出 */}
            <button
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-foreground-light dark:text-foreground-dark text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {t("common:logout")}
            </button>

            {/* 個人資料 */}
            <button
              onClick={() => {
                navigate(`/profile/${useProFile.id}`);
                setIsMenuOpen(false);
              }}
              className={`
                block w-full px-4 py-2 text-sm text-left 
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${
                  isCurrentPath("/profile") // 這裡改為檢查 '/profile'
                    ? "text-foreground-lightBlue bg-gray-50 dark:bg-gray-800"
                    : "text-foreground-light dark:text-foreground-dark"
                }
              `}
            >
              {t("common:profile")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
