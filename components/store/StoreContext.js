import { createStoreContext } from '../../lib/store/StoreContext';
import { RecordStoreable } from '../../lib/store/RecordStoreable';

/**
 * @typedef {ReturnType<useStore>} Store
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/View').ViewId} ViewId
 */

export const { StoreContext, StoreProvider, useStore } = createStoreContext({
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
        views: {}
    },
});

/** @type {RecordStoreable<Store, InvId, Inv>} */
export const InvStore = new RecordStoreable(s => s.values.invs, s => s.listeners.invs);
/** @type {RecordStoreable<Store, ViewId, View>} */
export const ViewStore = new RecordStoreable(s => s.values.views, s => s.listeners.views);
