import { throttle } from "@/utils/throttle";
import { useEffect, useMemo, useRef } from "react";

interface ContainerInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  throttleDelay?: number;
  enabled?: boolean;
}

/**
 * 容器無限捲動 Hook
 * @param options 配置選項
 */
export const useContainerInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.5,
  throttleDelay = 200,
  enabled = true,
}: ContainerInfiniteScrollOptions) => {
  // 創建容器引用
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const container = containerRef.current;
        if (!container || !hasNextPage || isFetchingNextPage || !enabled) {
          return;
        }

        // 獲取容器的滾動位置信息
        const {
          // 已滾動高度
          scrollTop,
          // 容器可視高度
          clientHeight,
          // 內容總高度
          scrollHeight,
        } = container;

        // 計算滾動閾值
        const scrollThreshold = clientHeight * threshold;
        // 計算距離底部的剩餘空間
        const remainingSpace = scrollHeight - scrollTop - clientHeight;

        // 如果剩餘空間小於等於滾動閾值，則觸發加載下一頁
        if (remainingSpace <= scrollThreshold) {
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
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll, enabled]);

  return containerRef;
};
