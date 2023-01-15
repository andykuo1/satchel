import { useEffect } from 'react';
import { uuid } from '../lib/util/uuid';
import Cursor from './Cursor';
import { createItem } from './inv/Item';
import { StoreProvider, useStore } from './store';
import { addItemToInv, getInv, getView } from './store/InvTransfer';
import Workspace from './Workspace';
import { useViewOrganizer } from './ViewOrganizer';
import { getCursor, hasHeldItem, setHeldItem } from './cursor/CursorTransfer';
import { createInvBoxInStore } from './containers/InvBox';
import { useYDoc } from './network/YDoc';
import { createConnectorBoxInStore } from './containers/ConnectorBox';
import { createFoundryBoxInStore } from './containers/FoundryBox';
import { createListBoxInStore } from './containers/ListBox';
import { createSocketBoxInStore } from './containers/SocketBox';
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

  useEffect(() => {
    let viewId;
    {
      let w = 6;
      let h = 4;
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      viewId = createInvBoxInStore(store, w, h, x, y);
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
    {
      if (!hasHeldItem(store)) {
        let cursor = getCursor(store);
        let item = createItem(uuid());
        item.width = 2;
        item.height = 2;
        item.imgSrc = '/images/potion.png';
        setHeldItem(cursor, store, item, 0, 0);
      }
    }
    {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      createSocketBoxInStore(store, x, y);
    }
    {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      createListBoxInStore(store, Math.floor(Math.random() * 3) + 2, 3, x, y);
    }
    {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      createFoundryBoxInStore(store, x, y);
    }
    {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      createConnectorBoxInStore(store, x, y);
    }
  }, []);
  useViewOrganizer();

  return (
    <>
    <Workspace />
    <Cursor />
    </>
  );
}

