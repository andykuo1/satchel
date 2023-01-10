import { isSlotIndexEmpty } from '../inv/InvSlots';
import { CursorStore } from '../store';
import { addItemToInv, clearItemsInInv, getInv, getItemAtSlotIndex } from '../store/InvTransfer';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/Item').Item} Item
 * @typedef {import('../inv/Item').ItemId} ItemId
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('./CursorState').CursorState} CursorState
 */

/**
 * @param {Store} store
 */
export function getCursor(store) {
  return CursorStore.get(store);
}

/**
 * @param {Store} store
 */
export function getCursorInvId(store) {
  return 'cursor';
}

/**
 * @param {Store} store
 */
export function getCursorViewId(store) {
  return 'cursor';
}

/**
 * @param {Store} store
 */
export function hasHeldItem(store) {
  let inv = getInv(store, getCursorInvId(store));
  return !isSlotIndexEmpty(inv, 0);
}

/**
 * @param {Store} store
 */
export function getHeldItem(store) {
  return getItemAtSlotIndex(store, getCursorInvId(store), 0);
}

/**
 * @param {CursorState} cursor The cursor state
 * @param {Store} store The store
 * @param {Item} item The item to hold
 * @param {number} offsetX The held offset from root item slot (can only be non-positive)
 * @param {number} offsetY The held offset from root item slot (can only be non-positive)
 */
export function setHeldItem(cursor, store, item, offsetX = 0, offsetY = 0) {
  if (!item) {
    throw new Error('Cannot set held item to null - use clearHeldItem() instead.');
  }
  if (hasHeldItem(store)) {
    throw new Error('Cannot set held item - already holding another item.');
  }
  addItemToInv(store, getCursorInvId(store), item, 0, 0);
  cursor.setFull(offsetX, offsetY);
}

/**
 * @param {CursorState} cursor The cursor state
 * @param {Store} store The store
 */
export function clearHeldItem(cursor, store) {
  clearItemsInInv(store, getCursorInvId(store));
  cursor.setEmpty();
}
