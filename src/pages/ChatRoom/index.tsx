import NoUserIdskeleton from "@/components/ChatRoom/skeleton/NoUserIdskeleton";
import UserList from "@/components/ChatRoom/UserList";
import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import { closeChatRoom } from "@/stores/slice/chatReducer";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

const ChatRoom = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // 進入聊天室時禁用外層滾動條，離開時恢復
  useEffect(() => {
    // 儲存原始的 overflow 值
    const originalOverflow = document.body.style.overflow;
    // 禁用滾動
    document.body.style.overflow = "hidden";

    return () => {
      // 組件卸載時恢復原始設置
      document.body.style.overflow = originalOverflow;
      dispatch(closeChatRoom());
    };
  }, [dispatch]);

  // 桌面版顯示
  return (
    <>
      <div className="flex h-[calc(100dvh-64px)] bg-light-background dark:bg-dark-background md:hidden overflow-hidden">
        {id ? <Outlet /> : <UserList />}
      </div>

      <div className="h-[calc(100dvh-64px)] bg-light-background dark:bg-dark-background hidden md:flex overflow-hidden">
        <UserList />
        {!id ? <NoUserIdskeleton /> : <Outlet />}
      </div>
    </>
  );
};

export default ChatRoom;
