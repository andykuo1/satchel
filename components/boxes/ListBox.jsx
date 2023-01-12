import { ViewStore, InvStore } from '../store';
import { createInv } from '../inv/Inv';
import { createView } from '../inv/View';
import { uuid } from '../../lib/util/uuid';
import { containerMouseUpCallback, handleMouseDownCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import ListViewRenderer from '../renderer/views/ListViewRenderer';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').ViewUsage} ViewUsage
 */

export default function ListBox({ store, view }) {
    const inv = InvStore.useValue(store, view.invId);
    return (
        <ListViewRenderer store={store} view={view} inv={inv}
            containerProps={{
                'data-view-id': view.viewId,
                onMouseUp(e) {
                    return containerMouseUpCallback(e, store, view);
                }
            }}
            itemProps={{
                onMouseDown(e) {
                    return itemMouseDownCallback(e, store, view);
                }
            }}
            handleProps={{
                onMouseDown(e) {
                    return handleMouseDownCallback(e, store, view);
                }
            }}/>
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
export function createListBoxInStore(store, width, height, coordX, coordY, usage = 'all') {
    let invId = uuid();
    let viewId = uuid();
    let inv = createInv(invId, 'single', width * height, width, height);
    let view = createView(viewId, invId, coordX, coordY, ['workspace'], usage, 'list', inv.width, inv.height);
    InvStore.put(store, inv.invId, inv);
    ViewStore.put(store, view.viewId, view);
    return view.viewId;
}
