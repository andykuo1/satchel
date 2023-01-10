import OutlinedBox from './box/OutlinedBox';
import { getSlotCoordsByIndex } from './inv/InvSlots';
import ItemRenderer from './ItemRenderer';
import { getItemAtSlotIndex } from './store/InvTransfer';
import GridViewRenderer from './renderer/GridViewRenderer';
import ListViewRenderer from './renderer/ListViewRenderer';

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
 * @param {object} props.itemProps
 */
export default function ViewRenderer({ store, view, inv, containerProps, itemProps }) {
  const containerPropsWithViewId = {
    'data-view-id': view.viewId,
    ...containerProps,
  };
  switch (view.type) {
    case 'cursor':
      return (
        <CursorViewRenderer store={store} view={view} inv={inv} containerProps={containerPropsWithViewId} itemProps={itemProps} />
      );
    case 'grid':
      return (
        <GridViewRenderer store={store} view={view} inv={inv} shadow="out" containerProps={containerPropsWithViewId} itemProps={itemProps} />
      );
    case 'ground':
      return (
        <GridViewRenderer store={store} view={view} inv={inv} shadow="one" containerProps={containerPropsWithViewId} itemProps={itemProps} />
      );
    case 'socket':
      return (
        <GridViewRenderer store={store} view={view} inv={inv} shadow="none" containerProps={containerPropsWithViewId} itemProps={itemProps} />
      );
  }
}

/**
 * @param {HTMLElement} element 
 */
export function getViewIdForElement(element) {
  if (element.hasAttribute('data-view-id')) {
    return element.getAttribute('data-view-id');
  } else {
    throw new Error('Cannot get view id for non-view element.');
  }
}

/**
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export function getClosestViewForElement(element) {
  return element.closest('[data-view-id]');
}

function CursorViewRenderer({ store, view, inv, containerProps, itemProps }) {
  let maxWidth = inv.width;
  let maxHeight = inv.height;
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
        store={store} item={item} x={x} y={y} containerProps={itemProps}/>);
      maxWidth = Math.max(item.width, maxWidth);
      maxHeight = Math.max(item.height, maxHeight);
    }
  }
  return (
    <OutlinedBox x={view.coordX} y={view.coordY} w={maxWidth} h={maxHeight} shadow="none" containerProps={containerProps}>
      {elements}
    </OutlinedBox>
  );
}
