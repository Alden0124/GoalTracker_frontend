import { useEffect, useRef, useState } from "react";

// 處理最小加載時間
export const useMinimumLoadingTime = (
  isLoading: boolean,
  minimumLoadingTime = 1000
) => {
  const loadingStartTime = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isShowingSkeleton, setIsShowingSkeleton] = useState(false);

  // 處理最小加載時間
  useEffect(() => {
    if (isLoading && !loadingStartTime.current) {
      // 只在開始加載時記錄時間
      loadingStartTime.current = Date.now();
      setIsShowingSkeleton(true);
    } else if (!isLoading && loadingStartTime.current) {
      const elapsedTime = Date.now() - loadingStartTime.current;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      if (remainingTime === 0) {
        // 如果已經超過最小加載時間，直接重置
        loadingStartTime.current = null;
        setIsShowingSkeleton(false);
      } else {
        // 如果還沒到最小加載時間，等待剩餘時間
        timeoutRef.current = setTimeout(() => {
          loadingStartTime.current = null;
          setIsShowingSkeleton(false);
        }, remainingTime);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, minimumLoadingTime]);

  // 如果正在加載或還在最小加載時間內，就返回 true
  return isShowingSkeleton;
};
