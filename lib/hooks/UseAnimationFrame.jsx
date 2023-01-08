import { useCallback, useEffect, useRef } from 'react';

export function useAnimationFrame(callback, deps = undefined) {
    const handle = useRef(null);
    const handler = useCallback(function handler() {
        if (!handle.current) {
            return;
        }
        callback();
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
