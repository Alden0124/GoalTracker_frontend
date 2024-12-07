import ProfileGoals from "@/components/Profile/ProfileGoals";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import "react-loading-skeleton/dist/skeleton.css";


const Profile = () => {
  return (
    <div className=" flex w-[95%] flex-col items-center py-[20px] gap-[30px] max-w-[1440px] md:flex-row m-[0_auto] md:items-start md:px-[10px] md:gap-[20px] md:w-full">
      <ProfileInfo />
      <ProfileGoals />
    </div>
  );
};

export default Profile;
