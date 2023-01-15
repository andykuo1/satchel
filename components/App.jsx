import { useEffect } from 'react';
import { uuid } from '../lib/util/uuid';
import Cursor from './cursor/Cursor';
import { createItem } from '../stores/inv/Item';
import { StoreProvider, useStore, ViewStore } from '../stores';
import { addItemToInv, getInv, getView } from '../stores/transfer/InvTransfer';
import Workspace from './playground/Workspace';
import { useViewOrganizer } from './ViewOrganizer';
import { getCursor, hasHeldItem, setHeldItem } from '../stores/transfer/CursorTransfer';
import { createInvBoxInStore } from './containers/InvBox';
import { useYDoc } from './network/YDoc';
import { createConnectorBoxInStore } from './containers/ConnectorBox';
import { createFoundryBoxInStore } from './containers/FoundryBox';
import { createListBoxInStore } from './containers/ListBox';
import { createSocketBoxInStore } from './containers/SocketBox';
import Settings from './Settings';
import { createCraftingBoxInStore } from './containers/CraftingBox';

export default function App() {
  return (
    <StoreProvider>
      <Content />
      <Settings />
    </StoreProvider>
  );
}

function Content() {
  const store = useStore();

  useYDoc();

  useEffect(() => {
    if (ViewStore.count(store) > 1) {
      return;
    }
    let viewId;
    {
      let w = 6;
      let h = 4;
      viewId = createInvBoxInStore(store, w, h, rand(), rand());
    }
    {
      let view = getView(store, viewId);
      let invId = view.invId;
      let inv = getInv(store, invId);
      inv.displayName = 'Funny';
      let item = createItem(uuid());
      item.imgSrc = '/images/potion.png';
      item.background = '#FF0000';
      item.displayName = 'Potion';
      item.stackSize = 10;
      let coordX = Math.floor(Math.random() * inv.width - 1);
      let coordY = Math.floor(Math.random() * inv.height - 1);
      addItemToInv(store, invId, item, coordX, coordY);
    }
    if (!hasHeldItem(store)) {
      let cursor = getCursor(store);
      let item = createItem(uuid());
      item.width = 2;
      item.height = 2;
      item.imgSrc = '/images/potion.png';
      setHeldItem(cursor, store, item, 0, 0);
    }
    createSocketBoxInStore(store, rand(), rand());
    createListBoxInStore(store, rand(5, 3), 3, rand(), rand());
    createFoundryBoxInStore(store, rand(), rand());
    createConnectorBoxInStore(store, rand(), rand());
    createCraftingBoxInStore(store, rand(), rand());
  }, []);
  useViewOrganizer();

  return (
    <>
    <Workspace />
    <Cursor />
    </>
  );
}

const MAX_RANGE = 20;
function rand(max = MAX_RANGE, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min;
}
