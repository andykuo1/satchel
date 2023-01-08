import OutlinedBox from './box/OutlinedBox';
import { getSlotCoordsByIndex } from './inv/InvSlots';
import ItemRenderer from './ItemRenderer';
import { getItemAtSlotIndex } from './store/InvTransfer';

/**
 * @typedef {import('./store').Store} Store
 * @typedef {import('./inv/View').View} View
 * @typedef {import('./inv/Inv').Inv} Inv
 * @typedef {import('./inv/Item').Item} Item
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {Inv} props.inv
 * @param {object} props.containerProps
 * @param {(store: Store, view: View, item: Item) => object} props.itemContainerPropsCallback
 */
export default function ViewRenderer({ store, view, inv, containerProps, itemContainerPropsCallback }) {
    switch (view.type) {
        case 'cursor':
            return (
                <CursorViewRenderer store={store} view={view} inv={inv} />
            );
        case 'grid':
            return (
                <GridViewRenderer store={store} view={view} inv={inv} containerProps={containerProps} itemContainerPropsCallback={itemContainerPropsCallback} />
            );
        case 'socket':
            return (
                <GridViewRenderer store={store} view={view} inv={inv} containerProps={containerProps} itemContainerPropsCallback={itemContainerPropsCallback} />
            );
    }
}

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {Inv} props.inv
 * @param {object} props.containerProps
 * @param {(store: Store, view: View, item: Item) => object} props.itemContainerPropsCallback
 */
function GridViewRenderer({ store, view, inv, containerProps, itemContainerPropsCallback }) {
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
                containerProps={itemContainerPropsCallback(store, view, item)} />);
        }
    }
    return (
        <OutlinedBox x={view.coordX} y={view.coordY} w={inv.width} h={inv.height} title={inv.displayName} containerProps={containerProps}>
            {elements}
        </OutlinedBox>
    );
}

function CursorViewRenderer({ store, view, inv }) {
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
                store={store} item={item} x={x} y={y} />);
        }
    }
    return (
        <OutlinedBox x={view.coordX} y={view.coordY} w={inv.width} h={inv.height} shadow={false}>
            {elements}
        </OutlinedBox>
    );
}