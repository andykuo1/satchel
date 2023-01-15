import { clearHeldItem, getCursorInvId, getHeldItem, setHeldItem } from './CursorTransfer';
import { isInputDisabled, isOutputDisabled } from '../inv/View';
import { getCursor } from './CursorTransfer';
import { getClientCoordX, getClientCoordY, getDeltaCoords, tryDropPartialItem, tryMergeItems, tryPickUp } from './ViewTransfer';
import { addItemToInv, getInv, getItemAtSlotCoords, getItemIdAtSlotCoords, removeItemFromInv } from './InvTransfer';
import { dijkstra2d } from '../../lib/util/dijkstra2d';
import { getItemByItemId } from '../inv/InvItems';
import { getSlotCoordsByIndex, getSlotIndexByItemId } from '../inv/Slots';

/**
 * @typedef {import('..').Store} Store
 * @typedef {import('../inv/Item').Item} Item
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../data/CursorState').CursorState} CursorState
 */

export const GridViewTransfer = {
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
  const [deltaCoordX, deltaCoordY] = getDeltaCoords(inv, item.itemId, e.clientX, e.clientY, cursor.gridUnit, element);
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
    return false;
  }
  if (isInputDisabled(view)) {
    return false;
  }
  const cursor = getCursor(store);
  const invId = view.invId;
  const shiftKey = e.shiftKey;
  const boundingRect = element.getBoundingClientRect();
  const clientCoordX = getClientCoordX(boundingRect, e.clientX, cursor.gridUnit);
  const clientCoordY = getClientCoordY(boundingRect, e.clientY, cursor.gridUnit);

  const swappable = !isOutputDisabled(view);
  const mergable = !isInputDisabled(view);

  const heldItem = getHeldItem(store);

  let result = false;
  if (heldItem) {
    if (cursor.ignoreFirstPutDown) {
      // First put down has been ignored. Don't ignore the next intentful one.
      cursor.ignoreFirstPutDown = false;
      result = true;
    } else {
      // playSound('putdown');
      result = putDownToGridInventory(
        cursor, store, getCursorInvId(store), invId,
        clientCoordX + cursor.heldOffsetX,
        clientCoordY + cursor.heldOffsetY,
        swappable, mergable, shiftKey);
    }
  }
  return result;
}

/**
 * @param {CursorState} cursorState
 * @param {Store} store
 * @param {InvId} heldInvId
 * @param {InvId} toInvId
 * @param {number} itemX The root slot coordinates to place item (includes holding offset)
 * @param {number} itemY The root slot coordinates to place item (includes holding offset)
 * @param {boolean} swappable
 * @param {boolean} mergable
 * @param {boolean} shiftKey
 */
function putDownToGridInventory(
  cursorState,
  store,
  heldInvId,
  toInvId,
  itemX,
  itemY,
  swappable,
  mergable,
  shiftKey,
) {
  const toInventory = getInv(store, toInvId);
  const heldItem = getHeldItem(store);
  const invWidth = toInventory.width;
  const invHeight = toInventory.height;
  // TODO: Is there a better way to do this? And not rely on single check?
  const itemWidth = toInventory.type === 'single' ? 1 : heldItem.width;
  const itemHeight = toInventory.type === 'single' ? 1 : heldItem.height;
  const maxCoordX = invWidth - itemWidth;
  const maxCoordY = invHeight - itemHeight;
  if (maxCoordX < 0 || maxCoordY < 0) {
    return false;
  }
  const targetCoordX = Math.min(Math.max(0, itemX), maxCoordX);
  const targetCoordY = Math.min(Math.max(0, itemY), maxCoordY);

  let prevItemId = null;
  for (let y = 0; y < itemHeight; ++y) {
    for (let x = 0; x < itemWidth; ++x) {
      let itemId = getItemIdAtSlotCoords(
        store,
        toInvId,
        targetCoordX + x,
        targetCoordY + y
      );
      if (itemId) {
        if (prevItemId) {
          if (itemId !== prevItemId) {
            swappable = false;
          } else {
            // It's the same item, keep going...
          }
        } else {
          prevItemId = itemId;
        }
      }
    }
  }

  if (swappable) {
    let prevItem = null;
    let prevItemX = -1;
    let prevItemY = -1;
    if (prevItemId) {
      // Has an item to swap or merge. So pick up this one for later.
      let inv = getInv(store, toInvId);
      let slotIndex = getSlotIndexByItemId(inv, prevItemId);
      let [x, y] = getSlotCoordsByIndex(inv, slotIndex);
      prevItemX = x;
      prevItemY = y;
      prevItem = getItemByItemId(inv, prevItemId);
      // If we can merge, do it now.
      if (tryMergeItems(cursorState, store, toInvId, prevItem, heldInvId, heldItem, mergable, shiftKey)) {
        return true;
      }
      // ...otherwise we continue with the swap.
      removeItemFromInv(store, toInvId, prevItemId);
    } else if (tryDropPartialItem(store, heldInvId, toInvId, heldItem, mergable, shiftKey, targetCoordX, targetCoordY)) {
      // No item in the way and we want to partially drop singles.
      return true;
    }
    // Now there are no items in the way. Place it down!
    clearHeldItem(cursorState, store);
    addItemToInv(store, toInvId, heldItem, targetCoordX, targetCoordY);
    // ...finally put the remaining item back now that there is space.
    if (prevItem) {
      setHeldItem(
        cursorState, store,
        prevItem,
        Math.min(0, prevItemX - targetCoordX),
        Math.min(0, prevItemY - targetCoordY)
      );
    }
    return true;
  } else {
    // Cannot swap here. Find somehwere close?
    const [x, y] = findEmptyCoords(
      targetCoordX,
      targetCoordY,
      maxCoordX,
      maxCoordY,
      (x, y) => canPlaceAt(store, toInvId, x, y, itemWidth, itemHeight)
    );
    if (x >= 0 && y >= 0) {
      clearHeldItem(cursorState, store);
      addItemToInv(store, toInvId, heldItem, x, y);
      return true;
    }
    // No can do :(
    return false;
  }
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param coordX
 * @param coordY
 * @param itemWidth
 * @param itemHeight
 * @param exclude
 */
function canPlaceAt(
  store,
  invId,
  coordX,
  coordY,
  itemWidth,
  itemHeight,
  exclude = null
) {
  for (let y = 0; y < itemHeight; ++y) {
    for (let x = 0; x < itemWidth; ++x) {
      const item = getItemAtSlotCoords(store, invId, coordX + x, coordY + y);
      if (item && (!exclude || item !== exclude)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * @param coordX
 * @param coordY
 * @param maxCoordX
 * @param maxCoordY
 * @param isEmptyCallback
 */
function findEmptyCoords(
  coordX,
  coordY,
  maxCoordX,
  maxCoordY,
  isEmptyCallback = () => true
) {
  return dijkstra2d(
    coordX,
    coordY,
    0,
    0,
    maxCoordX,
    maxCoordY,
    isEmptyCallback,
    getNeighborsFromCoords,
    fromCoordsToNode,
    toCoordsFromNode);
}

/**
 * @param coordX
 * @param coordY
 */
function fromCoordsToNode(coordX, coordY) {
  return ((coordX & 0xff_ff) << 16) | (coordY & 0xff_ff);
}

/**
 * @param node
 * @param out
 */
function toCoordsFromNode(node, out) {
  out[0] = node >> 16;
  out[1] = node & 0xff_ff;
  return out;
}

/**
 * @param coordX
 * @param coordY
 * @param out
 */
function getNeighborsFromCoords(coordX, coordY, out) {
  out[0] = fromCoordsToNode(coordX - 1, coordY);
  out[1] = fromCoordsToNode(coordX, coordY - 1);
  out[2] = fromCoordsToNode(coordX + 1, coordY);
  out[3] = fromCoordsToNode(coordX, coordY + 1);
  return out;
}
