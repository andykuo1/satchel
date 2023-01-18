import { useEffect } from 'react';

/**
 * @param {() => HTMLElement} getElement
 * @param {keyof HTMLElementEventMap} event
 * @param {EventListener} callback
 * @param {boolean} [opts]
 */
export function useEventListener(
  getClientElement,
  event,
  callback,
  opts = undefined,
  deps = undefined,
) {
  useEffect(() => {
    const element = getClientElement();
    element.addEventListener(event, callback, opts);
    return () => {
      element.removeEventListener(event, callback, opts);
    };
  }, deps);
}
