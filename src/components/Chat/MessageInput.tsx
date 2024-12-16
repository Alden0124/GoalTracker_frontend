import { useState } from "react";
import { IoSend } from "react-icons/io5";

interface MessageInputProps {
  handleSend: (inputMessage: string) => void;
}

export const MessageInput = ({ handleSend }: MessageInputProps) => {
  // 輸入訊息
  const [inputMessage, setInputMessage] = useState("");

  // 處理輸入
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  // 處理按鍵
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setInputMessage("");
      handleSend(inputMessage);
    }
  };

  const handleSendMessage = () => {
    setInputMessage("");
    handleSend(inputMessage);
  };

  return (
    <div className="border-t p-3 flex items-center space-x-2 bg-background-light dark:bg-background-dark ">
      <textarea
        value={inputMessage}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1 border rounded-full px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-input dark:text-dark-text"
        placeholder="輸入訊息..."
        rows={1}
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <IoSend className="w-5 h-5" />
      </button>
    </div>
  );
};

MessageInput.displayName = "MessageInput";
