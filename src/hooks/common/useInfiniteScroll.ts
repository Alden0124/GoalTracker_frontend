import { throttle } from "@/utils/throttle";
import { useEffect, useMemo } from "react";

interface InfiniteScrollOptions {
  // 用於控制是否還有更多數據可以加載
  hasNextPage: boolean;
  // 用於表示當前是否正在加載數據
  isFetchingNextPage: boolean;
  // 觸發加載下一頁數據的回調函數
  fetchNextPage: () => void;
  // 觸發加載的距離閾值，預設為 0.5（即距離底部 50% 時觸發）
  threshold?: number;
  // 節流延遲時間，預設 200ms，避免頻繁觸發
  throttleDelay?: number;
  // 是否啟用無限捲動，預設為 true
  enabled?: boolean;
}

/**
 * 無限捲動 Hook
 * @param options 配置選項
 */
export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.5,
  throttleDelay = 200,
  enabled = true,
}: InfiniteScrollOptions) => {
  const handleScroll = useMemo(
    () =>
      throttle(() => {
        // 檢查是否滿足加載條件
        if (!hasNextPage || isFetchingNextPage || !enabled) {
          console.log("無法加載更多:", {
            hasNextPage,
            isFetchingNextPage,
            enabled,
          });
          return;
        }

        // 獲取當前滾動位置、文檔高度和窗口高度
        const {
          scrollTop: windowScrollY,
          scrollHeight: documentHeight,
          clientHeight: windowHeight,
        } = {
          scrollTop: window.scrollY,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: window.innerHeight,
        };

        // 計算滾動閾值和剩餘空間
        const scrollThreshold = windowHeight * threshold;
        const remainingSpace = documentHeight - windowScrollY - windowHeight;

        // console.log("滾動狀態:", {
        //   remainingSpace,
        //   threshold: scrollThreshold,
        //   shouldLoadMore: remainingSpace <= scrollThreshold,
        // });

        // 如果剩餘空間小於等於滾動閾值，則觸發加載下一頁
        if (remainingSpace <= scrollThreshold) {
          console.log("觸發加載下一頁");
          fetchNextPage();
        }
      }, throttleDelay),
    [
      throttleDelay,
      hasNextPage,
      isFetchingNextPage,
      enabled,
      threshold,
      fetchNextPage,
    ]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll, enabled]);
};
