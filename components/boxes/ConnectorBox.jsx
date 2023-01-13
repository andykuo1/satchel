import ContainerBox from '../box/ContainerBox';
import { createInv } from '../inv/Inv';
import { createView } from '../inv/View';
import { createItem } from '../inv/Item';
import { InvStore, ViewStore } from '../store';
import { putItem } from '../inv/InvItems';
import { handleMouseDownCallback } from '../cursor/CursorCallback';
import { uuid } from '../../lib/util/uuid';

export default function ConnectorBox({ store, view }) {
    function onHandleMouseDown(e) {
        return handleMouseDownCallback(e, store, view);
    }
    return (
        <ContainerBox x={view.coordX} y={view.coordY} w={view.width} h={view.height}
            handleProps={{ onMouseDown: onHandleMouseDown }}>
        </ContainerBox>
    );
}

export function createConnectorBoxInStore(store, coordX, coordY) {
    let invId = uuid();
    let inViewId = uuid();
    let outViewId = uuid();
    let itemId = uuid();
    let inv = createInv(invId, 'single', 1, 1, 1);
    let inView = createView(inViewId, inv.invId, coordX, coordY, ['workspace'], 'all', 'connectorIn', 1, 1);
    let outView = createView(outViewId, inv.invId, coordX + 1, coordY, ['workspace'], 'all', 'connectorOut', 1, 1);
    let item = createItem(itemId);
    item.metadata.inViewId = inView.viewId;
    item.metadata.outViewId = outView.viewId;
    putItem(inv, item, 0, 0);
    InvStore.put(store, inv.invId, inv);
    ViewStore.put(store, inView.viewId, inView);
    ViewStore.put(store, outView.viewId, outView);
    return inView.viewId;
}
