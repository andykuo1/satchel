import { ViewStore, InvStore } from '../store';
import { createInv } from '../inv/Inv';
import { createView } from '../inv/View';
import { uuid } from '../../lib/util/uuid';
import { isInvEmpty } from '../store/InvTransfer';
import { useEffect } from 'react';
import InvBox from './InvBox';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').ViewUsage} ViewUsage
 */

export default function GroundBox({ store, view }) {
    const inv = InvStore.useValue(store, view.invId);
    useEffect(() => {
        if (isInvEmpty(store, inv.invId)) {
            ViewStore.delete(store, view.viewId);
            InvStore.delete(store, inv.invId);
        }
    });
    return (
        <InvBox store={store} view={view} />
    );
}

/**
 * @param {Store} store 
 * @param {number} width 
 * @param {number} height 
 * @param {number} coordX
 * @param {number} coordY
 * @param {ViewUsage} [usage]
 * @returns {ViewId}
 */
export function createGroundBoxInStore(store, width, height, coordX, coordY, usage = 'all') {
    let invId = uuid();
    let viewId = uuid();
    let inv = createInv(invId, 'connected', width * height, width, height);
    let view = createView(viewId, invId, coordX, coordY, ['workspace'], usage, 'ground', inv.width, inv.height);
    InvStore.put(store, inv.invId, inv);
    ViewStore.put(store, view.viewId, view);
    return view.viewId;
}
