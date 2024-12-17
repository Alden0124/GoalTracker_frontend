import NoUserIdskeleton from "@/components/ChatRoom/skeleton/NoUserIdskeleton";
import UserList from "@/components/ChatRoom/UserList";
import { useAppDispatch } from "@/hooks/common/useAppReduxs";
import { closeChatRoom } from "@/stores/slice/chatReducer";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

const ChatRoom = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // 離開聊天室
  useEffect(() => {
    return () => {
      dispatch(closeChatRoom());
    };
  }, [dispatch]);

  // 桌面版顯示
  return (
    <>
      <div className="flex h-[calc(100vh-64px)] bg-light-background dark:bg-dark-background md:hidden">
        {id ? <Outlet /> : <UserList />}
      </div>

      <div className=" h-[calc(100vh-64px)] bg-light-background dark:bg-dark-background hidden md:flex">
        <UserList />
        {!id ? <NoUserIdskeleton /> : <Outlet />}
      </div>
    </>
  );
};

export default ChatRoom;
