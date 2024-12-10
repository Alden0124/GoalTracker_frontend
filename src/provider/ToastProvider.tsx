import { ToastContext } from "@/context/ToastContext";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ToastContainer } from "react-toastify";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastPortalElement, setToastPortalElement] =
    useState<HTMLElement | null>(null);

  // console.log(toastPortalElement);

  return (
    <ToastContext.Provider
      value={{ toastPortalElement, setToastPortalElement }}
    >
      {children}
      {toastPortalElement ? (
        createPortal(<ToastContainer />, toastPortalElement)
      ) : (
        <ToastContainer />
      )}
    </ToastContext.Provider>
  );
};
