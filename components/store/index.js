import { uuid } from '../../lib/util/uuid';
import { createView } from '../inv/View';
import { createInv } from '../inv/Inv';
import { InvStore } from './InvStore';
import { ViewStore } from './ViewStore';
import { CursorStore } from './CursorStore';

/**
 * @typedef {import('./StoreContext').Store} Store
 */

export { StoreContext, StoreProvider, useStore } from './StoreContext';
export {
    InvStore,
    ViewStore,
    CursorStore,
};

export function createGridInvViewInStore(store, viewId = uuid(), invId = uuid(), width = 1, height = 1, coordX = 0, coordY = 0, topics = []) {
    createInvInStore(store, invId, 'grid', width * height, width, height);
    createViewInStore(store, viewId, invId, coordX, coordY, topics, 'all', 'grid', width, height);
    return viewId;
}

export function createGroundInvViewInStore(store, viewId = uuid(), invId = uuid(), width = 1, height = 1, coordX = 0, coordY = 0, topics = []) {
    createInvInStore(store, invId, 'grid', width * height, width, height);
    createViewInStore(store, viewId, invId, coordX, coordY, topics, 'all', 'ground', width, height);
    return viewId;
}

export function createSocketInvViewInStore(store, viewId = uuid(), invId = uuid(), coordX = 0, coordY = 0, topics = []) {
    createInvInStore(store, invId, 'socket', 1, 1, 1);
    createViewInStore(store, viewId, invId, coordX, coordY, topics, 'all', 'socket', 1, 1);
    return viewId;
}

export function createCursorInvViewInStore(store, viewId, invId) {
    createInvInStore(store, invId, 'socket', 1, 1, 1);
    createViewInStore(store, viewId, invId, 0, 0, ['cursor'], 'all', 'cursor', 1, 1);
    return viewId;
}

export function createViewInStore(store, viewId, invId, coordX, coordY, topics, usage, type, width, height) {
    let view = createView(viewId, invId, coordX, coordY, topics, usage, type, width, height);
    ViewStore.put(store, view.viewId, view);
    return view.viewId;
}

export function createInvInStore(store, invId, invType, slotCount, width, height) {
    let inv = createInv(invId, invType, slotCount, width, height);
    InvStore.put(store, inv.invId, inv);
    return inv.invId;
}
