import { ViewStore, InvStore } from '../store';
import { createInv } from '../inv/Inv';
import { createView } from '../inv/View';
import { uuid } from '../../lib/util/uuid';
import { containerMouseUpCallback, handleMouseDownCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import { renderItems } from '../renderer/ItemsRenderer';
import { computeSlottedArea, getSlotCoordsByIndex } from '../inv/Slots';
import ContainerBox from '../box/ContainerBox';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').ViewUsage} ViewUsage
 */

export default function SocketBox({ store, view }) {
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

    let maxWidth = inv.width;
    let maxHeight = inv.height;
    let elements = renderItems(store, view, inv, (store, view, inv, item, i) => {
        let [x, y] = getSlotCoordsByIndex(inv, i);
        let [w, h] = computeSlottedArea(inv, x, y, x + item.width, y + item.height, item.itemId);
        maxWidth = Math.max(w, maxWidth);
        maxHeight = Math.max(h, maxHeight);
        return { x, y, w, h, onMouseDown: onItemMouseDown };
    });
    return (
        <ContainerBox x={view.coordX} y={view.coordY}
            w={maxWidth} h={maxHeight}
            containerProps={{
                'data-view-id': view.viewId,
                onMouseUp: onContainerMouseUp,
            }}
            handleProps={{
                onMouseDown: onHandleMouseDown,
            }}>
            {elements}
        </ContainerBox>
    );
}

/**
 * @param {Store} store 
 * @param {number} coordX
 * @param {number} coordY
 * @param {ViewUsage} [usage]
 * @returns {ViewId}
 */
export function createSocketBoxInStore(store, coordX, coordY, usage = 'all') {
    let invId = uuid();
    let viewId = uuid();
    let inv = createInv(invId, 'single', 1, 1, 1);
    let view = createView(viewId, invId, coordX, coordY, ['workspace'], usage, 'socket', 1, 1);
    InvStore.put(store, inv.invId, inv);
    ViewStore.put(store, view.viewId, view);
    return view.viewId;
}
