import styles from './BaseSlots.module.css';
import { containerMouseUpCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import { renderItem, renderItems } from '../renderer/ItemsRenderer';
import { computeSlottedArea, getSlotCoordsByIndex } from '../inv/Slots';
import { InvStore } from '../store';
import ContainerGrid from '../box/ContainerGrid';

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
 * @param {import('react').ReactNode} [props.children]
 */
export function GridSlots({ store, view, children = undefined }) {
    const inv = InvStore.useValue(store, view.invId);
    function onContainerMouseUp(e) {
        return containerMouseUpCallback(e, store, view);
    }
    function onItemMouseDown(e) {
        return itemMouseDownCallback(e, store, view);
    }
    let elements = renderItems(store, view, inv, (store, view, inv, item, i) => {
        let [x, y] = getSlotCoordsByIndex(inv, i);
        let [w, h] = computeSlottedArea(inv, x, y, x + item.width, y + item.height, item.itemId);
        return { x, y, w, h, onMouseDown: onItemMouseDown };
    });
    return (
        <ContainerGrid containerProps={{
            'data-view-id': view.viewId,
            onMouseUp: onContainerMouseUp
        }}>
            {elements}
            {children}
        </ContainerGrid>
    );
}

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {number} props.slotIndex
 * @param {boolean} [props.fullSize]
 * @param {number} [props.maxWidth]
 * @param {number} [props.maxHeight]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export function SocketSlot({ store, view, slotIndex, fullSize, maxWidth, maxHeight, className, children }) {
    const inv = InvStore.useValue(store, view.invId);
    function onContainerMouseUp(e) {
        return containerMouseUpCallback(e, store, view);
    }
    function onItemMouseDown(e) {
        return itemMouseDownCallback(e, store, view);
    }
    let width = 1;
    let height = 1;
    let element = renderItem(store, view, inv, slotIndex,
        (store, view, inv, item, i) => {
            if (!item) {
                return null;
            }
            if (fullSize) {
                width = item.width;
                height = item.height;
            } else {
                let [x, y] = getSlotCoordsByIndex(inv, i);
                let [w, h] = computeSlottedArea(inv, x, y, x + item.width, y + item.height, item.itemId);
                width = w;
                height = h;
            }
            return {
                x: 0, y: 0,
                w: width, h: height,
                onMouseDown: onItemMouseDown
            };
        });
    return (
        <div className={`${styles.socket} ${Number.isFinite(maxWidth) && styles.maxWidth} ${Number.isFinite(maxHeight) && styles.maxHeight} ${className}`}
            style={{
                // @ts-ignore
                '--item-w': width,
                '--item-h': height,
                '--slot-max-w': maxWidth,
                '--slot-max-h': maxHeight,
            }}
            data-view-id={view.viewId}
            onMouseUp={onContainerMouseUp}>
            <div className={styles.item}>
                {element}
            </div>
            {children}
        </div>
    );
}
