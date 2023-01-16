import styles from './Cursor.module.css';

import { useEffect } from 'react';
import { useAnimationFrame } from '../../lib/hooks/UseAnimationFrame';
import { useEventListener } from '../../lib/hooks/UseEventListener';
import { useForceUpdate } from '../../lib/hooks/UseForceUpdate';
import { getCursor, getCursorInvId, getCursorViewId } from '../../stores/transfer/CursorTransfer';
import { useStore, ViewStore, InvStore, createInvInStore, createViewInStore } from '../../stores';
import Viewport from '../viewport/Viewport';
import { renderItem } from '../renderer/ItemsRenderer';
import Box from '../box/Box';

/**
 * @typedef {import('../../stores/data/CursorState').CursorState} CursorState
 * @typedef {import('../../stores').Store} Store
 */

export default function Cursor() {
  const store = useStore();
  const cursor = getCursor(store);
  const view = ViewStore.useValue(store, getCursorViewId(store));
  const inv = InvStore.useValue(store, getCursorInvId(store));

  useEffect(() => {
    if (ViewStore.has(store, getCursorViewId(store))) {
      return;
    }
    createCursorInvViewInStore(store, getCursorViewId(store), getCursorInvId(store));
  }, []);

  useEventListener(() => window.document, 'mousemove', cursor.onMouseMove, undefined, []);

  return (
    <PositionalCursor cursor={cursor}>
      <Viewport gridOffsetX={0} gridOffsetY={0} containerProps={{ className: styles.contained }}>
        {view && inv && <CursorRenderer store={store} view={view} inv={inv} />}
      </Viewport>
    </PositionalCursor>
  );
}

function CursorRenderer({ store, view, inv }) {
  let maxWidth = inv.width;
  let maxHeight = inv.height;
  let element = renderItem(store, view, inv, 0, (store, view, inv, item, i) => {
    if (!item) {
        return null;
    }
    let w = item.width;
    let h = item.height;
    maxWidth = Math.max(w, maxWidth);
    maxHeight = Math.max(h, maxHeight);
    return { x: 0, y: 0, w, h };
  });
  return (
    <Box x={0} y={0} w={maxWidth} h={maxHeight}>
      {element}
    </Box>
  );
}

function createCursorInvViewInStore(store, viewId, invId) {
  createInvInStore(store, invId, 'single', 1, 1, 1);
  createViewInStore(store, viewId, invId, 0, 0, ['cursor'], 'all', 'cursor', 1, 1);
  return viewId;
}

function PositionalCursor({ cursor, children = undefined }) {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    cursor.onComponentMount(forceUpdate);
  }, []);
  useAnimationFrame(cursor.onAnimationFrame, []);

  let gridUnit = cursor.gridUnit;
  let visible = cursor.visible;
  let cursorX = cursor.getCursorScreenX() - gridUnit / 2;
  let cursorY = cursor.getCursorScreenY() - gridUnit / 2;
  return (
    <div className={styles.cursor}
      style={{
        // @ts-ignore
        '--cursor-x': `${cursorX}px`,
        '--cursor-y': `${cursorY}px`,
        '--cursor-unit': `${gridUnit}px`,
        visibility: visible ? 'unset' : 'hidden',
      }}>
      {children}
    </div>
  );
}
