import { RecordStoreable } from '../../lib/store/RecordStoreable';

/**
 * @typedef {import('./StoreContext').Store} Store
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').Inv} Inv
 */

/** @type {RecordStoreable<Store, ViewId, View>} */
export const ViewStore = new RecordStoreable(s => s.values.views, s => s.listeners.views);
