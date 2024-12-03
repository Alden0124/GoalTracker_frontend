const GoalSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-3"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalSkeleton;
