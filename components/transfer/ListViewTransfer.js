import { clearHeldItem, getCursorInvId, getHeldItem, hasHeldItem, setHeldItem } from '../cursor/CursorTransfer';
import { isInputDisabled, isOutputCopied, isOutputDisabled } from '../inv/View';
import { getCursor } from '../cursor/CursorTransfer';
import { tryDropPartialItem, tryMergeItems, tryPickUp } from './ViewTransfer';
import { addItemToInv, getInv, removeItemFromInv } from '../store/InvTransfer';
import { getSlotCoordsByIndex, getSlotIndexByItemId, isSlotIndexEmpty } from '../inv/Slots';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/Item').Item} Item
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../cursor/CursorState').CursorState} CursorState
 */

export const ListViewTransfer = {
    itemMouseDownCallback,
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
function itemMouseDownCallback(e, store, view, inv, item, element) {
    const cursor = getCursor(store);
    const swappable = true;
    const mergable = true;
    const shiftKey = e.shiftKey;

    if (hasHeldItem(store)) {
        if (!swappable) {
            // Cannot swap. Exit early.
            return false;
        }
        if (!item) {
            return false;
        }
        if (isOutputDisabled(view)) {
            // Cannot output from swap.
            return false;
        }
        if (isInputDisabled(view)) {
            // Cannot input from swap.
            return false;
        }
        if (isOutputCopied(view)) {
            // Cannot copy into already full cursor.
            return false;
        }
        // Swap or merge it here!
        const heldInvId = getCursorInvId(store);
        const heldItem = getHeldItem(store);

        // Has an item to swap. So pick up this one for later.
        const toInvId = inv.invId;
        const prevItem = item;
        // If we can merge, do it now.
        if (tryMergeItems(cursor, store, toInvId, prevItem, heldInvId, heldItem, mergable, shiftKey)) {
            return true;
        }
        let slotIndex = getSlotIndexByItemId(inv, prevItem.itemId);
        let [coordX, coordY] = getSlotCoordsByIndex(inv, slotIndex);
        // ...otherwise we continue with the swap.
        removeItemFromInv(store, toInvId, prevItem.itemId);
        // Now there are no items in the way. Place it down!
        clearHeldItem(cursor, store);
        addItemToInv(store, toInvId, heldItem, coordX, coordY);
        // ...finally put the remaining item back now that there is space.
        if (prevItem) {
            setHeldItem(cursor, store, prevItem, 0, 0);
        }
        return true;
    } else {
        return tryPickUp(e, cursor, store, view, inv, item, 0, 0);
    }
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

    let result = false;
    const heldItem = getHeldItem(store);
    if (heldItem) {
        if (cursor.ignoreFirstPutDown) {
            // First put down has been ignored. Don't ignore the next intentful one.
            cursor.ignoreFirstPutDown = false;
            result = true;
        } else {
            // playSound('putdown');
            result = putDownToListInventory(cursor, store, invId, shiftKey);
        }
    }
    return result;
}

function putDownToListInventory(cursor, store, toInvId, shiftKey) {
    let heldItem = getHeldItem(store);
    let heldInvId = getCursorInvId(store);
    let mergable = false;
    let inv = getInv(store, toInvId);
    
    // Find nearest empty slot.
    let nextIndex = -1;
    for(let i = 0; i < inv.length; ++i) {
        if (isSlotIndexEmpty(inv, i)) {
            nextIndex = i;
            break;
        }
    }
    const [coordX, coordY] = getSlotCoordsByIndex(inv, nextIndex);
    if (nextIndex < 0) {
        return false;
    } else if (tryDropPartialItem(store, heldInvId, toInvId, heldItem, mergable, shiftKey, coordX, coordY)) {
        // No item in the way and we want to partially drop singles.
        return true;
    }

    clearHeldItem(cursor, store);
    addItemToInv(store, toInvId, heldItem, coordX, coordY);
    return true;
}
