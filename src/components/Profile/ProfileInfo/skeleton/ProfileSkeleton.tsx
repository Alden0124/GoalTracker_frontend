import Skeleton from "react-loading-skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="md:min-h-[calc(100vh-64px)] bg-background-secondaryLight dark:bg-background-secondaryDark">
      <div className="flex flex-col items-center py-[20px] px-[10px] gap-[30px] max-w-[1200px] md:flex-row m-[0_auto] md:items-start">
        <div className="md:px-[50px] md:w-[35%] md:min-h-[600px]">
          <div className="flex flex-col items-center pb-6">
            <Skeleton circle width={120} height={120} />
            <Skeleton width={150} height={24} className="mt-4" />
          </div>
          <div className="py-10 space-y-5">
            <Skeleton count={3} height={30} />
          </div>
          <div className="flex justify-around py-4">
            <Skeleton width={80} height={50} />
            <Skeleton width={80} height={50} />
          </div>
        </div>
        <div className="md:flex-1">
          <Skeleton height={200} count={3} className="mb-4" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
