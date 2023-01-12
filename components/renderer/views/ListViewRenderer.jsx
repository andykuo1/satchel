import styles from './ListViewRenderer.module.css';
import OutlinedBox from '../../box/OutlinedBox';
import { getItemAtSlotIndex } from '../../store/InvTransfer';
import ItemRenderer from '../ItemRenderer';

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
 * @param {object} props.containerProps
 * @param {object} props.itemProps
 * @param {object} props.handleProps
 * @param {import('react').ReactNode} props.children
 */
export default function ListViewRenderer({ store, view, inv, containerProps, itemProps, handleProps, children }) {
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
            elements.push(<ListViewItem key={`${i}:${item.itemId}`}
                store={store} item={item}
                containerProps={itemProps} />);
        }
    }
    return (
        <OutlinedBox
            x={view.coordX} y={view.coordY}
            w={inv.width} h={inv.height}
            right={true}
            bottom={true}
            title={inv.displayName}
            containerProps={containerProps}
            handleProps={handleProps}>
            <ul className={styles.container}>
                {elements}
            </ul>
            {children}
        </OutlinedBox>
    );
}

function ListViewItem({ store, item, containerProps }) {
    const containerPropsWithItemId = {
        'data-item-id': item.itemId,
        ...containerProps,
    };
    return (
        <li {...containerPropsWithItemId}>
            <span className={styles.item}>
                <ItemRenderer store={store} item={item} x={0} y={0} w={1} h={1}/>
            </span>
            <span className={styles.name}>
                {item.displayName || 'Item'}
            </span>
            {item.stackSize > 0 && <label className={styles.stackSize}>×{item.stackSize}</label>}
        </li>
    );
}
