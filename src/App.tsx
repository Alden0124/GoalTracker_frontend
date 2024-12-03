import { ThemeProvider } from "@/provider/ThemeProvider";
import Routes from "./router";
// style
import "@/assets/style/common.css";

function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
