import { ViewStore, InvStore, createInvViewInStore } from '../../stores';
import { isInvEmpty } from '../../stores/transfer/InvTransfer';
import { useEffect } from 'react';
import InvBox from './InvBox';
import { registerView } from '../ViewRegistry';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../stores/inv/View').ViewId} ViewId
 * @typedef {import('../../stores/inv/View').ViewUsage} ViewUsage
 */

registerView('ground', GroundBox);

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
 * @returns {ViewId}
 */
export function createGroundBoxInStore(store, width, height, coordX, coordY) {
    return createInvViewInStore(
        store, coordX, coordY, width, height,
        'ground', 'connected',
        width * height, width, height,
        'all', ['workspace']);
}
