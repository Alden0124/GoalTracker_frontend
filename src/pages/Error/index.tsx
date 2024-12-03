import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "發生未知錯誤";
  
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        errorMessage = "找不到該頁面";
        break;
      case 401:
        errorMessage = "您沒有權限訪問該頁面";
        break;
      case 403:
        errorMessage = "禁止訪問該頁面";
        break;
      case 500:
        errorMessage = "伺服器錯誤";
        break;
      default:
        errorMessage = "發生未知錯誤";
    }
  }

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center dark:bg-background-dark">
      <h1 className="text-4xl font-bold mb-4 dark:text-foreground-dark">
        糟糕！出錯了
      </h1>
      <p className="text-gray-600 mb-8 dark:text-foreground-dark">{errorMessage}</p>
      <button
        onClick={handleBackHome}
        className="btn-primary"
      >
        返回首頁
      </button>
    </main>
  );
};

export default ErrorPage; 