import LazyImage from "@/components/common/LazyImage";
import { IoPersonOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

interface ProfileAvatarProps {
  avatar?: string;
  size?: number;
  userId: string;
}

const CommentAvater = ({ avatar, size = 100, userId }: ProfileAvatarProps) => {
  if (avatar) {
    return (
      <Link to={`/profile/${userId}`}>
        <LazyImage
          src={avatar}
          alt="avatar"
          className="rounded-full object-cover"
          width={size}
          height={size}
        />
      </Link>
    );
  }

  return (
    <div
      className="rounded-full dark:text-foreground-dark bg-gray-200 flex justify-center items-center"
      style={{ width: size, height: size }}
    >
      <IoPersonOutline style={{ width: size / 2, height: size / 2 }} />
    </div>
  );
};

export default CommentAvater;
