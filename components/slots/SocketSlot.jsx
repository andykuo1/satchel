import styles from './SocketSlot.module.css';
import { containerMouseUpCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import { renderItem } from '../renderer/ItemsRenderer';
import { computeSlottedArea, getSlotCoordsByIndex } from '../../stores/inv/Slots';
import { InvStore } from '../../stores';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../stores/inv/View').View} View
 */

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
export default function SocketSlot({ store, view, slotIndex, fullSize, maxWidth, maxHeight, className, children }) {
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
