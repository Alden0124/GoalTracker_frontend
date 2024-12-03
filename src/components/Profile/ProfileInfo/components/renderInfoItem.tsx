// 用戶資訊項目渲染函數
const renderInfoItem = (
  icon: React.ReactNode,
  value: string | undefined,
  placeholder: string,
  isCurrentUser: boolean,
  setShowEditDialog: (show: boolean) => void
) => (
  <div className="flex items-center gap-2 text-[16px]">
    <span className="text-gray-500 dark:text-gray-400">{icon}</span>
    {value ? (
      <span className="text-[#71717a] dark:text-gray-300">{value}</span>
    ) : (
      isCurrentUser && (
        <span
          className="text-gray-400 dark:text-gray-500 italic cursor-pointer hover:text-gray-600 dark:hover:text-gray-400"
          onClick={() => setShowEditDialog(true)}
        >
          {placeholder}
        </span>
      )
    )}
  </div>
);

export default renderInfoItem;
