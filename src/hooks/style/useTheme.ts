import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";

export const useTheme = (): ThemeContextType => useContext(ThemeContext); 