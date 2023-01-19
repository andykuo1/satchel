import { Map as YMap } from 'yjs';

import { uuid } from '../../utils/uuid';
import { createProxyYMap } from './YProxy';

/**
 * @typedef {ReturnType<createYItem>} YItem
 */

/**
 * @param {import('yjs').Doc} yDoc
 * @param {import('../Item').ItemId} itemId
 */
export function createYItem(yDoc, itemId) {
  let src = yDoc.getMap();
  src.set('itemId', itemId);
  src.set('width', 1);
  src.set('height', 1);
  src.set('stackSize', -1);
  src.set('imgSrc', '');
  src.set('displayName', '');
  src.set('background', '');
  let metadata = new YMap();
  src.set('metadata', metadata);
  // NOTE: Order matters! New properties should always be added at the end.
  let item = {
    get itemId() {
      return src.get('itemId');
    },
    get width() {
      return src.get('width');
    },
    set width(value) {
      src.set('width', value);
    },
    get height() {
      return src.get('height');
    },
    set height(value) {
      src.set('height', value);
    },
    get stackSize() {
      return src.get('stackSize');
    },
    set stackSize(value) {
      src.set('stackSize', value);
    },
    get imgSrc() {
      return src.get('imgSrc');
    },
    set imgSrc(value) {
      src.set('imgSrc', value);
    },
    get displayName() {
      return src.get('displayName');
    },
    set displayName(value) {
      src.set('displayName', value);
    },
    get description() {
      return src.get('description');
    },
    set description(value) {
      src.set('description', value);
    },
    get background() {
      return src.get('background');
    },
    set background(value) {
      src.set('background', value);
    },
    metadata: createProxyYMap(metadata),
    __doc: yDoc,
  };
  return item;
}

/**
 * @param {YItem} other
 * @param {YItem} [dst]
 */
export function copyYItem(other, dst = undefined) {
  if (!dst) {
    dst = createYItem(other.__doc, uuid());
  }
  dst.width = other.width;
  dst.height = other.height;
  dst.stackSize = other.stackSize;
  dst.imgSrc = other.imgSrc;
  dst.displayName = other.displayName;
  dst.background = other.background;

  for (let key of Object.keys(other.metadata)) {
    dst.metadata[key] = other.metadata[key];
  }
  return dst;
}
