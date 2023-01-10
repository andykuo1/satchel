import { clearHeldItem, getHeldItem } from '../cursor/CursorTransfer';
import { getCursor } from '../cursor/CursorTransfer';
import { addItemToInv, getView } from '../store/InvTransfer';
import { posToCoord } from '../cursor/CursorState';
import { createGroundInvViewInStore } from '../store';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/Item').Item} Item
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../cursor/CursorState').CursorState} CursorState
 */

export const GroundViewTransfer = {
    itemMouseDowncallback,
    containerMouseUpCallback
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
function itemMouseDowncallback(e, store, view, inv, item, element) {
    throw new Error('Unsupported operation');
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
    const cursor = getCursor(store);
    let [gridX, gridY] = posToCoord([0, 0], cursor.getCursorWorldX(), cursor.getCursorWorldY(), cursor.gridUnit);
    gridX += cursor.heldOffsetX;
    gridY += cursor.heldOffsetY;
    return putDownInGround(cursor, store, gridX, gridY);
}

/**
 * Put down from cursor to ground.
 * @param {CursorState} cursor
 * @param {Store} store
 */
function putDownInGround(cursor, store, clientX = 0, clientY = 0) {
    const heldItem = getHeldItem(store);
    if (!heldItem) {
        return false;
    }
    if (cursor.ignoreFirstPutDown) {
        // First put down has been ignored. Don't ignore the next intentful one.
        cursor.ignoreFirstPutDown = false;
        return true;
    }
    clearHeldItem(cursor, store);

    // TODO: ???
    let posX = clientX;
    let posY = clientY;
    let viewId = createGroundInvViewInStore(store,
        undefined, undefined,
        heldItem.width, heldItem.height,
        Math.floor(posX / cursor.gridUnit),
        Math.floor(posY / cursor.gridUnit),
        ['workspace']);
    let view = getView(store, viewId);
    let invId = view.invId;
    addItemToInv(store, invId, heldItem, 0, 0);

    // dropFallingItem(heldItem, clientX, clientY);
    return true;
}