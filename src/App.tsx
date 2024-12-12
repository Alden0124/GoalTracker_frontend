import "@/assets/style/common.css";
import "@/assets/style/notification.css";
import { ChatWindowManager } from "@/components/Chat/ChatWindowManager";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { ToastProvider } from "@/provider/ToastProvider";
import { selectIsAuthenticated } from "@/stores/slice/userReducer";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "./hooks/common/useAppReduxs";
import { useSocketListener } from "./hooks/useSocketListener";
import Routes from "./router";
function App() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // 監聽新訊息
  useSocketListener();
  
  return (
    <ThemeProvider>
      <ToastProvider>
        {isAuthenticated && <ChatWindowManager />}
        <Routes />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
