import styles from './ListBox.module.css';
import { InvStore, createInvInStore, createViewInStore } from '../store';
import { uuid } from '../../lib/util/uuid';
import { containerMouseUpCallback, handleMouseDownCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import { getItemAtSlotIndex } from '../store/InvTransfer';
import ContainerBox from '../box/ContainerBox';
import ItemRenderer from '../renderer/ItemRenderer';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').ViewId} ViewId
 * @typedef {import('../inv/View').ViewUsage} ViewUsage
 */

export default function ListBox({ store, view }) {
    const inv = InvStore.useValue(store, view.invId);
    return (
        <ListViewRenderer store={store} view={view} inv={inv}
            containerProps={{
                'data-view-id': view.viewId,
                onMouseUp(e) {
                    return containerMouseUpCallback(e, store, view);
                }
            }}
            itemProps={{
                onMouseDown(e) {
                    return itemMouseDownCallback(e, store, view);
                }
            }}
            handleProps={{
                onMouseDown(e) {
                    return handleMouseDownCallback(e, store, view);
                }
            }} />
    );
}

/**
 * @param {Store} store 
 * @param {number} width 
 * @param {number} height 
 * @param {number} coordX
 * @param {number} coordY
 * @param {ViewUsage} [usage]
 * @returns {ViewId}
 */
export function createListBoxInStore(store, width, height, coordX, coordY, usage = 'all') {
    let invId = uuid();
    let viewId = uuid();
    createInvInStore(store, invId, 'single', width * height, width, height);
    createViewInStore(store, viewId, invId, coordX, coordY, ['workspace'], usage, 'list', width, height);
    return viewId;
}

function ListViewRenderer({ store, view, inv, containerProps, itemProps, handleProps }) {
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
        } else {
            // elements.push(<EmptyListViewItem key={`${i}:null`}/>);
        }
    }
    return (
        <ContainerBox
            x={view.coordX} y={view.coordY}
            w={inv.width} h={inv.height}
            title={inv.displayName}
            handleProps={handleProps}>
            <ul className={styles.container} {...containerProps}>
                {elements}
                {elements.length < inv.length && <div className={styles.anchor}></div>}
            </ul>
        </ContainerBox>
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
                <ItemRenderer store={store} item={item} x={0} y={0} w={1} h={1} />
            </span>
            <span className={styles.name}>
                {item.displayName || 'Item'}
            </span>
            {item.stackSize > 0 && <label className={styles.stackSize}>×{item.stackSize}</label>}
        </li>
    );
}

function EmptyListViewItem() {
    return (
        <li></li>
    );
}
