import { uuid } from '../../lib/util/uuid';
import { cloneItem, copyItem } from './Item';

/**
 * @typedef {import('./Item').Item} Item
 * @typedef {import('./Item').ItemId} ItemId
 */

/**
 * @typedef {string} InvId
 * @typedef {'grid'|'socket'} InvType
 *
 * @typedef Inv
 * @property {InvId} invId
 * @property {InvType} type
 * @property {Record<ItemId, Item>} items
 * @property {Array<ItemId>} slots
 * @property {number} width
 * @property {number} height
 * @property {number} length
 * @property {string} displayName
 * @property {object} metadata
 */

/**
 * Create an inventory.
 *
 * @param {InvId} invId
 * @param {InvType} invType
 * @param {number} slotCount
 * @param {number} maxCoordX
 * @param {number} maxCoordY
 * @returns {Inv}
 */
export function createInv(invId, invType, slotCount, maxCoordX, maxCoordY) {
  let inv = {
    invId,
    type: invType,
    items: {},
    slots: new Array(slotCount).fill(null),
    width: maxCoordX,
    height: maxCoordY,
    length: slotCount,
    displayName: '',
    metadata: {}, // TODO: Not used yet.
  };
  return inv;
}

/**
 * Create a grid inventory of given size.
 *
 * @param {InvId} invId
 * @param {number} width
 * @param {number} height
 * @returns {Inv}
 */
export function createInvGrid(invId, width, height) {
  return createInv(invId, 'grid', width * height, width, height);
}

/**
 * Create a socket inventory.
 *
 * @param {InvId} invId
 * @returns {Inv}
 */
export function createInvSocket(invId) {
  // TODO: width, height = Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY
  return createInv(invId, 'socket', 1, 1, 1);
}

/**
 * Copies the target inventory to destination as a new inventory. Unlike cloneInv(),
 * the resultant inventory can be added to the store with its copy.
 * 
 * @param {Inv} other
 * @param {Inv} [dst]
 * @returns {Inv}
 */
export function copyInv(other, dst = undefined) {
  let result = cloneInv(other, dst, { preserveItemId: false });
  if (result.invId === other.invId) {
    result.invId = uuid();
  }
  return result;
}

/**
 * Clones the target inventory to destination as a stored inventory. This is usually used
 * to store an exact replica of an inventory state, including ids. Unlike copyInv(),
 * the resultant inventory CANNOT be added to the store with its clone. It must replace
 * its clone.
 * 
 * @param {Inv} other
 * @param {Inv} [dst]
 * @param {object} [opts]
 * @param {boolean} [opts.preserveItemId]
 * @returns {Inv}
 */
export function cloneInv(other, dst = undefined, opts = {}) {
  const { preserveItemId = true } = opts;
  const invId = other.invId || uuid();
  const type = other.type || 'grid';
  const width = Number(other.width) || 1;
  const height = Number(other.height) || 1;
  const length = Number(other.length) || 1;
  if (!dst) {
    dst = createInv(invId, type, length, width, height);
  } else {
    dst.invId = invId;
    dst.type = type;
    dst.width = width;
    dst.height = height;
    dst.length = length;
  }
  let overrideItemIds = {};
  if (typeof other.items === 'object') {
    if (preserveItemId) {
      for(let item of Object.values(other.items)) {
        let newItem = cloneItem(item);
        dst.items[newItem.itemId] = newItem;
      }
    } else {
      for(let item of Object.values(other.items)) {
        let newItem = copyItem(item);
        overrideItemIds[item.itemId] = newItem.itemId;
        dst.items[newItem.itemId] = newItem;
      }
    }
  }
  if (Array.isArray(other.slots)) {
    if (preserveItemId) {
      const length = Math.min(other.slots.length, dst.slots.length);
      for (let i = 0; i < length; ++i) {
        dst.slots[i] = other.slots[i];
      }
    } else {
      const length = Math.min(other.slots.length, dst.slots.length);
      for (let i = 0; i < length; ++i) {
        let otherItemId = other.slots[i];
        let newItemId = overrideItemIds[otherItemId];
        dst.slots[i] = newItemId || null;
      }
    }
  }
  if (typeof other.displayName === 'string') {
    dst.displayName = other.displayName;
  }
  if (typeof other.metadata === 'object') {
    try {
      dst.metadata = JSON.parse(JSON.stringify(other.metadata));
    } catch (e) {
      dst.metadata = {};
    }
  }
  return dst;
}
