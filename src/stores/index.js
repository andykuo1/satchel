import { Map } from 'yjs';

import { uuid } from '../utils/uuid';
import { CursorStore } from './CursorStore';
import { InvStore } from './InvStore';
import { ViewStore } from './ViewStore';
import { YDocStore } from './YDocStore';
import { createYInv } from '../inv/yinv/YInv';
import { createYView } from '../inv/yinv/YView';

/**
 * @typedef {import('./StoreContext').Store} Store
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').InvType} InvType
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').ViewUsage} ViewUsage
 * @typedef {import('../inv/View').ViewType} ViewType
 */

export { StoreContext, StoreProvider, useStore } from './StoreContext';
export { InvStore, ViewStore, CursorStore };

export function createViewInStore(
  store,
  viewId,
  invId,
  coordX,
  coordY,
  topics,
  usage,
  type,
  width,
  height,
) {
  let ymap = new Map();
  YDocStore.get(store).getMap('views').set(viewId, ymap);
  let view = createYView(ymap, viewId, invId, type, usage, topics);
  view.coordX = coordX;
  view.coordY = coordY;
  view.width = width;
  view.height = height;
  ViewStore.put(store, view.viewId, view);
  return view.viewId;
}

/**
 * @param {Store} store
 * @param {InvId} invId
 * @param {InvType} invType
 * @param {number} slotCount
 * @param {number} width
 * @param {number} height
 */
export function createInvInStore(
  store,
  invId,
  invType,
  slotCount,
  width,
  height,
) {
  let ymap = new Map();
  YDocStore.get(store).getMap('invs').set(invId, ymap);
  let inv = createYInv(ymap, invId, invType, slotCount, width, height);
  InvStore.put(store, inv.invId, inv);
  return inv.invId;
}

/**
 * @param {Store} store
 * @param {number} coordX
 * @param {number} coordY
 * @param {number} viewWidth
 * @param {number} viewHeight
 * @param {ViewType} viewType
 * @param {InvType} invType
 * @param {number} slotCount
 * @param {number} invWidth
 * @param {number} invHeight
 * @param {ViewUsage} usage
 * @param {Array<string>} topics
 * @returns {ViewId}
 */
export function createInvViewInStore(
  store,
  coordX,
  coordY,
  viewWidth,
  viewHeight,
  viewType,
  invType,
  slotCount,
  invWidth,
  invHeight,
  usage,
  topics,
) {
  let viewId = uuid();
  let invId = uuid();
  createViewInStore(
    store,
    viewId,
    invId,
    coordX,
    coordY,
    topics,
    usage,
    viewType,
    viewWidth,
    viewHeight,
  );
  createInvInStore(store, invId, invType, slotCount, invWidth, invHeight);
  return viewId;
}
