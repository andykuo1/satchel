import { useRef } from 'react';
import styles from './FoundryBox.module.css';

import { InvStore, createInvViewInStore } from '../../stores';
import {
  getItemAtSlotIndex,
  updateItem,
} from '../../inv/transfer/InvTransfer';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import SocketSlot from '../slots/SocketSlot';

import ZoomIn from '@material-symbols/svg-400/outlined/zoom_in.svg';
import ZoomOut from '@material-symbols/svg-400/outlined/zoom_out.svg';
import VerticalAlignCenter from '@material-symbols/svg-400/outlined/vertical_align_center.svg';
import AspectRatio from '@material-symbols/svg-400/outlined/aspect_ratio.svg';
import IconButton from '../IconButton';

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

  function onZoomIn() {
    if (!currentItem.current) {
      return;
    }
    let item = currentItem.current;
    let width = Math.min(8, item.width + 1);
    let height = Math.min(8, item.height + 1);
    updateItem(store, view.invId, item.itemId, { width, height });
  }

  function onZoomOut() {
    if (!currentItem.current) {
      return;
    }
    let item = currentItem.current;
    let width = Math.max(1, item.width - 1);
    let height = Math.max(1, item.height - 1);
    updateItem(store, view.invId, item.itemId, { width, height });
  }

  function onFlattenX() {
    if (!currentItem.current) {
      return;
    }
    let item = currentItem.current;
    let oldWidth = item.width;
    let oldHeight = item.height;
    let newWidth;
    let newHeight;
    if (oldHeight > oldWidth) {
      // Rotate it
      newWidth = oldHeight;
      newHeight = oldWidth;
    } else if (oldHeight === 1) {
      if (oldWidth === 1) {
        // Flat & Tiny
        newWidth = 2;
        newHeight = 1;
      } else {
        // No change
        return;
      }
    } else {
      // Flatten it
      newWidth = oldWidth + 1;
      newHeight = Math.ceil(oldHeight / 2);
      if (newWidth === newHeight && newWidth !== 1) {
        newWidth -= 1;
        newHeight -= 1;
      }
    }
    updateItem(store, view.invId, item.itemId, { width: newWidth, height: newHeight });
  }

  function onFlattenY() {
    if (!currentItem.current) {
      return;
    }
    let item = currentItem.current;
    let oldWidth = item.width;
    let oldHeight = item.height;
    let newWidth;
    let newHeight;
    if (oldWidth > oldHeight) {
      // Rotate it
      newWidth = oldHeight;
      newHeight = oldWidth;
    } else if (oldWidth === 1) {
      if (oldHeight === 1) {
        // Flat & Tiny
        newWidth = 1;
        newHeight = 2;
      } else {
        // No change
        return;
      }
    } else {
      // Flatten it
      newWidth = Math.ceil(oldWidth / 2);
      newHeight = oldHeight + 1;
      if (newWidth === newHeight && newHeight !== 1) {
        newWidth -= 1;
        newHeight -= 1;
      }
    }
    updateItem(store, view.invId, item.itemId, { width: newWidth, height: newHeight });
  }

  function onFit() {
    if (!currentItem.current) {
      return;
    }
    let item = currentItem.current;
    let oldWidth = item.width;
    let oldHeight = item.height;
    // NOTE: Finds the nearest square size that is even (min 1)
    let newSize = Math.max(1, Math.floor(Math.floor((oldWidth + oldHeight) / 2) / 2) * 2);
    updateItem(store, view.invId, item.itemId, { width: newSize, height: newSize });
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
  let disabled = !Boolean(item);
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
        <div className={styles.toolbar}>
          <IconButton Icon={ZoomIn} disabled={disabled} onClick={onZoomIn} />
          <IconButton Icon={ZoomOut} disabled={disabled} onClick={onZoomOut} />
          <IconButton Icon={VerticalAlignCenter} disabled={disabled} onClick={onFlattenX} />
          <IconButton Icon={VerticalAlignCenter} className={styles.rotated} disabled={disabled} onClick={onFlattenY} />
          <IconButton Icon={AspectRatio} disabled={disabled} onClick={onFit} />
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
