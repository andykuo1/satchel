import { getInv } from '../store/InvTransfer';
import { GridViewTransfer } from '../transfer/GridViewTransfer';

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
 * @param {Item} item
 * @param {View} view
 * @param {HTMLElement} containerElement
 * @returns {boolean} Whether to allow the event to propagate.
 */
export function itemMouseDownCallback(mouseEvent, store, item, view, containerElement) {
  const invId = view.invId;
  const inv = getInv(store, invId);

  let result = GridViewTransfer.itemMouseDownCallback(mouseEvent, store, view, inv, item, containerElement);
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
 * @returns {boolean} Whether to allow the event to propagate.
 */
export function containerMouseUpCallback(
  mouseEvent,
  store,
  view,
  containerElement
) {
  const invId = view.invId;
  const inv = getInv(store, invId);

  let result = GridViewTransfer.containerMouseUpCallback(mouseEvent, store, view, inv, containerElement);
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
