import { useRef, useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import { notification } from "@/utils/notification";

interface ProfileAvatarUploadProps {
  currentAvatar?: string;
  onFileSelect: (file: File) => void;
}

const ProfileAvatarUpload = ({ currentAvatar, onFileSelect }: ProfileAvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatar);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 檢查檔案類型
      if (!file.type.startsWith('image/')) {
        notification.error({ 
          title: "錯誤", 
          text: "請上傳圖片檔案" 
        });
        return;
      }

      // 檢查檔案大小 (例如限制 5MB)
      if (file.size > 5 * 1024 * 1024) {
        notification.error({ 
          title: "錯誤", 
          text: "圖片大小不能超過 5MB" 
        });
        return;
      }

      // 建立預覽
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      onFileSelect(file);
    }
  };

  return (
    <div 
      className="relative cursor-pointer group"
      onClick={handleClick}
    >
      <ProfileAvatar 
        avatar={previewUrl} 
        size={120}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white text-sm">更換頭像</span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileAvatarUpload; 