import i18next from "i18next";

export const formatDate = (date: string | Date) => {
  const d = new Date(date);

  // 獲取當前語言
  const currentLanguage = i18next.language;

  if (currentLanguage === "en-US") {
    // 英文格式：Month DD, YYYY
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else {
    // 中文格式：YYYY年MM月DD日
    return d.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

export const formatTime = (dateString: string) => {
  const currentLanguage = i18next.language;
  const date = new Date(dateString);
  return date.toLocaleTimeString(currentLanguage, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
