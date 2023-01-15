import { useEffect } from 'react';
import { uuid } from '../lib/util/uuid';
import Cursor from './cursor/Cursor';
import { createItem } from '../stores/inv/Item';
import { StoreProvider, useStore, ViewStore } from '../stores';
import { addItemToInv, getView } from '../stores/transfer/InvTransfer';
import Workspace from './playground/Workspace';
import { useViewOrganizer } from './ViewOrganizer';
import { getCursor, hasHeldItem, setHeldItem } from '../stores/transfer/CursorTransfer';
import { createInvBoxInStore } from './containers/InvBox';
import { useYDoc } from './network/YDoc';
import { createConnectorBoxInStore } from './containers/ConnectorBox';
import { createFoundryBoxInStore } from './containers/FoundryBox';
import { createListBoxInStore } from './containers/ListBox';
import { createSocketBoxInStore } from './containers/SocketBox';
import { createCraftingBoxInStore } from './containers/CraftingBox';
import Settings from './Settings';

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
  useViewOrganizer();

  useEffect(() => {
    if (ViewStore.count(store) > 1) {
      return;
    }
    {
      let w = 6;
      let h = 4;
      createInvBoxInStore(store, w, h, rand(), rand());
    }
    {
      let viewId = createSocketBoxInStore(store, rand(), rand());
      let view = getView(store, viewId);
      let invId = view.invId;
      let item = createItem(uuid());
      item.imgSrc = '/images/potion.png';
      item.background = '#FF0000';
      item.displayName = 'Potion';
      item.stackSize = 99;
      addItemToInv(store, invId, item, 0, 0);
    }
    if (!hasHeldItem(store)) {
      let cursor = getCursor(store);
      let item = createItem(uuid());
      item.width = 2;
      item.height = 2;
      item.imgSrc = '/images/potion.png';
      setHeldItem(cursor, store, item, 0, 0);
    }
    createListBoxInStore(store, rand(5, 3), 3, rand(), rand());
    createFoundryBoxInStore(store, rand(), rand());
    createConnectorBoxInStore(store, rand(), rand());
    // createCraftingBoxInStore(store, rand(), rand());
  }, []);

  return (
    <>
    <Workspace />
    <Cursor />
    </>
  );
}

const MAX_RANGE = 10;
function rand(max = MAX_RANGE, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min;
}
