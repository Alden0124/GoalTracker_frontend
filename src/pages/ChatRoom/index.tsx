import NoUserIdskeleton from "@/components/ChatRoom/skeleton/NoUserIdskeleton";
import UserList from "@/components/ChatRoom/UserList";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

const ChatRoom = () => {
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 在移動端，如果有選擇用戶，只顯示聊天內容
  if (isMobile && id) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-light-background dark:bg-dark-background">
        <Outlet />
      </div>
    );
  }

  // 在移動端，如果沒有選擇用戶，只顯示用戶列表
  if (isMobile && !id) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-light-background dark:bg-dark-background">
        <UserList />
      </div>
    );
  }

  // 桌面版顯示
  return (
    <div className="flex h-[calc(100vh-64px)] bg-light-background dark:bg-dark-background">
      <UserList />
      {!id ? <NoUserIdskeleton /> : <Outlet />}
    </div>
  );
};

export default ChatRoom;