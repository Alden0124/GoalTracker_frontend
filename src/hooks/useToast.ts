import { ToastContext, ToastContextType } from "@/context/ToastContext";
import { useContext } from "react";

export const useToast = ():ToastContextType => useContext(ToastContext);

