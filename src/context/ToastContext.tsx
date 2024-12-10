import { createContext } from "react";

export interface ToastContextType {
  setToastPortalElement: (element: HTMLElement | null) => void;
  toastPortalElement: HTMLElement | null;
}

export const ToastContext = createContext<ToastContextType>({
  setToastPortalElement: () => {},
  toastPortalElement: null,
});

