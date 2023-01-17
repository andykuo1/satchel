import { InvStore } from '..';
import { copyItem } from '../inv/Item';
import { getSlotCoordsByIndex, getSlotIndexByItemId } from '../inv/Slots';
import { isOutputCopied, isOutputDisabled } from '../inv/View';
import { clearHeldItem, hasHeldItem, setHeldItem } from './CursorTransfer';
import { addItemToInv, removeItemFromInv } from './InvTransfer';

/**
 * @typedef {import('..').Store} Store
 * @typedef {import('../data/CursorState').CursorState} CursorState
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/Item').ItemId} ItemId
 * @typedef {import('../inv/Item').Item} Item
 * @typedef {import('../inv/View').View} View
 */

/**
 * @param {MouseEvent} e
 * @param {CursorState} cursor
 * @param {Store} store
 * @param {View} view
 * @param {Item} item
 * @param {number} deltaCoordX
 * @param {number} deltaCoordX
 * @returns {boolean}
 */
export function tryPickUp(
  e,
  cursor,
  store,
  view,
  inv,
  item,
  deltaCoordX = 0,
  deltaCoordY = 0,
) {
  if (!item) {
    return false;
  }
  if (isOutputDisabled(view)) {
    return false;
  }
  if (hasHeldItem(store)) {
    // NOTE: Swapping is performed on putDown(), so ignore for pick up.
    return false;
  }
  const itemId = item.itemId;
  const invId = view.invId;

  const maxDeltaCoordX = -1 * Math.min(item.width, -1 * deltaCoordX);
  const maxDeltaCoordY = -1 * Math.min(item.height, -1 * deltaCoordY);

  if (isOutputCopied(view)) {
    let newItem = copyItem(item);
    // Try splitting the stack.
    if (e.shiftKey && item.stackSize > 1) {
      newItem.stackSize = Math.floor(item.stackSize / 2);
    }
    setHeldItem(cursor, store, newItem, maxDeltaCoordX, maxDeltaCoordY);
  } else {
    // Try splitting the stack.
    let newItem = null;
    if (e.shiftKey && (newItem = trySplitStack(store, invId, item))) {
      setHeldItem(cursor, store, newItem, maxDeltaCoordX, maxDeltaCoordY);
    } else {
      removeItemFromInv(store, invId, itemId);
      setHeldItem(cursor, store, item, maxDeltaCoordX, maxDeltaCoordY);
    }
  }
  return true;
}

/**
 * @param {CursorState} cursor
 * @param {Store} store
 * @param {InvId} prevInvId
 * @param {Item} prevItem
 * @param {InvId} heldInvId
 * @param {Item} heldItem
 * @param {boolean} mergable
 * @param {boolean} shiftKey
 * @returns {boolean}
 */
export function tryMergeItems(
  cursor,
  store,
  prevInvId,
  prevItem,
  heldInvId,
  heldItem,
  mergable,
  shiftKey,
) {
  // If we can merge, do it now.
  if (!mergable || !isMergableItems(prevItem, heldItem)) {
    return false;
  }
  // Full merge!
  if (!shiftKey) {
    mergeItems(prevItem, heldItem);
    InvStore.dispatch(store, prevInvId);
    // Merged successfully! Discard the held item.
    clearHeldItem(cursor, store);
    return true;
  }
  // If not enough items, stop here.
  if (heldItem.stackSize <= 1) {
    return true;
  }
  // Single merge!
  let amount = 1;
  let remaining = heldItem.stackSize - amount;
  prevItem.stackSize += amount;
  heldItem.stackSize = remaining;
  InvStore.dispatch(store, prevInvId);
  InvStore.dispatch(store, heldInvId);
  return true;
}

/**
 * @param {Item} item
 * @param {Item} other
 */
function mergeItems(item, other) {
  item.stackSize += other.stackSize;
  if (item.description !== other.description && other.description) {
    if (item.description) {
      item.description += '\n\n';
    }
    item.description += other.description;
  }
  if (other.metadata) {
    item.metadata = {
      ...item.metadata,
      ...other.metadata,
    };
  }
  return item;
}

/**
 * @param {Item} item
 * @param {Item} other
 */
function isMergableItems(item, other) {
  if (item.stackSize < 0 || other.stackSize < 0) {
    // Only merge if already stackable.
    return false;
  }
  if (item.imgSrc !== other.imgSrc) {
    return false;
  }
  if (item.displayName !== other.displayName) {
    return false;
  }
  if (item.width !== other.width || item.height !== other.height) {
    return false;
  }
  if (item.background !== other.background) {
    return false;
  }
  if (item.itemId === other.itemId) {
    // Cannot self merge.
    return false;
  }
  return true;
}

/**
 * @param {Store} store
 * @param {InvId} heldInvId
 * @param {InvId} toInvId
 * @param {Item} heldItem
 * @param {boolean} mergable
 * @param {boolean} shiftKey
 * @param {number} targetCoordX
 * @param {number} targetCoordY
 */
export function tryDropPartialItem(
  store,
  heldInvId,
  toInvId,
  heldItem,
  mergable,
  shiftKey,
  targetCoordX,
  targetCoordY,
) {
  if (mergable && shiftKey && heldItem.stackSize > 1) {
    // No item in the way and we want to partially drop singles.
    let amount = 1;
    let remaining = heldItem.stackSize - amount;
    let newItem = copyItem(heldItem);
    newItem.stackSize = amount;
    heldItem.stackSize = remaining;
    InvStore.dispatch(store, heldInvId);
    addItemToInv(store, toInvId, newItem, targetCoordX, targetCoordY);
    return true;
  }
  return false;
}

/**
 * @param {Store} store
 * @param {InvId} fromInvId
 * @param {Item} item
 */
export function tryTakeOneItem(store, fromInvId, item) {
  if (item.stackSize > 1) {
    let amount = 1;
    let remaining = item.stackSize - amount;
    let newItem = copyItem(item);
    newItem.stackSize = amount;
    item.stackSize = remaining;
    InvStore.dispatch(store, fromInvId);
    return newItem;
  } else {
    return null;
  }
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param {Item} item
 */
export function trySplitStack(store, invId, item) {
  if (item.stackSize <= 1) {
    return null;
  }
  let newStackSize = Math.floor(item.stackSize / 2);
  let remaining = item.stackSize - newStackSize;
  let newItem = copyItem(item);
  newItem.stackSize = newStackSize;
  item.stackSize = remaining;
  // NOTE: Item change.
  InvStore.dispatch(store, invId);
  return newItem;
}

/**
 * @param {Inv} inv
 * @param {ItemId} itemId
 * @param {number} clientX
 * @param {number} clientY
 * @param {number} gridUnit
 * @param {HTMLElement} containerElement
 */
export function getDeltaCoords(
  inv,
  itemId,
  clientX,
  clientY,
  gridUnit,
  containerElement,
) {
  const boundingRect = containerElement.getBoundingClientRect();
  const clientCoordX = getClientCoordX(boundingRect, clientX, gridUnit);
  const clientCoordY = getClientCoordY(boundingRect, clientY, gridUnit);
  const slotIndex = getSlotIndexByItemId(inv, itemId);
  const [fromItemX, fromItemY] = getSlotCoordsByIndex(inv, slotIndex);
  return [fromItemX - clientCoordX, fromItemY - clientCoordY];
}

/**
 * @param {DOMRect} elementBoundingRect
 * @param {number} clientX
 * @param {number} unitSize
 * @returns {number}
 */
export function getClientCoordX(elementBoundingRect, clientX, unitSize) {
  return Math.floor((clientX - elementBoundingRect.x) / unitSize);
}

/**
 * @param {DOMRect} elementBoundingRect
 * @param {number} clientY
 * @param {number} unitSize
 * @returns {number}
 */
export function getClientCoordY(elementBoundingRect, clientY, unitSize) {
  return Math.floor((clientY - elementBoundingRect.y) / unitSize);
}
