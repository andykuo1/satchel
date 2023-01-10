import { getItemByItemId } from '../inv/InvItems';
import { getClosestItemForElement, getItemIdForElement } from '../renderer/ItemRenderer';
import { getInv } from '../store/InvTransfer';
import { GridViewTransfer } from '../transfer/GridViewTransfer';
import { getClosestViewForElement } from '../renderer/ViewRenderer';
import { ListViewTransfer } from '../transfer/ListViewTransfer';

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
