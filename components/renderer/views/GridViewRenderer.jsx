import OutlinedBox from '../../box/OutlinedBox';
import { computeSlottedArea, getSlotCoordsByIndex } from '../../inv/Slots';
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
 * @param {object} [props.containerProps]
 * @param {object} [props.itemProps]
 * @param {object} [props.handleProps]
 * @param {import('react').ReactNode} [props.children]
 */
export default function GridViewRenderer({ store, view, inv, containerProps = {}, itemProps = {}, handleProps={}, children }) {
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
            right={true}
            bottom={true}
            containerProps={containerProps}
            handleProps={handleProps}>
            {elements}
            {children}
        </OutlinedBox>
    );
}
