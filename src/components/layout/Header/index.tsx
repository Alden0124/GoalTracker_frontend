// icon
import { AiOutlineGlobal } from "react-icons/ai";
import { CiDark } from "react-icons/ci";
import {
  IoChatbubbleOutline,
  IoNotificationsOutline,
  IoSunnyOutline,
} from "react-icons/io5";
// i18n
import { useTranslation } from "react-i18next";
// 自訂一hook
import { useTheme } from "@/hooks/style/useTheme";
import { Link, useLocation } from "react-router-dom";
// redux
import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { selectIsAuthenticated } from "@/stores/slice/userReducer";
// utils
import UserList from "@/components/layout/Header/components/UserList";
import UserMenu from "@/components/layout/Header/components/UserMenu";
import { useGetUnreadNotificationCount } from "@/hooks/notifications/Chat/useNotifications";
import { useEffect, useRef, useState } from "react";
import IconButton from "./components/IconButton";
import ListWrapper from "./components/ListWrapper";
import NotificationList from "./components/NotificationList";
const Header = () => {
  const location = useLocation();
  const isLogin = useAppSelector(selectIsAuthenticated);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [showChatList, setShowChatList] = useState(false);
  const [showLanguageList, setShowLanguageList] = useState(false);
  const languageListRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const [showNotificationList, setShowNotificationList] = useState(false);
  const notificationListRef = useRef<HTMLDivElement>(null);

  const { data: unreadNotificationCount } = useGetUnreadNotificationCount();
  const unreadCount = unreadNotificationCount?.unreadCount;


  const currentLanguageList = [
    {
      label: "English",
      value: "en-US",
    },
    {
      label: "繁體中文",
      value: "zh-TW",
    },
  ];

  // 切換主題
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 切換語言
  const handleLanguageChange = ( value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("language", value);
    setShowLanguageList(false);
  };

  // 監聽點擊事件
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 聊天列表
      if (
        chatListRef.current &&
        !chatListRef.current.contains(event.target as Node)
      ) {
        setShowChatList(false);
      }
      // 語言列表
      if (
        languageListRef.current &&
        !languageListRef.current.contains(event.target as Node)
      ) {
        setShowLanguageList(false);
      }
      // 通知列表
      if (
        notificationListRef.current &&
        !notificationListRef.current.contains(event.target as Node)
      ) {
        setShowNotificationList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  return (
    <header
      className={`
        h-[64px] py-[8px] px-[15px] md:px-[30px] sticky top-0
        flex justify-between items-center border-b shadow-sm 
        bg-background-light dark:bg-background-dark
        text-foreground-light dark:text-foreground-dark z-10
      `}
    >
      {/* 標題 */}
      <Link to={isLogin ? "/feed" : "/"} className="text-[18px]">
        GoalTracker
      </Link>

      {/* 選單 */}
      <div className="flex items-center justify-between text-[16px] gap-[12px] sm:gap-[6px] ">
        {/* 語言選擇 */}
        <div className="relative" ref={languageListRef}>
          <IconButton
            onClick={() => setShowLanguageList(!showLanguageList)}
            ariaLabel={t("changeLanguage")}
          >
            <AiOutlineGlobal />
          </IconButton>
          {showLanguageList && (
            <ListWrapper className={`md:w-48`}>
              {currentLanguageList.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={`
                    w-full px-4 py-2 text-left
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    ${
                      i18n.language === lang.value
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""
                    }
                  `}
                >
                  {lang.label}
                </button>
              ))}
            </ListWrapper>
          )}
        </div>

        {/* 主題 */}
        <IconButton
          onClick={toggleTheme}
          ariaLabel={t("changeTheme")}
        >
          {theme === "dark" ? <IoSunnyOutline /> : <CiDark />}
        </IconButton>

        {/* 登入後的選單 */}
        {isLogin && (
          <>
            {/* 聊天列表 */}
            <div
              ref={chatListRef}
              className={` relative ${
                location.pathname.includes("/chatRoom") ? "hidden" : "block"
              }`}
            >
              <IconButton
                onClick={() => setShowChatList(!showChatList)}
                ariaLabel={t("messages")}
              >
                <IoChatbubbleOutline />
              </IconButton>
              {/* 聊天列表彈出層 */}
              {showChatList && (
                <ListWrapper className={`md:w-fit`}>
                  <UserList
                    setShowChatList={setShowChatList}
                    className={`h-[calc(100vh-64px)] md:h-auto `}
                  />
                </ListWrapper>
              )}
            </div>

            {/* 通知 */}
            <div className="relative" ref={notificationListRef}>
              <IconButton 
                onClick={() => setShowNotificationList(!showNotificationList)}
                ariaLabel={t("notifications")}
              >
                <IoNotificationsOutline />
                {unreadCount && unreadCount > 0 && (
                  <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </IconButton>
              {showNotificationList && (
                <ListWrapper className="md:w-80">
                  <NotificationList
                    setShowNotificationList={setShowNotificationList}
                    className="h-[calc(100vh-64px)] md:h-auto"
                  />
                </ListWrapper>
              )}
            </div>
          </>
        )}

        {isLogin ? (
          // 登入後-選單
          <UserMenu />
        ) : (
          // 登入前-登入
          <Link to={"/auth/signIn"} className={`btn-primary ml-[15px]`}>
            {t("login")}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
