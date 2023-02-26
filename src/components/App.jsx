import { useEffect } from 'react';

import { uuid } from '../utils/uuid';
import { StoreProvider, ViewStore, useStore } from '../stores';
import { createItem } from '../inv/Item';
import {
  getCursor,
  hasHeldItem,
  setHeldItem,
} from '../inv/transfer/CursorTransfer';
import { addItemToInv, getView, getInv } from '../inv/transfer/InvTransfer';
import Settings from './Settings';
import { useViewOrganizer } from './ViewOrganizer';
import { createAlbumBoxInStore } from './containers/AlbumBox';
import { createConnectorBoxInStore } from './containers/ConnectorBox';
import { createCraftingBoxInStore } from './containers/CraftingBox';
import { createFoundryBoxInStore } from './containers/FoundryBox';
import { createInvBoxInStore } from './containers/InvBox';
import { createListBoxInStore } from './containers/ListBox';
import { createSocketBoxInStore } from './containers/SocketBox';
import { createDispenserBoxInStore } from './containers/DispenserBox';
import Cursor from './cursor/Cursor';
import { useYDoc } from './network/YDoc';
import Workspace from './playground/Workspace';
import { getSlotCoordsByIndex } from '@/inv/Slots';

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
    /**/
    withItems(store, createDispenserBoxInStore(store, rand(), rand()), [
      randItem(),
      randItem(),
      randItem(),
      randItem(),
    ]);
    /**/
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

function choose(list) {
  return list[rand(list.length)];
}

function randItem() {
  let item = createItem(uuid());
  item.imgSrc = '/images/potion.png';
  item.width = rand(4, 1);
  item.height = rand(4, 1);
  item.background = choose(['#00FF00', '#FF0000', '#FF00FF', '#00FFFF']);
  item.displayName = 'Item';
  item.metadata = {};
  if (rand(3) === 0) {
    item.metadata.packed = {
      type: 'grid',
      width: 4,
      height: 3,
    };
  }
  return item;
}

function withItems(store, viewId, items) {
  let invId = getView(store, viewId).invId;
  let inv = getInv(store, invId);
  for(let i = 0; i < items.length;  ++i) {
    let item = items[i];
    if (!item) {
      continue;
    }
    let [x, y] = getSlotCoordsByIndex(inv, i);
    addItemToInv(store, invId, item, x, y);
  }
  return viewId;
}
