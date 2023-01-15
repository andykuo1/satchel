import { createInvViewInStore } from '../../stores';
import ContainerBox from '../container/ContainerBox';
import GridSlots from '../slots/GridSlots';
import { registerView } from '../ViewRegistry';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../stores/inv/View').ViewId} ViewId
 * @typedef {import('../../stores/inv/View').ViewUsage} ViewUsage
 */

registerView('grid', InvBox);

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
 * @returns {ViewId}
 */
export function createInvBoxInStore(store, width, height, coordX, coordY) {
    return createInvViewInStore(
        store, coordX, coordY, width, height,
        'grid', 'connected',
        width * height, width, height,
        'all', ['workspace']);
}
