import { Outlet, Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const AuthLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="absolute top-4 left-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
            text-foreground-light dark:text-foreground-dark
            hover:bg-gray-100 dark:hover:bg-gray-800 
            transition-colors duration-200"
        >
          <IoArrowBackOutline className="h-5 w-5" />
          <span>{t("backToHome")}</span>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 