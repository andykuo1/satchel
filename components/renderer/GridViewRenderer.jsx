import OutlinedBox from '../box/OutlinedBox';
import { getSlotCoordsByIndex } from '../inv/InvSlots';
import ItemRenderer from '../ItemRenderer';
import { getItemAtSlotIndex } from '../store/InvTransfer';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/Item').Item} Item
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {Inv} props.inv
 * @param {'in'|'out'|'one'|'none'} props.shadow
 * @param {object} props.containerProps
 * @param {object} props.itemProps
 */
export default function GridViewRenderer({ store, view, inv, shadow, containerProps, itemProps }) {
    let elements = [];
    let keys = [];
    for (let i = 0; i < inv.length; ++i) {
        let item = getItemAtSlotIndex(store, inv.invId, i);
        if (item) {
            if (keys.includes(item.itemId)) {
                // Don't render more than once!
                continue;
            }
            let [x, y] = getSlotCoordsByIndex(inv, i);
            keys.push(item.itemId);
            elements.push(<ItemRenderer key={`${i}:${item.itemId}`}
                store={store} item={item} x={x} y={y}
                containerProps={itemProps}/>);
        }
    }
    return (
        <OutlinedBox
            x={view.coordX} y={view.coordY}
            w={inv.width} h={inv.height}
            title={inv.displayName}
            shadow={shadow}
            containerProps={containerProps}>
            {elements}
        </OutlinedBox>
    );
}
