import { IoPersonOutline } from "react-icons/io5";

interface ProfileAvatarProps {
  avatar?: string;
  size?: number;
}

const CommentAvater = ({ avatar, size = 100 }: ProfileAvatarProps) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt="avatar"
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
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
