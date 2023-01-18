import { useEffect, useRef, useState } from 'react';

export function useThrottle(value, intervalMillis) {
  const [throttled, setThrottled] = useState(value);
  const prevThrottled = useRef(performance.now());

  useEffect(() => {
    let now = performance.now();
    if (now >= prevThrottled.current + intervalMillis) {
      prevThrottled.current = now;
      setThrottled(value);
    } else {
      let timeoutId = setTimeout(() => {
        prevThrottled.current = performance.now();
        setThrottled(value);
      }, intervalMillis);
      return () => clearTimeout(timeoutId);
    }
  }, [value, intervalMillis]);

  return throttled;
}
