import { useEffect } from 'react';
import { uuid } from '../lib/util/uuid';
import Cursor from './Cursor';
import { createItem } from './inv/Item';
import { createViewInStore, createGridInvInStore, useStore } from './store';
import { addItemToInv, getInv } from './store/InvTransfer';
import Workspace from './Workspace';

export default function App() {
    const store = useStore();
    useEffect(() => {
      let w = 6;
      let h = 4;
      let invId = createGridInvInStore(store, undefined, w, h);
      let viewId = createViewInStore(store, undefined, invId,
        Math.floor(Math.random() * w),
        Math.floor(Math.random() * h),
        ['workspace']);
      let item = createItem(uuid());
      item.imgSrc = '/images/potion.png';
      let inv = getInv(store, invId);
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