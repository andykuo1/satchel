import { hasHeldItem, pickUp, putDown, setHeldItem } from './CursorTransfer';
import { getSlotCoordsByIndex, getSlotIndexByItemId } from './inv/InvSlots';
import { copyItem } from './inv/Item';
import { isInputDisabled, isOutputCopied, isOutputDisabled } from './inv/View';
import { CursorStore } from './store';

/**
 * @typedef {import('react').RefObject} RefObject
 * @typedef {import('./store').Store} Store
 * @typedef {import('./inv/Item').Item} Item
 * @typedef {import('./inv/View').View} View
 */

const UNIT_SIZE = 50;

/**
 * Perform pickup logic for item elements.
 *
 * @param {MouseEvent} mouseEvent The triggering mouse event.
 * @param {Store} store
 * @param {Item} item
 * @param {View} view
 * @param {HTMLElement} containerElement
 * @param {number} unitSize The item unit size.
 * @returns {boolean} Whether to allow the event to propagate.
 */
export function itemMouseDownCallback(mouseEvent, store, item, view, containerElement, unitSize = UNIT_SIZE) {
  if (isOutputDisabled(view)) {
    return;
  }
  const boundingRect = containerElement.getBoundingClientRect();
  const clientCoordX = getClientCoordX(boundingRect, mouseEvent.clientX, unitSize);
  const clientCoordY = getClientCoordY(boundingRect, mouseEvent.clientY, unitSize);

  const itemId = item.itemId;
  const invId = view.invId;
  const cursor = CursorStore.get(store);

  let result;
  if (isOutputCopied(view)) {
    if (!item) {
      return;
    }
    if (hasHeldItem(store)) {
      // NOTE: Swapping is performed on putDown(), so ignore for pick up.
      return;
    }
    let newItem = copyItem(item);
    // Try splitting the stack.
    if (mouseEvent.shiftKey && item.stackSize > 1) {
      newItem.stackSize = Math.floor(item.stackSize / 2);
    }
    const slotIndex = getSlotIndexByItemId(inv, itemId);
    const [fromItemX, fromItemY] = getSlotCoordsByIndex(inv, slotIndex);
    setHeldItem(cursor, store, newItem, fromItemX - clientCoordX, fromItemY - clientCoordY);
    result = true;
  } else {
    // Try splitting the stack.
    if (mouseEvent.shiftKey && !hasHeldItem(store) && item.stackSize > 1) {
      let newStackSize = Math.floor(item.stackSize / 2);
      let remaining = item.stackSize - newStackSize;
      let newItem = copyItem(item);
      newItem.stackSize = newStackSize;
      item.stackSize = remaining;
      // dispatchItemChange(store, itemId);
      const slotIndex = getSlotIndexByItemId(inv, itemId);
      const [fromItemX, fromItemY] = getSlotCoordsByIndex(inv, slotIndex);
      setHeldItem(cursor, store, newItem, fromItemX - clientCoordX, fromItemY - clientCoordY);
      result = true;
    } else {
      result = pickUp(cursor, store, invId, itemId, clientCoordX, clientCoordY);
    }
  }
  if (result) {
    // HACK: This should really grab focus to the item.
    let activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    return false;
  }
}

/**
 * Perform pickup logic for container elements.
 *
 * @param {MouseEvent} mouseEvent The triggering mouse event.
 * @param {Store} store
 * @param {View} view
 * @param {HTMLElement} containerElement
 * @param {number} unitSize The item unit size.
 * @returns {boolean} Whether to allow the event to propagate.
 */
export function containerMouseUpCallback(
  mouseEvent,
  store,
  view,
  containerElement,
  unitSize = UNIT_SIZE
) {
  if (mouseEvent.button !== 0) {
    return;
  }
  if (isInputDisabled(view)) {
    return;
  }
  const invId = view.invId;
  const rootElement = containerElement;
  const swappable = !isOutputDisabled(view);
  const mergable = !isInputDisabled(view);
  const shiftKey = mouseEvent.shiftKey;
  const boundingRect = rootElement.getBoundingClientRect();
  const clientCoordX = getClientCoordX(
    boundingRect,
    mouseEvent.clientX,
    unitSize
  );
  const clientCoordY = getClientCoordY(
    boundingRect,
    mouseEvent.clientY,
    unitSize
  );
  const cursor = CursorStore.get(store);
  let result = putDown(cursor, store, invId, clientCoordX, clientCoordY, swappable, mergable, shiftKey);
  if (result) {
    // HACK: This should really grab focus to the item.
    let activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    return false;
  }
}

/**
 * @param {DOMRect} elementBoundingRect
 * @param {number} clientX
 * @param {number} unitSize
 * @returns {number}
 */
export function getClientCoordX(elementBoundingRect, clientX, unitSize) {
  return Math.trunc((clientX - elementBoundingRect.x) / unitSize);
}

/**
 * @param {DOMRect} elementBoundingRect
 * @param {number} clientY
 * @param {number} unitSize
 * @returns {number}
 */
export function getClientCoordY(elementBoundingRect, clientY, unitSize) {
  return Math.trunc((clientY - elementBoundingRect.y) / unitSize);
}
