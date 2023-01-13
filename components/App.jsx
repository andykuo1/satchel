import { useEffect } from 'react';
import { uuid } from '../lib/util/uuid';
import Cursor from './Cursor';
import { createItem } from './inv/Item';
import { useStore } from './store';
import { addItemToInv, getInv, getView } from './store/InvTransfer';
import Workspace from './Workspace';
import { useViewOrganizer } from './ViewOrganizer';
import { getCursor, hasHeldItem, setHeldItem } from './cursor/CursorTransfer';
import { createInvBoxInStore } from './boxes/InvBox';
import { createSocketBoxInStore } from './boxes/SocketBox';
import { createListBoxInStore } from './boxes/ListBox';
import { createFoundryBoxInStore } from './boxes/FoundryBox';

export default function App() {
    const store = useStore();
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
    }, []);
    useViewOrganizer();

    return (
        <>
        <Workspace />
        <Cursor />
        </>
    );
}