const CommentSkeleton = () => {
  return (
    <div className="border-t dark:border-gray-700 pt-3 min-h-[88px]">
      <div className="flex gap-2">
        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1">
          <div className="w-3/4 h-[42px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
