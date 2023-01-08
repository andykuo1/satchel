import { uuid } from '../../lib/util/uuid';
import { createView } from '../inv/View';
import { createInv } from '../inv/Inv';
import { ViewStoreable } from './ViewStoreable';
import { ViewIdsStoreable } from './ViewIdsStoreable';
import { InvIdsStoreable } from './InvIdsStoreable';
import { InvStoreable } from './InvStoreable';

/**
 * @typedef {import('./StoreContext').Store} Store
 */

export { StoreContext, StoreProvider, useStore } from './StoreContext';

export const InvStore = new InvStoreable();
export const InvIdsStore = new InvIdsStoreable();
export const ViewStore = new ViewStoreable();
export const ViewIdsStore = new ViewIdsStoreable();

export function createGridInvInStore(store, invId = uuid(), width = 1, height = 1) {
    return createInvInStore(store, invId, 'grid', width * height, width, height);
}

export function createSocketInvInStore(store, invId = uuid()) {
    return createInvInStore(store, invId, 'socket', 1, 1, 1);
}

export function createViewInStore(store, viewId = uuid(), invId = '', coordX = 0, coordY = 0, topics = []) {
    let view = createView(viewId, invId, coordX, coordY, topics);
    store.values.views[view.viewId] = view;

    ViewStore.dispatch(store, viewId);
    ViewIdsStore.dispatch(store);

    return view.viewId;
}

export function destroyViewInStore(store, viewId) {
    delete store.values.views[viewId];

    ViewIdsStore.dispatch(store);
    ViewStore.dispatch(store, viewId);
}

/**
 * @param {Store} store 
 * @param {InvId} invId
 * @returns {InvId}
 */
export function createInvInStore(store, invId, invType, slotCount, width, height) {
    let inv = createInv(invId, invType, slotCount, width, height);
    store.values.invs[inv.invId] = inv;

    InvStore.dispatch(store, invId);
    InvIdsStore.dispatch(store);

    return inv.invId;
}

/**
 * @param {Store} store 
 * @param {InvId} invId 
 */
export function destroyInvInStore(store, invId) {
    delete store.values.invs[invId];

    InvIdsStore.dispatch(store);
    InvStore.dispatch(store, invId);
}
