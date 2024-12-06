import { useToast } from "@/hooks/useToast";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string | null;
  className?: string;
  childrenClassName?: string | null;
  footer?: React.ReactNode | null;
}

const Dialog = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  childrenClassName,
  footer,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { setToastPortalElement } = useToast();
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // 處理 dialog 的關閉事件
  const handleClose = () => {
    onClose();
    setToastPortalElement(null);
  };

  // 控制 dialog 的顯示與隱藏
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      setToastPortalElement(dialogContentRef.current);
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      setToastPortalElement(null);
      document.body.style.overflow = "unset";
    }

    // 清理函數
    return () => {
      document.body.style.overflow = "unset";
      setToastPortalElement(null);
    };
  }, [isOpen, setToastPortalElement]);

  // 處理 dialog 的 backdrop 點擊事件
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <dialog
      id="portal-dialog"
      ref={dialogRef}
      className={` mx-auto w-[90%] md:w-[600px] bg-white dark:bg-background-dark rounded-lg shadow-xl p-0 backdrop:bg-black/25 z-[0] ${className}`}
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
    >
      <div
        ref={dialogContentRef}
        className="flex flex-col max-h-[90vh] relative"
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-medium text-foreground-light dark:text-foreground-dark">
              {title}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <IoClose className="text-xl" />
            </button>
          </div>
        )}
        <div
          className={`p-4 overflow-y-auto flex-1 custom-scrollbar ${childrenClassName}
            `}
        >
          {children}
        </div>
        {footer}
      </div>
    </dialog>,
    document.getElementById("portal-root")!
  );
};

export default Dialog;
