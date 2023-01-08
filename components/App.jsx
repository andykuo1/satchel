import { useEffect } from 'react';
import { uuid } from '../lib/util/uuid';
import Cursor from './Cursor';
import { createItem } from './inv/Item';
import { useStore, createGridInvViewInStore } from './store';
import { addItemToInv, getInv, getView } from './store/InvTransfer';
import Workspace from './Workspace';

export default function App() {
    const store = useStore();
    useEffect(() => {
      let w = 6;
      let h = 4;
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let viewId = createGridInvViewInStore(store, undefined, undefined, w, h, x, y, ['workspace']);
      let view = getView(store, viewId);
      let invId = view.invId;
      let inv = getInv(store, invId);
      let item = createItem(uuid());
      item.imgSrc = '/images/potion.png';
      item.background = '#FF0000';
      item.displayName = 'Potion';
      item.stackSize = 10;
      let coordX = Math.floor(Math.random() * inv.width - 1);
      let coordY = Math.floor(Math.random() * inv.height - 1);
      addItemToInv(store, invId, item, coordX, coordY);
    }, []);
    return (
        <>
        <Workspace />
        <Cursor />
        </>
    );
}