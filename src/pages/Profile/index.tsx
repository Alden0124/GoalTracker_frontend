import ProfileGoals from "@/components/Profile/ProfileGoals";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import ProfileSkeleton from "@/components/Profile/ProfileInfo/skeleton/ProfileSkeleton";
import { useProfileData } from "@/hooks/profile/ProfileInfo/useProfile";
import { useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { isCurrentUser, isLoading, error, data } = useProfileData();
  const navigate = useNavigate();

  useEffect(() => {
    if (error && !data) {
      navigate("/");
    }
  }, [error, data, navigate]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error && !data) {
    return null;
  }

  return (
    <div className="  min-h-[calc(100vh-64px)] dark:bg-background-secondaryDark">
      <div className="flex  w-[90%] flex-col items-center py-[20px] px-[10px] gap-[30px] max-w-[1200px] md:flex-row m-[0_auto] md:items-start">
        {data?.user && (
          <>
            <ProfileInfo isCurrentUser={isCurrentUser} userData={data.user} />
            <ProfileGoals isCurrentUser={isCurrentUser} userData={data.user} />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
