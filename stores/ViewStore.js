import { RecordStoreable } from '../lib/store/RecordStoreable';

/**
 * @typedef {import('./StoreContext').Store} Store
 * @typedef {import('./inv/View').ViewId} ViewId
 * @typedef {import('./inv/View').View} View
 */

/** @type {RecordStoreable<Store, ViewId, View>} */
export const ViewStore = new RecordStoreable(s => s.values.views, s => s.listeners.views);
