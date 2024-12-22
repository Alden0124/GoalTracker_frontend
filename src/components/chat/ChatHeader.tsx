interface ChatHeaderProps {
  recipientName: string;
  onClose: () => void;
}

export const ChatHeader = ({ recipientName, onClose }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-blue-600 rounded-t-lg">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-white font-medium">{recipientName}</span>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:bg-blue-700 rounded-full w-6 h-6 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
};
