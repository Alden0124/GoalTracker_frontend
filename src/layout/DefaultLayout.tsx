import Header from "@/components/layout/Header";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <>
      <div className={` flex flex-col min-h-[100dvh] m-[0_auto] `}>
        <Header />
        <div className={`flex-1 bg-background-light dark:bg-background-dark`}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
