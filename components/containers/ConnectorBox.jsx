import { uuid } from '../../lib/util/uuid';
import { createInvInStore, createViewInStore } from '../../stores';
import { putItem } from '../../stores/inv/InvItems';
import { createItem } from '../../stores/inv/Item';
import { getInv } from '../../stores/transfer/InvTransfer';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';

registerView('connectorIn', ConnectorBox);
registerView('connectorOut', ConnectorBox);

export default function ConnectorBox({ store, view }) {
  return <ContainerBox store={store} view={view}></ContainerBox>;
}

export function createConnectorBoxInStore(store, coordX, coordY) {
  let invId = uuid();
  let inViewId = uuid();
  let outViewId = uuid();
  let itemId = uuid();
  createInvInStore(store, invId, 'single', 1, 1, 1);
  createViewInStore(
    store,
    inViewId,
    invId,
    coordX,
    coordY,
    ['workspace'],
    'all',
    'connectorIn',
    1,
    1,
  );
  createViewInStore(
    store,
    outViewId,
    invId,
    coordX + 1,
    coordY,
    ['workspace'],
    'all',
    'connectorOut',
    1,
    1,
  );
  let item = createItem(itemId);
  item.metadata.inViewId = inViewId;
  item.metadata.outViewId = outViewId;
  let inv = getInv(store, invId);
  putItem(inv, item, 0, 0);
  return inViewId;
}
