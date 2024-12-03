type ThrottleFunction<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

/**
 * 節流函數，限制函數在一定時間內只能執行一次
 * @param fn 要執行的函數
 * @param delay 延遲時間（毫秒）
 * @returns 節流後的函數，包含 cancel 方法用於取消等待中的執行
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ThrottleFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastRun = 0;

  function throttled(this: unknown, ...args: Parameters<T>) {
    const now = Date.now();

    if (lastRun && now < lastRun + delay) {
      // 如果距離上次執行還沒有超過 delay，則設定一個定時器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        lastRun = now;
        fn.apply(this, args);
      }, delay);
    } else {
      // 如果已經超過 delay，則立即執行
      lastRun = now;
      fn.apply(this, args);
    }
  }

  // 添加取消方法
  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttled;
}
