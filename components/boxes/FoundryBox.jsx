import { uuid } from '../../lib/util/uuid';
import ContainerBox from '../box/ContainerBox';
import { createInv } from '../inv/Inv';
import { createView } from '../inv/View';
import { InvStore, ViewStore } from '../store'

export default function FoundryBox({ store, view }) {
    return (
        <ContainerBox x={view.coordX} y={view.coordY} w={view.width} h={view.height}>
            <button>RESET</button>
        </ContainerBox>
    );
}

export function createFoundryBoxInStore(store, coordX, coordY) {
    let invId = uuid();
    let viewId = uuid();
    let inv = createInv(invId, 'single', 1, 1, 1);
    let view = createView(viewId, inv.invId, coordX, coordY, ['workspace'], 'all', 'foundry', 4, 5);
    InvStore.put(store, inv.invId, inv);
    ViewStore.put(store, view.viewId, view);
    return viewId;
}
