import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { selectIsAuthenticated } from "@/stores/slice/userReducer";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  const isLogin = useAppSelector(selectIsAuthenticated);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>

        <h2 className="text-2xl font-semibold text-gray-700">
          糟糕！找不到頁面
        </h2>

        <p className="text-gray-600 max-w-md mx-auto">
          您要尋找的頁面可能已被移除、名稱已更改或暫時無法使用。
        </p>

        <div className="space-x-4">
          <Link
            to={isLogin ? "/feed" : "/"}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首頁
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-block px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            返回上一頁
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
