import { InvStore } from '../../stores';
import {
  computeSlottedArea,
  getSlotCoordsByIndex,
} from '../../inv/Slots';
import {
  containerMouseUpCallback,
  itemMouseDownCallback,
} from '../cursor/CursorCallback';
import { renderItems } from '../renderer/ItemsRenderer';
import Styles from './GridSlots.module.css';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/View').View} View
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export default function GridSlots({
  store,
  view,
  className,
  children = undefined,
}) {
  const inv = InvStore.useValue(store, view.invId);
  function onContainerMouseUp(e) {
    return containerMouseUpCallback(e, store, view);
  }
  function onItemMouseDown(e) {
    return itemMouseDownCallback(e, store, view);
  }
  let elements = renderItems(store, view, inv, (store, view, inv, item, i) => {
    let [x, y] = getSlotCoordsByIndex(inv, i);
    let [w, h] = computeSlottedArea(
      inv,
      x,
      y,
      x + item.width,
      y + item.height,
      item.itemId,
    );
    return { x, y, w, h, onMouseDown: onItemMouseDown };
  });
  return (
    <fieldset
      className={`${Styles.container} ${Styles.subgrid} ${className}`}
      style={{
        // @ts-ignore
        '--slots-w': `${inv.width}`,
        '--slots-h': `${inv.height}`,
      }}
      data-view-id={view.viewId}
      onMouseUp={onContainerMouseUp}>
      <legend className={Styles.title}>{inv.displayName}</legend>
      <div className={Styles.items}>
        {elements}
      </div>
      {children}
    </fieldset>
  );
}
