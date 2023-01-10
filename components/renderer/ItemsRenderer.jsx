import ItemRenderer from './ItemRenderer';
import { getItemAtSlotIndex } from '../store/InvTransfer';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/Item').Item} Item
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
            let key = `${i}:${item.itemId}`;
            let result = itemPropsCallback(store, view, inv, item, i);
            if (!result) {
                continue;
            }
            const { x, y, w, h, ...itemProps } = result;
            elements.push(<ItemRenderer key={key}
                store={store} item={item} x={x} y={y} w={w} h={h}
                containerProps={itemProps}/>);
        }
    }
    return elements;
}
