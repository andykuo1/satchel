import { getItemAtSlotIndex } from '../../inv/transfer/InvTransfer';
import ItemRenderer from './ItemRenderer';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/View').View} View
 * @typedef {import('../../inv/Inv').Inv} Inv
 * @typedef {import('../../inv/Item').Item} Item
 */

/**
 * @param {Store} store
 * @param {View} view
 * @param {Inv} inv
 * @param {(store: Store, view: View, inv: Inv, item: Item, i: number) => object} itemPropsCallback
 */
export function renderItems(store, view, inv, itemPropsCallback) {
  let elements = [];
  let keys = [];
  for (let i = 0; i < inv.length; ++i) {
    let item = getItemAtSlotIndex(store, inv.invId, i);
    if (item) {
      if (keys.includes(item.itemId)) {
        // Don't render more than once!
        continue;
      }
      keys.push(item.itemId);
      let result = renderItem(store, view, inv, i, itemPropsCallback);
      if (!result) {
        continue;
      }
      elements.push(result);
    }
  }
  return elements;
}

/**
 * @param {Store} store
 * @param {View} view
 * @param {Inv} inv
 * @param {number} slotIndex
 * @param {(store: Store, view: View, inv: Inv, item: Item, i: number) => object} itemPropsCallback
 */
export function renderItem(store, view, inv, slotIndex, itemPropsCallback) {
  let item = getItemAtSlotIndex(store, inv.invId, slotIndex);
  let result = itemPropsCallback(store, view, inv, item, slotIndex);
  if (!result) {
    return null;
  }
  const key = `${slotIndex}:${item.itemId}`;
  const { x, y, w, h, ...itemProps } = result;
  return (
    <ItemRenderer
      key={key}
      store={store}
      item={item}
      x={x}
      y={y}
      w={w}
      h={h}
      containerProps={itemProps}
    />
  );
}
