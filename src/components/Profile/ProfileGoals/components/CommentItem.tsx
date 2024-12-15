import { useAppSelector } from "@/hooks/common/useAppReduxs";
import {
  useCreateComment,
  useDeleteComment,
  useGetReplies,
  useLikeComment,
  useUpdateComment,
} from "@/hooks/profile/ProfileGoals/queries/useProfileGoalsQueries";
import { CommentFormData, commentSchema } from "@/schemas/commentSchema";
import { DEFAULT_COMMENTS_PARAMS } from "@/services/api/Profile/ProfileGoals/constants";
import {
  Comment,
  CreateCommentParams,
} from "@/services/api/Profile/ProfileGoals/type";
import { selectUserProFile } from "@/stores/slice/userReducer";
import { formatDate, formatTime } from "@/utils/dateFormat";
import { debounce } from "@/utils/debounce";
import { notification } from "@/utils/notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiEdit2, FiHeart, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import CommentAvater from "../../ProfileInfo/components/CommentAvater";
import CommentSkeleton from "../skeleton/CommentSkeleton";

interface CommentItemProps {
  comment: Comment;
  goalId: string;
  activeTab: "progress" | "comment";
  isCurrentUser: boolean;
}

const CommentItem = ({
  comment,
  goalId,
  activeTab,
  isCurrentUser,
}: CommentItemProps) => {
  // 語言
  const { t } = useTranslation(["profileGoals"]);
  // 選單參考
  const menuRef = useRef<HTMLDivElement>(null);
  // 文字框參考
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 顯示選單
  const [showMenu, setShowMenu] = useState(false);
  // 編輯狀態
  const [isEditing, setIsEditing] = useState(false);
  // 編輯內容
  const [editContent, setEditContent] = useState(
    JSON.parse(comment.content).content
  );
  // 顯示回覆列表
  const [showReplies, setShowReplies] = useState(false);
  // 點擊回覆
  const [isReplying, setIsReplying] = useState(false);
  // 用戶資訊
  const userInfo = useAppSelector(selectUserProFile);

  // 新增留言或回覆 API hooks
  const { mutate: createComment } = useCreateComment(goalId, userInfo, {
    ...DEFAULT_COMMENTS_PARAMS,
    type: activeTab,
  });

  // 獲取回覆列表 API hooks
  const { data: repliesData, isLoading: isRepliesLoading } = useGetReplies(
    goalId,
    {
      ...DEFAULT_COMMENTS_PARAMS,
      parentId: comment._id,
      type: activeTab,
    },
    {
      enabled: showReplies,
    }
  );

  // 更新留言或回覆 API hooks
  const { mutate: updateComment } = useUpdateComment(goalId, {
    ...DEFAULT_COMMENTS_PARAMS,
    // parentId: comment._id,
    type: activeTab,
  });

  // 刪除留言或回覆 API hooks
  const { mutate: deleteComment } = useDeleteComment(goalId, userInfo.id, {
    ...DEFAULT_COMMENTS_PARAMS,
    type: activeTab,
  });

  // 添加點讚評論的 mutation
  const { mutate: likeComment } = useLikeComment(
    goalId,
    {
      ...DEFAULT_COMMENTS_PARAMS,
      type: activeTab,
    },
    comment
  );

  // 添加本地狀態
  const [localLikeCount, setLocalLikeCount] = useState(comment.likeCount);
  const [isLiked, setIsLiked] = useState(comment.isLiked);

  // 使用 useMemo 確保 debounce 函數只創建一次
  const debouncedLike = useMemo(
    () =>
      debounce((commentId: string, isLiked: boolean) => {
        likeComment({
          commentId,
          isLiked,
        });
      }, 1000),
    [likeComment]
  );

  // 處理點讚
  const handleLike = () => {
    const newIsLiked = !isLiked;

    // 立即更新本地狀態
    setIsLiked(newIsLiked);
    setLocalLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    // 延遲發送請求
    debouncedLike(comment._id, newIsLiked);
  };

  // 自動調整文字框高度
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, editContent]);

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 添加表單相關邏輯
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  // 提交回覆
  const onReplySubmit = handleSubmit((data) => {
    const params: CreateCommentParams = {
      content: JSON.stringify(data),
      type: activeTab,
      parentId: comment._id,
    };
    createComment(params);
    reset();
  });

  // 編輯點擊
  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  // 取消編輯
  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(JSON.parse(comment.content).content);
  };

  // 提交編輯
  const handleEdit = () => {
    updateComment({
      commentId: comment._id,
      content: JSON.stringify({ content: editContent }),
    });
    setIsEditing(false);
  };

  // 刪除留言或回覆
  const handleDelete = async () => {
    const confirm = await notification.confirm({
      title: "確定要刪除這則留言嗎？",
    });

    if (confirm) {
      deleteComment({
        commentId: comment._id,
        parentId: comment.parentId?._id || "",
      });
    }
    setShowMenu(false);
  };

  // 點擊回覆
  const handleReplyClick = () => {
    setShowReplies(!showReplies);
    setIsReplying(!isReplying);
  };

  // 按下 Enter 鍵提交表單
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && isReplying) {
      event.preventDefault();
      onReplySubmit();
    }

    if (event.key === "Enter" && !event.shiftKey && isEditing) {
      event.preventDefault();
      handleEdit();
    }
  };

  return (
    <>
      <div>
        {/* 留言 */}
        <div className="border-t dark:border-gray-700 pt-3">
          <div className="flex gap-2">
            <CommentAvater
              userId={comment.user._id}
              avatar={comment.user.avatar}
              size={40}
            />
            {/* 留言內容 */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  {/* 編輯狀態 */}
                  {isEditing ? (
                    <div>
                      <div className="relative w-[95%]">
                        <textarea
                          ref={textareaRef}
                          value={editContent}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 pr-12 border rounded-lg overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-background-dark dark:border-gray-700 dark:text-foreground-dark"
                          rows={1}
                        />
                        <div className="absolute right-2 bottom-2 flex gap-2">
                          <button
                            onClick={handleCancel}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {t("profileGoals:cancel")}
                          </button>
                          <button
                            onClick={handleEdit}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <IoSend className="text-xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 顯示留言內容
                    <div>
                      {/* 添加用戶名稱 */}
                      <p className="font-medium text-sm text-foreground-light dark:text-foreground-dark">
                        {comment.user.username}
                      </p>
                      <p className="font-sans text-foreground-light dark:text-foreground-dark whitespace-pre-wrap">
                        {JSON.parse(comment.content).content}
                      </p>
                    </div>
                  )}

                  {/* 顯示留言時間 */}
                  {!comment.parentId ? (
                    <div className="flex gap-4 items-center">
                      <p className="text-sm text-gray-500 break-keep">
                        {formatDate(comment.createdAt)}{" "}
                        {formatTime(comment.createdAt)}
                      </p>
                      <button
                        type="button"
                        onClick={handleReplyClick}
                        className="text-sm break-keep text-gray-500 hover:text-foreground-light/80 dark:hover:text-foreground-dark/80"
                      >
                        {comment.replyCount
                          ? `${comment.replyCount} ${t("profileGoals:reply")}`
                          : t("profileGoals:reply")}
                      </button>
                      {/* 添加愛心按鈕 */}
                      <button
                        type="button"
                        onClick={handleLike}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                      >
                        <FiHeart
                          className={`text-lg ${
                            isLiked
                              ? "fill-red-500 text-red-500"
                              : "fill-none hover:text-red-500"
                          }`}
                        />
                        <span>{localLikeCount}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-center mb-[2px]">
                      <p className="text-sm text-gray-500 break-keep">
                        {formatDate(comment.createdAt)}{" "}
                        {formatTime(comment.createdAt)}
                      </p>
                      {/* 添加愛心按鈕 */}
                      <button
                        type="button"
                        onClick={handleLike}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                      >
                        <FiHeart
                          className={`text-lg ${
                            isLiked
                              ? "fill-red-500 text-red-500"
                              : "fill-none hover:text-red-500"
                          }`}
                        />
                        <span>{localLikeCount}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 當前用戶且不是編輯狀態時顯示選單 */}
                {userInfo.id === comment.user._id && !isEditing && (
                  <div className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <FiMoreVertical className="text-gray-500" />
                    </button>

                    {showMenu && (
                      <div className="absolute right-[20px] top-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                        <button
                          onClick={handleEditClick}
                          className="flex items-center w-full px-4 py-2 text-sm gap-2 text-foreground-light/80 dark:text-foreground-dark/80 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FiEdit2 />
                          {t("profileGoals:edit")}
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex items-center w-full px-4 py-2 text-sm gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                        >
                          <FiTrash2 />
                          {t("profileGoals:delete")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 回覆列表和回覆表單 */}
        {showReplies && (
          <div className="mt-2 ml-12">
            {/* 回覆列表 */}
            {isRepliesLoading ? (
              <CommentSkeleton />
            ) : (
              repliesData?.comments.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  goalId={goalId}
                  activeTab={activeTab}
                  isCurrentUser={isCurrentUser}
                />
              ))
            )}

            {/* 回覆表單 */}
            {isReplying && (
              <div className="w-[95%] mt-3">
                <form onSubmit={onReplySubmit}>
                  <div className="relative">
                    <textarea
                      {...register("content")}
                      placeholder={t("profileGoals:reply")}
                      onKeyDown={handleKeyDown}
                      className="w-full p-3 pr-12 border rounded-lg resize-none min-h-[60px] text-foreground-light/80 dark:text-foreground-dark/80 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-background-dark dark:border-gray-700"
                    />
                    <button
                      className="absolute right-3 bottom-3 text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={t("profileGoals:sendReply")}
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
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CommentItem;
