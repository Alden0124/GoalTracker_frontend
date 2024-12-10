import { throttle } from "@/utils/throttle";
import { useEffect, useMemo } from "react";

interface InfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  throttleDelay?: number;
  enabled?: boolean;
}

/**
 * 無限捲動 Hook
 * @param options 配置選項
 */
export const useInfiniteScroll = ({
  // 是否還有更多數據可以加載
  hasNextPage,
  // 是否正在加載數據
  isFetchingNextPage,
  // 觸發加載下一頁數據的回調函數
  fetchNextPage,
  // 觸發加載的距離閾值，預設為 0.5（即距離底部 50% 時觸發）
  threshold = 0.5,
  // 節流延遲時間，預設 200ms，避免頻繁觸發
  throttleDelay = 200,
  // 是否啟用無限捲動，預設為 true
  enabled = true,
}: InfiniteScrollOptions) => {
  const handleScroll = useMemo(
    () =>
      throttle(() => {
        // 檢查是否滿足加載條件
        if (!hasNextPage || isFetchingNextPage || !enabled) {
          // console.log("無法加載更多:", {
          //   hasNextPage,
          //   isFetchingNextPage,
          //   enabled,
          // });
          return;
        }

        // 獲取當前滾動位置、文檔高度和窗口高度
        const {
          // 滾動位置
          scrollTop: windowScrollY,
          // 文檔高度
          scrollHeight: documentHeight,
          // 窗口高度
          clientHeight: windowHeight,
        } = {
          scrollTop: window.scrollY,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: window.innerHeight,
        };

        // 計算滾動閾值
        const scrollThreshold = windowHeight * threshold;
        // 剩餘空間
        const remainingSpace = documentHeight - windowScrollY - windowHeight;

        console.log("剩餘空間", {
          // 文檔高度(網頁內容總高高度不包含外圍視窗-總高度)
          documentHeight: documentHeight,
          // 滾動位置(目前滾動位置高度-不會隨著視窗大小改變)
          windowScrollY: windowScrollY,
          // 窗口高度(視窗高度-會隨著視窗大小改變)
          windowHeight: windowHeight,
          // 剩餘空間(視窗內容高度 - 滾動位置 - 視窗高度)
          remainingSpace: remainingSpace,
          // 滾動閾值(視窗高度 * 閾值 = 剩餘空間 (會比窗口高度小))
          scrollThreshold: scrollThreshold * threshold,
        });

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
