import { ThemeProvider } from "@/provider/ThemeProvider";
import { ToastProvider } from "@/provider/ToastProvider";
import Routes from "./router";
// style
import "@/assets/style/common.css";
import "@/assets/style/notification.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
