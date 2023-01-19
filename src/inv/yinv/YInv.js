import { Array as YArray, Map as YMap } from 'yjs';

import { uuid } from '../../utils/uuid';
import { copyYItem } from './YItem';
import { createProxyYArray, createProxyYMap } from './YProxy';

/** @typedef {ReturnType<createYInv>} YInv */

/**
 * @param {import('yjs').Map} src
 * @param {import('../Inv').InvId} invId
 * @param {import('../Inv').InvType} invType
 * @param {number} slotCount
 * @param {number} maxCoordX
 * @param {number} maxCoordY
 */
export function createYInv(
  src,
  invId,
  invType,
  slotCount,
  maxCoordX,
  maxCoordY,
) {
  src.set('invId', invId);
  src.set('type', invType);
  src.set('width', maxCoordX);
  src.set('height', maxCoordY);
  src.set('length', slotCount);
  src.set('displayName', '');
  let items = new YMap();
  src.set('items', items);
  let slots = new YArray();
  slots.push(new Array(slotCount).fill(null));
  src.set('slots', slots);
  let metadata = new YMap();
  src.set('metadata', metadata);
  return toYInv(src);
}

/**
 * @param {YMap} src
 */
export function toYInv(src) {
  let inv = {
    get invId() {
      return src.get('invId');
    },
    get type() {
      return src.get('type');
    },
    get width() {
      return src.get('width');
    },
    get height() {
      return src.get('height');
    },
    get length() {
      return src.get('length');
    },
    get displayName() {
      return src.get('displayName');
    },
    set displayName(value) {
      src.set('displayName', value);
    },
    _items: null,
    get items() {
      let result = this._items;
      if (!result) {
        result = createProxyYMap(src.get('items'));
        this._items = result;
      }
      return result;
    },
    _slots: null,
    get slots() {
      let result = this._slots;
      if (!result) {
        result = createProxyYArray(src.get('slots'));
        this._slots = result;
      }
      return result;
    },
    _metadata: null,
    get metadata() {
      let result = this._metadata;
      if (!result) {
        result = createProxyYMap(src.get('metadata'));
        this._metadata = result;
      }
      return result;
    },
    __src: src,
  };
  return inv;
}

/**
 * @param {YInv} other
 * @param {YInv} [dst]
 */
export function copyYInv(other, dst = undefined) {
  if (!dst) {
    dst = createYInv(
      other.__src,
      uuid(),
      other.type,
      other.length,
      other.width,
      other.height,
    );
  }
  dst.displayName = other.displayName;

  let newItemIdMapping = {};
  for (let item of Object.values(other.items)) {
    let newItem = copyYItem(item);
    newItemIdMapping[item.itemId] = newItem.itemId;
    dst.items[newItem.itemId] = newItem;
  }
  for (let i = 0; i < dst.length; ++i) {
    let otherItemId = other.slots[i];
    let newItemId = newItemIdMapping[otherItemId];
    dst.slots[i] = newItemId || null;
  }
  for (let key of Object.keys(other.metadata)) {
    dst.metadata[key] = other.metadata[key];
  }
  return dst;
}
