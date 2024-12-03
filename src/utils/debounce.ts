export function debounce<Args extends unknown[], R>(
  func: (...args: Args) => R,
  delay: number
): (...args: Args) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: Args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
