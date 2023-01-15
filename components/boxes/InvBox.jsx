import { createInvInStore, createViewInStore } from '../store';
import { uuid } from '../../lib/util/uuid';
import BaseBox from './BaseBox';
import { GridSlots } from './BaseSlots';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').ViewUsage} ViewUsage
 */

export default function InvBox({ store, view }) {
    return (
        <BaseBox store={store} view={view}>
            <GridSlots store={store} view={view}/>
        </BaseBox>
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
export function createInvBoxInStore(store, width, height, coordX, coordY, usage = 'all') {
    let invId = uuid();
    let viewId = uuid();
    createInvInStore(store, invId, 'connected', width * height, width, height);
    createViewInStore(store, viewId, invId, coordX, coordY, ['workspace'], usage, 'grid', width, height);
    return viewId;
}
