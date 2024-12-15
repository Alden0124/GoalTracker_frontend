import { forwardRef, InputHTMLAttributes, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  onClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className = "", type, onClick, ...props }, ref) => {
    // 密碼顯示/隱藏
    const [showPassword, setShowPassword] = useState(false);
    // 密碼類型
    const isPasswordType = type === "password";
    // 日期選擇
    const isDateType = type === "date";
    // 日期選擇的 ref
   const inputRef = useRef<HTMLInputElement | null>(null);

    // 日期選擇的點擊事件
    const handleDateClick = () => {
      if (isDateType && inputRef.current) {
        inputRef.current.showPicker();
      }
    };

    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className={`text-black/70 dark:text-foreground-dark ${
              isDateType ? "block cursor-pointer" : ""
            }`}
          >
            {label}
          </label>
        )}
        <div
          className={`relative ${isDateType ? "cursor-pointer" : ""}`}
          onClick={isDateType ? handleDateClick : onClick}
        >
          <input
            ref={(e) => {
              if (inputRef.current !== e) {
                if (typeof ref === "function") ref(e);
                else if (ref) ref.current = e;
                inputRef.current = e;
              }
            }}
            type={isPasswordType ? (showPassword ? "text" : "password") : type}
            className={`w-full px-4 py-2 mt-[8px] rounded-[5px] border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background-dark dark:text-foreground-dark ${
              isPasswordType ? "pr-12" : ""
            } ${
              isDateType
                ? "cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                : ""
            } ${className}`}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ right: "15px", top: "18px" }}
              className="absolute text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {!showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;