import { getItemByItemId } from '../inv/InvItems';
import { getClosestItemForElement, getItemIdForElement } from '../renderer/ItemRenderer';
import { getInv } from '../store/InvTransfer';
import { GridViewTransfer } from '../transfer/GridViewTransfer';
import { getClosestViewForElement } from '../renderer/ViewRenderer';
import { ListViewTransfer } from '../transfer/ListViewTransfer';
import { getCursor } from './CursorTransfer';
import { ViewStore } from '../store';
import { findValidPosition } from '../ViewOrganizer';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/Item').Item} Item
 * @typedef {import('../inv/View').View} View
 */

/**
 * Perform pickup logic for item elements.
 *
 * @param {MouseEvent} mouseEvent The triggering mouse event.
 * @param {Store} store
 * @param {View} view
 * @returns {boolean} Whether to allow the event to propagate.
 */
export function itemMouseDownCallback(mouseEvent, store, view) {
  const invId = view.invId;
  const inv = getInv(store, invId);
  const element = /** @type {HTMLElement} */ (mouseEvent.target);
  const itemElement = getClosestItemForElement(element);
  const itemId = getItemIdForElement(itemElement);
  const item = getItemByItemId(inv, itemId);
  const containerElement = getClosestViewForElement(element);

  let result;
  if (view.type === 'list') {
    result = ListViewTransfer.itemMouseDownCallback(mouseEvent, store, view, inv, item, containerElement);
  } else {
    result = GridViewTransfer.itemMouseDownCallback(mouseEvent, store, view, inv, item, containerElement);
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
 * @returns {boolean} Whether to allow the event to propagate.
 */
export function containerMouseUpCallback(
  mouseEvent,
  store,
  view,
) {
  const invId = view.invId;
  const inv = getInv(store, invId);
  const containerElement = getClosestViewForElement(/** @type {HTMLElement} */ (mouseEvent.target));

  let result;
  if (view.type === 'list') {
    result = ListViewTransfer.containerMouseUpCallback(mouseEvent, store, view, inv, containerElement);
  } else {
    result = GridViewTransfer.containerMouseUpCallback(mouseEvent, store, view, inv, containerElement);
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
 * @param {MouseEvent} e 
 * @param {Store} store 
 * @param {View} view 
 */
export function handleMouseDownCallback(e, store, view) {
  const cursor = getCursor(store);
  let offsetX = view.coordX - Math.round(cursor.getCursorWorldX() / cursor.gridUnit);
  let offsetY = view.coordY - Math.round(cursor.getCursorWorldY() / cursor.gridUnit);

  let handle = null;
  function onAnimationFrame() {
    if (!handle) {
      return;
    }

    const cursor = getCursor(store);
    let nextX = Math.round(cursor.getCursorWorldX() / cursor.gridUnit) + offsetX;
    let nextY = Math.round(cursor.getCursorWorldY() / cursor.gridUnit) + offsetY;
    let out = findValidPosition([0, 0], store, view, nextX, nextY);
    view.coordX = out[0];
    view.coordY = out[1];
    ViewStore.dispatch(store, view.viewId);

    handle = requestAnimationFrame(onAnimationFrame);
  }
  handle = requestAnimationFrame(onAnimationFrame);

  function onMouseUp(e) {
    cancelAnimationFrame(handle);
    handle = null;

    document.removeEventListener('mouseup', onMouseUp, true);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  document.addEventListener('mouseup', onMouseUp, true);
}
