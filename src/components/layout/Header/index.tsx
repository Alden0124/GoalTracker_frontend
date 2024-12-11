// icon
import { AiOutlineGlobal } from "react-icons/ai";
import { CiDark } from "react-icons/ci";
import { IoChatbubbleOutline, IoNotificationsOutline, IoSunnyOutline } from "react-icons/io5";
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
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const location = useLocation();
  const isLogin = useAppSelector(selectIsAuthenticated);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [showChatList, setShowChatList] = useState(false);
  const [showLanguageList, setShowLanguageList] = useState(false);
  const languageListRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  // 切換主題
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 切換語言
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setShowLanguageList(false);
  };

  // 監聽點擊事件
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatListRef.current && !chatListRef.current.contains(event.target as Node)) {
        setShowChatList(false);
      }
      if (languageListRef.current && !languageListRef.current.contains(event.target as Node)) {
        setShowLanguageList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      <Link to={isLogin ? "/feed" : "/"} className="text-[18px]">
        GoalTracker
      </Link>
      <div className="flex items-center justify-between text-[16px] gap-[12px] sm:gap-[6px] ">
        {/* 語言選擇 */}
        <div className="relative" ref={languageListRef}>
          <button
            onClick={() => setShowLanguageList(!showLanguageList)}
            className="flex w-12 h-12 rounded-full items-center justify-center hover:opacity-80 dark:hover:bg-foreground-darkHover"
            aria-label={t("changeLanguage")}
          >
            <AiOutlineGlobal />
          </button>
          {showLanguageList && (
            <div className={`
              absolute right-0 mt-2 z-50
              md:w-48 md:right-0 
              w-full left-0 top-[64px]
              md:top-[initial] md:mt-2
              bg-background-light dark:bg-background-dark
              md:border md:rounded-lg md:shadow-lg
            `}>
              <div className="py-2">
                <button
                  onClick={() => handleLanguageChange('en-US')}
                  className={`
                    w-full px-4 py-2 text-left
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    ${i18n.language === 'en-US' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                  `}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('zh-TW')}
                  className={`
                    w-full px-4 py-2 text-left
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    ${i18n.language === 'zh-TW' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                  `}
                >
                  繁體中文
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 主題 */}
        <button
          onClick={toggleTheme}
          className="flex w-4 h-4 sm:w-12 sm:h-12 rounded-full items-center justify-center hover:opacity-80 dark:hover:bg-foreground-darkHover"
        >
          {theme === "dark" ? <IoSunnyOutline /> : <CiDark />}
        </button>

        {isLogin && (
          <>
            {/* 消息 */}
            <div ref={chatListRef} className={` ${location.pathname.includes("/chatRoom") ? "hidden" : "block"}`}>
              <button
                onClick={() => setShowChatList(!showChatList)}
                className="flex w-4 h-4 sm:w-12 sm:h-12 rounded-full items-center justify-center hover:opacity-80  dark:hover:bg-foreground-darkHover"
                aria-label={t("messages")}
              >
                <IoChatbubbleOutline />
              </button>
              {/* 聊天列表彈出層 */}
              {showChatList && (
                <div 
                  className={`absolute right-0 top-[64px] w-full z-50 md:w-auto md:right-[160px] md:top-[initial] md:mt-[20px] md:h-auto md:border md:rounded-lg md:shadow-[0_0_10px_rgba(0,0,0,0.2)] md:overflow-hidden`}
                >
                  <UserList setShowChatList={setShowChatList} className={`h-[calc(100vh-64px)] md:h-auto`} />
                </div>
              )}
            </div>
            {/* 通知 */}
            <button
              className="flex w-4 h-4 sm:w-12 sm:h-12 rounded-full items-center justify-center hover:opacity-80 dark:hover:bg-foreground-darkHover"
              aria-label={t("notifications")}
            >
              <IoNotificationsOutline />
            </button>
          </>
        )}

        {isLogin ? (
          // 登入後的選單
          <UserMenu />
        ) : (
          // 登入-登入前
          <Link to={"/auth/signIn"} className={`btn-primary ml-[15px]`}>
            {t("login")}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
