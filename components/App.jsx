import { useEffect } from 'react';

import { uuid } from '../lib/util/uuid';
import { StoreProvider, ViewStore, useStore } from '../stores';
import { createItem } from '../stores/inv/Item';
import {
  getCursor,
  hasHeldItem,
  setHeldItem,
} from '../stores/transfer/CursorTransfer';
import { addItemToInv, getView } from '../stores/transfer/InvTransfer';
import Settings from './Settings';
import { useViewOrganizer } from './ViewOrganizer';
import { createAlbumBoxInStore } from './containers/AlbumBox';
import { createConnectorBoxInStore } from './containers/ConnectorBox';
import { createCraftingBoxInStore } from './containers/CraftingBox';
import { createFoundryBoxInStore } from './containers/FoundryBox';
import { createInvBoxInStore } from './containers/InvBox';
import { createListBoxInStore } from './containers/ListBox';
import { createSocketBoxInStore } from './containers/SocketBox';
import Cursor from './cursor/Cursor';
import { useYDoc } from './network/YDoc';
import Workspace from './playground/Workspace';

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
    {
      let viewId = createSocketBoxInStore(store, rand(), rand());
      let view = getView(store, viewId);
      let invId = view.invId;
      let item = createItem(uuid());
      item.imgSrc = '/images/potion.png';
      item.width = 2;
      item.height = 2;
      item.background = '#00FF00';
      item.displayName = 'Bag';
      item.metadata = {
        packed: {
          type: 'grid',
          width: 4,
          height: 3,
        },
      };
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
    createAlbumBoxInStore(store, rand(), rand());
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
