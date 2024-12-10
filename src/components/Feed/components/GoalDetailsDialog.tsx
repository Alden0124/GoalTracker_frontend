import Dialog from "@/components/common/Dialog";
import { useAppSelector } from "@/hooks/common/useAppReduxs";
import { useMinimumLoadingTime } from "@/hooks/common/useMinimumLoadingTime";
import { useCreateComment, useGetComments } from "@/hooks/feed/useFeedQueries";
import { CommentFormData, commentSchema } from "@/schemas/commentSchema";
import { DEFAULT_COMMENTS_PARAMS } from "@/services/api/Profile/ProfileGoals/constants";
import { CreateCommentParams } from "@/services/api/Profile/ProfileGoals/type";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import CommentSkeleton from "../skeleton/CommentSkeleton";
import CommentItem from "./CommentItem";

interface GoalDetailsDialogProps {
  activeTab: "progress" | "comment";
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  isCurrentUser: boolean;
}

const GoalDetailsDialog = ({
  activeTab,
  isOpen,
  onClose,
  goalId,
  isCurrentUser,
}: GoalDetailsDialogProps) => {
  const userInfo = useAppSelector(selectUserProFile);

  // 新增留言或回覆 API hooks
  const { mutate: createComment } = useCreateComment(goalId, userInfo, {
    ...DEFAULT_COMMENTS_PARAMS,
    type: activeTab,
  });

  // 留言或回覆查詢 API hooks
  const { data: commentsData, isLoading: isGetCommentsLoading } =
    useGetComments(goalId || "", {
      ...DEFAULT_COMMENTS_PARAMS,
      type: activeTab,
    });

  const isCommentsDataMinimumLoadingTime =
    useMinimumLoadingTime(isGetCommentsLoading);

  // 表單初始化&驗證
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  // 提交主留言
  const handleFormSubmit = async (commentContent: CommentFormData) => {
    const params: CreateCommentParams = {
      content: JSON.stringify(commentContent),
      type: activeTab,
    };
    createComment(params);
    reset();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${activeTab === "progress" ? "進度紀錄" : "留言"}`}
      footer={
        isCurrentUser || activeTab === "comment" ? (
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex-shrink-0 mx-[20px]"
          >
            <div className="relative">
              <textarea
                {...register("content")}
                placeholder={`新增${
                  activeTab === "progress" ? "進度紀錄" : "留言"
                }...`}
                className={`w-full p-3 pr-12 border rounded-lg resize-none text-foreground-light dark:text-foreground-dark min-h-[80px] max-h-[500px] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-background-dark dark:border-gray-700 ${
                  errors.content ? "border-red-500" : ""
                }`}
              />
              <button
                type="submit"
                className="absolute right-3 bottom-3 text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="發送"
              >
                <IoSend className="text-xl" />
              </button>
            </div>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </form>
        ) : null
      }
      className="!z-0 overflow-hidden"
    >
      <div className={`space-y-4 flex flex-col h-[60vh]`}>
        {/* 留言列表 */}
        <div className="flex-1 ">
          <div className="space-y-3 h-full ">
            {isCommentsDataMinimumLoadingTime ? (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            ) : (
              <>
                {commentsData?.comments.length === 0 ? (
                  <div className=" flex flex-col items-center justify-center h-full text-gray-500">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p>
                      目前尚無{activeTab === "progress" ? "進度紀錄" : "留言"}
                    </p>
                  </div>
                ) : (
                  commentsData?.comments.map((comment) => (
                    <div key={comment._id}>
                      <CommentItem
                        comment={comment}
                        goalId={goalId}
                        activeTab={activeTab}
                        isCurrentUser={isCurrentUser}
                      />
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default GoalDetailsDialog;
