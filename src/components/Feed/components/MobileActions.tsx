import Dialog from "@/components/common/Dialog";
import { memo, useState } from "react";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import Following from "./Following";

const MobileActions = memo(() => {
  const [showUserListDialog, setShowUserListDialog] = useState(false);
  const [showRecommendDialog, setShowRecommendDialog] = useState(false);

  return (
    <>
      <div className="flex justify-center gap-4 md:hidden">
        <button
          onClick={() => setShowUserListDialog(true)}
          className="w-[50%] p-2 rounded-[5px] bg-gray-100 dark:bg-gray-800 
            hover:bg-gray-200 dark:hover:bg-gray-700 
            transition-colors text-foreground-light dark:text-foreground-dark"
          title="粉絲與追蹤"
        >
          <div className="flex justify-center items-center gap-2">
            <FiUsers className="h-6 w-6" />
            <p>粉絲與追蹤</p>
          </div>
        </button>
        <button
          onClick={() => setShowRecommendDialog(true)}
          className="w-[50%] p-2 rounded-[5px] bg-gray-100 dark:bg-gray-800 
            hover:bg-gray-200 dark:hover:bg-gray-700 
            transition-colors text-foreground-light dark:text-foreground-dark"
          title="推薦用戶"
        >
          <div className="flex justify-center items-center gap-2">
            <FiUserPlus className="h-6 w-6" />
            <p>推薦用戶</p>
          </div>
        </button>
      </div>

      {/* 粉絲與追蹤列表 Dialog */}
      <Dialog
        isOpen={showUserListDialog}
        onClose={() => setShowUserListDialog(false)}
        title={null}
      >
        <Following className="border-none shadow-none" />
      </Dialog>

      {/* 推薦用戶 Dialog */}
      <Dialog
        isOpen={showRecommendDialog}
        onClose={() => setShowRecommendDialog(false)}
        title="推薦用戶"
      >
        <div>推薦用戶列表內容</div>
      </Dialog>
    </>
  );
});

MobileActions.displayName = "MobileActions";

export default MobileActions;
