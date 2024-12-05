import ProfileGoals from "@/components/Profile/ProfileGoals";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import ProfileSkeleton from "@/components/Profile/ProfileInfo/skeleton/ProfileSkeleton";
import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { useProfileData } from "@/hooks/profile/ProfileInfo/useProfile";
import { selectIsAuthenticated } from "@/stores/slice/userReducer";
import { useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { isCurrentUser, isLoading, error, data } = useProfileData();
  const isLogin = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (error && !data) {
      navigate(isLogin ? "/feed" : "/");
    }
  }, [error, data, navigate, isLogin]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error && !data) {
    return null;
  }

  return (
    <div className="flex w-[90%] flex-col items-center py-[20px] px-[10px] gap-[30px] max-w-[1440px] md:flex-row m-[0_auto] md:items-start">
      {data?.user && (
        <>
          <ProfileInfo isCurrentUser={isCurrentUser} userData={data.user} />
          <ProfileGoals isCurrentUser={isCurrentUser} userData={data.user} />
        </>
      )}
    </div>
  );
};

export default Profile;
