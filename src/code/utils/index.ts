// @ts-ignore
export function debounce(callback: (...args: any[]) => void, waitMs: number) {
  let timeout: NodeJS.Timeout;

  // @ts-ignore
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, waitMs);
  };
}

export function _runAtIntervalFor(
  callback: () => void,
  intervalMs: number,
  durationMs: number,
) {
  const start = Date.now();

  const interval = setInterval(() => {
    if (Date.now() > start + durationMs) {
      clearInterval(interval);
    }

    callback();
  }, intervalMs);

  return () => {
    clearInterval(interval);
  };
}
