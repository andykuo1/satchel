import { createInvInStore, createViewInStore } from '../store';
import { uuid } from '../../lib/util/uuid';
import ContainerBox from '../container/ContainerBox';
import GridSlots from '../container/slots/GridSlots';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').ViewUsage} ViewUsage
 */

export default function InvBox({ store, view }) {
    return (
        <ContainerBox store={store} view={view}>
            <GridSlots store={store} view={view}/>
        </ContainerBox>
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
