import { useCallback, useEffect, useRef } from 'react';

/**
 * @param {Function} callback 
 * @param {React.DependencyList} deps 
 */
export function useAnimationFrame(callback, deps = undefined) {
  const handle = useRef(null);
  const handler = useCallback(function handler(now) {
    if (!handle.current) {
      return;
    }
    callback(now);
    handle.current = requestAnimationFrame(handler);
  }, deps);
  useEffect(() => {
    handle.current = requestAnimationFrame(handler);
    return () => {
      cancelAnimationFrame(handle.current);
      handle.current = null;
    };
  }, [handler]);
}
