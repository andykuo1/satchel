import { getItemByItemId } from '../InvItems';
import { getSlotCoordsByIndex, getSlotIndexByItemId } from '../Slots';
import { isInputDisabled, isOutputDisabled } from '../View';
import {
  clearHeldItem,
  getCursorInvId,
  getHeldItem,
  setHeldItem,
} from './CursorTransfer';
import { getCursor } from './CursorTransfer';
import {
  addItemToInv,
  getInv,
  getItemAtSlotIndex,
  removeItemFromInv,
} from './InvTransfer';
import {
  getClientCoordX,
  getClientCoordY,
  getDeltaCoords,
  tryDropPartialItem,
  tryMergeItems,
  tryPickUp,
} from './ViewTransfer';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../Item').Item} Item
 * @typedef {import('../View').View} View
 * @typedef {import('../Inv').Inv} Inv
 * @typedef {import('../Inv').InvId} InvId
 * @typedef {import('../../stores/CursorState').CursorState} CursorState
 */

export const SocketViewTransfer = {
  itemMouseDownCallback,
  containerMouseUpCallback,
};

/**
 * Perform pickup logic for item elements.
 *
 * @param {MouseEvent} e The triggering mouse event
 * @param {Store} store The store
 * @param {View} view The current view
 * @param {Inv} inv The current inv
 * @param {Item} item The item clicked
 * @param {HTMLElement} element The container element
 * @returns {boolean} Whether to allow the event to propagate
 */
function itemMouseDownCallback(e, store, view, inv, item, element) {
  const cursor = getCursor(store);
  const [deltaCoordX, deltaCoordY] = getDeltaCoords(
    inv,
    item.itemId,
    e.clientX,
    e.clientY,
    cursor.gridUnit,
    element,
  );
  return tryPickUp(e, cursor, store, view, inv, item, deltaCoordX, deltaCoordY);
}

/**
 * Perform putdown logic for container elements.
 *
 * @param {MouseEvent} e The triggering mouse event
 * @param {Store} store The store
 * @param {View} view The current view
 * @param {Inv} inv The current inv
 * @param {HTMLElement} element The container element
 * @returns {boolean} Whether to allow the event to propagate
 */
function containerMouseUpCallback(e, store, view, inv, element) {
  if (e.button !== 0) {
    return;
  }
  if (isInputDisabled(view)) {
    return;
  }
  const cursor = getCursor(store);
  const invId = view.invId;
  const shiftKey = e.shiftKey;
  const boundingRect = element.getBoundingClientRect();
  const clientCoordX = getClientCoordX(
    boundingRect,
    e.clientX,
    cursor.gridUnit,
  );
  const clientCoordY = getClientCoordY(
    boundingRect,
    e.clientY,
    cursor.gridUnit,
  );

  const swappable = !isOutputDisabled(view);
  const mergable = !isInputDisabled(view);

  let result = false;

  const heldItem = getHeldItem(store);
  if (heldItem) {
    if (cursor.ignoreFirstPutDown) {
      // First put down has been ignored. Don't ignore the next intentful one.
      cursor.ignoreFirstPutDown = false;
      result = true;
    } else {
      // playSound('putdown');
      result = putDownToSocketInventory(
        cursor,
        store,
        getCursorInvId(store),
        invId,
        clientCoordX,
        clientCoordY,
        swappable,
        mergable,
        shiftKey,
      );
    }
  }

  return result;
}

/**
 * @param {CursorState} cursorState
 * @param {Store} store
 * @param {InvId} toInvId
 * @param {number} coordX
 * @param {number} coordY
 * @param {boolean} swappable
 * @param {boolean} mergable
 * @param {boolean} shiftKey
 */
function putDownToSocketInventory(
  cursorState,
  store,
  heldInvId,
  toInvId,
  coordX,
  coordY,
  swappable,
  mergable,
  shiftKey,
) {
  let heldItem = getHeldItem(store);
  let prevItem = getItemAtSlotIndex(store, toInvId, 0);
  let prevItemX = -1;
  let prevItemY = -1;
  if (prevItem) {
    if (swappable) {
      // Has an item to swap. So pick up this one for later.
      let inv = getInv(store, toInvId);
      let prevItemId = prevItem.itemId;
      let slotIndex = getSlotIndexByItemId(inv, prevItemId);
      let [x, y] = getSlotCoordsByIndex(inv, slotIndex);
      prevItemX = x;
      prevItemY = y;
      prevItem = getItemByItemId(inv, prevItemId);
      // If we can merge, do it now.
      if (
        tryMergeItems(
          cursorState,
          store,
          toInvId,
          prevItem,
          heldInvId,
          heldItem,
          mergable,
          shiftKey,
        )
      ) {
        return true;
      }
      // ...otherwise we continue with the swap.
      removeItemFromInv(store, toInvId, prevItemId);
    } else {
      // Cannot swap. Exit early.
      return false;
    }
  } else if (
    tryDropPartialItem(
      store,
      heldInvId,
      toInvId,
      heldItem,
      mergable,
      shiftKey,
      0,
      0,
    )
  ) {
    // No item in the way and we want to partially drop singles.
    return true;
  }
  // Now there are no items in the way. Place it down!
  clearHeldItem(cursorState, store);
  addItemToInv(store, toInvId, heldItem, 0, 0);
  // ...finally put the remaining item back now that there is space.
  if (prevItem) {
    setHeldItem(
      cursorState,
      store,
      prevItem,
      Math.min(0, prevItemX - coordX),
      Math.min(0, prevItemY - coordY),
    );
  }
  return true;
}
