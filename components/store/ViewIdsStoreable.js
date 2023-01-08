import { useEffect } from 'react';
import { useForceUpdate } from '../../lib/hooks/UseForceUpdate';

import { KEYS_LISTENERS } from './StoreContext';
import { Storeable } from '../../lib/store/Storeable';

/**
 * @typedef {import('./StoreContext').Store} Store
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').View} View
 */

export class ViewIdsStoreable extends Storeable {
    /**
     * @override
     * @param {Store} store
     * @returns {Array<ViewId>}
     */
    get(store) {
        return Object.keys(store.values.views);
    }

    /**
     * @override
     * @param {Store} store
     */
    has(store) {
        return true;
    }

    /**
     * @override
     * @param {Store} store
     */
    listeners(store) {
        return store.listeners.views[KEYS_LISTENERS];
    }

    /**
     * @override
     * @param {Store} store
     */
    dispatch(store) {
        for(let listener of this.listeners(store)) {
            listener();
        }
    }

    /**
     * @override
     * @param {Store} store
     * @returns {Array<InvId>}
     */
    use(store) {
        const result = this.get(store);
        const update = useForceUpdate();
        useEffect(() => {
            let listeners = this.listeners(store);
            listeners.push(update);
            return () => {
                let i = listeners.indexOf(update);
                if (i >= 0) {
                    listeners.splice(i, 1);
                }
            };
        });
        return result;
    }
}
