import { dijkstra2d } from '../lib/util/dijkstra2d';
import { distanceSquared } from '../lib/util/math';
import { getItemByItemId } from './inv/InvItems';
import { getSlotCoordsByIndex, getSlotIndexByItemId, isSlotIndexEmpty } from './inv/InvSlots';
import { copyItem } from './inv/Item';
import { CursorStore } from './store';
import { addItemToInv, clearItemsInInv, getInv, getItemAtSlotCoords, getItemAtSlotIndex, getItemIdAtSlotCoords, removeItemFromInv } from './store/InvTransfer';

/**
 * @typedef {import('./store').Store} Store
 * @typedef {import('./inv/Item').Item} Item
 */

const PLACE_BUFFER_RANGE = 10;
const PLACE_BUFFER_RANGE_SQUARED = PLACE_BUFFER_RANGE * PLACE_BUFFER_RANGE;

export class CursorState {
  constructor() {
    this.clientX = 0;
    this.clientY = 0;
    this.heldOffsetX = 0;
    this.heldOffsetY = 0;
    this.startHeldX = 0;
    this.startHeldY = 0;
    this.ignoreFirstPutDown = false;
    this.gridUnit = 50;
    this.visible = false;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
  }

  /** @param {MouseEvent} e */
  onMouseMove(e) {
    this.clientX = e.clientX;
    this.clientY = e.clientY;
  }

  /** @param {number} now */
  onAnimationFrame(now) {
    if (this.ignoreFirstPutDown
      && distanceSquared(this.clientX, this.clientY, this.startHeldX, this.startHeldY) >= PLACE_BUFFER_RANGE_SQUARED) {
      // This is a drag motion. Next putDown should be intentful.
      this.ignoreFirstPutDown = false;
    }
  }

  getCursorScreenX() {
    return this.clientX + this.heldOffsetX * this.gridUnit;
  }

  getCursorScreenY() {
    return this.clientY + this.heldOffsetY * this.gridUnit;
  }

  setFull(offsetX = 0, offsetY = 0) {
    this.visible = true;
    this.ignoreFirstPutDown = true;
    this.startHeldX = this.clientX;
    this.startHeldY = this.clientY;
    this.heldOffsetX = Math.min(0, offsetX);
    this.heldOffsetY = Math.min(0, offsetY);
    // playSound('pickup');
  }

  setEmpty() {
    this.visible = false;
    this.ignoreFirstPutDown = false;
  }
}

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
 * @param {CursorState} cursorState The cursor state
 * @param {Store} store The store
 * @param {Item} item The item to hold
 * @param {number} offsetX The held offset from root item slot (can only be non-positive)
 * @param {number} offsetY The held offset from root item slot (can only be non-positive)
 */
export function setHeldItem(cursorState, store, item, offsetX = 0, offsetY = 0) {
  if (!item) {
    throw new Error('Cannot set held item to null - use clearHeldItem() instead.');
  }
  if (hasHeldItem(store)) {
    throw new Error('Cannot set held item - already holding another item.');
  }
  addItemToInv(store, getCursorInvId(store), item, 0, 0);
  cursorState.setFull(offsetX, offsetY);
}

/**
 * @param {CursorState} cursorState The cursor state
 * @param {Store} store The store
 */
export function clearHeldItem(cursorState, store) {
  clearItemsInInv(store, getCursorInvId(store));
  cursorState.setEmpty();
}

/**
 * Pick up from target inventory to cursor if able to.
 *
 * @param {CursorState} cursorState The cursor state
 * @param {Store} store The store
 * @param {InvId} invId The inventory to pick up from
 * @param {ItemId} itemId The item to pick up
 * @param {number} coordX The cursor pick up coordinates from the inventory
 * @param {number} coordY The cursor pick up coordinates from the inventory
 * @returns {boolean} Whether the transfer to cursor was successful.
 */
export function pickUp(cursorState, store, invId, itemId, coordX = 0, coordY = 0) {
  if (!itemId) {
    return false;
  }
  if (hasHeldItem(store)) {
    // NOTE: Swapping is performed on putDown(), so ignore for pick up.
    return false;
  }
  let inv = getInv(store, invId);
  const slotIndex = getSlotIndexByItemId(inv, itemId);
  const [fromItemX, fromItemY] = getSlotCoordsByIndex(inv, slotIndex);
  const item = getItemByItemId(inv, itemId);
  removeItemFromInv(store, invId, itemId);
  setHeldItem(cursorState, store, item, fromItemX - coordX, fromItemY - coordY);
  return true;
}

/**
 * Put down from cursor to destination inventory.
 *
 * @param {CursorState} cursorState
 * @param {Store} store
 * @param {InvId} invId
 * @param {number} coordX
 * @param {number} coordY
 * @param {boolean} swappable
 * @param {boolean} mergable
 * @param {boolean} shiftKey
 */
export function putDown(cursorState, store, invId, coordX, coordY, swappable, mergable, shiftKey) {
  const heldItem = getHeldItem(store);
  if (!heldItem) {
    return false;
  }
  if (cursorState.ignoreFirstPutDown) {
    // First put down has been ignored. Don't ignore the next intentful one.
    cursorState.ignoreFirstPutDown = false;
    return true;
  }
  // playSound('putdown');
  const toInventory = getInv(store, invId);
  const invType = toInventory.type;
  switch (invType) {
    case 'socket':
      return putDownToSocketInventory(cursorState, store, invId, coordX, coordY, swappable, mergable, shiftKey);
    case 'grid':
      return putDownToGridInventory(
        cursorState, store, invId,
        coordX + cursorState.heldOffsetX,
        coordY + cursorState.heldOffsetY,
        swappable, mergable, shiftKey);
    default:
      throw new Error('Unsupported inventory type.');
  }
}

/**
 * Put down from cursor to ground.
 * @param {CursorState} cursorState
 * @param {Store} store
 */
export function putDownInGround(cursorState, store, clientX = 0, clientY = 0) {
  const heldItem = getHeldItem(store);
  if (!heldItem) {
    return false;
  }
  if (cursorState.ignoreFirstPutDown) {
    // First put down has been ignored. Don't ignore the next intentful one.
    cursorState.ignoreFirstPutDown = false;
    return true;
  }
  clearHeldItem(store, cursorState);
  // dropFallingItem(heldItem, clientX, clientY);
  return true;
}

/**
 * @param {CursorState} cursor
 * @param {Store} store
 * @param {InvId} toInvId
 * @param {number} coordX
 * @param {number} coordY
 * @param {boolean} swappable
 * @param {boolean} mergable
 * @param {boolean} shiftKey
 */
export function putDownToSocketInventory(
  cursorState,
  store,
  toInvId,
  coordX,
  coordY,
  swappable,
  mergable,
  shiftKey
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
      if (tryMergeItems(cursorState, store, prevItem, heldItem, mergable, shiftKey)) {
        return true;
      }
      // ...otherwise we continue with the swap.
      removeItemFromInv(store, toInvId, prevItemId);
    } else {
      // Cannot swap. Exit early.
      return false;
    }
  } else if (tryDropPartialItem(store, toInvId, heldItem, mergable, shiftKey, 0, 0)) {
    // No item in the way and we want to partially drop singles.
    return true;
  }
  // Now there are no items in the way. Place it down!
  clearHeldItem(cursorState, store);
  addItemToInv(store, toInvId, heldItem, 0, 0);
  // ...finally put the remaining item back now that there is space.
  if (prevItem) {
    setHeldItem(
      cursorState, store, prevItem,
      Math.min(0, prevItemX - coordX),
      Math.min(0, prevItemY - coordY));
  }
  return true;
}

/**
 * @param {CursorState} cursorState
 * @param {Store} store
 * @param {InvId} toInvId
 * @param {number} itemX The root slot coordinates to place item (includes holding offset)
 * @param {number} itemY The root slot coordinates to place item (includes holding offset)
 * @param {boolean} swappable
 * @param {boolean} mergable
 * @param {boolean} shiftKey
 */
export function putDownToGridInventory(
  cursorState,
  store,
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
  const itemWidth = heldItem.width;
  const itemHeight = heldItem.height;
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
      if (tryMergeItems(cursorState, store, prevItem, heldItem, mergable, shiftKey)) {
        return true;
      }
      // ...otherwise we continue with the swap.
      removeItemFromInv(store, toInvId, prevItemId);
    } else if (tryDropPartialItem(store, toInvId, heldItem, mergable, shiftKey, targetCoordX, targetCoordY)) {
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

export function tryTakeOneItem(store, item) {
  if (item.stackSize > 1) {
    let amount = 1;
    let remaining = item.stackSize - amount;
    let newItem = copyItem(item);
    newItem.stackSize = amount;
    item.stackSize = remaining;
    // dispatchItemChange(store, item.itemId);
    return newItem;
  } else {
    return null;
  }
}

function tryDropPartialItem(store, toInvId, heldItem, mergable, shiftKey, targetCoordX, targetCoordY) {
  if (mergable && shiftKey && heldItem.stackSize > 1) {
    // No item in the way and we want to partially drop singles.
    let amount = 1;
    let remaining = heldItem.stackSize - amount;
    let newItem = copyItem(heldItem);
    newItem.stackSize = amount;
    heldItem.stackSize = remaining;
    // dispatchItemChange(store, heldItem.itemId);
    addItemToInv(store, toInvId, newItem, targetCoordX, targetCoordY);
    return true;
  }
  return false;
}

function tryMergeItems(cursorState, store, prevItem, heldItem, mergable, shiftKey) {
  // If we can merge, do it now.
  if (!mergable || !isMergableItems(prevItem, heldItem)) {
    return false;
  }
  // Full merge!
  if (!shiftKey) {
    mergeItems(prevItem, heldItem);
    // dispatchItemChange(store, prevItem.itemId);
    // Merged successfully! Discard the held item.
    clearHeldItem(cursorState, store);
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
  // dispatchItemChange(store, prevItem.itemId);
  // dispatchItemChange(store, heldItem.itemId);
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
