import styles from './GridSlots.module.css';
import { containerMouseUpCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import { renderItems } from '../renderer/ItemsRenderer';
import { computeSlottedArea, getSlotCoordsByIndex } from '../inv/Slots';
import { InvStore } from '../store';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').View} View
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export default function GridSlots({ store, view, className, children = undefined }) {
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
        <fieldset className={`${styles.container} ${styles.subgrid} ${className}`}
            data-view-id={view.viewId}
            onMouseUp={onContainerMouseUp}>
            <legend className={styles.title}>{inv.displayName}</legend>
            {elements}
            {children}
        </fieldset>
    );
}
