import {
  clearSlots,
  getSlotCoordsByIndex,
  getSlotIndexByItemId,
  setSlots,
} from './Slots';

/**
 * @typedef {import('./Inv').Inv} Inv
 * @typedef {import('./Item').ItemId} ItemId
 * @typedef {import('./Item').Item} Item
 */

/**
 * @param {Inv} inv
 * @param {ItemId} itemId
 * @param {Item} item
 */
export function UNSAFE_registerItemByItemId(inv, itemId, item) {
  inv.items[itemId] = item;
}

/**
 * @param {Inv} inv
 * @param {ItemId} itemId
 */
export function UNSAFE_unregisterItemByItemId(inv, itemId) {
  delete inv.items[itemId];
}

/**
 * @param {Inv} inv
 * @returns {Array<ItemId>}
 */
export function getItemIds(inv) {
  return Object.keys(inv.items);
}

/**
 * @param {Inv} inv
 * @returns {Array<Item>}
 */
export function getItems(inv) {
  return Object.values(inv.items);
}

/**
 * @param {Inv} inv
 * @param {ItemId} itemId
 * @returns {Item}
 */
export function getItemByItemId(inv, itemId) {
  return inv.items[itemId];
}

/**
 * @param {Inv} inv
 * @param {ItemId} itemId
 * @returns {boolean}
 */
export function hasItem(inv, itemId) {
  if (getItemByItemId(inv, itemId)) {
    return true;
  } else {
    return false;
  }
}

/**
 * @param {Inv} inv
 * @param {Item} item
 * @param {number} coordX
 * @param {number} coordY
 */
export function putItem(inv, item, coordX, coordY) {
  if (!inv) {
    throw new Error('Cannot put item to non-existant inventory.');
  }
  if (!item) {
    throw new Error('Cannot put null item.');
  }
  const itemId = item.itemId;
  if (hasItem(inv, itemId)) {
    throw new Error(
      `Cannot put item '${itemId}' that already exists in inventory '${inv.invId}'.`,
    );
  }
  UNSAFE_registerItemByItemId(inv, itemId, item);
  if (inv.type === 'single') {
    setSlots(inv, coordX, coordY, coordX, coordY, itemId);
  } else {
    setSlots(
      inv,
      coordX,
      coordY,
      coordX + item.width - 1,
      coordY + item.height - 1,
      itemId,
    );
  }
}

/**
 * @param {Inv} inv
 * @param {ItemId} itemId
 */
export function removeItem(inv, itemId) {
  if (!inv) {
    throw new Error('Cannot remove item from non-existant inventory.');
  }
  if (!hasItem(inv, itemId)) {
    throw new Error(
      `Cannot remove item '${itemId}' that does not exist in inventory '${inv.invId}'.`,
    );
  }
  let slotIndex = getSlotIndexByItemId(inv, itemId);
  if (slotIndex < 0) {
    throw new Error(
      `Failed to remove item '${itemId}' - missing slot index for item.`,
    );
  }
  let item = getItemByItemId(inv, itemId);
  let [fromX, fromY] = getSlotCoordsByIndex(inv, slotIndex);
  if (inv.type === 'single') {
    clearSlots(inv, fromX, fromY, fromX, fromY, itemId);
  } else {
    let toX = fromX + item.width - 1;
    let toY = fromY + item.height - 1;
    clearSlots(inv, fromX, fromY, toX, toY, itemId);
  }
  UNSAFE_unregisterItemByItemId(inv, itemId);
  return true;
}

/**
 * @param {Inv} inv
 */
export function clearItems(inv) {
  clearSlots(inv, 0, 0, inv.width - 1, inv.height - 1);
  for (let itemId of getItemIds(inv)) {
    UNSAFE_unregisterItemByItemId(inv, itemId);
  }
}
