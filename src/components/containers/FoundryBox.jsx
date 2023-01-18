import { useRef } from 'react';

import { InvStore, createInvViewInStore } from '../../stores';
import {
  getItemAtSlotIndex,
  updateItem,
} from '../../stores/transfer/InvTransfer';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import SocketSlot from '../slots/SocketSlot';
import styles from './FoundryBox.module.css';

/**
 * @typedef {import('../../stores').Store} Store
 */

registerView('foundry', FoundryBox);

export default function FoundryBox({ store, view }) {
  const currentItem = useRef(null);

  function onChange(e) {
    if (!currentItem.current) {
      return;
    }
    const name = e.target.name;
    let state = null;
    switch (name) {
      case 'width':
        {
          let value = Math.max(1, Number(e.target.value));
          state = { width: value };
        }
        break;
      case 'height':
        {
          let value = Math.max(1, Number(e.target.value));
          state = { height: value };
        }
        break;
      case 'stackSize':
        {
          let value = Math.max(-1, Number(e.target.value));
          state = { stackSize: value };
        }
        break;
      case 'displayName':
        {
          let value = String(e.target.value);
          state = { displayName: value };
        }
        break;
      case 'description':
        {
          let value = String(e.target.value);
          state = { description: value };
        }
        break;
    }
    if (state) {
      updateItem(store, view.invId, currentItem.current.itemId, state);
    }
  }

  let inv = InvStore.useValue(store, view.invId);
  let item = getItemAtSlotIndex(store, inv.invId, 0);
  currentItem.current = item;
  let {
    width = '',
    height = '',
    stackSize = '',
    displayName = '',
    description = '',
  } = item || {};
  return (
    <ContainerBox store={store} view={view}>
      <fieldset className={styles.container}>
        <SocketSlot
          className={styles.socket}
          store={store}
          view={view}
          fullSize={true}
          slotIndex={0}
          maxWidth={3}
          maxHeight={3}>
          <input
            type="number"
            name="width"
            className={styles.width}
            value={width}
            placeholder="--"
            onChange={onChange}
          />
          <input
            type="number"
            name="height"
            className={styles.height}
            value={height}
            placeholder="--"
            onChange={onChange}
          />
          <span className={styles.stackSizeContainer}>
            <span className={styles.stackSizeMarker}>×</span>
            <input
              type="number"
              name="stackSize"
              className={styles.stackSize}
              value={stackSize}
              placeholder="--"
              onChange={onChange}
            />
          </span>
        </SocketSlot>
        <div className={styles.detail}>
          <div className={styles.header}>
            <input
              type="text"
              name="displayName"
              className={styles.displayName}
              value={displayName}
              placeholder="--"
              onChange={onChange}
            />
          </div>
          <textarea
            name="description"
            className={styles.description}
            value={description}
            placeholder="Notes..."
            onChange={onChange}
          />
          <button>Reset</button>
          <button>Clone</button>
        </div>
      </fieldset>
    </ContainerBox>
  );
}

/**
 * @param {Store} store
 * @param {number} coordX
 * @param {number} coordY
 */
export function createFoundryBoxInStore(store, coordX, coordY) {
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    6,
    8,
    'foundry',
    'single',
    1,
    1,
    1,
    'all',
    ['workspace'],
  );
}
