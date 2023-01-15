import { InvStore, createInvInStore, createViewInStore } from '../store';
import { uuid } from '../../lib/util/uuid';
import { containerMouseUpCallback, handleMouseDownCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import { renderItems } from '../renderer/ItemsRenderer';
import { computeSlottedArea, getSlotCoordsByIndex } from '../inv/Slots';
import ContainerBox from '../box/ContainerBox';
import ContainerGrid from '../box/ContainerGrid';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').ViewUsage} ViewUsage
 */

export default function InvBox({ store, view }) {
    const inv = InvStore.useValue(store, view.invId);

    function onContainerMouseUp(e) {
        return containerMouseUpCallback(e, store, view);
    }

    function onItemMouseDown(e) {
        return itemMouseDownCallback(e, store, view);
    }

    function onHandleMouseDown(e) {
        return handleMouseDownCallback(e, store, view);
    }

    let elements = renderItems(store, view, inv, (store, view, inv, item, i) => {
        let [x, y] = getSlotCoordsByIndex(inv, i);
        let [w, h] = computeSlottedArea(inv, x, y, x + item.width, y + item.height, item.itemId);
        return { x, y, w, h, onMouseDown: onItemMouseDown };
    });

    return (
        <ContainerBox
            x={view.coordX} y={view.coordY}
            w={inv.width} h={inv.height}
            title={inv.displayName}
            handleProps={{ onMouseDown: onHandleMouseDown }}>
            <ContainerGrid containerProps={{ 'data-view-id': view.viewId, onMouseUp: onContainerMouseUp }}>
                {elements}
            </ContainerGrid>
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