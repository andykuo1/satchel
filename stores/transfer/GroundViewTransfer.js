import { clearHeldItem, getHeldItem } from './CursorTransfer';
import { getCursor } from './CursorTransfer';
import { posToCoord } from '../data/CursorState';
import { tryUnpackItem } from './Unpacker';
import { getLanding } from '../../components/cursor/CursorLanding';

/**
 * @typedef {import('..').Store} Store
 * @typedef {import('../inv/Item').Item} Item
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../data/CursorState').CursorState} CursorState
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

    let [valid, coordX, coordY, width, height] = getLanding(cursor, store);
    if (!valid) {
        return false;
    }
    if (tryUnpackItem(store, heldItem, coordX, coordY)) {
        clearHeldItem(cursor, store);
        return true;
    }

    // drop falling item.
    return false;
}
