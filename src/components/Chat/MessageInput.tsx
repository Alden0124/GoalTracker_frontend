import { useState } from "react";
import { IoSend } from "react-icons/io5";

interface MessageInputProps {
  handleSend: (inputMessage: string) => Promise<void>;
}

export const MessageInput = ({ handleSend }: MessageInputProps) => {
  // 輸入訊息
  const [inputMessage, setInputMessage] = useState("");

  // 處理輸入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  // 處理按鍵
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInputMessage('')
      handleSend(inputMessage);
    }
  };

  const handleSendMessage = () => {
    setInputMessage("");
    handleSend(inputMessage);
  };

  return (
    <div className="border-t p-3 flex items-center space-x-2">
      <input
        type="text"
        value={inputMessage}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="輸入訊息..."
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
