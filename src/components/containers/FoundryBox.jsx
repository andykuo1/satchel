import AspectRatio from '@material-symbols/svg-400/outlined/aspect_ratio.svg';
import VerticalAlignCenter from '@material-symbols/svg-400/outlined/vertical_align_center.svg';
import ZoomIn from '@material-symbols/svg-400/outlined/zoom_in.svg';
import ZoomOut from '@material-symbols/svg-400/outlined/zoom_out.svg';
import { useRef } from 'react';

import { getItemAtSlotIndex, updateItem } from '../../inv/transfer/InvTransfer';
import { InvStore, createInvViewInStore } from '../../stores';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import IconButton from '../lib/IconButton';
import ImageContextMenu from '../menus/ImageContextMenu';
import SocketSlot from '../slots/SocketSlot';
import Styles from './FoundryBox.module.css';

/**
 * @typedef {import('../../stores').Store} Store
 */

registerView('foundry', FoundryBox);

export default function FoundryBox({ store, view }) {
  const currentItem = useRef(null);

  function onCopy() {
    if (!currentItem.current) {
      return;
    }
  }

  let inv = InvStore.useValue(store, view.invId);
  let item = getItemAtSlotIndex(store, inv.invId, 0);
  currentItem.current = item;
  let disabled = !Boolean(item);
  return (
    <ContainerBox store={store} view={view}>
      <fieldset className={Styles.container}>
        <SocketSlot
          className={Styles.socket}
          store={store}
          view={view}
          fullSize={true}
          slotIndex={0}
          maxWidth={3}
          maxHeight={3}>
          <WidthInput
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
          <HeightInput
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
          <StackSizeInput
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
        </SocketSlot>
        <div className={Styles.detail}>
          <div className={Styles.header}>
            <DisplayNameInput
              store={store}
              view={view}
              itemRef={currentItem}
              disabled={disabled}
            />
          </div>
          <DescriptionInput
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
          <button disabled={disabled} onClick={onCopy}>
            + Item
          </button>
        </div>
        <div className={Styles.toolbar}>
          <ZoomInButton
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
          <ZoomOutButton
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
          <FlattenXButton
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
          <FlattenYButton
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
          <FitButton
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
        </div>
        <div className={Styles.menubar}>
          <ImageContextMenu
            store={store}
            view={view}
            itemRef={currentItem}
            disabled={disabled}
          />
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

function ZoomInButton({ store, view, itemRef, disabled }) {
  function onZoomIn() {
    if (!itemRef.current) {
      return;
    }
    let item = itemRef.current;
    let width = Math.min(8, item.width + 1);
    let height = Math.min(8, item.height + 1);
    updateItem(store, view.invId, item.itemId, { width, height });
  }
  return <IconButton Icon={ZoomIn} disabled={disabled} onClick={onZoomIn} />;
}

function ZoomOutButton({ store, view, itemRef, disabled }) {
  function onZoomOut() {
    if (!itemRef.current) {
      return;
    }
    let item = itemRef.current;
    let width = Math.max(1, item.width - 1);
    let height = Math.max(1, item.height - 1);
    updateItem(store, view.invId, item.itemId, { width, height });
  }
  return <IconButton Icon={ZoomOut} disabled={disabled} onClick={onZoomOut} />;
}

function FlattenXButton({ store, view, itemRef, disabled }) {
  function onFlattenX() {
    if (!itemRef.current) {
      return;
    }
    let item = itemRef.current;
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
    updateItem(store, view.invId, item.itemId, {
      width: newWidth,
      height: newHeight,
    });
  }
  return (
    <IconButton
      Icon={VerticalAlignCenter}
      disabled={disabled}
      onClick={onFlattenX}
    />
  );
}

function FlattenYButton({ store, view, itemRef, disabled }) {
  function onFlattenY() {
    if (!itemRef.current) {
      return;
    }
    let item = itemRef.current;
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
    updateItem(store, view.invId, item.itemId, {
      width: newWidth,
      height: newHeight,
    });
  }
  return (
    <IconButton
      Icon={VerticalAlignCenter}
      className={Styles.rotated}
      disabled={disabled}
      onClick={onFlattenY}
    />
  );
}

function FitButton({ store, view, itemRef, disabled }) {
  function onFit() {
    if (!itemRef.current) {
      return;
    }
    let item = itemRef.current;
    let oldWidth = item.width;
    let oldHeight = item.height;
    // NOTE: Finds the nearest square size that is even (min 1)
    let newSize = Math.max(
      1,
      Math.floor(Math.floor((oldWidth + oldHeight) / 2) / 2) * 2,
    );
    updateItem(store, view.invId, item.itemId, {
      width: newSize,
      height: newSize,
    });
  }
  return <IconButton Icon={AspectRatio} onClick={onFit} disabled={disabled} />;
}

function WidthInput({ store, view, itemRef, disabled }) {
  function onChange(e) {
    if (!itemRef.current) {
      return;
    }
    let value = Math.max(1, Number(e.target.value));
    updateItem(store, view.invId, itemRef.current.itemId, { width: value });
  }
  let item = itemRef.current;
  let width = item ? item.width : '';
  return (
    <input
      type="number"
      name="width"
      className={Styles.width}
      value={width}
      placeholder="--"
      onChange={onChange}
      disabled={disabled}
    />
  );
}

function HeightInput({ store, view, itemRef, disabled }) {
  function onChange(e) {
    if (!itemRef.current) {
      return;
    }
    let value = Math.max(1, Number(e.target.value));
    updateItem(store, view.invId, itemRef.current.itemId, { height: value });
  }
  let item = itemRef.current;
  let height = item ? item.height : '';
  return (
    <input
      type="number"
      name="height"
      className={Styles.height}
      value={height}
      placeholder="--"
      onChange={onChange}
      disabled={disabled}
    />
  );
}

function StackSizeInput({ store, view, itemRef, disabled }) {
  function onChange(e) {
    if (!itemRef.current) {
      return;
    }
    let value = Math.max(-1, Number(e.target.value));
    updateItem(store, view.invId, itemRef.current.itemId, { stackSize: value });
  }
  let item = itemRef.current;
  let stackSize = item ? item.stackSize : '';
  return (
    <span className={Styles.stackSizeContainer}>
      <span className={Styles.stackSizeMarker}>×</span>
      <input
        type="number"
        name="stackSize"
        className={Styles.stackSize}
        value={stackSize}
        placeholder="--"
        onChange={onChange}
        disabled={disabled}
      />
    </span>
  );
}

function DisplayNameInput({ store, view, itemRef, disabled }) {
  function onChange(e) {
    if (!itemRef.current) {
      return;
    }
    let value = String(e.target.value);
    updateItem(store, view.invId, itemRef.current.itemId, {
      displayName: value,
    });
  }
  let item = itemRef.current;
  let displayName = item ? item.displayName : '';
  return (
    <input
      type="text"
      name="displayName"
      className={Styles.displayName}
      value={displayName}
      placeholder="--"
      onChange={onChange}
      disabled={disabled}
    />
  );
}

function DescriptionInput({ store, view, itemRef, disabled }) {
  function onChange(e) {
    if (!itemRef.current) {
      return;
    }
    let value = String(e.target.value);
    updateItem(store, view.invId, itemRef.current.itemId, {
      description: value,
    });
  }
  let item = itemRef.current;
  let description = item ? item.description : '';
  return (
    <textarea
      name="description"
      className={Styles.description}
      value={description}
      placeholder="Notes..."
      onChange={onChange}
      disabled={disabled}
    />
  );
}
