import { createStoreContext } from '../../lib/store/StoreContext';
import { CursorState } from '../cursor/CursorState';

/**
 * @typedef {ReturnType<useStore>} Store
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/View').ViewId} ViewId
 */

export const { StoreContext, StoreProvider, useStore } = createStoreContext({
    cursor: new CursorState(),
    values: {
        /** @type {Record<InvId, Inv>} */
        invs: {},
        /** @type {Record<ViewId, View>} */
        views: {},
    },
    listeners: {
        /** @type {Record<InvId, Array<Function>>} */
        invs: {},
        /** @type {Record<ViewId, Array<Function>} */
        views: {},
    },
});
