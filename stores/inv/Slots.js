/**
 * @typedef {import('./Inv').Inv} Inv
 * @typedef {import('./Inv').ItemId} ItemId
 */

/**
 * @param {Inv} inv
 * @param {number} slotIndex
 * @param {ItemId} itemId
 */
export function UNSAFE_setItemIdBySlotIndex(inv, slotIndex, itemId) {
  inv.slots[slotIndex] = itemId;
}

/**
 * @param {Inv} inv
 * @param {number} slotIndex
 * @returns {ItemId}
 */
export function getItemIdBySlotIndex(inv, slotIndex) {
  return inv.slots[slotIndex];
}

/**
 * @param {Inv} inv
 * @param {number} coordX
 * @param {number} coordY
 * @returns {ItemId}
 */
export function getItemIdBySlotCoords(inv, coordX, coordY) {
  let slotIndex = getSlotIndexByCoords(inv, coordX, coordY);
  return getItemIdBySlotIndex(inv, slotIndex);
}

/**
 * @param {Inv} inv
 * @param {number} coordX
 * @param {number} coordY
 * @returns {boolean}
 */
export function isSlotCoordEmpty(inv, coordX, coordY) {
  let slotIndex = getSlotIndexByCoords(inv, coordX, coordY);
  return isSlotIndexEmpty(inv, slotIndex);
}

/**
 * @param {Inv} inv
 * @param {number} slotIndex
 * @returns {boolean}
 */
export function isSlotIndexEmpty(inv, slotIndex) {
  let itemId = getItemIdBySlotIndex(inv, slotIndex);
  if (itemId) {
    return false;
  } else {
    return true;
  }
}

/**
 * @param {Inv} inv
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {ItemId} itemId
 */
export function setSlots(inv, fromX, fromY, toX, toY, itemId) {
  for (let x = fromX; x <= toX; ++x) {
    for (let y = fromY; y <= toY; ++y) {
      let slotIndex = getSlotIndexByCoords(inv, x, y);
      if (slotIndex < 0) {
        continue;
      }
      UNSAFE_setItemIdBySlotIndex(inv, slotIndex, itemId);
    }
  }
}

/**
 * @param {Inv} inv
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {ItemId} [itemId]
 */
export function clearSlots(inv, fromX, fromY, toX, toY, itemId = undefined) {
  for (let x = fromX; x <= toX; ++x) {
    for (let y = fromY; y <= toY; ++y) {
      let slotIndex = getSlotIndexByCoords(inv, x, y);
      if (slotIndex < 0) {
        continue;
      }
      if (!itemId || itemId === getItemIdBySlotIndex(inv, slotIndex)) {
        UNSAFE_setItemIdBySlotIndex(inv, slotIndex, null);
      }
    }
  }
}

/**
 * @param {Inv} inv
 * @param {number} coordX
 * @param {number} coordY
 * @returns {number}
 */
export function getSlotIndexByCoords(inv, coordX, coordY) {
  if (coordX < 0 || coordY < 0) {
    return -1;
  }
  const width = inv.width;
  const height = inv.height;
  if (coordX >= width || coordY >= height) {
    return -1;
  }
  return Math.floor(coordX) + Math.floor(coordY) * width;
}

/**
 * @param {Inv} inv
 * @param {number} slotIndex
 * @returns {[number, number]}
 */
export function getSlotCoordsByIndex(inv, slotIndex) {
  if (slotIndex < 0) {
    return [-1, -1];
  }
  const width = inv.width;
  return [slotIndex % width, Math.floor(slotIndex / width)];
}

/**
 * @param {Inv} inv
 * @param {ItemId} itemId
 * @param {number} startIndex
 */
export function getSlotIndexByItemId(inv, itemId, startIndex = 0) {
  const length = inv.length;
  for (let i = startIndex; i < length; ++i) {
    let invItemId = getItemIdBySlotIndex(inv, i);
    if (invItemId && invItemId === itemId) {
      return i;
    }
  }
  return -1;
}

/**
 * @param {Inv} inv
 */
export function getSlottedItemIds(inv) {
  return inv.slots.filter((itemId) => typeof itemId === 'string');
}

/**
 * @param {Inv} inv
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {ItemId} [itemId]
 */
export function computeSlottedArea(
  inv,
  fromX,
  fromY,
  toX,
  toY,
  itemId = undefined,
) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = 0;
  let maxY = 0;
  for (let x = fromX; x <= toX; ++x) {
    for (let y = fromY; y <= toY; ++y) {
      let slotIndex = getSlotIndexByCoords(inv, x, y);
      if (slotIndex < 0) {
        continue;
      }
      if (!itemId || itemId === getItemIdBySlotIndex(inv, slotIndex)) {
        minX = Math.min(x, minX);
        minY = Math.min(y, minY);
        maxX = Math.max(x, maxX);
        maxY = Math.max(y, maxY);
      }
    }
  }
  if (Number.isFinite(minX) && Number.isFinite(minY)) {
    return [maxX - minX + 1, maxY - minY + 1];
  } else {
    return [0, 0];
  }
}
