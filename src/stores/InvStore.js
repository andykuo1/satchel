import { RecordStoreable } from '../lib/store/RecordStoreable';

/**
 * @typedef {import('./StoreContext').Store} Store
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').Inv} Inv
 */

/** @type {RecordStoreable<Store, InvId, Inv>} */
export const InvStore = new RecordStoreable(
  (s) => s.values.invs,
  (s) => s.listeners.invs,
);
