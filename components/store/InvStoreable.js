import { useEffect } from 'react';
import { useForceUpdate } from '../../lib/hooks/UseForceUpdate';

import { Storeable } from '../../lib/store/Storeable';

/**
 * @typedef {import('./StoreContext').Store} Store
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').Inv} Inv
 */

export class InvStoreable extends Storeable {
    /**
     * @override
     * @param {Store} store 
     * @param {InvId} invId
     * @returns {Inv}
     */
    get(store, invId) {
        return store.values.invs[invId];
    }

    /**
     * @override
     * @param {Store} store 
     * @param {InvId} invId
     */
    has(store, invId) {
        return invId in store.values.invs;
    }

    /**
     * @override
     * @param {Store} store 
     * @param {InvId} invId
     */
    listeners(store, invId) {
        if (invId in store.listeners.invs) {
            return store.listeners.invs[invId];
        }

        let result = [];
        store.listeners.invs[invId] = result;
        return result;
    }

    /**
     * @override
     * @param {Store} store 
     * @param {InvId} invId 
     */
    dispatch(store, invId) {
        for(let listener of this.listeners(store, invId)) {
            listener();
        }
    }

    /**
     * @override
     * @param {Store} store 
     * @param {InvId} invId
     * @returns {Inv}
     */
    use(store, invId) {
        const inv = this.get(store, invId);
        const update = useForceUpdate();
        useEffect(() => {
            let listeners = this.listeners(store, invId);
            listeners.push(update);
            return () => {
                let i = listeners.indexOf(update);
                if (i >= 0) {
                    listeners.splice(i, 1);
                }
            };
        }, [invId]);
        return inv;
    }
}
