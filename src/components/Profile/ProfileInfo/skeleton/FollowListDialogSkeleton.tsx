import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FollowListDialogSkeleton = () => {
  return (
    <div className="space-y-4 p-4 w-full">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={100} />
          </div>
          <Skeleton width={50} />
        </div>
      ))}
    </div>
  );
};

export default FollowListDialogSkeleton;
