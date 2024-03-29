import { InvStore, ViewStore } from '../../stores';
import {
  clearItems,
  getItemByItemId,
  getItemIds,
  getItems,
  hasItem,
  putItem,
  removeItem,
} from '../InvItems';
import { cloneItem } from '../Item';
import {
  getItemIdBySlotCoords,
  getItemIdBySlotIndex,
  getSlottedItemIds,
} from '../Slots';

/**
 * @typedef {import('../../stores/StoreContext').Store} Store
 * @typedef {import('../Inv').InvId} InvId
 * @typedef {import('../Inv').Inv} Inv
 * @typedef {import('../Item').Item} Item
 * @typedef {import('../Item').ItemId} ItemId
 * @typedef {import('../View').ViewId} ViewId
 * @typedef {import('../View').View} View
 */

export function getItemInInv(store, invId, itemId) {
  let inv = getInv(store, invId);
  return getItemByItemId(inv, itemId);
}

export function getItemIdsInInv(store, invId) {
  let inv = getInv(store, invId);
  return getItemIds(inv);
}

export function getItemsInInv(store, invId) {
  let inv = getInv(store, invId);
  return getItems(inv);
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param {Item} item
 * @param {number} coordX
 * @param {number} coordY
 */
export function addItemToInv(store, invId, item, coordX = 0, coordY = 0) {
  let inv = getInv(store, invId);
  putItem(inv, item, coordX, coordY);
  InvStore.dispatch(store, invId);
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param {ItemId} itemId
 * @returns {boolean}
 */
export function removeItemFromInv(store, invId, itemId) {
  let inv = getInv(store, invId);
  if (hasItem(inv, itemId)) {
    removeItem(inv, itemId);
    InvStore.dispatch(store, invId);
    return true;
  }
  return false;
}

/**
 * @param {Store} store
 * @param {InvId} invId
 */
export function clearItemsInInv(store, invId) {
  let inv = getInv(store, invId);
  clearItems(inv);
  InvStore.dispatch(store, invId);
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param {ItemId} itemId
 */
export function hasItemInInventory(store, invId, itemId) {
  let inv = getInv(store, invId);
  return hasItem(inv, itemId);
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param {number} slotIndex
 */
export function getItemAtSlotIndex(store, invId, slotIndex) {
  let inv = getInv(store, invId);
  let itemId = getItemIdBySlotIndex(inv, slotIndex);
  return getItemByItemId(inv, itemId);
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param {number} coordX
 * @param {number} coordY
 */
export function getItemAtSlotCoords(store, invId, coordX, coordY) {
  let inv = getInv(store, invId);
  let itemId = getItemIdBySlotCoords(inv, coordX, coordY);
  return getItemByItemId(inv, itemId);
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param {number} coordX
 * @param {number} coordY
 */
export function getItemIdAtSlotCoords(store, invId, coordX, coordY) {
  let inv = getInv(store, invId);
  return getItemIdBySlotCoords(inv, coordX, coordY);
}

/**
 * @param {Store} store
 * @param {InvId} invId
 */
export function getItemIdsInSlots(store, invId) {
  let inv = getInv(store, invId);
  return new Set(getSlottedItemIds(inv));
}

/**
 * @param {Store} store
 * @param {InvId} invId
 */
export function isInvEmpty(store, invId) {
  const inv = getInv(store, invId);
  const length = inv.length;
  for (let i = 0; i < length; ++i) {
    let itemId = getItemIdBySlotIndex(inv, i);
    if (itemId) {
      return false;
    }
  }
  return true;
}

/**
 * Get an existing inventory. Will throw if it does not exist.
 *
 * @param {Store} store
 * @param {InvId} invId
 * @returns {Inv}
 */
export function getInv(store, invId) {
  if (InvStore.has(store, invId)) {
    return InvStore.get(store, invId);
  } else {
    throw new Error(`Cannot get non-existant inventory '${invId}'.`);
  }
}

/**
 * Get an existing view. Will throw if it does not exist.
 *
 * @param {Store} store
 * @param {ViewId} viewId
 * @returns {View}
 */
export function getView(store, viewId) {
  if (ViewStore.has(store, viewId)) {
    return ViewStore.get(store, viewId);
  } else {
    throw new Error(`Cannot get non-existant view '${viewId}'.`);
  }
}

/**
 * @param {Store} store
 * @param {ItemId} itemId
 * @param {object} state
 */
export function updateItem(store, invId, itemId, state) {
  let inv = getInv(store, invId);
  let item = getItemByItemId(inv, itemId);
  if (!item) {
    throw new Error('Cannot update null item.');
  }
  cloneItem(state, item);

  // NOTE: Item change.
  InvStore.dispatch(store, invId);
}
