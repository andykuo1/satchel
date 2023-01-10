import OutlinedBox from '../../box/OutlinedBox';
import { computeSlottedArea, getSlotCoordsByIndex } from '../../inv/Slots';
import ItemRenderer from '../ItemRenderer';
import { getItemAtSlotIndex } from '../../store/InvTransfer';
import { renderItems } from '../ItemsRenderer';

/**
 * @typedef {import('../../store').Store} Store
 * @typedef {import('../../inv/View').View} View
 * @typedef {import('../../inv/Inv').Inv} Inv
 * @typedef {import('../../inv/Item').Item} Item
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
    let elements = renderItems(store, view, inv, (store, view, inv, item, i) => {
        let [x, y] = getSlotCoordsByIndex(inv, i);
        let [w, h] = computeSlottedArea(inv, x, y, x + item.width, y + item.height, item.itemId);
        return { x, y, w, h, ...itemProps };
    });
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
