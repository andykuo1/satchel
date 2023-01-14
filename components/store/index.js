import { InvStore } from './InvStore';
import { ViewStore } from './ViewStore';
import { CursorStore } from './CursorStore';
import { Map } from 'yjs';
import { createYInv } from '../inv/yinv/YInv';
import { createYView } from '../inv/yinv/YView';
import { YDocStore } from './YDocStore';

/**
 * @typedef {import('./StoreContext').Store} Store
 * @typedef {import('../inv/Inv').InvId} InvId
 * @typedef {import('../inv/Inv').InvType} InvType
 */

export { StoreContext, StoreProvider, useStore } from './StoreContext';
export {
    InvStore,
    ViewStore,
    CursorStore,
};

export function createViewInStore(store, viewId, invId, coordX, coordY, topics, usage, type, width, height) {
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
export function createInvInStore(store, invId, invType, slotCount, width, height) {
    let ymap = new Map();
    YDocStore.get(store).getMap('invs').set(invId, ymap);
    let inv = createYInv(ymap, invId, invType, slotCount, width, height);
    InvStore.put(store, inv.invId, inv);
    return inv.invId;
}
