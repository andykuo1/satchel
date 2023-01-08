import { useEffect } from 'react';
import { useForceUpdate } from '../../lib/hooks/UseForceUpdate';

import { Storeable } from '../../lib/store/Storeable';

/**
 * @typedef {import('./StoreContext').Store} Store
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/View').View} ViewId
 */

export class ViewStoreable extends Storeable {
  /**
   * @override
   * @param {Store} store 
   * @param {ViewId} viewId
   * @returns {View}
   */
  get(store, viewId) {
    return store.values.views[viewId];
  }

  /**
   * @override
   * @param {Store} store 
   * @param {ViewId} viewId
   */
  has(store, viewId) {
    return viewId in store.values.views;
  }

  /**
   * @override
   * @param {Store} store 
   * @param {ViewId} viewId
   */
  listeners(store, viewId) {
    if (viewId in store.listeners.views) {
      return store.listeners.views[viewId];
    }

    let result = [];
    store.listeners.views[viewId] = result;
    return result;
  }

  /**
   * @override
   * @param {Store} store 
   * @param {ViewId} viewId 
   */
  dispatch(store, viewId) {
    for (let listener of this.listeners(store, viewId)) {
      listener();
    }
  }

  /**
   * @override
   * @param {Store} store 
   * @param {ViewId} invId
   * @returns {View}
   */
  use(store, viewId) {
    const inv = this.get(store, viewId);
    const update = useForceUpdate();
    useEffect(() => {
      let listeners = this.listeners(store, viewId);
      listeners.push(update);
      return () => {
        let i = listeners.indexOf(update);
        if (i >= 0) {
          listeners.splice(i, 1);
        }
      };
    });
    return inv;
  }
}
