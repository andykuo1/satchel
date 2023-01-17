import { InvStore, createInvViewInStore } from '../../stores';
import { getItemAtSlotIndex } from '../../stores/transfer/InvTransfer';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import {
  containerMouseUpCallback,
  handleMouseDownCallback,
  itemMouseDownCallback,
} from '../cursor/CursorCallback';
import ItemRenderer from '../renderer/ItemRenderer';
import styles from './ListBox.module.css';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../stores/inv/View').ViewId} ViewId
 * @typedef {import('../../stores/inv/View').ViewUsage} ViewUsage
 */

registerView('list', ListBox);

export default function ListBox({ store, view }) {
  const inv = InvStore.useValue(store, view.invId);
  return (
    <ListViewRenderer
      store={store}
      view={view}
      inv={inv}
      containerProps={{
        'data-view-id': view.viewId,
        onMouseUp(e) {
          return containerMouseUpCallback(e, store, view);
        },
      }}
      itemProps={{
        onMouseDown(e) {
          return itemMouseDownCallback(e, store, view);
        },
      }}
      handleProps={{
        onMouseDown(e) {
          return handleMouseDownCallback(e, store, view);
        },
      }}
    />
  );
}

/**
 * @param {Store} store
 * @param {number} width
 * @param {number} height
 * @param {number} coordX
 * @param {number} coordY
 * @returns {ViewId}
 */
export function createListBoxInStore(store, width, height, coordX, coordY) {
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    width,
    height,
    'list',
    'single',
    width * height,
    width,
    height,
    'all',
    ['workspace'],
  );
}

function ListViewRenderer({
  store,
  view,
  inv,
  containerProps,
  itemProps,
  handleProps,
}) {
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
      elements.push(
        <ListViewItem
          key={`${i}:${item.itemId}`}
          store={store}
          item={item}
          containerProps={itemProps}
        />,
      );
    } else {
      // elements.push(<EmptyListViewItem key={`${i}:null`}/>);
    }
  }
  return (
    <ContainerBox store={store} view={view}>
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
      <span className={styles.name}>{item.displayName || 'Item'}</span>
      {item.stackSize > 0 && (
        <label className={styles.stackSize}>×{item.stackSize}</label>
      )}
    </li>
  );
}
