const NoUserIdskeleton = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="mt-4 text-gray-500">請選擇一個聊天對象開始對話</p>
      </div>
    </div>
  );
};

export default NoUserIdskeleton;
