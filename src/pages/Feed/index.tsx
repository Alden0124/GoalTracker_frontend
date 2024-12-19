import Following from "@/components/Feed/components/Following";
import GoalList from "@/components/Feed/components/GoalList";
import MobileActions from "@/components/Feed/components/MobileActions";
import RecommendUsers from "@/components/Feed/components/RecommendUsers";
import SearchBar from "@/components/Feed/components/SearchBar";
import { useState } from "react";

const Feed = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <div
      className="flex w-[95%] flex-col items-center py-[20px] m-[0_auto] max-w-[1440px] 
      md:px-[10px] md:gap-[20px] md:flex-row md:w-full md:items-start"
    >
      {/* 桌面版側邊欄 */}
      <div
        className={`hidden md:flex flex-col md:w-[40%] lg:w-[30%] gap-4 sticky top-[64px]`}
      >
        <Following />
        <RecommendUsers />
      </div>

      {/* 目標列表區域 */}
      <div className="w-full md:w-[60%] lg:w-[70%] flex flex-col gap-4">
        <SearchBar onSearch={handleSearch} />
        <MobileActions />
        <GoalList searchKeyword={searchKeyword} />
      </div>
    </div>
  );
};

export default Feed;
