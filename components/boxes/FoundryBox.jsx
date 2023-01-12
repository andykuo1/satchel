import { uuid } from '../../lib/util/uuid';
import ContainerBox from '../box/ContainerBox';
import { createView } from '../inv/View';
import { createInvInStore } from '../store';
import { ViewStore } from '../store'

export default function FoundryBox({ store, viewId }) {
    const view = ViewStore.useValue(store, viewId);
    return (
        <ContainerBox x={view.coordX} y={view.coordY} w={view.width} h={view.height}>
        </ContainerBox>
    );
}

function createFoundryViewInStore(store, viewId, invId, coordX, coordY) {
    let view = createView(viewId, invId, coordX, coordY, ['workspace'], 'all', 'foundry', 4, 5);
    ViewStore.put(store, view.viewId, view);
    return viewId;
}

function createFoundryInStore(store, coordX, coordY) {
    let invId = uuid();
    let viewId = uuid();
    let inv = createInvInStore(store, invId, 'single', 1, 1, 1);
    return createFoundryViewInStore(store, viewId, inv.invId, coordX, coordY);
}
