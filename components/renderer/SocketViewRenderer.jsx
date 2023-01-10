import OutlinedBox from '../box/OutlinedBox';
import { computeSlottedArea, getSlotCoordsByIndex } from '../inv/Slots';
import { renderItems } from './ItemsRenderer';

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
 * @param {object} props.containerProps
 * @param {object} props.itemProps
 */
export default function SocketViewRenderer({ store, view, inv, containerProps, itemProps }) {
    let maxWidth = inv.width;
    let maxHeight = inv.height;
    let elements = renderItems(store, view, inv, (store, view, inv, item, i) => {
        let [x, y] = getSlotCoordsByIndex(inv, i);
        let [w, h] = computeSlottedArea(inv, x, y, x + item.width, y + item.height, item.itemId);
        maxWidth = Math.max(w, maxWidth);
        maxHeight = Math.max(h, maxHeight);
        return { x, y, w, h, ...itemProps };
    });
    return (
        <OutlinedBox x={view.coordX} y={view.coordY}
            w={maxWidth} h={maxHeight}
            shadow="none"
            containerProps={containerProps}>
            {elements}
        </OutlinedBox>
    );
}