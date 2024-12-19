import { useTranslation } from "react-i18next";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Link
        to="/home"
        className="w-fit flex items-center gap-2 p-[20px] md:pl-[40px] md:py-[20px] rounded-lg 
          text-foreground-light dark:text-foreground-dark dark:hover:bg-gray-800 
          transition-colors duration-200 group"
      >
        <IoArrowBackOutline className="h-5 w-5 transform transition-transform duration-200 group-hover:-translate-x-1" />
        <span>{t("auth:backToHome")}</span>
      </Link>

      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 