import { ViewStore, InvStore, useStore } from './store';
import { getItemAtSlotIndex } from './store/InvTransfer';
import { getSlotCoordsByIndex } from './inv/InvSlots';
import OutlinedBox from './box/OutlinedBox';
import ItemStack from './ItemStack';
import { containerMouseUpCallback } from './cursor/CursorCallback';
import { useRef } from 'react';

export default function GridView({ viewId }) {
  const store = useStore();
  const containerRef = useRef(null);
  const view = ViewStore.useValue(store, viewId);
  const inv = InvStore.useValue(store, view ? view.invId : '');
  if (!view || !inv) {
    return null;
  }
  const invId = inv.invId;
  let itemElements = [];
  let itemKeys = [];
  for (let i = 0; i < inv.length; ++i) {
    let item = getItemAtSlotIndex(store, invId, i);
    if (item) {
      if (itemKeys.includes(item.itemId)) {
        continue;
      }
      let [x, y] = getSlotCoordsByIndex(inv, i);
      itemKeys.push(item.itemId);
      itemElements.push(<ItemStack key={`${i}:${item.itemId}`}
        x={x} y={y} slotIndex={i} item={item}
        store={store} view={view} containerRef={containerRef} />);
    }
  }

  function onMouseUp(e) {
    containerMouseUpCallback(e, store, view, containerRef.current);
  }

  return (
    <OutlinedBox x={view.coordX} y={view.coordY}
        w={inv.width} h={inv.height}
        title={inv.displayName + inv.invId}
        containerProps={{ ref: containerRef, onMouseUp }}>
      {itemElements}
    </OutlinedBox>
  );
}
