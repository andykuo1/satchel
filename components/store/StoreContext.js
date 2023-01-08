import { createStoreContext } from '../../lib/store/StoreContext';

/**
 * @typedef {ReturnType<useStore>} Store
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/View').ViewId} ViewId
 */

export const KEYS_LISTENERS = Symbol('keys');
export const { StoreContext, StoreProvider, useStore } = createStoreContext({
    values: {
        /** @type {Record<InvId, Inv>} */
        invs: {},
        /** @type {Record<ViewId, View>} */
        views: {},
    },
    listeners: {
        /** @type {Record<InvId, Array<Function>>} */
        invs: {
            [KEYS_LISTENERS]: [],
        },
        /** @type {Record<ViewId, Array<Function>} */
        views: {
            [KEYS_LISTENERS]: [],
        }
    },
});
